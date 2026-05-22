const Vocabulary = (() => {
  let currentTab = 'flashcards';
  let currentCardIdx = 0;
  let isFlipped = false;
  let deck = [];
  let searchResults = [];

  // Built-in vocabulary deck
  const BUILT_IN_DECK = [
    { word: 'Accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: 'To successfully achieve or complete something', meaningPT: 'Realizar/conquistar', example: 'We accomplished all our sprint goals.', pos: 'verb', level: 'B1' },
    { word: 'Acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: 'To recognize or admit the existence of something', meaningPT: 'Reconhecer/admitir', example: 'Please acknowledge receipt of this email.', pos: 'verb', level: 'B2' },
    { word: 'Allocate', phonetic: '/ˈæləkeɪt/', meaning: 'To distribute resources for a specific purpose', meaningPT: 'Alocar/distribuir', example: 'We need to allocate more time for testing.', pos: 'verb', level: 'B2' },
    { word: 'Ambiguous', phonetic: '/æmˈbɪɡjuəs/', meaning: 'Open to more than one interpretation; unclear', meaningPT: 'Ambíguo/pouco claro', example: 'The requirements are too ambiguous.', pos: 'adjective', level: 'C1' },
    { word: 'Approach', phonetic: '/əˈproʊtʃ/', meaning: 'A way of dealing with a problem or task', meaningPT: 'Abordagem/método', example: 'What approach should we take?', pos: 'noun/verb', level: 'B1' },
    { word: 'Assess', phonetic: '/əˈses/', meaning: 'To evaluate or estimate something', meaningPT: 'Avaliar/estimar', example: 'We need to assess the risks first.', pos: 'verb', level: 'B2' },
    { word: 'Assumption', phonetic: '/əˈsʌmpʃən/', meaning: 'Something taken for granted without proof', meaningPT: 'Suposição/premissa', example: "Don't make assumptions about user behavior.", pos: 'noun', level: 'B2' },
    { word: 'Benchmark', phonetic: '/ˈbentʃmɑːrk/', meaning: 'A standard or point of reference', meaningPT: 'Referência/padrão de comparação', example: 'Set a performance benchmark first.', pos: 'noun/verb', level: 'B2' },
    { word: 'Collaborate', phonetic: '/kəˈlæbəreɪt/', meaning: 'To work together toward a shared goal', meaningPT: 'Colaborar/trabalhar em equipe', example: 'Our teams collaborate across time zones.', pos: 'verb', level: 'B1' },
    { word: 'Concise', phonetic: '/kənˈsaɪs/', meaning: 'Expressing much in few words; brief and clear', meaningPT: 'Conciso/claro e direto', example: 'Keep your commit messages concise.', pos: 'adjective', level: 'C1' },
    { word: 'Constraint', phonetic: '/kənˈstreɪnt/', meaning: 'A limitation or restriction', meaningPT: 'Restrição/limitação', example: 'Budget constraints affect our choices.', pos: 'noun', level: 'B2' },
    { word: 'Dedicated', phonetic: '/ˈdedɪkeɪtɪd/', meaning: 'Committed to a task or purpose', meaningPT: 'Dedicado/comprometido', example: 'She is a dedicated developer.', pos: 'adjective', level: 'B1' },
    { word: 'Efficient', phonetic: '/ɪˈfɪʃənt/', meaning: 'Achieving maximum productivity with minimum effort', meaningPT: 'Eficiente/produtivo', example: 'This algorithm is more efficient.', pos: 'adjective', level: 'B1' },
    { word: 'Enhance', phonetic: '/ɪnˈhæns/', meaning: 'To improve the quality or value of something', meaningPT: 'Aprimorar/melhorar', example: 'This update enhances performance.', pos: 'verb', level: 'B2' },
    { word: 'Establish', phonetic: '/ɪˈstæblɪʃ/', meaning: 'To set up or create something permanent', meaningPT: 'Estabelecer/criar', example: 'We need to establish coding standards.', pos: 'verb', level: 'B2' },
    { word: 'Feasible', phonetic: '/ˈfiːzɪbəl/', meaning: 'Possible and practical to achieve', meaningPT: 'Viável/factível', example: 'Is this feature feasible in two weeks?', pos: 'adjective', level: 'C1' },
    { word: 'Framework', phonetic: '/ˈfreɪmwɜːrk/', meaning: 'A supporting structure or system', meaningPT: 'Framework/estrutura', example: 'We use React as our frontend framework.', pos: 'noun', level: 'B1' },
    { word: 'Generate', phonetic: '/ˈdʒenəreɪt/', meaning: 'To produce or create something', meaningPT: 'Gerar/produzir', example: 'The script generates a report automatically.', pos: 'verb', level: 'B1' },
    { word: 'Implement', phonetic: '/ˈɪmplɪment/', meaning: 'To put a plan or system into effect', meaningPT: 'Implementar/colocar em prática', example: 'We will implement this feature next sprint.', pos: 'verb', level: 'B1' },
    { word: 'Integrate', phonetic: '/ˈɪntɪɡreɪt/', meaning: 'To combine parts into a whole', meaningPT: 'Integrar/combinar', example: 'We need to integrate this API.', pos: 'verb', level: 'B2' },
    { word: 'Intuitive', phonetic: '/ɪnˈtjuːɪtɪv/', meaning: 'Easy to understand or use naturally', meaningPT: 'Intuitivo/fácil de entender', example: 'The interface should be intuitive.', pos: 'adjective', level: 'C1' },
    { word: 'Iterate', phonetic: '/ˈɪtəreɪt/', meaning: 'To repeat a process, usually to improve', meaningPT: 'Iterar/repetir em ciclos', example: 'We iterate quickly on new features.', pos: 'verb', level: 'B2' },
    { word: 'Leverage', phonetic: '/ˈlevərɪdʒ/', meaning: 'To use something to maximum advantage', meaningPT: 'Alavancar/aproveitar', example: 'Leverage existing tools when possible.', pos: 'verb', level: 'C1' },
    { word: 'Maintain', phonetic: '/meɪnˈteɪn/', meaning: 'To keep in a certain condition; to continue', meaningPT: 'Manter/sustentar', example: 'Who maintains this codebase?', pos: 'verb', level: 'B1' },
    { word: 'Migrate', phonetic: '/ˈmaɪɡreɪt/', meaning: 'To move from one system or platform to another', meaningPT: 'Migrar/transferir', example: 'We need to migrate to PostgreSQL.', pos: 'verb', level: 'B2' },
    { word: 'Optimize', phonetic: '/ˈɒptɪmaɪz/', meaning: 'To make as efficient as possible', meaningPT: 'Otimizar/melhorar eficiência', example: 'Let\'s optimize these database queries.', pos: 'verb', level: 'B2' },
    { word: 'Outstanding', phonetic: '/ˌaʊtˈstændɪŋ/', meaning: 'Exceptionally good; still to be done', meaningPT: 'Excepcional / pendente (duas acepções)', example: 'Outstanding work on this feature!', pos: 'adjective', level: 'B2' },
    { word: 'Prioritize', phonetic: '/praɪˈɒrɪtaɪz/', meaning: 'To arrange in order of importance', meaningPT: 'Priorizar/ordenar por importância', example: 'Let\'s prioritize the backlog today.', pos: 'verb', level: 'B2' },
    { word: 'Reliable', phonetic: '/rɪˈlaɪəbəl/', meaning: 'Consistently good in quality; dependable', meaningPT: 'Confiável/consistente', example: 'We need a reliable server.', pos: 'adjective', level: 'B1' },
    { word: 'Seamless', phonetic: '/ˈsiːmləs/', meaning: 'Smooth and without any problems or breaks', meaningPT: 'Perfeito/sem falhas', example: 'The migration was seamless.', pos: 'adjective', level: 'C1' },
    { word: 'Stakeholder', phonetic: '/ˈsteɪkhoʊldər/', meaning: 'A person with interest in the outcome', meaningPT: 'Parte interessada/stakeholder', example: 'All stakeholders approved the design.', pos: 'noun', level: 'B2' },
    { word: 'Streamline', phonetic: '/ˈstriːmlaɪn/', meaning: 'To make more efficient by simplifying', meaningPT: 'Simplificar/otimizar processo', example: 'Let\'s streamline the review process.', pos: 'verb', level: 'C1' },
    { word: 'Troubleshoot', phonetic: '/ˈtrʌbəlʃuːt/', meaning: 'To identify and fix problems', meaningPT: 'Solucionar problemas', example: 'Can you troubleshoot this error?', pos: 'verb', level: 'B2' },
    { word: 'Validate', phonetic: '/ˈvælɪdeɪt/', meaning: 'To check or prove something is correct', meaningPT: 'Validar/verificar', example: 'Always validate user input.', pos: 'verb', level: 'B1' },
    { word: 'Vulnerability', phonetic: '/ˌvʌlnərəˈbɪlɪti/', meaning: 'A weakness that can be exploited', meaningPT: 'Vulnerabilidade/fraqueza', example: 'This is a critical security vulnerability.', pos: 'noun', level: 'C1' },
  ];

  const getCustomCards = () => {
    try { return JSON.parse(localStorage.getItem('fluentai_vocab_custom') || '[]'); } catch { return []; }
  };
  const saveCustomCards = (cards) => localStorage.setItem('fluentai_vocab_custom', JSON.stringify(cards));

  const getReviewData = () => {
    try { return JSON.parse(localStorage.getItem('fluentai_vocab_review') || '{}'); } catch { return {}; }
  };
  const saveReviewData = (data) => localStorage.setItem('fluentai_vocab_review', JSON.stringify(data));

  const buildDeck = () => {
    const custom = getCustomCards();
    return [...BUILT_IN_DECK, ...custom];
  };

  const getCardsForReview = () => {
    const allCards = buildDeck();
    const reviewData = getReviewData();
    const now = Date.now();
    return allCards.filter(card => {
      const rd = reviewData[card.word];
      if (!rd) return true;
      return rd.nextReview <= now;
    });
  };

  const recordReview = (word, correct) => {
    const data = getReviewData();
    const rd = data[word] || { interval: 1, easiness: 2.5, repetitions: 0 };
    if (correct) {
      rd.repetitions++;
      if (rd.repetitions === 1) rd.interval = 1;
      else if (rd.repetitions === 2) rd.interval = 6;
      else rd.interval = Math.round(rd.interval * rd.easiness);
      rd.easiness = Math.max(1.3, rd.easiness + 0.1);
    } else {
      rd.repetitions = 0;
      rd.interval = 1;
      rd.easiness = Math.max(1.3, rd.easiness - 0.2);
    }
    rd.nextReview = Date.now() + rd.interval * 86400000;
    rd.lastReviewed = Date.now();
    data[word] = rd;
    saveReviewData(data);
  };

  const addToFlashcards = (word) => {
    const found = BUILT_IN_DECK.find(c => c.word.toLowerCase() === word.toLowerCase());
    if (found) {
      Progress.toast(`"${word}" is already in your deck!`, 'info', 2500);
      return;
    }
    const custom = getCustomCards();
    if (custom.find(c => c.word.toLowerCase() === word.toLowerCase())) {
      Progress.toast(`"${word}" is already saved!`, 'info', 2500);
      return;
    }
    custom.push({ word, phonetic: '', meaning: word, meaningPT: word, example: '', pos: 'word', level: 'B1', custom: true });
    saveCustomCards(custom);
    Progress.toast(`"${word}" added to flashcards!`, 'success', 2500);
  };

  const init = () => {
    renderVocabularyPage();
  };

  const renderVocabularyPage = () => {
    const container = document.getElementById('vocabularyContent');
    if (!container) return;
    const lang = I18n.getCurrent();
    const dueCount = getCardsForReview().length;
    const allCards = buildDeck();

    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap">
        <div class="vocab-tabs">
          <button class="vocab-tab ${currentTab === 'flashcards' ? 'active' : ''}" onclick="Vocabulary.setTab('flashcards')">
            <i class="fa-solid fa-clone"></i> ${lang === 'pt' ? 'Flashcards' : 'Flashcards'}
          </button>
          <button class="vocab-tab ${currentTab === 'browse' ? 'active' : ''}" onclick="Vocabulary.setTab('browse')">
            <i class="fa-solid fa-list"></i> ${lang === 'pt' ? 'Navegar' : 'Browse'}
          </button>
          <button class="vocab-tab ${currentTab === 'search' ? 'active' : ''}" onclick="Vocabulary.setTab('search')">
            <i class="fa-solid fa-search"></i> ${lang === 'pt' ? 'Buscar' : 'Search'}
          </button>
          <button class="vocab-tab ${currentTab === 'add' ? 'active' : ''}" onclick="Vocabulary.setTab('add')">
            <i class="fa-solid fa-plus"></i> ${lang === 'pt' ? 'Adicionar' : 'Add'}
          </button>
        </div>
        <div class="tag tag-orange">
          ${dueCount} ${lang === 'pt' ? 'cartões para revisar' : 'cards due for review'}
        </div>
      </div>
      <div id="vocabTabContent"></div>
    `;
    renderTab(currentTab);
  };

  const setTab = (tab) => {
    currentTab = tab;
    document.querySelectorAll('.vocab-tab').forEach((t, i) => {
      t.classList.toggle('active', ['flashcards', 'browse', 'search', 'add'][i] === tab);
    });
    renderTab(tab);
  };

  const renderTab = (tab) => {
    const container = document.getElementById('vocabTabContent');
    if (!container) return;
    if (tab === 'flashcards') renderFlashcards(container);
    else if (tab === 'browse') renderBrowse(container);
    else if (tab === 'search') renderSearch(container);
    else if (tab === 'add') renderAdd(container);
  };

  const renderFlashcards = (container) => {
    const lang = I18n.getCurrent();
    deck = getCardsForReview();
    if (!deck.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-party-horn" style="color:var(--accent-green)"></i>
          <h4>${lang === 'pt' ? 'Tudo em dia! 🎉' : 'All caught up! 🎉'}</h4>
          <p>${lang === 'pt' ? 'Nenhum cartão para revisar agora. Volte mais tarde!' : 'No cards due for review right now. Come back later!'}</p>
          <button class="btn-primary" style="width:auto;margin-top:24px" onclick="Vocabulary.setTab('browse')">
            ${lang === 'pt' ? 'Navegar vocabulário' : 'Browse vocabulary'}
          </button>
        </div>
      `;
      return;
    }
    currentCardIdx = 0;
    isFlipped = false;
    renderCard(container);
  };

  const renderCard = (container) => {
    if (!container) container = document.getElementById('vocabTabContent');
    if (!container) return;
    if (currentCardIdx >= deck.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-check-circle" style="color:var(--accent-green)"></i>
          <h4>Session Complete!</h4>
          <p>You reviewed ${deck.length} cards. Great work!</p>
          <button class="btn-primary" style="width:auto;margin-top:24px" onclick="Vocabulary.renderFlashcards(document.getElementById('vocabTabContent'))">
            Start Again
          </button>
        </div>
      `;
      Progress.addXP(deck.length * 3);
      return;
    }
    const card = deck[currentCardIdx];
    const lang = I18n.getCurrent();
    isFlipped = false;
    container.innerHTML = `
      <div class="flashcard-container">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <span style="font-size:13px;color:var(--text-muted)">${currentCardIdx + 1} / ${deck.length}</span>
          <span class="tag tag-blue">${card.level || 'B1'}</span>
          <button class="btn-icon" onclick="Speech.speak('${card.word}')" title="Pronounce">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
        <div class="progress-bar-container" style="margin-bottom:20px">
          <div class="progress-bar" style="width:${(currentCardIdx / deck.length) * 100}%"></div>
        </div>

        <div class="flashcard" id="currentFlashcard" onclick="Vocabulary.flipCard()">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <span class="word-pos">${card.pos || 'word'}</span>
              <div class="flashcard-word">${card.word}</div>
              <div class="flashcard-phonetic">${card.phonetic || ''}</div>
              <div class="flashcard-hint" style="margin-top:16px">
                <i class="fa-solid fa-hand-pointer"></i>
                ${lang === 'pt' ? 'Clique para ver o significado' : 'Click to reveal meaning'}
              </div>
            </div>
            <div class="flashcard-back">
              <div class="flashcard-meaning">${lang === 'pt' ? card.meaningPT : card.meaning}</div>
              ${card.example ? `<div class="flashcard-example">"${card.example}"</div>` : ''}
            </div>
          </div>
        </div>

        <div class="flashcard-actions" id="cardActions" style="display:none">
          <button class="fc-btn fc-btn-wrong" onclick="Vocabulary.rateCard(false)">
            <i class="fa-solid fa-xmark"></i> ${lang === 'pt' ? 'Difícil' : 'Hard'}
          </button>
          <button class="fc-btn fc-btn-correct" onclick="Vocabulary.rateCard(true)">
            <i class="fa-solid fa-check"></i> ${lang === 'pt' ? 'Fácil' : 'Easy'}
          </button>
        </div>
        <p style="text-align:center;color:var(--text-muted);font-size:12px;margin-top:12px">
          ${lang === 'pt' ? 'Clique no cartão para revelar, depois avalie' : 'Click card to reveal, then rate yourself'}
        </p>
      </div>
    `;
  };

  const flipCard = () => {
    const card = document.getElementById('currentFlashcard');
    const actions = document.getElementById('cardActions');
    if (!card) return;
    isFlipped = !isFlipped;
    card.classList.toggle('flipped', isFlipped);
    if (actions) actions.style.display = isFlipped ? 'flex' : 'none';
    if (isFlipped) Speech.speak(deck[currentCardIdx]?.word || '');
  };

  const rateCard = (correct) => {
    const card = deck[currentCardIdx];
    recordReview(card.word, correct);
    Progress.recordAnswer(correct);
    if (correct) { Progress.addXP(5); Progress.playSound('correct'); }
    else { Progress.playSound('wrong'); }
    currentCardIdx++;
    const container = document.getElementById('vocabTabContent');
    renderCard(container);
  };

  const renderBrowse = (container) => {
    const lang = I18n.getCurrent();
    const allCards = buildDeck();
    const reviewData = getReviewData();
    const now = Date.now();
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
        ${allCards.map(card => {
          const rd = reviewData[card.word];
          const isDue = !rd || rd.nextReview <= now;
          return `
            <div class="glass-card" style="padding:18px;cursor:pointer;position:relative" onclick="Vocabulary.showWordDetail('${card.word.replace(/'/g, "\\'")}')">
              ${isDue ? '<div style="position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:50%;background:var(--accent-orange)"></div>' : ''}
              <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
                <span style="font-size:18px;font-weight:700;color:var(--accent-cyan)">${card.word}</span>
                <span style="font-size:12px;color:var(--text-muted)">${card.phonetic}</span>
              </div>
              <p style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">${lang === 'pt' ? card.meaningPT : card.meaning}</p>
              <div style="display:flex;gap:6px">
                <span class="tag tag-blue">${card.level}</span>
                <span class="tag tag-purple">${card.pos}</span>
                ${card.custom ? '<span class="tag tag-green">Custom</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  const showWordDetail = (word) => {
    const card = buildDeck().find(c => c.word === word);
    if (!card) return;
    const lang = I18n.getCurrent();
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px';
    modal.innerHTML = `
      <div class="glass-card" style="max-width:480px;width:100%;padding:36px;position:relative">
        <button onclick="this.closest('[style]').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer"><i class="fa-solid fa-xmark"></i></button>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span class="word-text" style="font-size:32px;font-weight:800;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${card.word}</span>
          <button class="btn-icon" onclick="Speech.speak('${card.word}')"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <span class="tag tag-blue">${card.level}</span>
          <span class="tag tag-purple">${card.pos}</span>
        </div>
        <p style="font-size:16px;color:var(--text-secondary);margin-bottom:8px">${card.meaning}</p>
        <p style="font-size:14px;color:var(--text-muted);font-style:italic;margin-bottom:16px">${card.meaningPT}</p>
        ${card.example ? `<div class="example-box"><div class="example-en">"${card.example}"</div></div>` : ''}
        <div style="display:flex;gap:8px;margin-top:20px">
          <button class="btn-primary" style="width:auto" onclick="Vocabulary.practiceWord('${card.word}')">
            <i class="fa-solid fa-clone"></i> ${lang === 'pt' ? 'Praticar' : 'Practice'}
          </button>
          <button class="btn-secondary" onclick="Chat.quickSend('Give me 3 example sentences using the word: ${card.word}');App.navigate('chat');this.closest('[style]').remove()">
            <i class="fa-solid fa-robot"></i> Ask AI
          </button>
        </div>
      </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  };

  const practiceWord = (word) => {
    document.querySelector('[style*="inset:0"]')?.remove();
    const card = buildDeck().find(c => c.word === word);
    if (!card) return;
    deck = [card];
    currentCardIdx = 0;
    setTab('flashcards');
  };

  const renderSearch = (container) => {
    const lang = I18n.getCurrent();
    container.innerHTML = `
      <div style="max-width:600px;margin:0 auto">
        <div style="display:flex;gap:8px;margin-bottom:24px">
          <input type="text" id="vocabSearchInput" class="glass-input" placeholder="${lang === 'pt' ? 'Buscar palavras em inglês...' : 'Search English words...'}"
            oninput="Vocabulary.searchWord(this.value)" style="margin-bottom:0" />
          <button class="btn-primary" style="width:auto;padding:0 20px" onclick="Vocabulary.lookupDictionary()">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div id="searchResults"></div>
      </div>
    `;
  };

  const searchWord = (query) => {
    const lang = I18n.getCurrent();
    if (!query.trim()) {
      document.getElementById('searchResults').innerHTML = '';
      return;
    }
    const q = query.toLowerCase();
    const allCards = buildDeck();
    const results = allCards.filter(c =>
      c.word.toLowerCase().includes(q) ||
      c.meaning.toLowerCase().includes(q) ||
      c.meaningPT.toLowerCase().includes(q)
    ).slice(0, 10);
    const el = document.getElementById('searchResults');
    if (!el) return;
    if (!results.length) {
      el.innerHTML = `<p style="color:var(--text-muted);text-align:center">${lang === 'pt' ? 'Nenhuma palavra encontrada localmente. Clique em buscar para procurar no dicionário!' : 'No local results. Click search to look up in the dictionary!'}</p>`;
      return;
    }
    el.innerHTML = results.map(card => `
      <div class="glass-card" style="padding:16px;margin-bottom:8px;cursor:pointer" onclick="Vocabulary.showWordDetail('${card.word}')">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:17px;font-weight:700;color:var(--accent-cyan)">${card.word}</span>
          <span class="tag tag-blue">${card.level}</span>
        </div>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:4px">${lang === 'pt' ? card.meaningPT : card.meaning}</p>
      </div>
    `).join('');
  };

  const lookupDictionary = async () => {
    const input = document.getElementById('vocabSearchInput');
    const word = input?.value?.trim();
    if (!word) return;
    const el = document.getElementById('searchResults');
    if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:24px"><div class="spinner" style="margin:0 auto"></div></div>';
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!res.ok) throw new Error('Word not found');
      const data = await res.json();
      const entry = data[0];
      const phonetic = entry.phonetics?.find(p => p.text)?.text || '';
      const meanings = entry.meanings || [];
      el.innerHTML = `
        <div class="glass-card" style="padding:24px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <h3 style="font-size:28px;font-weight:800;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${entry.word}</h3>
            <span style="color:var(--text-muted)">${phonetic}</span>
            <button class="btn-icon" onclick="Speech.speak('${entry.word}')"><i class="fa-solid fa-volume-high"></i></button>
          </div>
          ${meanings.slice(0, 3).map(m => `
            <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--glass-border)">
              <span class="tag tag-purple" style="margin-bottom:8px">${m.partOfSpeech}</span>
              ${m.definitions.slice(0, 2).map(d => `
                <p style="color:var(--text-secondary);font-size:14px;margin:8px 0">${d.definition}</p>
                ${d.example ? `<div class="example-box"><div class="example-en">"${d.example}"</div></div>` : ''}
              `).join('')}
            </div>
          `).join('')}
          <button class="btn-primary" style="width:auto;margin-top:8px" onclick="Vocabulary.saveFromDictionary('${entry.word}', '${phonetic}', '${meanings[0]?.definitions[0]?.definition?.replace(/'/g, "\\'")||''}')">
            <i class="fa-solid fa-plus"></i> Save to my deck
          </button>
        </div>
      `;
    } catch {
      el.innerHTML = `<p style="color:var(--text-muted);text-align:center">Word not found in dictionary. Check the spelling!</p>`;
    }
  };

  const saveFromDictionary = (word, phonetic, meaning) => {
    const custom = getCustomCards();
    if ([...BUILT_IN_DECK, ...custom].find(c => c.word.toLowerCase() === word.toLowerCase())) {
      Progress.toast(`"${word}" is already in your deck!`, 'info');
      return;
    }
    custom.push({ word, phonetic, meaning, meaningPT: meaning, example: '', pos: 'word', level: 'B1', custom: true });
    saveCustomCards(custom);
    Progress.toast(`"${word}" saved to your deck!`, 'success');
  };

  const renderAdd = (container) => {
    const lang = I18n.getCurrent();
    const custom = getCustomCards();
    container.innerHTML = `
      <div style="max-width:600px">
        <div class="glass-card" style="padding:28px;margin-bottom:24px">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:20px">
            <i class="fa-solid fa-plus" style="color:var(--accent-green)"></i>
            ${lang === 'pt' ? 'Adicionar palavra personalizada' : 'Add custom word'}
          </h3>
          <div style="display:flex;flex-direction:column;gap:12px">
            <input type="text" id="addWord" class="glass-input" placeholder="${lang === 'pt' ? 'Palavra em inglês' : 'English word'}" style="margin-bottom:0" />
            <input type="text" id="addMeaning" class="glass-input" placeholder="${lang === 'pt' ? 'Significado em inglês' : 'Meaning in English'}" style="margin-bottom:0" />
            <input type="text" id="addMeaningPT" class="glass-input" placeholder="Significado em português" style="margin-bottom:0" />
            <input type="text" id="addExample" class="glass-input" placeholder="${lang === 'pt' ? 'Frase exemplo (opcional)' : 'Example sentence (optional)'}" style="margin-bottom:0" />
            <button class="btn-primary" onclick="Vocabulary.saveCustomWord()">
              <i class="fa-solid fa-plus"></i> ${lang === 'pt' ? 'Adicionar ao baralho' : 'Add to deck'}
            </button>
          </div>
        </div>
        ${custom.length ? `
          <div class="glass-card" style="padding:28px">
            <h3 style="font-size:15px;font-weight:700;margin-bottom:16px">${lang === 'pt' ? 'Palavras personalizadas' : 'Custom words'} (${custom.length})</h3>
            ${custom.map((c, i) => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--glass-border)">
                <div>
                  <span style="font-weight:700;color:var(--accent-cyan)">${c.word}</span>
                  <span style="font-size:12px;color:var(--text-muted);margin-left:8px">${c.meaningPT}</span>
                </div>
                <button class="btn-icon" onclick="Vocabulary.removeCustomWord(${i})" style="width:30px;height:30px;font-size:12px">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  };

  const saveCustomWord = () => {
    const word = document.getElementById('addWord')?.value?.trim();
    const meaning = document.getElementById('addMeaning')?.value?.trim();
    const meaningPT = document.getElementById('addMeaningPT')?.value?.trim();
    const example = document.getElementById('addExample')?.value?.trim();
    if (!word || !meaning) { Progress.toast('Word and meaning are required!', 'warning'); return; }
    const custom = getCustomCards();
    if ([...BUILT_IN_DECK, ...custom].find(c => c.word.toLowerCase() === word.toLowerCase())) {
      Progress.toast(`"${word}" already exists!`, 'warning'); return;
    }
    custom.push({ word, phonetic: '', meaning, meaningPT: meaningPT || meaning, example: example || '', pos: 'word', level: 'B1', custom: true });
    saveCustomCards(custom);
    Progress.toast(`"${word}" added!`, 'success');
    renderAdd(document.getElementById('vocabTabContent'));
  };

  const removeCustomWord = (idx) => {
    const custom = getCustomCards();
    custom.splice(idx, 1);
    saveCustomCards(custom);
    renderAdd(document.getElementById('vocabTabContent'));
    Progress.toast('Word removed.', 'info', 2000);
  };

  return {
    init, setTab, renderFlashcards, flipCard, rateCard,
    searchWord, lookupDictionary, saveFromDictionary,
    showWordDetail, practiceWord, addToFlashcards,
    saveCustomWord, removeCustomWord,
  };
})();
