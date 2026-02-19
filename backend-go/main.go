package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"echobasket/config"
	"echobasket/firebase"
	"echobasket/handlers"
)

func main() {
	// Load configuration
	config.Load()

	// Initialize Firebase
	if err := firebase.Initialize(); err != nil {
		log.Fatalf("Failed to initialize Firebase: %v", err)
	}

	// Setup Gin router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Auth routes
	router.POST("/signup", handlers.Signup)
	router.POST("/login", handlers.Login)
	router.POST("/logout", handlers.Logout)

	// Cart routes
	router.GET("/cart", handlers.GetCart)
	router.POST("/cart", handlers.AddToCart)
	router.DELETE("/cart/:item_id", handlers.RemoveFromCart)
	router.PUT("/cart/:item_id", handlers.UpdateCartItem)

	// Suggestions route
	router.POST("/suggestions", handlers.Suggestions)

	// Speech routes
	router.POST("/stt", handlers.SpeechToText)
	router.POST("/tts", handlers.TextToSpeech)

	// Search route
	router.POST("/search", handlers.SearchItems)

	// Start server
	port := config.AppConfig.Port
	log.Printf("🚀 Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
