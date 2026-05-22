require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ── SECURITY HEADERS ──
app.use(helmet({
  contentSecurityPolicy: false // disabled to allow CDN scripts (GSAP, FontAwesome)
}));

// ── CORS ──
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`];
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (same-origin, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  }
}));

// ── RATE LIMITING ──
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 30,                   // max 30 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,                   // chat is more expensive — stricter limit
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat requests, please wait a moment.' }
});

app.use(express.json({ limit: '16kb' })); // prevent oversized payloads
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model cascade: try best model first, fall back on quota/not-found errors
const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

const generateWithFallback = async (buildPrompt, options = {}) => {
  let lastError;
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {})
      });
      if (options.chat) {
        const chat = model.startChat({ history: options.history || [] });
        const result = await chat.sendMessage(options.message);
        return result.response.text();
      }
      const result = await model.generateContent(buildPrompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const is429 = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('Too Many Requests');
      const is404 = err.message?.includes('404') || err.message?.includes('not found') || err.message?.includes('is not supported');
      if (is429 || is404) {
        console.warn(`[fallback] ${modelName} unavailable (${is429 ? 'quota' : 'not found'}), trying next model...`);
        continue;
      }
      throw err; // other errors: fail immediately
    }
  }
  throw lastError;
};

const systemPrompts = {
  tutor: (level) => `You are Alex, a friendly and enthusiastic native English tutor. The student's current level is ${level || 'beginner'}.
Your personality: warm, encouraging, patient, uses humor naturally.

CRITICAL RULE — ALWAYS use this exact bilingual format for EVERY response:

