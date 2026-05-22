# FluentAI — Setup Guide

## 1. Install Node.js (required)
Download and install from: https://nodejs.org (choose the LTS version)

After installing, restart your terminal/PowerShell.

## 2. Install dependencies
Open PowerShell in this folder and run:
```
npm install
```

## 3. Add your API Key (optional but recommended)
Copy `.env.example` to `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get a free key at: https://console.anthropic.com

You can also add the key directly inside the app at Settings → API Key.

## 4. Start the server
```
npm start
```
Or for development (auto-restart):
```
npm run dev
```

## 5. Open the app
Go to: http://localhost:3000

---

## Features
- Dashboard with XP, streaks, level progress
- Complete English lessons A1 → C2
- AI Tutor (Alex) — 4 conversation modes
- Grammar exercises with instant feedback
- Vocabulary flashcards with spaced repetition
- Dictionary search (Free Dictionary API)
- Daily English news with word tooltips
- Speaking practice (Web Speech API)
- IT/Developer English section
- Dark/Light theme
- Portuguese/English UI toggle
