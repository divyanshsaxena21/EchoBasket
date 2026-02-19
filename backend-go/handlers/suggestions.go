package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"echobasket/config"
	"echobasket/firebase"
)

type SuggestionsRequest struct {
	Prompt string `json:"prompt"`
}

// getCurrentSeason returns the current season based on month
func getCurrentSeason() string {
	month := time.Now().Month()
	switch {
	case month >= 12 || month <= 2:
		return "winter"
	case month >= 3 && month <= 5:
		return "spring"
	case month >= 6 && month <= 8:
		return "summer"
	default:
		return "fall"
	}
}

// getGroqSuggestions calls the Groq API for AI suggestions
func getGroqSuggestions(prompt string) (string, error) {
	url := "https://api.groq.com/openai/v1/chat/completions"

	payload := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{
				"role": "system",
				"content": "You are a helpful assistant suggesting grocery items. " +
					"Include seasonal and trending products, categorize items, " +
					"and suggest quantities as needed.",
			},
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"max_tokens": 200,
	}

	jsonData, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+config.AppConfig.GroqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Groq API error: %d %s", resp.StatusCode, string(body))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	choices := result["choices"].([]interface{})
	if len(choices) > 0 {
		message := choices[0].(map[string]interface{})["message"].(map[string]interface{})
		return message["content"].(string), nil
	}

	return "", fmt.Errorf("no response from Groq")
}

// Suggestions handles the /suggestions endpoint
func Suggestions(c *gin.Context) {
	uid := defaultUID

	season := getCurrentSeason()

	// Fetch user's cart items
	ctx := context.Background()
	ref := firebase.DBClient.NewRef("carts/" + uid)

	var cart map[string]map[string]interface{}
	if err := ref.Get(ctx, &cart); err != nil {
		cart = make(map[string]map[string]interface{})
	}

	// Prepare cart summary
	var cartItems []string
	for _, item := range cart {
		quantity := 1
		if q, ok := item["quantity"].(float64); ok {
			quantity = int(q)
		}
		name := "unknown"
		if n, ok := item["name"].(string); ok {
			name = n
		}
		cartItems = append(cartItems, fmt.Sprintf("%d x %s", quantity, name))
	}

	cartSummary := "no items"
	if len(cartItems) > 0 {
		cartSummary = strings.Join(cartItems, ", ")
	}

	// Get user prompt
	var req SuggestionsRequest
	c.ShouldBindJSON(&req)
	userPrompt := req.Prompt
	if userPrompt == "" {
		userPrompt = "Suggest grocery items"
	}

	// Construct prompt with cart and season context
	prompt := fmt.Sprintf(
		"The user currently has %s in their cart. It is %s season. Based on this, %s.",
		cartSummary, season, userPrompt,
	)

	suggestionsText, err := getGroqSuggestions(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"suggestions": suggestionsText})
}