🇺🇸 **English:**
[Your full answer, correction, explanation or conversation in English. Adapt vocabulary to the student's level. Gently correct mistakes. Suggest better phrases naturally. End with a question or challenge to keep the conversation going.]

---

🇧🇷 **Português:**
[Exact same content translated to Brazilian Portuguese. Explain grammar rules, vocabulary and tips in Portuguese so the student fully understands. If there were mistakes, explain WHY in Portuguese.]

Teaching style:
- Always gently correct grammar mistakes without making the student feel bad
- Explain WHY something is correct/incorrect
- Use simple language for beginners, richer vocabulary for advanced students
- Celebrate progress and effort
- When asked about IT/tech topics, give examples with programming context
- Always end the English section with an engaging question or challenge`,

  conversation: (level) => `You are Sam, a friendly American who just met the student online. Have a natural conversation about everyday topics.
The student is a Brazilian IT developer learning English.
Level: ${level || 'beginner'} — adapt your vocabulary accordingly.

CRITICAL RULE — ALWAYS use this exact bilingual format for EVERY response:

🇺🇸 **English:**
[Your natural conversational reply in English. Talk like a real person, not a teacher. Introduce new vocabulary naturally in context. Ask about their life, work, interests.]

---

🇧🇷 **Português:**
[Translation and explanation in Brazilian Portuguese. Point out any interesting vocabulary or expressions you used. If they made grammar mistakes, gently note the correct form here.]`,

  interview: () => `You are interviewing the student for a software developer position at a tech company.
The student is Brazilian and practicing English for job interviews.

CRITICAL RULE — ALWAYS use this exact bilingual format for EVERY response:

🇺🇸 **English:**
[Ask the interview question or give feedback in professional English. Suggest more professional phrases when needed. Be professional but encouraging.]

---

🇧🇷 **Português:**
[Translate your question/feedback to Portuguese. Explain what makes a strong answer, what phrases sound more professional, and any grammar issues in their response.]`,

  correction: () => `You are a strict but kind English grammar checker for a Brazilian student.

CRITICAL RULE — ALWAYS use this exact bilingual format for EVERY response:

🇺🇸 **English:**
[Corrected version of the text. List all grammar, vocabulary and style issues found. Rate the text: Grammar X/10 | Vocabulary X/10 | Fluency X/10. Give specific improvement tips in English.]

---

🇧🇷 **Português:**
[Explain every correction in Brazilian Portuguese. Say WHY each mistake happened and how to avoid it. Give the student clear, practical rules to remember.]`
};

// Convert OpenAI-style message format to Gemini history format
const toGeminiHistory = (messages) => {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
};

const parseJSON = (text) => {
  // Try direct parse first (cleanest path)
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}
  // Strip markdown code fences if present (```json ... ```)
  const fenced = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(fenced);
  } catch {}
  // Last resort: extract outermost JSON object
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON found in response');
  return JSON.parse(fenced.slice(start, end + 1));
};

// ── CHAT ──
app.post('/api/chat', chatLimiter, async (req, res) => {
  const { messages, userLevel, mode } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'GEMINI_API_KEY not configured in .env' });
  }

  try {
    const systemPrompt = (systemPrompts[mode] || systemPrompts.tutor)(userLevel);
    const history = toGeminiHistory(messages.slice(0, -1));
    const lastMessage = messages[messages.length - 1];

    const text = await generateWithFallback(null, {
      systemInstruction: systemPrompt,
      chat: true,
      history,
      message: lastMessage.content
    });

    res.json({ content: text });
  } catch (error) {
    console.error('Gemini chat error:', error);
    const is429 = error.message?.includes('429') || error.message?.includes('quota');
    res.status(is429 ? 429 : 500).json({
      error: is429
        ? 'QUOTA_EXCEEDED'
        : error.message
    });
  }
});

// ── GRAMMAR CHECK ──
app.post('/api/grammar-check', apiLimiter, async (req, res) => {
  const { text } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'GEMINI_API_KEY not configured in .env' });
  }

  try {
    const prompt = `Check the grammar of this English text and respond ONLY in JSON format (no markdown, no code block):
{"corrected":"...","errors":[{"original":"...","correction":"...","explanation":"...","explanationPT":"..."}],"score":8,"feedback":"...","feedbackPT":"..."}
Text to check: "${text}"`;
    const responseText = await generateWithFallback(prompt);
    try { res.json(parseJSON(responseText)); }
    catch { res.json({ corrected: text, errors: [], score: 10, feedback: 'Looks good!', feedbackPT: 'Parece bom!' }); }
  } catch (error) {
    console.error('Gemini grammar-check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── DAILY CHALLENGE ──
app.post('/api/daily-challenge', apiLimiter, async (req, res) => {
  const { level } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'GEMINI_API_KEY not configured in .env' });
  }

  try {
    const prompt = `Create a daily English challenge for level ${level || 'A2'}. Respond ONLY in JSON (no markdown):
{"grammar":{"question":"Choose the correct sentence:","options":["A","B","C","D"],"answer":1,"explanation":"...","explanationPT":"..."},"vocabulary":{"word":"...","pronunciation":"/.../","meaning":"...","meaningPT":"...","example":"...","examplePT":"..."},"idiom":{"phrase":"...","meaning":"...","meaningPT":"...","example":"..."},"writingPrompt":{"prompt":"...","promptPT":"...","tips":["tip1","tip2"]}}
IMPORTANT: "answer" must be 0, 1, 2 or 3 (index of correct option).`;
    const responseText = await generateWithFallback(prompt);
    res.json(parseJSON(responseText));
  } catch (error) {
    console.error('Gemini daily-challenge error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── PRONUNCIATION FEEDBACK ──
app.post('/api/pronunciation-feedback', apiLimiter, async (req, res) => {
  const { spokenText, targetText } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'GEMINI_API_KEY not configured in .env' });
  }

  try {
    const prompt = `Compare what the student said vs what they should have said:
Target: "${targetText}"
Student said: "${spokenText}"

Respond ONLY in JSON (no markdown, no code block):
{
  "score": 85,
  "feedback": "Your pronunciation was...",
  "feedbackPT": "Sua pronúncia foi...",
  "tips": ["tip1", "tip2"],
  "tipsPT": ["dica1", "dica2"]
}`;

    const responseText = await generateWithFallback(prompt);
    res.json(parseJSON(responseText));
  } catch (error) {
    console.error('Gemini pronunciation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── NEWS (AI-generated articles, 1-hour cache) ──
const newsCache = { data: null, ts: 0 };
app.get('/api/news', apiLimiter, async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: 'GEMINI_API_KEY not configured' });
  if (newsCache.data && Date.now() - newsCache.ts < 3600000) {
    return res.json({ articles: newsCache.data, generatedAt: newsCache.ts });
  }
  try {
    const prompt = `Generate 8 English learning articles for a Brazilian IT professional. Mix levels and categories as specified below.

Each article must:
- Be written with real, practical information (not fictional)
- Have a body of at least 250 words using **bold** and *italic* markdown
- Include vocabulary words (5 per article) with Portuguese translations
- Be relevant to software developers and tech workers

Respond ONLY in JSON (no markdown wrapper):
{
  "articles": [
    {
      "id": 1, "level": "A2", "category": "daily", "readTime": "3 min",
      "title": "...", "summary": "One clear sentence.",
      "body": "Full article body with **bold**, *italic*, real tips, \\n\\n between paragraphs",
      "words": ["w1","w2","w3","w4","w5"],
      "translations": {"w1":"pt1","w2":"pt2","w3":"pt3","w4":"pt4","w5":"pt5"}
    }
  ]
}

Generate exactly 8 articles with this distribution:
- 2 articles at A2 level, categories: "daily", "tech"
- 3 articles at B1 level, categories: "tech", "career", "grammar"
- 2 articles at B2 level, categories: "culture", "tech"
- 1 article at C1 level, category: "career"

Topics must be diverse: AI tools, remote work culture, developer interviews, GitHub tips, English email writing, tech podcasts, code reviews in English, salary negotiation.`;
    const parsed = parseJSON(await generateWithFallback(prompt));
    newsCache.data = parsed.articles || [];
    newsCache.ts = Date.now();
    res.json({ articles: newsCache.data, generatedAt: newsCache.ts });
  } catch (error) {
    console.error('Gemini news error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── EXERCISES (AI-generated, infinite variety) ──
app.post('/api/exercises', apiLimiter, async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: 'GEMINI_API_KEY not configured' });
  const { category, level, count = 8 } = req.body;
  const categoryDesc = {
    grammar: 'English grammar (verb tenses, articles, prepositions, modal verbs, conditionals)',
    vocabulary: 'English vocabulary with definitions and usage in tech/work context',
    translation: 'Brazilian Portuguese → English translation for IT professionals',
    'fill-blank': 'Fill in the blank grammar exercises',
    'it-english': 'IT/tech English: acronyms, jargon, idioms used in software development teams',
    mixed: 'Mix of grammar, vocabulary, and translation'
  }[category] || 'mixed English exercises';

  try {
    const prompt = `Generate ${count} unique multiple-choice English exercises for a Brazilian IT developer at ${level} level.
Category: ${categoryDesc}

Rules:
- 4 options each, only one correct
- Distribute correct answers across positions (not always B)
- Use real developer/tech scenarios
- Explanations must be clear and teach the rule

Respond ONLY in JSON (no markdown):
{
  "exercises": [
    {
      "q": "Question in English",
      "qt": "Pergunta em Português",
      "options": ["A text", "B text", "C text", "D text"],
      "answer": 1,
      "explanation": "Explanation in English",
      "explanationPT": "Explicação em Português"
    }
  ]
}`;
    const parsed = parseJSON(await generateWithFallback(prompt));
    res.json(parsed.exercises || []);
  } catch (error) {
    console.error('Gemini exercises error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── WORK PHRASE (professional context-aware translator/improver) ──
app.post('/api/work-phrase', apiLimiter, async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: 'GEMINI_API_KEY not configured' });
  const { text, mode = 'translate' } = req.body;
  try {
    let prompt;
    if (mode === 'improve') {
      prompt = `You are an English writing coach for a Brazilian software developer. The user wrote this in English (may have errors):

"${text}"

Rewrite it as a clear, natural, professional English phrase for a tech work environment (Slack, standup, email, meeting). Return ONLY the improved English version — no explanation, no introduction.`;
    } else {
      prompt = `You are a professional translator for a Brazilian software developer working in an English-speaking tech company. Translate this to professional English suitable for workplace communication (Slack, standup, code review, email, or meeting):

"${text}"

Requirements:
- Use natural professional English that a native developer would actually say
- Keep technical terms in English
- Be direct and clear
- Return ONLY the English translation — no explanation, no introduction, no quotes around the result.`;
    }
    res.json({ result: (await generateWithFallback(prompt)).trim() });
  } catch (error) {
    console.error('Work phrase error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── TRANSLATE ──
app.post('/api/translate', apiLimiter, async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: 'GEMINI_API_KEY not configured' });
  const { text, targetLang = 'pt' } = req.body;
  try {
    const lang = targetLang === 'pt' ? 'Brazilian Portuguese' : 'English';
    const translation = await generateWithFallback(`Translate to ${lang}. Respond with ONLY the translation, no explanations:\n\n${text}`);
    res.json({ translation: translation.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── STATUS ──
app.get('/api/status', (req, res) => {
  res.json({
    provider: 'gemini',
    hasKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    version: '2.5.0'
  });
});

// ── SET KEY (runtime, não persiste — localhost only) ──
app.post('/api/set-key', (req, res) => {
  const host = req.get('host') || '';
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  if (!isLocal) {
    return res.status(403).json({ error: 'This endpoint is only available on localhost.' });
  }
  const { key } = req.body;
  if (key && key.startsWith('AIza')) {
    process.env.GEMINI_API_KEY = key;
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Formato de chave inválido (deve começar com AIza)' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 FluentAI running at http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: Google Gemini (gemini-2.5-flash)`);
  console.log(`📚 Your personal English learning platform is ready!\n`);
});
