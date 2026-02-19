package handlers

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"

	"echobasket/config"
	"echobasket/utils"
)

// generateResponseWithGroq generates a friendly response using Groq API
func generateResponseWithGroq(commandText string) string {
	url := "https://api.groq.com/openai/v1/chat/completions"

	payload := map[string]interface{}{
		"model": "llama3-8b-8192",
		"messages": []map[string]string{
			{
				"role": "system",
				"content": "You are a helpful assistant that generates short confirmation replies " +
					"based on user commands. Keep it friendly, natural, and avoid repeating the input verbatim.",
			},
			{
				"role":    "user",
				"content": fmt.Sprintf("User command: \"%s\"\nReply with a friendly confirmation.", commandText),
			},
		},
		"max_tokens":  60,
		"temperature": 0.7,
	}

	jsonData, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Groq request error: %v", err)
		return fmt.Sprintf("You said: %s", commandText)
	}

	req.Header.Set("Authorization", "Bearer "+config.AppConfig.GroqAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Groq API error: %v", err)
		return fmt.Sprintf("You said: %s", commandText)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		log.Printf("Groq API error: %d %s", resp.StatusCode, string(body))
		return fmt.Sprintf("You said: %s", commandText)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return fmt.Sprintf("You said: %s", commandText)
	}

	choices := result["choices"].([]interface{})
	if len(choices) > 0 {
		message := choices[0].(map[string]interface{})["message"].(map[string]interface{})
		return message["content"].(string)
	}

	return fmt.Sprintf("You said: %s", commandText)
}

// transcribeWithAssemblyAI transcribes audio using AssemblyAI
func transcribeWithAssemblyAI(audioPath string) (string, error) {
	apiKey := config.AppConfig.AssemblyAIAPIKey
	if apiKey == "" {
		return "", fmt.Errorf("ASSEMBLYAI_API_KEY not configured")
	}

	// Upload the audio file
	uploadURL := "https://api.assemblyai.com/v2/upload"
	audioFile, err := os.Open(audioPath)
	if err != nil {
		return "", err
	}
	defer audioFile.Close()

	audioData, err := io.ReadAll(audioFile)
	if err != nil {
		return "", err
	}

	uploadReq, _ := http.NewRequest("POST", uploadURL, bytes.NewBuffer(audioData))
	uploadReq.Header.Set("Authorization", apiKey)
	uploadReq.Header.Set("Content-Type", "application/octet-stream")

	client := &http.Client{Timeout: 60 * time.Second}
	uploadResp, err := client.Do(uploadReq)
	if err != nil {
		return "", err
	}
	defer uploadResp.Body.Close()

	var uploadResult map[string]string
	json.NewDecoder(uploadResp.Body).Decode(&uploadResult)
	audioURL := uploadResult["upload_url"]

	// Create transcription
	transcriptURL := "https://api.assemblyai.com/v2/transcript"
	transcriptPayload := map[string]string{"audio_url": audioURL}
	transcriptData, _ := json.Marshal(transcriptPayload)

	transcriptReq, _ := http.NewRequest("POST", transcriptURL, bytes.NewBuffer(transcriptData))
	transcriptReq.Header.Set("Authorization", apiKey)
	transcriptReq.Header.Set("Content-Type", "application/json")

	transcriptResp, err := client.Do(transcriptReq)
	if err != nil {
		return "", err
	}
	defer transcriptResp.Body.Close()

	var transcriptResult map[string]interface{}
	json.NewDecoder(transcriptResp.Body).Decode(&transcriptResult)
	transcriptID := transcriptResult["id"].(string)

	// Poll for result
	pollURL := fmt.Sprintf("https://api.assemblyai.com/v2/transcript/%s", transcriptID)
	for {
		pollReq, _ := http.NewRequest("GET", pollURL, nil)
		pollReq.Header.Set("Authorization", apiKey)

		pollResp, err := client.Do(pollReq)
		if err != nil {
			return "", err
		}

		var pollResult map[string]interface{}
		json.NewDecoder(pollResp.Body).Decode(&pollResult)
		pollResp.Body.Close()

		status := pollResult["status"].(string)
		if status == "completed" {
			return pollResult["text"].(string), nil
		} else if status == "error" {
			return "", fmt.Errorf("transcription error: %v", pollResult["error"])
		}

		time.Sleep(1 * time.Second)
	}
}

// generateTTSAudio generates TTS audio using MurfAI
func generateTTSAudio(text string) ([]byte, error) {
	apiKey := config.AppConfig.MurfAIAPIKey
	if apiKey == "" {
		log.Println("MURFAI_API_KEY not set")
		return nil, fmt.Errorf("MURFAI_API_KEY not configured")
	}

	url := "https://api.murf.ai/v1/speech/generate"
	payload := map[string]string{
		"text":     text,
		"voice_id": "en-IN-isha",
		"format":   "mp3",
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("api-key", apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("MurfAI TTS error: %s", string(body))
		return nil, fmt.Errorf("MurfAI error: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	audioURL, ok := result["audioFile"].(string)
	if !ok || audioURL == "" {
		log.Println("MurfAI: No audioFile returned")
		return nil, fmt.Errorf("no audio file returned")
	}

	// Fetch the audio
	audioResp, err := http.Get(audioURL)
	if err != nil {
		return nil, err
	}
	defer audioResp.Body.Close()

	return io.ReadAll(audioResp.Body)
}

// SpeechToText handles the /stt endpoint
func SpeechToText(c *gin.Context) {
	if config.AppConfig.AssemblyAIAPIKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ASSEMBLYAI_API_KEY not configured"})
		return
	}

	file, err := c.FormFile("audio")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Audio file is required"})
		return
	}

	// Create temp file
	tempDir := os.TempDir()
	tempPath := filepath.Join(tempDir, fmt.Sprintf("audio_%d.wav", time.Now().UnixNano()))

	if err := c.SaveUploadedFile(file, tempPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save audio file"})
		return
	}
	defer os.Remove(tempPath)

	// Transcribe
	userText, err := transcribeWithAssemblyAI(tempPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("User said: %s", userText)

	// Parse command
	parsedCommand := utils.ParseCommand(userText)
	log.Printf("Parsed command: %+v", parsedCommand)

	// Generate smart reply
	reply := generateResponseWithGroq(userText)
	log.Printf("Generated response: %s", reply)

	// Generate TTS
	ttsAudio, err := generateTTSAudio(reply)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to synthesize speech"})
		return
	}

	audioB64 := base64.StdEncoding.EncodeToString(ttsAudio)

	c.JSON(http.StatusOK, gin.H{
		"transcript": userText,
		"command":    parsedCommand,
		"reply":      reply,
		"audio":      audioB64,
	})
}

// TextToSpeech handles the /tts endpoint
func TextToSpeech(c *gin.Context) {
	ctx := context.Background()
	_ = ctx // For future use

	var req struct {
		Text string `json:"text"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.Text == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Text is required"})
		return
	}

	audio, err := generateTTSAudio(req.Text)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	audioB64 := base64.StdEncoding.EncodeToString(audio)
	c.JSON(http.StatusOK, gin.H{"audio": audioB64})
}
