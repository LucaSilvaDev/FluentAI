// Quick phrases constant (moved out of inline render function)
const IT_QUICK_PHRASES = [
  { pt: 'Preciso de mais tempo nessa task', en: 'I need more time on this task' },
  { pt: 'O ambiente de staging está fora', en: 'The staging environment is down' },
  { pt: 'Vou fazer o deploy hoje à tarde', en: "I'll deploy this afternoon" },
  { pt: 'Preciso rever esse código com você', en: 'I need to go over this code with you' },
  { pt: 'Encontrei um bug em produção', en: 'I found a bug in production' },
  { pt: 'A API está retornando erro 500', en: 'The API is returning a 500 error' },
  { pt: 'Posso pegar essa task?', en: 'Can I pick up this ticket?' },
  { pt: 'Qual é a prioridade disso?', en: "What's the priority on this?" },
];

const ITEnglish = (() => {

  // ── MAIN RENDER ──
  const render = () => {
    const container = document.getElementById('itEnglishContent');
    if (!container) return;
    const lang = I18n.getCurrent();
    let activeSection = 'git';

    const TABS = [
      ...IT_ENGLISH.categories.map(c => ({ id: c.id, icon: c.icon, label: lang === 'pt' ? c.namePT : c.name })),
      { id: 'phrases', icon: 'fa-comments', label: lang === 'pt' ? 'Frases' : 'Phrases' },
      { id: 'sql-phrases', icon: 'fa-database', label: lang === 'pt' ? 'SQL em Reuniões' : 'SQL in Meetings' },
      { id: 'translator', icon: 'fa-wand-magic-sparkles', label: lang === 'pt' ? 'Tradutor Pro' : 'Pro Translator' },
    ];

    container.innerHTML = `
      <div class="it-english-tabs" id="itTabs">
        ${TABS.map(t => `
          <button class="filter-pill it-tab ${t.id === activeSection ? 'active' : ''}" data-section="${t.id}">
            <i class="fa-solid ${t.icon}"></i> ${sanitizeHTML(t.label)}
          </button>
        `).join('')}
      </div>
      <div id="itContent" style="margin-top:20px"></div>
    `;

    container.querySelectorAll('.it-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSection = btn.dataset.section;
        container.querySelectorAll('.it-tab').forEach(t =>
          t.classList.toggle('active', t.dataset.section === activeSection)
        );
        _switchSection(activeSection, lang);
      });
    });

    _switchSection('git', lang);
  };

  // ── SECTION ROUTER ──
  const _switchSection = (sec, lang) => {
    const content = document.getElementById('itContent');
    if (!content) return;
    if (sec === 'phrases') _renderPhrases(content, lang);
    else if (sec === 'sql-phrases') _renderSQLPhrases(content, lang);
    else if (sec === 'translator') _renderTranslator(content, lang);
    else _renderVocabSection(sec, content, lang);
  };

  // ── VOCAB SECTION ──
  const _renderVocabSection = (sectionId, content, lang) => {
    const section = IT_ENGLISH.categories.find(c => c.id === sectionId);
    if (!section) return;

    content.innerHTML = `
      <div class="it-section">
        <div class="it-section-header">
          <h3><i class="fa-solid ${section.icon}" style="color:var(--accent-cyan)"></i>
            ${sanitizeHTML(lang === 'pt' ? section.namePT : section.name)}
          </h3>
          <button class="btn-secondary btn-sm it-quiz-btn">
            <i class="fa-solid fa-robot"></i> ${lang === 'pt' ? 'Testar com IA' : 'Quiz me on this'}
          </button>
        </div>
        <div class="it-vocab-grid">
          ${section.terms.map((t, i) => `
            <div class="glass-card it-vocab-card hover-lift" data-term-idx="${i}" data-section-id="${sanitizeHTML(sectionId)}">
              <div class="term">${sanitizeHTML(t.term)}</div>
              ${t.pronunciation ? `<div class="term-pronunciation">${sanitizeHTML(t.pronunciation)}</div>` : ''}
              <div class="meaning">${sanitizeHTML(lang === 'pt' ? t.meaningPT : t.meaning)}</div>
              <div class="example-code">${sanitizeHTML(t.example)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    content.querySelector('.it-quiz-btn')?.addEventListener('click', () => {
      Chat.quickSend(`Quiz me on ${section.name} vocabulary. Give me 5 questions one at a time.`);
      App.navigate('chat');
    });

    content.querySelectorAll('.it-vocab-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.termIdx);
        const sec = IT_ENGLISH.categories.find(c => c.id === card.dataset.sectionId);
        if (sec?.terms[idx]) _showTermDetail(sec.terms[idx], lang);
      });
    });

    gsap?.from('.it-vocab-card', { opacity: 0, y: 16, stagger: 0.04, duration: 0.4, ease: 'power2.out' });
  };

  // ── PHRASES SECTION ──
  const _renderPhrases = (content, lang) => {
    const groups = [
      { title: 'Code Review', icon: 'fa-code-pull-request', color: 'var(--accent-blue)', data: IT_ENGLISH.phrases.codeReview || [] },
      { title: lang === 'pt' ? 'Standup Diário' : 'Daily Standup', icon: 'fa-circle-play', color: 'var(--accent-green)', data: IT_ENGLISH.phrases.standups || [] },
      { title: 'Slack / Chat', icon: 'fa-message', color: 'var(--accent-purple)', data: IT_ENGLISH.phrases.slack || [] },
      { title: lang === 'pt' ? 'Emails Profissionais' : 'Professional Emails', icon: 'fa-envelope', color: 'var(--accent-orange)', data: IT_ENGLISH.phrases.emails || [] },
      { title: lang === 'pt' ? 'Reuniões' : 'Meetings', icon: 'fa-video', color: 'var(--accent-pink)', data: IT_ENGLISH.phrases.meetings || [] },
    ];

    // Flatten phrases with global index for event delegation
    const flat = [];
    content.innerHTML = groups.map(g => {
      const startIdx = flat.length;
      flat.push(...g.data);
      return `
        <div class="it-section">
          <h3><i class="fa-solid ${g.icon}" style="color:${g.color}"></i> ${sanitizeHTML(g.title)}</h3>
          <div class="phrase-grid">
            ${g.data.map((p, i) => `
              <div class="glass-card phrase-card" data-phrase-idx="${startIdx + i}">
                <span class="phrase-context">${sanitizeHTML(p.context || p.situation || '')}</span>
                <div class="phrase-en">${sanitizeHTML(p.en)}</div>
                <div class="phrase-pt">${sanitizeHTML(p.pt || '')}</div>
                <div class="phrase-actions">
                  <button class="helper-pill phrase-speak-btn" data-idx="${startIdx + i}"><i class="fa-solid fa-volume-high"></i></button>
                  <button class="helper-pill phrase-explain-btn" data-idx="${startIdx + i}"><i class="fa-solid fa-robot"></i></button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Single event listener on content via delegation
    content.addEventListener('click', (e) => {
      const speakBtn = e.target.closest('.phrase-speak-btn');
      const explainBtn = e.target.closest('.phrase-explain-btn');
      const card = e.target.closest('.phrase-card');

      if (speakBtn) {
        e.stopPropagation();
        const p = flat[parseInt(speakBtn.dataset.idx)];
        if (p) Speech.speak(p.en);
      } else if (explainBtn) {
        e.stopPropagation();
        const p = flat[parseInt(explainBtn.dataset.idx)];
        if (p) { Chat.quickSend(`Explain this phrase and give me 2 more examples: ${p.en}`); App.navigate('chat'); }
      } else if (card) {
        const p = flat[parseInt(card.dataset.phraseIdx)];
        if (p) Speech.speak(p.en);
      }
    });
  };

  // ── SQL PHRASES ──
  const _renderSQLPhrases = (content, lang) => {
    const phrases = IT_ENGLISH.sqlPhrases || [];
    content.innerHTML = `
      <div class="it-section">
        <h3><i class="fa-solid fa-database" style="color:var(--accent-cyan)"></i>
          ${lang === 'pt' ? 'Como falar sobre SQL em inglês em reuniões' : 'How to talk about SQL in English at work'}
        </h3>
        <p class="section-subtitle">
          ${lang === 'pt' ? 'Clique na frase para ouvir. Use o botão IA para ver mais exemplos.' : 'Click a phrase to hear it. Use the AI button for more examples.'}
        </p>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${phrases.map((p, i) => `
            <div class="glass-card sql-phrase-card" data-phrase-idx="${i}" style="padding:18px;cursor:pointer">
              <div class="sql-phrase-situation">${sanitizeHTML(p.situation)}</div>
              <div class="sql-phrase-en">${sanitizeHTML(p.en)}</div>
              <div class="sql-phrase-pt">${sanitizeHTML(p.pt)}</div>
              <div class="phrase-actions">
                <button class="helper-pill phrase-speak-btn" data-idx="${i}"><i class="fa-solid fa-volume-high"></i></button>
                <button class="helper-pill phrase-more-btn" data-idx="${i}"><i class="fa-solid fa-robot"></i> More examples</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    content.addEventListener('click', (e) => {
      const speakBtn = e.target.closest('.phrase-speak-btn');
      const moreBtn = e.target.closest('.phrase-more-btn');
      const card = e.target.closest('.sql-phrase-card');

      if (speakBtn) {
        e.stopPropagation();
        const p = phrases[parseInt(speakBtn.dataset.idx)];
        if (p) Speech.speak(p.en);
      } else if (moreBtn) {
        e.stopPropagation();
        const p = phrases[parseInt(moreBtn.dataset.idx)];
        if (p) { Chat.quickSend(`Give me 3 more ways to say this in a work meeting: ${p.en}`); App.navigate('chat'); }
      } else if (card) {
        const p = phrases[parseInt(card.dataset.phraseIdx)];
        if (p) Speech.speak(p.en);
      }
    });
  };

  // ── TRANSLATOR ──
  const _renderTranslator = (content, lang) => {
    content.innerHTML = `
      <div class="it-section">
        <div class="glass-card translator-card">
          <h3 style="margin-bottom:6px"><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--accent-purple)"></i>
            ${lang === 'pt' ? 'Tradutor para Trabalho' : 'Work Phrase Translator'}
          </h3>
          <p class="section-subtitle">
            ${lang === 'pt'
              ? 'Digite em português o que quer dizer no trabalho e receba a versão profissional em inglês técnico.'
              : 'Type what you want to say at work in Portuguese and get the professional English version.'}
          </p>
          <textarea id="translatorInput" class="glass-input" rows="3" style="resize:vertical;font-size:15px;margin-bottom:12px"
            placeholder="${lang === 'pt'
              ? 'Ex: Estou bloqueado nessa task por causa de um bug na API...'
              : 'e.g. I need to explain my blocker in standup...'}"></textarea>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
            <button class="btn-primary" id="translateBtn" style="width:auto">
              <i class="fa-solid fa-language"></i> ${lang === 'pt' ? 'Traduzir para inglês profissional' : 'Translate to professional English'}
            </button>
            <button class="btn-secondary" id="improveBtn" style="width:auto">
              <i class="fa-solid fa-pen-to-square"></i> ${lang === 'pt' ? 'Melhorar meu inglês' : 'Improve my English'}
            </button>
          </div>
          <div id="translatorResult" class="translator-result hidden">
            <div class="translator-result-label">
              ${lang === 'pt' ? '✅ Versão Profissional em Inglês' : '✅ Professional English Version'}
            </div>
            <p id="translatorResultText" class="translator-result-text"></p>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="helper-pill" id="translatorSpeakBtn"><i class="fa-solid fa-volume-high"></i> Listen</button>
              <button class="helper-pill" id="translatorCopyBtn"><i class="fa-solid fa-copy"></i> Copy</button>
              <button class="helper-pill" id="translatorAltBtn"><i class="fa-solid fa-robot"></i> Ask AI for alternatives</button>
            </div>
          </div>
        </div>

        <div class="glass-card" style="padding:24px;max-width:680px;margin-top:16px">
          <h4 style="margin-bottom:16px"><i class="fa-solid fa-bolt" style="color:var(--accent-orange)"></i>
            ${lang === 'pt' ? 'Frases rápidas do dia a dia' : 'Quick daily phrases'}
          </h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px" id="quickPhrasesGrid">
            ${IT_QUICK_PHRASES.map((p, i) => `
              <button class="helper-pill quick-phrase-btn" data-idx="${i}" style="font-size:12px">
                ${sanitizeHTML(p.pt)}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const inputEl = document.getElementById('translatorInput');
    const resultEl = document.getElementById('translatorResult');
    const resultText = document.getElementById('translatorResultText');

    document.getElementById('translateBtn')?.addEventListener('click', () => {
      if (inputEl?.value.trim()) _callTranslateAPI(inputEl.value.trim(), 'translate', resultEl, resultText);
    });
    document.getElementById('improveBtn')?.addEventListener('click', () => {
      if (inputEl?.value.trim()) _callTranslateAPI(inputEl.value.trim(), 'improve', resultEl, resultText);
    });
    document.getElementById('quickPhrasesGrid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-phrase-btn');
      if (!btn) return;
      const phrase = IT_QUICK_PHRASES[parseInt(btn.dataset.idx)];
      if (phrase && inputEl) {
        inputEl.value = phrase.pt;
        _callTranslateAPI(phrase.pt, 'translate', resultEl, resultText);
      }
    });
    document.getElementById('translatorSpeakBtn')?.addEventListener('click', () => {
      if (resultText?.textContent) Speech.speak(resultText.textContent);
    });
    document.getElementById('translatorCopyBtn')?.addEventListener('click', () => {
      if (resultText?.textContent) {
        navigator.clipboard.writeText(resultText.textContent);
        Progress.toast('Copied!', 'success', 1500);
      }
    });
    document.getElementById('translatorAltBtn')?.addEventListener('click', () => {
      if (resultText?.textContent) {
        Chat.quickSend(`Give me 3 alternative ways to say this in a professional tech environment: "${resultText.textContent}"`);
        App.navigate('chat');
      }
    });
  };

  const _callTranslateAPI = async (input, mode, resultEl, resultText) => {
    if (!resultEl || !resultText) return;
    resultEl.classList.remove('hidden');
    resultText.innerHTML = `<div class="spinner" style="width:16px;height:16px;display:inline-block;margin-right:8px"></div> ${mode === 'improve' ? 'Improving...' : 'Translating...'}`;
    try {
      const res = await fetch('/api/work-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode })
      });
      const data = await res.json();
      resultText.textContent = data.result || (mode === 'improve' ? 'Error improving text.' : 'Error generating translation.');
    } catch {
      resultText.textContent = 'Server error. Make sure the server is running.';
    }
  };

  // ── TERM DETAIL MODAL (no window._ globals) ──
  const _showTermDetail = (t, lang) => {
    const modal = document.createElement('div');
    modal.className = 'term-detail-overlay';
    modal.innerHTML = `
      <div class="glass-card term-detail-modal">
        <button class="term-detail-close"><i class="fa-solid fa-xmark"></i></button>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">
          <h3 style="font-size:26px;font-weight:800;color:var(--accent-cyan)">${sanitizeHTML(t.term)}</h3>
          ${t.pronunciation ? `<span style="color:var(--text-muted)">${sanitizeHTML(t.pronunciation)}</span>` : ''}
        </div>
        <p style="font-size:15px;color:var(--text-secondary);margin-bottom:8px">${sanitizeHTML(lang === 'pt' ? t.meaningPT : t.meaning)}</p>
        <div class="example-box" style="margin-top:12px">
          <div class="example-en" style="font-family:monospace;color:var(--accent-green)">${sanitizeHTML(t.example)}</div>
        </div>
        ${t.usage ? `<div class="tip-box" style="margin-top:12px"><strong>💬 In use</strong><p>${sanitizeHTML(t.usage)}</p></div>` : ''}
        <div style="display:flex;gap:8px;margin-top:20px;flex-wrap:wrap">
          <button class="btn-secondary term-ask-btn"><i class="fa-solid fa-robot"></i> Ask AI tutor</button>
          <button class="btn-secondary term-add-btn"><i class="fa-solid fa-plus"></i> Add to flashcards</button>
        </div>
      </div>
    `;

    modal.querySelector('.term-detail-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    modal.querySelector('.term-ask-btn').addEventListener('click', () => {
      Chat.quickSend(`Explain the term '${t.term}' in English and give me example sentences using it`);
      App.navigate('chat');
      modal.remove();
    });
    modal.querySelector('.term-add-btn').addEventListener('click', () => {
      Vocabulary.addToFlashcards(t.term);
      modal.remove();
    });

    document.body.appendChild(modal);
  };

  return { render };
})();
