package firebase

import (
	"context"
	"log"
	"os"
	"path/filepath"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"firebase.google.com/go/v4/db"
	"google.golang.org/api/option"

	"echobasket/config"
)

var (
	App        *firebase.App
	AuthClient *auth.Client
	DBClient   *db.Client
)

func Initialize() error {
	ctx := context.Background()

	var opt option.ClientOption

	// Check if credentials are provided as JSON string in env var
	credJSON := os.Getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
	if credJSON != "" {
		log.Println("Using Firebase credentials from environment variable")
		opt = option.WithCredentialsJSON([]byte(credJSON))
	} else {
		// Fall back to file-based credentials
		credPath := config.AppConfig.FirebaseServiceAccountPath

		// Try multiple locations to find the credential file
		possiblePaths := []string{
			credPath,                        // As specified
			filepath.Join("..", credPath),   // Relative to parent
			"firebase-service-account.json", // Current directory
			filepath.Base(credPath),         // Just the filename
		}

		foundPath := ""
		for _, p := range possiblePaths {
			if _, err := os.Stat(p); err == nil {
				foundPath = p
				break
			}
		}

		if foundPath == "" {
			log.Fatalf("Firebase credential file not found. Tried: %v\nAlternatively, set FIREBASE_SERVICE_ACCOUNT_JSON env var with the JSON content.", possiblePaths)
		}

		log.Printf("Using Firebase credentials from file: %s", foundPath)
		opt = option.WithCredentialsFile(foundPath)
	}

	conf := &firebase.Config{
		DatabaseURL:   config.AppConfig.FirebaseDatabaseURL,
		StorageBucket: config.AppConfig.FirebaseStorageBucket,
		ProjectID:     config.AppConfig.FirebaseProjectID,
	}

	var err error
	App, err = firebase.NewApp(ctx, conf, opt)
	if err != nil {
		return err
	}

	AuthClient, err = App.Auth(ctx)
	if err != nil {
		return err
	}

	DBClient, err = App.Database(ctx)
	if err != nil {
		return err
	}

	log.Println("✅ Firebase initialized")

	return nil
}
