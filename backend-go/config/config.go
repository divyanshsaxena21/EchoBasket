package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	FirebaseServiceAccountPath string
	FirebaseDatabaseURL        string
	FirebaseStorageBucket      string
	FirebaseProjectID          string
	GroqAPIKey                 string
	AssemblyAIAPIKey           string
	MurfAIAPIKey               string
	Port                       string
}

var AppConfig Config

func Load() {
	// Load .env from project root
	envPath := filepath.Join("..", ".env")
	if err := godotenv.Load(envPath); err != nil {
		// Try current directory
		if err := godotenv.Load(".env"); err != nil {
			log.Println("Warning: .env file not found, using environment variables")
		}
	}

	AppConfig = Config{
		FirebaseServiceAccountPath: getEnv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json"),
		FirebaseDatabaseURL:        getEnv("FIREBASE_DATABASE_URL", ""),
		FirebaseStorageBucket:      getEnv("FIREBASE_STORAGE_BUCKET", ""),
		FirebaseProjectID:          getEnv("FIREBASE_PROJECT_ID", ""),
		GroqAPIKey:                 getEnv("GROQ_API_KEY", ""),
		AssemblyAIAPIKey:           getEnv("ASSEMBLYAI_API_KEY", ""),
		MurfAIAPIKey:               getEnv("MURFAI_API_KEY", ""),
		Port:                       getEnv("PORT", "5000"),
	}

	log.Println("✅ Configuration loaded")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
