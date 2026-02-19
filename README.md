# 🛒 EchoBasket

<div align="center">

![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A voice-controlled smart shopping assistant powered by AI**

[Live Demo](https://echobasket.onrender.com) • [Report Bug](https://github.com/divyanshsaxena21/EchoBasket/issues) • [Request Feature](https://github.com/divyanshsaxena21/EchoBasket/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Commands** | Add, remove, and manage cart items hands-free |
| 🤖 **AI Suggestions** | Get personalized recommendations based on cart contents and season |
| 🔊 **Voice Responses** | Hear confirmations and suggestions via text-to-speech |
| 📱 **Real-time Sync** | Cart syncs instantly across devices with Firebase |
| 🌐 **RESTful API** | Fast Go backend with Gin framework |

---

## 🏗️ Architecture

```
EchoBasket/
├── 🔧 backend-go/          # Go API Server
│   ├── config/             # Environment configuration
│   ├── firebase/           # Firebase Admin SDK integration
│   ├── handlers/           # Route handlers (cart, speech, suggestions)
│   ├── middleware/         # Auth middleware
│   ├── utils/              # NLP utilities
│   └── main.go             # Application entry point
│
├── 🎨 frontend/            # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page views
│   │   └── services/       # API client
│   └── public/
│
└── 📄 .env                 # Shared environment variables
```

---

## 🚀 Quick Start

### Prerequisites

- **Go** 1.21+
- **Node.js** 18+
- **Firebase** project with Realtime Database

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/divyanshsaxena21/EchoBasket.git
cd EchoBasket
```

### 2️⃣ Configure Environment

Create a `.env` file in the project root:

```env
# Backend (Go)
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GROQ_API_KEY=your-groq-api-key
ASSEMBLYAI_API_KEY=your-assemblyai-api-key
MURFAI_API_KEY=your-murfai-api-key
PORT=5000

# Frontend (Vite)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_BASE_URL=http://localhost:5000
```

### 3️⃣ Start the Backend

```bash
cd backend-go
go mod tidy
go run main.go
```

### 4️⃣ Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cart` | Get cart items |
| `POST` | `/cart` | Add item to cart |
| `PUT` | `/cart/:id` | Update cart item |
| `DELETE` | `/cart/:id` | Remove cart item |
| `POST` | `/suggestions` | Get AI-powered suggestions |
| `POST` | `/stt` | Speech-to-text transcription |
| `POST` | `/tts` | Text-to-speech synthesis |
| `POST` | `/search` | Search cart items |

---

## 🎤 Voice Commands

| Command | Action |
|---------|--------|
| *"Add milk to my cart"* | Adds milk with quantity 1 |
| *"Add 3 apples"* | Adds 3 apples |
| *"Remove bread"* | Removes bread from cart |
| *"What's in my cart?"* | Lists cart contents |
| *"Give me suggestions"* | AI suggests items based on cart & season |

---

## 🛠️ Tech Stack

### Backend
- **[Go](https://golang.org/)** - Fast, compiled language
- **[Gin](https://gin-gonic.com/)** - HTTP web framework
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** - Authentication & Realtime Database

### Frontend
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Axios](https://axios-http.com/)** - HTTP client

### AI Services
- **[Groq](https://groq.com/)** - LLM for suggestions & responses
- **[AssemblyAI](https://www.assemblyai.com/)** - Speech-to-text
- **[Murf AI](https://murf.ai/)** - Text-to-speech

---

## 🌐 Deployment

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `./backend-go`
   - **Build Command:** `go build -o server main.go`
   - **Start Command:** `./server`
4. Add environment variables (including `FIREBASE_SERVICE_ACCOUNT_JSON`)

### Frontend (Vercel/Netlify)

1. Connect your repository
2. Set root directory to `frontend`
3. Add `VITE_API_BASE_URL` pointing to your backend URL

---

## 📋 Roadmap

- [x] Voice-controlled cart management
- [x] AI-powered suggestions with Groq
- [x] Speech-to-text with AssemblyAI
- [x] Text-to-speech responses
- [x] Go backend migration
- [ ] User authentication
- [ ] Multi-language support
- [ ] Smart home integration (Alexa, Google Home)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Divyansh Saxena**

[![Email](https://img.shields.io/badge/Email-divyansh__saxena%40yahoo.com-red?style=flat-square&logo=yahoo)](mailto:divyansh_saxena@yahoo.com)
[![GitHub](https://img.shields.io/badge/GitHub-divyanshsaxena21-black?style=flat-square&logo=github)](https://github.com/divyanshsaxena21)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Divyansh Saxena](https://github.com/divyanshsaxena21)

</div>
