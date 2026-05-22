# FluentAI — Personal English Learning Platform

A full-stack AI-powered English learning web app built for Brazilian IT professionals. Features a modern glassmorphism UI, Google Gemini integration, and a complete A1→C2 curriculum.

![FluentAI Dashboard](public/logo.png)

## Features

- **AI Tutor (Alex)** — 4 conversation modes: tutor, free chat, job interview prep, text correction
- **Structured Curriculum** — Grammar lessons from A1 to C2
- **AI Exercises** — Infinite variety via Gemini (grammar, vocabulary, translation, IT English)
- **Vocabulary Flashcards** — Spaced repetition system with custom cards
- **Daily Challenge** — AI-generated grammar question + word + idiom + writing prompt, cached per day
- **Daily News** — AI-generated English articles with hover-to-translate vocabulary tooltips
- **Speaking Practice** — Web Speech API with AI pronunciation feedback
- **IT English** — Developer vocabulary, professional phrases, SQL in meetings, work translator
- **Dark/Light theme**, PT/EN UI toggle, XP + streak gamification

## Tech Stack

**Backend**
- Node.js + Express
- Google Gemini API (`gemini-2.5-flash`) with automatic model fallback
- Rate limiting (`express-rate-limit`), security headers (`helmet`), CORS

**Frontend**
- Vanilla JavaScript — modular IIFE pattern, no framework dependencies
- GSAP 3 for animations (scroll triggers, stagger reveals, page transitions)
- Web Speech API for speech recognition and synthesis
- CSS glassmorphism with custom properties for dark/light theming

## Getting Started

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/fluent-ai.git
cd fluent-ai
npm install
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env` and add your key:

```
GEMINI_API_KEY=your_key_here
```

### Run

```bash
npm start          # production
npm run dev        # development with auto-restart
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
fluent-ai/
├── server.js              # Express API (chat, exercises, news, translation)
├── public/
│   ├── index.html         # Single-page app shell
│   ├── css/
│   │   ├── styles.css     # Glassmorphism design system
│   │   └── animations.css # GSAP-integrated keyframes
│   ├── js/
│   │   ├── app.js         # Navigation, onboarding, confirm modal
│   │   ├── dashboard.js   # Daily challenge, XP stats
│   │   ├── it-english.js  # IT vocabulary, phrases, work translator
│   │   ├── settings.js    # Settings page
│   │   ├── chat.js        # AI tutor (persistent across sessions)
│   │   ├── lessons.js     # Curriculum viewer
│   │   ├── exercises.js   # Quiz engine
│   │   ├── vocabulary.js  # Flashcard system
│   │   ├── news.js        # News reader
│   │   ├── speech.js      # Web Speech API
│   │   ├── progress.js    # XP, streak, localStorage state
│   │   ├── effects.js     # GSAP effects (tilt, magnetic, scramble)
│   │   ├── particles.js   # Canvas particle system
│   │   └── i18n.js        # PT/EN translations
│   └── data/
│       ├── curriculum.js  # A1→C2 lessons and word of the day list
│       ├── it-english.js  # IT vocabulary and professional phrases
│       ├── phrases.js     # Conversation phrase bank
│       └── translations.js # UI string translations
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | AI tutor conversation |
| POST | `/api/grammar-check` | Silent grammar analysis |
| POST | `/api/daily-challenge` | Generate daily challenge (cached client-side) |
| POST | `/api/exercises` | Generate exercise set |
| POST | `/api/translate` | Translate text PT↔EN |
| POST | `/api/work-phrase` | Professional phrase translator/improver |
| POST | `/api/pronunciation-feedback` | Compare spoken vs target text |
| GET  | `/api/news` | AI-generated articles (1h server cache) |
| GET  | `/api/status` | Server health + API key status |

## License

MIT
