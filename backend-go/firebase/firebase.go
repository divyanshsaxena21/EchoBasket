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

	// Resolve service account path
	credPath := config.AppConfig.FirebaseServiceAccountPath

	// Try multiple locations to find the credential file
	possiblePaths := []string{
		credPath,                           // As specified
		filepath.Join("..", credPath),      // Relative to parent
		"firebase-service-account.json",    // Current directory
		filepath.Base(credPath),            // Just the filename
	}

	foundPath := ""
	for _, p := range possiblePaths {
		if _, err := os.Stat(p); err == nil {
			foundPath = p
			break
		}
	}

	if foundPath == "" {
		log.Fatalf("Firebase credential file not found. Tried: %v", possiblePaths)
	}
	credPath = foundPath

	opt := option.WithCredentialsFile(credPath)

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
	log.Printf("Service account path: %s", credPath)

	return nil
}
