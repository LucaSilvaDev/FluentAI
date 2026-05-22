const News = (() => {
  let currentCategory = 'all';
  let lastGeneratedAt = null; // timestamp of last AI generation
  let ARTICLES = [
    {
      id: 1, level: 'A2', category: 'tech', readTime: '3 min',
      title: 'Why Learning English Opens Doors in Tech',
      summary: 'English is the universal language of technology. Most programming languages, documentation, and tutorials are written in English.',
      body: `English is the **language of technology**. Whether you are writing code, reading documentation, or collaborating with international teams, English is everywhere in the tech world.

Most popular programming languages use English keywords: *function*, *return*, *while*, *class*. Documentation for frameworks like React, Node.js, and Python is written in English first.

**Key facts:**
- Over 90% of tech content online is in English
- GitHub, Stack Overflow, and most developer tools use English
- International tech companies conduct meetings in English

Learning English means you can:
- Read official documentation without waiting for translations
- Ask questions on Stack Overflow and get answers faster
- Apply for remote jobs at global companies
- Understand error messages and debug more effectively

**Start small!** Change your computer or phone language to English. Read error messages carefully. Search for solutions in English. Every little bit helps!`,
      words: ['universal', 'documentation', 'collaborate', 'framework', 'effectively'],
      translations: {
        universal: 'universal',
        documentation: 'documentação',
        collaborate: 'colaborar',
        framework: 'framework/estrutura',
        effectively: 'efetivamente',
      }
    },
    {
      id: 2, level: 'B1', category: 'tech', readTime: '4 min',
      title: 'How to Write Better Code Comments in English',
      summary: 'Good comments explain the WHY, not the WHAT. Learn how native English speakers write clean, professional code comments.',
      body: `Writing code comments in English is an essential skill for any developer working in a global team. But there is a difference between **good comments** and **bad comments**.

**❌ Bad comment:**
\`// increment i by 1\`
\`i++;\`

**✅ Good comment:**
\`// Retry up to 3 times to handle transient network failures\`
\`for (let i = 0; i < 3; i++) { ... }\`

The bad comment explains *what* the code does — which is obvious. The good comment explains *why* the code does it — which is the valuable information.

**Useful comment patterns:**

*For TODO items:*
- \`// TODO: refactor this when we upgrade to v3\`
- \`// FIXME: this breaks when input is empty\`
- \`// HACK: temporary workaround for Safari bug\`

*For functions:*
- \`// Returns the user's display name, or "Anonymous" if not set\`
- \`// Throws if userId is invalid\`

**Pro tip:** Write comments as if explaining to a colleague who just joined the team and is reading your code for the first time. Be clear, be **concise**, and focus on the non-obvious.`,
      words: ['essential', 'transient', 'temporary', 'workaround', 'concise'],
      translations: {
        essential: 'essencial',
        transient: 'temporário/transitório',
        temporary: 'temporário',
        workaround: 'solução alternativa',
        concise: 'conciso/direto',
      }
    },
    {
      id: 3, level: 'A2', category: 'daily', readTime: '3 min',
      title: '10 Phrases Every Developer Needs in Meetings',
      summary: 'These professional phrases will help you communicate clearly in English during meetings, standups, and presentations.',
      body: `Whether you are attending a daily standup, a sprint planning, or a client call, knowing the right phrases in English is **crucial**.

Here are 10 essential phrases for developers:

**1. Asking for clarification:**
*"Could you clarify what you mean by...?"*
*"Just to make sure I understand — are you saying...?"*

**2. Sharing your status:**
*"I'm currently working on..."*
*"I'm almost done with... I just need to..."*
*"I'm blocked on... and could use some help."*

**3. Agreeing and supporting:**
*"That makes sense."*
*"I think that's a good approach."*
*"+1 on that."*

**4. Respectfully disagreeing:**
*"I see your point, but have you considered...?"*
*"I'm not sure that approach will work because..."*

**5. Wrapping up:**
*"To summarize what we decided..."*
*"I'll follow up on that by Friday."*
*"Should we schedule a follow-up call?"*

**Practice tip:** Record yourself saying these phrases and listen back. Notice the rhythm and stress of natural English speech.`,
      words: ['crucial', 'clarification', 'approach', 'summarize', 'schedule'],
      translations: {
        crucial: 'crucial/fundamental',
        clarification: 'esclarecimento',
        approach: 'abordagem',
        summarize: 'resumir',
        schedule: 'agendar/programar',
      }
    },
    {
      id: 4, level: 'B2', category: 'grammar', readTime: '5 min',
      title: 'The Most Common Grammar Mistakes Brazilians Make in English',
      summary: 'Portuguese and English are very different. Here are the top grammar mistakes Brazilian developers make — and how to fix them.',
      body: `As a Brazilian learning English, your native Portuguese sometimes works *against* you. Here are the **most common mistakes** and how to avoid them:

**1. "I have X years" vs "I am X years old"**
❌ "I have 28 years."
✅ "I am 28 years old." / "I'm 28."

In Portuguese: "Eu tenho 28 anos." → "Tenho" = I have. But in English, you *are* your age.

**2. "Since" vs "For"**
❌ "I work here since 2020."
✅ "I have worked here since 2020." / "I have worked here for 4 years."

Use **Present Perfect** with "since" (a point in time) and "for" (a duration).

**3. Saying "Open" for turning on lights/devices**
❌ "Open the computer."
✅ "Turn on the computer." / "Boot up the computer."

In Portuguese: "Abrir o computador." → In English, you "open" a file or door, but "turn on" a device.

**4. False friends: "Pretend" vs "Intend"**
❌ "I pretend to finish the project tomorrow."
✅ "I intend to finish the project tomorrow."

"Pretend" in English = *fingir* (to fake something). "Intend" = *ter a intenção* (to plan to do something).

**5. "Actually" vs "Currently"**
❌ "Actually, I work remotely." (when you mean *atualmente*)
✅ "Currently, I work remotely." / "These days, I work remotely."

"Actually" in English = *na verdade* (to correct something). Not *atualmente*!`,
      words: ['avoid', 'duration', 'device', 'intend', 'currently'],
      translations: {
        avoid: 'evitar',
        duration: 'duração',
        device: 'dispositivo',
        intend: 'ter intenção de',
        currently: 'atualmente',
      }
    },
    {
      id: 5, level: 'B1', category: 'culture', readTime: '4 min',
      title: 'American vs British English: What Developers Need to Know',
      summary: 'The two main varieties of English have important differences. Here is what matters most for tech professionals.',
      body: `When you learn English for tech, you will encounter both **American English (AmE)** and **British English (BrE)**. Most tech content uses American English, but British English is common in Europe.

**Spelling differences:**
| American | British | Meaning |
|----------|---------|---------|
| color | colour | cor |
| organize | organise | organizar |
| program | programme | programa |
| license | licence | licença |
| center | centre | centro |

**Vocabulary differences:**
| American | British | Meaning |
|----------|---------|---------|
| elevator | lift | elevador |
| cell phone | mobile | celular |
| apartment | flat | apartamento |
| vacation | holiday | férias |
| eraser | rubber | borracha |

**In tech specifically:**
- "program" is standard in both for software (AmE: "program", BrE: "programme" for TV, but "program" for software)
- GitHub, Stack Overflow, and most docs use American English
- UK companies often use British spelling in documentation

**Our advice:** Learn American English as your primary standard for tech. When dealing with British companies or colleagues, do not be surprised by the differences — both are completely correct!`,
      words: ['encounter', 'standard', 'primarily', 'standard', 'documentation'],
      translations: {
        encounter: 'encontrar/se deparar com',
        standard: 'padrão/norma',
        primarily: 'principalmente',
        documentation: 'documentação',
        variety: 'variedade',
      }
    },
    {
      id: 6, level: 'B2', category: 'tech', readTime: '5 min',
      title: 'How to Give a Great Technical Presentation in English',
      summary: 'Presenting your work in English can be scary. These tips will help you communicate clearly and confidently.',
      body: `Giving a technical presentation in English is one of the most **challenging** — and rewarding — things you can do as a developer. Here is how to do it well.

**Structure your talk:**
Always use this structure:
1. *"Today I'm going to talk about..."* (introduction)
2. *"First, let me show you the problem we were solving..."* (context)
3. *"Our approach was to..."* (solution)
4. *"The results showed that..."* (outcome)
5. *"In conclusion..."* (wrap up)
6. *"Happy to take any questions."* (Q&A)

**Transition phrases:**
- Moving on: *"Let's move on to..."* / *"Next, I'd like to cover..."*
- Emphasizing: *"The key takeaway here is..."* / *"What's really important is..."*
- Referring to slides: *"As you can see here..."* / *"This diagram shows..."*

**Handling questions you don't understand:**
- *"I'm sorry, could you repeat that?"*
- *"Could you rephrase the question?"*
- *"That's a great question. Let me think about it..."*
- *"I'm not sure off the top of my head, but I'll follow up on that."*

**The biggest tip:** Slow down. Non-native speakers often rush because they are nervous. Speaking **clearly and slowly** is more professional than speaking fast and being hard to understand.`,
      words: ['challenging', 'transition', 'emphasizing', 'rephrase', 'professional'],
      translations: {
        challenging: 'desafiador',
        transition: 'transição',
        emphasizing: 'enfatizando',
        rephrase: 'reformular',
        professional: 'profissional',
      }
    },
    {
      id: 7, level: 'A1', category: 'daily', readTime: '2 min',
      title: 'Your First 100 English Words for Tech',
      summary: 'These are the most important basic English words every developer should know first.',
      body: `If you are just starting your English journey, focus on these **essential words** first. They appear everywhere in tech!

**Action words (verbs):**
- run / execute → executar
- build → construir/compilar
- test → testar
- check → verificar
- update → atualizar
- save / store → salvar
- load → carregar
- delete / remove → deletar/remover
- create / add → criar/adicionar
- open / close → abrir/fechar

**Describing words (adjectives):**
- fast / slow → rápido/lento
- new / old → novo/velho
- large / small → grande/pequeno
- public / private → público/privado
- local / remote → local/remoto
- valid / invalid → válido/inválido
- required / optional → obrigatório/opcional

**Important nouns:**
- file → arquivo
- folder / directory → pasta/diretório
- error / bug → erro/bug
- warning → aviso
- database → banco de dados
- server → servidor
- network → rede
- user → usuário
- password → senha
- version → versão

**Practice:** Every day, pick 5 words from this list and use them in a sentence. Write the sentence in a notes app to build your habit!`,
      words: ['essential', 'execute', 'optional', 'directory', 'version'],
      translations: {
        essential: 'essencial',
        execute: 'executar',
        optional: 'opcional',
        directory: 'diretório/pasta',
        version: 'versão',
      }
    },
    {
      id: 8, level: 'C1', category: 'grammar', readTime: '6 min',
      title: 'Advanced Collocations Every Professional Should Know',
      summary: 'Collocations are word combinations that native speakers use naturally. Mastering them will make your English sound much more fluent.',
      body: `A **collocation** is a pair or group of words that are commonly used together. Native English speakers use collocations automatically — and when you use them correctly, your English sounds much more natural.

**Business & tech collocations:**
- make a decision (✅) vs *do a decision* (❌)
- take responsibility (✅) vs *make responsibility* (❌)
- meet a deadline (✅) vs *make a deadline* (❌)
- raise a concern (✅) vs *tell a concern* (❌)
- reach a consensus (✅) vs *arrive to consensus* (❌)
- set up a meeting (✅) vs *do a meeting* (❌)

**Common verb + noun collocations for developers:**
- conduct a code review
- run a test / run a script
- handle an error / handle an exception
- establish a connection
- maintain a database
- deploy an application
- ship a feature
- break a build (bad!) / fix a build

**Collocations with "get":**
- get feedback
- get stuck (ficar preso em algo)
- get the hang of something (aprender o jeito)
- get approval
- get back to someone (responder alguém)

**How to learn collocations:** When you learn a new word, always learn it *with its partners*. Don't just learn "deadline" — learn "meet a deadline", "miss a deadline", "set a deadline". Your brain will remember them as chunks, making them much easier to use naturally.`,
      words: ['collocation', 'consensus', 'conduct', 'establish', 'approval'],
      translations: {
        collocation: 'colocação (combinação de palavras)',
        consensus: 'consenso',
        conduct: 'conduzir/realizar',
        establish: 'estabelecer',
        approval: 'aprovação',
      }
    },
  ];

  const CATEGORIES = [
    { id: 'all', name: 'All', namePT: 'Todos', icon: 'fa-border-all' },
    { id: 'tech', name: 'Tech', namePT: 'Tecnologia', icon: 'fa-code' },
    { id: 'grammar', name: 'Grammar Tips', namePT: 'Dicas de Gramática', icon: 'fa-spell-check' },
    { id: 'daily', name: 'Daily English', namePT: 'Inglês Diário', icon: 'fa-sun' },
    { id: 'culture', name: 'Culture', namePT: 'Cultura', icon: 'fa-globe' },
  ];

  // ── FETCH FRESH ARTICLES FROM GEMINI ──
  const fetchArticles = async (container) => {
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      // Support both old array format and new { articles, generatedAt } format
      if (Array.isArray(data)) {
        if (data.length) ARTICLES = data;
      } else if (Array.isArray(data.articles) && data.articles.length) {
        ARTICLES = data.articles;
        lastGeneratedAt = data.generatedAt || null;
      }
    } catch {
      // keep using hardcoded ARTICLES as fallback
    }
    renderGrid();
    renderTimestamp();
    if (container) gsap?.from('.news-card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.4, ease: 'power2.out' });
  };

  const init = () => renderNewsPage();

  const renderTimestamp = () => {
    const el = document.getElementById('newsTimestamp');
    if (!el) return;
    const lang = I18n.getCurrent();
    if (!lastGeneratedAt) { el.textContent = ''; return; }
    const d = new Date(lastGeneratedAt);
    const timeStr = d.toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short' });
    el.textContent = lang === 'pt'
      ? `Gerado pela IA em ${dateStr} às ${timeStr} · atualiza a cada 1h`
      : `AI-generated on ${dateStr} at ${timeStr} · refreshes every 1h`;
  };

  const renderNewsPage = () => {
    const container = document.getElementById('newsContent');
    if (!container) return;
    const lang = I18n.getCurrent();

    container.innerHTML = `
      <div class="news-categories">
        ${CATEGORIES.map(cat => `
          <button class="filter-pill ${cat.id === currentCategory ? 'active' : ''}"
                  onclick="News.filterBy('${cat.id}', this)">
            <i class="fa-solid ${cat.icon}"></i>
            ${lang === 'pt' ? cat.namePT : cat.name}
          </button>
        `).join('')}
        <button class="filter-pill" onclick="News.refresh()" title="${lang === 'pt' ? 'Gerar novos artigos com IA' : 'Generate new AI articles'}" style="margin-left:auto">
          <i class="fa-solid fa-rotate"></i> ${lang === 'pt' ? 'Atualizar' : 'Refresh'}
        </button>
      </div>
      <p id="newsTimestamp" style="font-size:11px;color:var(--text-muted);text-align:right;margin:-4px 0 8px;padding-right:4px"></p>
      <div class="news-grid" id="newsGrid">
        <div style="grid-column:1/-1;text-align:center;padding:48px">
          <div class="spinner" style="margin:0 auto 16px"></div>
          <p style="color:var(--text-muted)">${lang === 'pt' ? 'Gerando artigos com IA...' : 'Generating articles with AI…'}</p>
        </div>
      </div>
    `;
    fetchArticles(container);
  };

  const refresh = () => {
    const grid = document.getElementById('newsGrid');
    const lang = I18n.getCurrent();
    const tsEl = document.getElementById('newsTimestamp');
    if (tsEl) tsEl.textContent = lang === 'pt' ? 'Gerando novos artigos...' : 'Generating new articles…';
    if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px">
      <div class="spinner" style="margin:0 auto 16px"></div>
      <p style="color:var(--text-muted)">${lang === 'pt' ? 'Gerando novos artigos...' : 'Generating new articles…'}</p>
    </div>`;
    fetchArticles(null);
  };

  const filterBy = (cat, btn) => {
    currentCategory = cat;
    document.querySelectorAll('.news-categories .filter-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    renderGrid();
  };

  const renderGrid = () => {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    const lang = I18n.getCurrent();
    const filtered = currentCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter(a => a.category === currentCategory);

    grid.innerHTML = filtered.map(article => `
      <div class="glass-card news-card glass-shine hover-lift animate-in" onclick="News.openArticle(${article.id})">
        <div class="news-card-level">
          <i class="fa-solid fa-signal"></i> ${article.level}
          <span style="opacity:0.6;margin:0 4px">•</span>
          ${article.category.toUpperCase()}
        </div>
        <h4>${article.title}</h4>
        <p>${article.summary}</p>
        <div class="news-card-footer">
          <span class="news-read-time"><i class="fa-regular fa-clock"></i> ${article.readTime}</span>
          <span class="news-words-tooltip">
            <i class="fa-solid fa-language"></i>
            ${lang === 'pt' ? `${article.words.length} palavras-chave` : `${article.words.length} key words`}
          </span>
        </div>
      </div>
    `).join('');

    gsap?.from('.news-card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.4, ease: 'power2.out' });
  };

  const openArticle = (id) => {
    const article = ARTICLES.find(a => a.id === id);
    if (!article) return;
    const lang = I18n.getCurrent();
    const container = document.getElementById('newsContent');

    const formattedBody = formatArticleBody(article.body, article.words, article.translations, lang);

    container.innerHTML = `
      <div style="max-width:720px;margin:0 auto">
        <button class="btn-back" onclick="News.init()" style="margin-bottom:24px">
          <i class="fa-solid fa-arrow-left"></i> ${lang === 'pt' ? 'Voltar' : 'Back'}
        </button>
        <div class="glass-card" style="padding:40px">
          <div style="display:flex;gap:8px;margin-bottom:16px">
            <span class="tag tag-blue">${article.level}</span>
            <span class="tag tag-purple">${article.category.toUpperCase()}</span>
            <span style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:4px">
              <i class="fa-regular fa-clock"></i> ${article.readTime}
            </span>
          </div>
          <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.5px;margin-bottom:24px;line-height:1.3">${article.title}</h1>
          <div class="article-body" style="line-height:1.9;font-size:15px;color:var(--text-secondary)">
            ${formattedBody}
          </div>

          <!-- Translation section -->
          <div id="articleTranslationBox" style="display:none;margin-top:24px;padding:24px;background:rgba(0,180,120,0.07);border:1px solid rgba(0,180,120,0.2);border-radius:16px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
              <span style="font-size:20px">🇧🇷</span>
              <span style="font-weight:700;font-size:14px;color:var(--accent-green)">Tradução em Português</span>
            </div>
            <div id="articleTranslationText" style="line-height:1.9;font-size:15px;color:var(--text-secondary)"></div>
          </div>

          <div style="margin-top:20px;margin-bottom:4px">
            <button class="btn-secondary" id="translateArticleBtn" onclick="News.translateArticle(${article.id})" style="width:100%;justify-content:center;gap:10px;padding:14px">
              <span style="font-size:16px">🇧🇷</span>
              ${lang === 'pt' ? 'Traduzir artigo para Português' : 'Translate article to Portuguese'}
            </button>
          </div>

          <div class="divider"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <div>
              <h4 style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">
                ${lang === 'pt' ? '📚 Palavras-chave desta leitura' : '📚 Key vocabulary from this article'}
              </h4>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${article.words.map(w => `
                  <button class="helper-pill" onclick="Vocabulary.showWordDetail('${w}')" title="${article.translations[w] || w}">
                    ${w}
                  </button>
                `).join('')}
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn-secondary" onclick="Progress.addXP(20);Progress.toast('+20 XP for reading!','success');this.disabled=true;this.innerHTML='<i class=\\'fa-solid fa-check\\'></i> Done'">
                <i class="fa-solid fa-check-double"></i>
                ${lang === 'pt' ? 'Marcar como lido (+20 XP)' : 'Mark as read (+20 XP)'}
              </button>
              <button class="btn-secondary" onclick="Chat.quickSend('I just read an article about: ${article.title.replace(/'/g, "\\'")}. Can you ask me comprehension questions about it?');App.navigate('chat')">
                <i class="fa-solid fa-robot"></i> Discuss with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    gsap?.from('.article-body', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
  };

  const formatArticleBody = (text, keyWords, translations, lang) => {
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:700">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="color:var(--accent-cyan)">$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:var(--glass-bg);padding:2px 8px;border-radius:4px;font-family:monospace;font-size:13px;color:var(--accent-green)">$1</code>')
      .replace(/✅ /g, '<span style="color:var(--accent-green)">✅ </span>')
      .replace(/❌ /g, '<span style="color:var(--accent-pink)">❌ </span>')
      .replace(/\n\n/g, '</p><p style="margin-bottom:12px">')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p style="margin-bottom:12px">')
      .replace(/$/, '</p>');

    // highlight key words with tooltips
    keyWords.forEach(word => {
      const translation = translations[word] || '';
      const regex = new RegExp(`\\b(${word}s?)\\b`, 'gi');
      html = html.replace(regex, (match) =>
        `<span class="hover-word" title="${translation}" style="position:relative;cursor:help;text-decoration:underline;text-decoration-style:dotted;text-decoration-color:var(--accent-cyan)"
          onmouseenter="News.showTooltip(event,'${translation}')"
          onmouseleave="News.hideTooltip()"
        >${match}</span>`
      );
    });

    return html;
  };

  const translateArticle = async (id) => {
    const article = ARTICLES.find(a => a.id === id);
    if (!article) return;

    const btn = document.getElementById('translateArticleBtn');
    const box = document.getElementById('articleTranslationBox');
    const textEl = document.getElementById('articleTranslationText');

    // Toggle: if already showing, hide it
    if (box.style.display !== 'none') {
      box.style.display = 'none';
      btn.innerHTML = `<span style="font-size:16px">🇧🇷</span> Traduzir artigo para Português`;
      return;
    }

    // Show loading
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner" style="width:16px;height:16px;border-width:2px;margin:0"></div> Traduzindo...`;
    box.style.display = 'block';
    textEl.innerHTML = `<div style="text-align:center;padding:24px"><div class="spinner" style="margin:0 auto 12px"></div><p style="color:var(--text-muted)">Traduzindo artigo com IA...</p></div>`;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: article.title + '\n\n' + article.body, targetLang: 'pt' })
      });
      const data = await res.json();
      if (!data.translation) throw new Error('empty');

      const formatted = data.translation
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:700">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p style="margin-bottom:12px">')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p style="margin-bottom:12px">')
        .replace(/$/, '</p>');

      textEl.innerHTML = formatted;
      btn.disabled = false;
      btn.innerHTML = `<span style="font-size:16px">🇧🇷</span> Ocultar tradução`;
    } catch {
      textEl.innerHTML = `<p style="color:var(--accent-orange)">Erro ao traduzir. Verifique se o servidor está rodando.</p>`;
      btn.disabled = false;
      btn.innerHTML = `<span style="font-size:16px">🇧🇷</span> Tentar novamente`;
    }
  };

  const showTooltip = (event, text) => {
    let tip = document.getElementById('globalTooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'globalTooltip';
      tip.style.cssText = 'position:fixed;background:var(--bg-secondary);border:1px solid var(--glass-border);border-radius:8px;padding:6px 12px;font-size:12px;z-index:1000;pointer-events:none;color:var(--text-primary);box-shadow:0 4px 16px rgba(0,0,0,0.3);white-space:nowrap';
      document.body.appendChild(tip);
    }
    tip.textContent = `🇧🇷 ${text}`;
    tip.style.display = 'block';
    tip.style.left = Math.min(event.clientX + 12, window.innerWidth - 160) + 'px';
    tip.style.top = event.clientY - 40 + 'px';
  };

  const hideTooltip = () => {
    const tip = document.getElementById('globalTooltip');
    if (tip) tip.style.display = 'none';
  };

  return { init, filterBy, openArticle, translateArticle, showTooltip, hideTooltip, refresh };
})();
