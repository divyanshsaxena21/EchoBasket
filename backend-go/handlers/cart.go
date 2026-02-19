package handlers

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"echobasket/firebase"
	"echobasket/utils"
)

// Default user ID when auth is disabled
const defaultUID = "demo-user"

type CartItem struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Quantity int     `json:"quantity"`
	Category string  `json:"category"`
	Brand    string  `json:"brand,omitempty"`
	Price    float64 `json:"price,omitempty"`
}

type AddCartRequest struct {
	Item CartItem `json:"item"`
}

// GetCart retrieves the user's cart
func GetCart(c *gin.Context) {
	uid := defaultUID

	ctx := context.Background()
	ref := firebase.DBClient.NewRef("carts/" + uid)

	var cart map[string]CartItem
	if err := ref.Get(ctx, &cart); err != nil {
		log.Printf("❌ GetCart error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if cart == nil {
		cart = make(map[string]CartItem)
	}

	c.JSON(http.StatusOK, cart)
}

// AddToCart adds an item to the user's cart
func AddToCart(c *gin.Context) {
	uid := defaultUID

	var req AddCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	item := req.Item
	if item.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No item provided"})
		return
	}

	// Categorize item
	itemName := strings.ToLower(item.Name)
	item.Category = utils.GetCategory(itemName)
	if item.Quantity == 0 {
		item.Quantity = 1
	}

	ctx := context.Background()
	ref := firebase.DBClient.NewRef("carts/" + uid)

	var cart map[string]CartItem
	if err := ref.Get(ctx, &cart); err != nil {
		cart = make(map[string]CartItem)
	}
	if cart == nil {
		cart = make(map[string]CartItem)
	}

	cart[item.ID] = item
	if err := ref.Set(ctx, cart); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// RemoveFromCart removes an item from the user's cart
func RemoveFromCart(c *gin.Context) {
	uid := defaultUID

	itemID := c.Param("item_id")
	ctx := context.Background()
	ref := firebase.DBClient.NewRef("carts/" + uid + "/" + itemID)

	if err := ref.Delete(ctx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// UpdateCartItem updates an item in the user's cart
func UpdateCartItem(c *gin.Context) {
	uid := defaultUID

	itemID := c.Param("item_id")
	var req AddCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	ctx := context.Background()
	ref := firebase.DBClient.NewRef("carts/" + uid + "/" + itemID)

	if err := ref.Set(ctx, req.Item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
