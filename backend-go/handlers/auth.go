package handlers

import (
	"context"
	"net/http"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"

	"echobasket/firebase"
)

type SignupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Signup creates a new user with email and password
func Signup(c *gin.Context) {
	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	ctx := context.Background()
	params := (&auth.UserToCreate{}).
		Email(req.Email).
		Password(req.Password)

	user, err := firebase.AuthClient.CreateUser(ctx, params)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"uid": user.UID})
}

// Login - Firebase client SDK handles login
func Login(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"error": "Use Firebase client SDK for login"})
}

// Logout - handled client-side
func Logout(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"error": "Logout is handled client-side"})
}
