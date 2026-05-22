const Chat = (() => {
  let messages = [];
  let mode = 'tutor';
  let showTranslation = false;
  let isLoading = false;

  const STORAGE_KEY = 'fluentai_chat_history';

  const _saveHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, mode, savedAt: Date.now() }));
    } catch {}
  };

  const _loadHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      // Discard sessions older than 24 hours
      if (Date.now() - data.savedAt > 86400000) { localStorage.removeItem(STORAGE_KEY); return; }
      if (Array.isArray(data.messages) && data.messages.length) {
        messages = data.messages;
        mode = data.mode || 'tutor';
      }
    } catch {}
  };

  const _restoreMessagesUI = () => {
    const area = document.getElementById('messagesArea');
    if (!area || !messages.length) return;
    document.getElementById('chatWelcome')?.remove();
    messages.forEach(m => appendMessage(m.role === 'user' ? 'user' : 'ai', m.content, true));
  };

  const AGENT_NAMES = {
    tutor: 'Alex', conversation: 'Sam', interview: 'Interviewer', correction: 'Editor'
  };

  const TOPICS = {
    tutor: ['Grammar help', 'Vocabulary', 'Pronunciation tips', 'Common mistakes', 'Phrasal verbs'],
    conversation: ['My work', 'Tech & coding', 'Hobbies', 'Travel', 'Current events'],
    interview: ['Tell me about yourself', 'Strengths & weaknesses', 'Technical questions', 'Salary negotiation'],
    correction: ['Check my email', 'Fix my text', 'Review my message', 'Help me write better']
  };

  const WELCOME_MESSAGES = {
    tutor: { en: "Hi! I'm Alex, your AI English tutor! 👋 I'm here to help you improve your English. What would you like to work on today? Grammar, vocabulary, pronunciation, or just a friendly chat in English?", pt: "Oi! Sou Alex, seu tutor de inglês com IA! 👋 Estou aqui para ajudar você a melhorar seu inglês. O que você gostaria de trabalhar hoje? Gramática, vocabulário, pronúncia, ou apenas uma conversa em inglês?" },
    conversation: { en: "Hey! I'm Sam 😊 Just a friendly American here for a chat! I love meeting people from different countries. So, tell me a bit about yourself — what do you do for work?", pt: "Ei! Sou Sam 😊 Apenas um americano aqui para bater papo! Adoro conhecer pessoas de outros países. Me conte sobre você — o que você faz no trabalho?" },
    interview: { en: "Good morning! Thank you for coming in today. I've reviewed your resume and I'm excited to learn more about your technical background. Shall we get started?", pt: "Bom dia! Obrigado por vir hoje. Revisei seu currículo e estou animado para saber mais sobre seu background técnico. Podemos começar?" },
    correction: { en: "Hi! I'm your English editor 📝 Paste or type any text you want me to correct — emails, messages, technical docs, anything. I'll improve it and explain all the changes!", pt: "Oi! Sou seu editor de inglês 📝 Cole ou digite qualquer texto que queira corrigir — emails, mensagens, documentos técnicos. Vou melhorá-lo e explicar todas as alterações!" }
  };

  const setMode = (newMode, btn) => {
    mode = newMode;
    document.querySelectorAll('.chat-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const nameEl = document.getElementById('chatAgentName');
    if (nameEl) nameEl.textContent = AGENT_NAMES[newMode];
    renderTopics();
    clearForWelcome();
  };

  const renderTopics = () => {
    const el = document.getElementById('chatTopicPills');
    if (!el) return;
    el.innerHTML = (TOPICS[mode] || []).map(t =>
      `<button class="topic-pill" onclick="Chat.quickSend('${t}')">${t}</button>`
    ).join('');
  };

  const clearForWelcome = () => {
    messages = [];
    const area = document.getElementById('messagesArea');
    if (!area) return;
    const lang = I18n.getCurrent();
    const welcome = WELCOME_MESSAGES[mode];
    const text = welcome ? (lang === 'pt' ? welcome.pt : welcome.en) : '';
    area.innerHTML = `
      <div class="chat-welcome" id="chatWelcome">
        <div class="welcome-avatar"><i class="fa-solid fa-robot"></i></div>
        <h3>${AGENT_NAMES[mode]}</h3>
        <p>${text}</p>
      </div>
    `;
  };

  const send = async () => {
    const input = document.getElementById('chatInput');
    if (!input || isLoading) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    autoResize(input);

    const userMsg = { role: 'user', content: text };
    messages.push(userMsg);
    _saveHistory();
    appendMessage('user', text);
    showTyping();
    isLoading = true;
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.disabled = true;

    // Auto grammar check on user message (non-blocking)
    if (text.split(' ').length >= 4) checkGrammarSilent(text);

    try {
      const userLevel = Progress.get().level;
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.slice(-20), userLevel, mode })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Server error');
      }
      const data = await response.json();
      const aiText = data.content;
      messages.push({ role: 'assistant', content: aiText });
      _saveHistory();
      hideTyping();
      const msgId = appendMessage('ai', aiText);
      Progress.addXP(5);

      // Translate if enabled
      if (showTranslation && msgId) translateMessage(msgId, aiText);
    } catch (error) {
      hideTyping();
      if (error.message === 'QUOTA_EXCEEDED') {
        appendMessage('ai', '⏳ The AI is temporarily at capacity (quota limit reached). Please wait 30–60 seconds and try again. This happens on the free API tier — all 3 fallback models are busy right now.');
      } else if (error.message.includes('API key') || error.message.includes('GEMINI')) {
        appendMessage('ai', '⚠️ AI tutor is not connected. Make sure the server is running with GEMINI_API_KEY set in .env');
      } else {
        appendMessage('ai', `Sorry, I had trouble connecting. Error: ${error.message}`);
      }
    } finally {
      isLoading = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  };

  // ── REAL TRANSLATION via Gemini ──
  const translateMessage = async (msgId, text) => {
    const transEl = document.getElementById(`trans-${msgId}`);
    if (!transEl) return;
    transEl.innerHTML = `<i class="fa-solid fa-language"></i> <span style="opacity:0.5">Translating…</span>`;
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'pt' })
      });
      const data = await res.json();
      if (data.translation) {
        transEl.innerHTML = `<i class="fa-solid fa-language" style="color:var(--accent-cyan)"></i> <span style="color:var(--text-secondary)">${data.translation}</span>`;
      }
    } catch {
      transEl.remove();
    }
  };

  // ── SILENT GRAMMAR CHECK (shows hint bar if errors found) ──
  const checkGrammarSilent = async (text) => {
    try {
      const res = await fetch('/api/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.errors && data.errors.length > 0) showGrammarBar(data);
    } catch { /* silent */ }
  };

  const showGrammarBar = (data) => {
    const bar = document.getElementById('grammarBar');
    if (!bar) return;
    const lang = I18n.getCurrent();
    const first = data.errors[0];
    bar.style.display = 'flex';
    bar.innerHTML = `
      <i class="fa-solid fa-pen-to-square" style="color:var(--accent-orange);flex-shrink:0"></i>
      <div style="flex:1;min-width:0">
        <span style="font-size:13px;font-weight:600">${lang === 'pt' ? 'Dica gramatical:' : 'Grammar tip:'}</span>
        <span style="font-size:13px;color:var(--text-secondary);margin-left:6px">
          <del style="opacity:0.6">${first.original}</del> → <strong style="color:var(--accent-green)">${first.correction}</strong>
          ${first.explanationPT && lang === 'pt' ? `<span style="color:var(--text-muted)"> — ${first.explanationPT}</span>` : first.explanation ? `<span style="color:var(--text-muted)"> — ${first.explanation}</span>` : ''}
        </span>
      </div>
      <button onclick="Chat.dismissGrammar()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;flex-shrink:0"><i class="fa-solid fa-xmark"></i></button>
    `;
    setTimeout(() => dismissGrammar(), 8000);
  };

  const quickSend = (text) => {
    const input = document.getElementById('chatInput');
    if (input) { input.value = text; autoResize(input); }
    send();
  };

  let _msgCounter = 0;
  const appendMessage = (sender, text, silent = false) => {
    const area = document.getElementById('messagesArea');
    if (!area) return null;
    document.getElementById('chatWelcome')?.remove();
    const isAI = sender === 'ai';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = ++_msgCounter;
    const formattedText = formatMessageText(text);
    const div = document.createElement('div');
    div.className = `message ${isAI ? 'ai-msg' : 'user-msg'}`;
    div.innerHTML = `
      <div class="msg-avatar">
        ${isAI ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>'}
      </div>
      <div style="min-width:0;flex:1">
        <div class="msg-bubble">${formattedText}</div>
        ${isAI && showTranslation ? `<div class="msg-translation" id="trans-${msgId}">
          <i class="fa-solid fa-language"></i> <span style="opacity:0.5">Translating…</span>
        </div>` : ''}
        <div class="msg-time">${time}</div>
        ${isAI ? `<div style="margin-top:6px;display:flex;gap:6px">
          <button class="helper-pill" title="Listen" onclick="Speech.speak(this.closest('.message').querySelector('.msg-bubble').innerText.replace(/[^a-zA-Z0-9 .,!?']/g,''))">
            <i class="fa-solid fa-volume-high"></i>
          </button>
          <button class="helper-pill" title="Translate this message" onclick="Chat.translateSingleMessage(${msgId}, this)">
            <i class="fa-solid fa-language"></i>
          </button>
        </div>` : ''}
      </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
    if (isAI && !silent && Progress.get().settings?.soundEffects) Progress.playSound('correct');
    return msgId;
  };

  // Translate a single message on demand (button click)
  const translateSingleMessage = async (msgId, btn) => {
    const msgBubble = btn.closest('.message').querySelector('.msg-bubble');
    if (!msgBubble) return;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:12px;height:12px;border-width:2px"></div>';
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msgBubble.innerText, targetLang: 'pt' })
      });
      const data = await res.json();
      if (data.translation) {
        let transEl = document.getElementById(`trans-${msgId}`);
        if (!transEl) {
          transEl = document.createElement('div');
          transEl.id = `trans-${msgId}`;
          transEl.className = 'msg-translation';
          msgBubble.insertAdjacentElement('afterend', transEl);
        }
        transEl.innerHTML = `<i class="fa-solid fa-language" style="color:var(--accent-cyan)"></i> <span style="color:var(--text-secondary)">${data.translation}</span>`;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      }
    } catch {
      btn.innerHTML = '<i class="fa-solid fa-language"></i>';
      btn.disabled = false;
    }
  };

  const formatMessageText = (text) => {
    // 1) Escape raw HTML first, THEN apply our safe markdown
    const safe = sanitizeHTML(text);
    return safe
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:var(--glass-bg);padding:1px 6px;border-radius:4px;font-family:monospace;font-size:13px">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  const showTyping = () => {
    const area = document.getElementById('messagesArea');
    if (!area) return;
    const div = document.createElement('div');
    div.className = 'message ai-msg';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="typing-indicator">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
  };

  const hideTyping = () => document.getElementById('typingIndicator')?.remove();

  const handleKey = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); }
  };

  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const toggleTranslation = () => {
    showTranslation = !showTranslation;
    const btn = document.getElementById('translationToggleBtn');
    if (btn) btn.style.color = showTranslation ? 'var(--accent-cyan)' : '';
    Progress.toast(showTranslation ? '🌐 Auto-translation ON — AI messages will be translated to Portuguese' : 'Translation disabled', 'info', 2500);
  };

  const clearHistory = () => {
    messages = [];
    localStorage.removeItem(STORAGE_KEY);
    clearForWelcome();
    Progress.toast('Chat cleared!', 'success', 2000);
  };

  const dismissGrammar = () => {
    const bar = document.getElementById('grammarBar');
    if (bar) bar.style.display = 'none';
  };

  const init = () => {
    _loadHistory();
    renderTopics();
    // Sync mode button with restored mode
    const modeBtn = document.querySelector(`.chat-mode-btn[data-mode="${mode}"]`);
    if (modeBtn) {
      document.querySelectorAll('.chat-mode-btn').forEach(b => b.classList.remove('active'));
      modeBtn.classList.add('active');
      const nameEl = document.getElementById('chatAgentName');
      if (nameEl) nameEl.textContent = AGENT_NAMES[mode];
    }
    if (messages.length) {
      _restoreMessagesUI();
    } else {
      clearForWelcome();
    }
  };

  return { setMode, send, quickSend, handleKey, autoResize, toggleTranslation, clearHistory, dismissGrammar, translateSingleMessage, init };
})();
