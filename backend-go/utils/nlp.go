package utils

import "regexp"

// CATEGORIES maps item names to their categories
var CATEGORIES = map[string]string{
	"milk":        "dairy",
	"cheese":      "dairy",
	"apple":       "produce",
	"banana":      "produce",
	"bread":       "bakery",
	"water":       "beverages",
	"snacks":      "snacks",
	"almond milk": "dairy",
}

// ParsedCommand represents the result of parsing a voice command
type ParsedCommand struct {
	Intent   string `json:"intent"`
	Item     string `json:"item"`
	Quantity int    `json:"quantity"`
	Category string `json:"category"`
	Action   string `json:"action"`
	Brand    string `json:"brand"`
	Price    int    `json:"price"`
}

// ParseCommand parses a text command and extracts intent, item, quantity, etc.
func ParseCommand(text string) ParsedCommand {
	result := ParsedCommand{
		Quantity: 1,
	}

	// Intent detection
	addKeywords := []string{"add", "buy", "need", "want"}
	for _, keyword := range addKeywords {
		if regexp.MustCompile(`(?i)\b` + keyword + `\b`).MatchString(text) {
			result.Intent = "add"
			result.Action = "add"
			break
		}
	}

	if result.Intent == "" {
		if regexp.MustCompile(`(?i)\b(remove|delete)\b`).MatchString(text) {
			result.Intent = "remove"
			result.Action = "remove"
		} else if regexp.MustCompile(`(?i)\b(find|search)\b`).MatchString(text) {
			result.Intent = "search"
			result.Action = "search"
		}
	}

	// Quantity extraction
	quantityRegex := regexp.MustCompile(`(?i)(\d+)\s*(\w+)`)
	if matches := quantityRegex.FindStringSubmatch(text); len(matches) >= 3 {
		qty := parseIntSafe(matches[1])
		if qty > 0 {
			result.Quantity = qty
			result.Item = matches[2]
		}
	}

	// Try to find item name from categories if not found
	if result.Item == "" {
		for item := range CATEGORIES {
			if regexp.MustCompile(`(?i)\b` + regexp.QuoteMeta(item) + `\b`).MatchString(text) {
				result.Item = item
				break
			}
		}
	}

	// Category assignment
	if result.Item != "" {
		if category, exists := CATEGORIES[result.Item]; exists {
			result.Category = category
		}
	}

	// Brand extraction
	brandRegex := regexp.MustCompile(`(?i)brand\s+(\w+)`)
	if matches := brandRegex.FindStringSubmatch(text); len(matches) >= 2 {
		result.Brand = matches[1]
	}

	// Price extraction
	priceRegex := regexp.MustCompile(`(?i)under\s*\$?(\d+)`)
	if matches := priceRegex.FindStringSubmatch(text); len(matches) >= 2 {
		result.Price = parseIntSafe(matches[1])
	}

	return result
}

func parseIntSafe(s string) int {
	var result int
	for _, c := range s {
		if c >= '0' && c <= '9' {
			result = result*10 + int(c-'0')
		}
	}
	return result
}

// GetCategory returns the category for an item
func GetCategory(itemName string) string {
	if category, exists := CATEGORIES[itemName]; exists {
		return category
	}
	return ""
}
