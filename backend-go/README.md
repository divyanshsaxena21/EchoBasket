# EchoBasket Go Backend

A Go-based backend for EchoBasket, a voice-enabled smart shopping list application.

## Prerequisites

- Go 1.21 or higher
- Firebase project with service account credentials

## Setup

1. **Configure environment variables**

   Copy the `.env.example` or update the `.env` file in the project root with your configuration:

   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=backend-go/firebase-service-account.json
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_PROJECT_ID=your-project-id
   GROQ_API_KEY=your-groq-api-key
   ASSEMBLYAI_API_KEY=your-assemblyai-api-key
   MURFAI_API_KEY=your-murfai-api-key
   PORT=5000
   ```

2. **Place your Firebase service account credentials**

   Download your Firebase service account JSON file and place it at the path specified in `FIREBASE_SERVICE_ACCOUNT_PATH`.

3. **Install dependencies**

   ```bash
   cd backend-go
   go mod tidy
   ```

4. **Run the server**

   ```bash
   go run main.go
   ```

   Or build and run:

   ```bash
   go build -o echobasket
   ./echobasket
   ```

## API Endpoints

### Authentication
- `POST /signup` - Create a new user account
- `POST /login` - Login (handled by Firebase client SDK)
- `POST /logout` - Logout (handled client-side)

### Cart
- `GET /cart` - Get user's cart items
- `POST /cart` - Add item to cart
- `PUT /cart/:item_id` - Update cart item
- `DELETE /cart/:item_id` - Remove item from cart

### Suggestions
- `POST /suggestions` - Get AI-powered grocery suggestions

### Speech
- `POST /stt` - Speech to text (upload audio, get transcript and parsed command)
- `POST /tts` - Text to speech (get audio for text)

### Search
- `POST /search` - Search items in cart

## Project Structure

```
backend-go/
├── main.go              # Application entry point
├── go.mod               # Go module dependencies
├── config/
│   └── config.go        # Environment configuration
├── firebase/
│   └── firebase.go      # Firebase initialization
├── handlers/
│   ├── auth.go          # Authentication handlers
│   ├── cart.go          # Cart CRUD handlers
│   ├── search.go        # Search handler
│   ├── speech.go        # STT/TTS handlers
│   └── suggestions.go   # AI suggestions handler
├── middleware/
│   └── auth.go          # Token verification middleware
└── utils/
    └── nlp.go           # NLP command parsing utilities
```

## External Services

- **Firebase** - Authentication and Realtime Database
- **Groq API** - AI-powered suggestions and responses
- **AssemblyAI** - Speech-to-text transcription
- **MurfAI** - Text-to-speech synthesis
