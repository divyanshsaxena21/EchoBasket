package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"echobasket/firebase"
)

// VerifyToken extracts and verifies the Firebase ID token from the Authorization header
func VerifyToken(token string) (string, error) {
	ctx := context.Background()
	decodedToken, err := firebase.AuthClient.VerifyIDToken(ctx, token)
	if err != nil {
		return "", err
	}
	return decodedToken.UID, nil
}

// AuthMiddleware is a Gin middleware that verifies the Firebase token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			c.Abort()
			return
		}

		token := authHeader
		if strings.HasPrefix(authHeader, "Bearer ") {
			token = authHeader[7:]
		}

		uid, err := VerifyToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("uid", uid)
		c.Next()
	}
}

// ExtractToken extracts the token from Authorization header without middleware
func ExtractToken(c *gin.Context) string {
	authHeader := c.GetHeader("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return authHeader[7:]
	}
	return authHeader
}
