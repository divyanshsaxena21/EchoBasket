package handlers

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"echobasket/firebase"
)

type SearchRequest struct {
	Query string  `json:"query"`
	Brand string  `json:"brand"`
	Price float64 `json:"price"`
}

// SearchItems searches items in the user's cart
func SearchItems(c *gin.Context) {
	uid := defaultUID

	var req SearchRequest
	c.ShouldBindJSON(&req)
	query := strings.ToLower(req.Query)

	ctx := context.Background()
	ref := firebase.DBClient.NewRef("carts/" + uid)

	var cart map[string]map[string]interface{}
	if err := ref.Get(ctx, &cart); err != nil {
		c.JSON(http.StatusOK, gin.H{"results": []interface{}{}})
		return
	}

	var results []map[string]interface{}
	for _, item := range cart {
		// Filter by query
		if query != "" {
			name, _ := item["name"].(string)
			if !strings.Contains(strings.ToLower(name), query) {
				continue
			}
		}

		// Filter by brand
		if req.Brand != "" {
			brand, _ := item["brand"].(string)
			if strings.ToLower(brand) != strings.ToLower(req.Brand) {
				continue
			}
		}

		// Filter by price
		if req.Price > 0 {
			price, _ := item["price"].(float64)
			if price > req.Price {
				continue
			}
		}

		results = append(results, item)
	}

	if results == nil {
		results = []map[string]interface{}{}
	}

	c.JSON(http.StatusOK, gin.H{"results": results})
}
