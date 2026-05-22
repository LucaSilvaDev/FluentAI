const Dashboard = (() => {
  // Stores current challenge data so event listeners can access it without inline onclick
  let _challenge = null;

  // ── INIT ──
  const init = () => {
    Progress.updateUIStats();
    Progress.newWordOfDay();
    if (window.Effects) {
      Effects.staggerIn('.stat-card', { duration: 0.5, stagger: 0.08, delay: 0.1 });
      Effects.staggerIn('.glass-card:not(.stat-card)', { duration: 0.55, stagger: 0.07, delay: 0.3 });
    }
  };

  // ── LOAD DAILY CHALLENGE ──
  const loadDailyChallenge = async () => {
    const container = document.getElementById('dailyChallengeContent');
    if (!container) return;
    const today = new Date().toDateString();
    const cached = localStorage.getItem('fluentai_daily_challenge');
    if (cached) {
      try {
        const { date, data } = JSON.parse(cached);
        if (date === today) { render(data); return; }
      } catch {}
    }
    try {
      const level = Progress.get().level;
      const res = await fetch('/api/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      localStorage.setItem('fluentai_daily_challenge', JSON.stringify({ date: today, data }));
      render(data);
    } catch {
      _renderFallback();
    }
  };

  // ── RENDER CHALLENGE ──
  const render = (data) => {
    const container = document.getElementById('dailyChallengeContent');
    if (!container || !data) return;
    _challenge = data;

    const lang = I18n.getCurrent();
    let done = JSON.parse(localStorage.getItem('fluentai_daily_done') || '{}');
    const today = new Date().toDateString();
    if (done.date !== today) done = { date: today, grammar: false };

    const grammarAnswer = typeof data.grammar?.answer === 'string'
      ? ['a', 'b', 'c', 'd'].indexOf(data.grammar.answer.toLowerCase())
      : (data.grammar?.answer ?? 0);

    try {
      container.innerHTML = `
        <div class="challenge-inner">
          ${data.grammar ? `
          <div class="challenge-block">
            <p class="challenge-label"><i class="fa-solid fa-spell-check"></i> Grammar</p>
            ${done.grammar
              ? `<div class="tag tag-green"><i class="fa-solid fa-check"></i> ${lang === 'pt' ? 'Completado!' : 'Completed!'}</div>`
              : `<p class="challenge-question">${sanitizeHTML(data.grammar.question)}</p>
                 <div class="challenge-options" id="dailyGrammarOpts" data-answer="${grammarAnswer}">
                   ${data.grammar.options.map((opt, i) =>
                     `<button class="helper-pill" data-choice="${i}">${sanitizeHTML(opt)}</button>`
                   ).join('')}
                 </div>
                 <p id="dailyGrammarFeedback" class="grammar-feedback hidden"></p>`
            }
          </div>` : ''}

          ${data.vocabulary ? `
          <div class="challenge-block challenge-block--border">
            <p class="challenge-label"><i class="fa-solid fa-book"></i> ${lang === 'pt' ? 'Palavra do Desafio' : 'Challenge Word'}</p>
            <div class="vocab-word-row">
              <span class="vocab-word-main">${sanitizeHTML(data.vocabulary.word)}</span>
              <span class="vocab-phonetic">${sanitizeHTML(data.vocabulary.pronunciation)}</span>
              <button class="btn-icon vocab-speak-btn" style="width:28px;height:28px;font-size:12px">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            <p class="vocab-meaning">${sanitizeHTML(lang === 'pt' ? data.vocabulary.meaningPT : data.vocabulary.meaning)}</p>
            <p class="vocab-example">"${sanitizeHTML(data.vocabulary.example)}"</p>
          </div>` : ''}

          ${data.idiom ? `
          <div class="challenge-block challenge-block--border">
            <p class="challenge-label"><i class="fa-solid fa-comment-dots"></i> ${lang === 'pt' ? 'Expressão do Dia' : 'Idiom of the Day'}</p>
            <span class="idiom-phrase">"${sanitizeHTML(data.idiom.phrase)}"</span>
            <p class="idiom-meaning">${sanitizeHTML(lang === 'pt' ? data.idiom.meaningPT : data.idiom.meaning)}</p>
            <p class="idiom-example">"${sanitizeHTML(data.idiom.example)}"</p>
          </div>` : ''}

          ${data.writingPrompt ? `
          <div class="challenge-block challenge-block--border">
            <p class="challenge-label"><i class="fa-solid fa-pen-nib" style="color:var(--accent-purple)"></i> ${lang === 'pt' ? 'Desafio de Escrita' : 'Writing Challenge'}</p>
            <p class="writing-prompt">${sanitizeHTML(lang === 'pt' ? data.writingPrompt.promptPT : data.writingPrompt.prompt)}</p>
            ${data.writingPrompt.tips?.length
              ? `<ul class="writing-tips">${data.writingPrompt.tips.map(t => `<li>${sanitizeHTML(t)}</li>`).join('')}</ul>`
              : ''}
            <button class="btn-secondary writing-chat-btn" style="margin-top:10px;width:auto;font-size:12px">
              <i class="fa-solid fa-robot"></i> ${lang === 'pt' ? 'Praticar com IA' : 'Practice with AI'}
            </button>
          </div>` : ''}
        </div>
      `;

      _bindEvents(container, data, grammarAnswer);
    } catch {
      container.innerHTML = `<p style="color:var(--text-muted);padding:16px">Could not load challenge. Try refreshing!</p>`;
    }
  };

  // ── BIND EVENTS (no inline onclick) ──
  const _bindEvents = (container, data, grammarAnswer) => {
    const lang = I18n.getCurrent();

    // Grammar option buttons — event delegation on container
    const opts = container.querySelector('#dailyGrammarOpts');
    if (opts) {
      opts.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-choice]');
        if (btn) _answerGrammar(parseInt(btn.dataset.choice), grammarAnswer);
      });
    }

    // Vocab speak button
    container.querySelector('.vocab-speak-btn')?.addEventListener('click', () => {
      if (data.vocabulary?.word) Speech.speak(data.vocabulary.word);
    });

    // Writing challenge → chat
    container.querySelector('.writing-chat-btn')?.addEventListener('click', () => {
      if (data.writingPrompt) {
        const prompt = lang === 'pt' ? data.writingPrompt.promptPT : data.writingPrompt.prompt;
        Chat.quickSend('Writing challenge: ' + prompt);
        App.navigate('chat');
      }
    });
  };

  // ── ANSWER GRAMMAR ──
  const _answerGrammar = (chosen, correct) => {
    const opts = document.getElementById('dailyGrammarOpts');
    const feedback = document.getElementById('dailyGrammarFeedback');
    if (!opts || !feedback) return;

    const lang = I18n.getCurrent();
    const expl = _challenge?.grammar
      ? (lang === 'pt'
        ? (_challenge.grammar.explanationPT || _challenge.grammar.explanation)
        : _challenge.grammar.explanation) || ''
      : '';

    const correctIdx = typeof correct === 'number'
      ? correct
      : ['a', 'b', 'c', 'd'].indexOf(String(correct).toLowerCase());

    const isCorrect = chosen === correctIdx;
    const btns = opts.querySelectorAll('[data-choice]');
    btns.forEach(b => { b.disabled = true; });
    btns[chosen].style.background = isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(236,72,153,0.2)';
    btns[chosen].style.borderColor = isCorrect ? 'var(--accent-green)' : 'var(--accent-pink)';
    if (!isCorrect && btns[correctIdx]) {
      btns[correctIdx].style.background = 'rgba(16,185,129,0.2)';
      btns[correctIdx].style.borderColor = 'var(--accent-green)';
    }
    feedback.classList.remove('hidden');
    feedback.textContent = `${isCorrect ? '✅' : '❌'} ${expl}`;
    feedback.style.color = isCorrect ? 'var(--accent-green)' : 'var(--accent-pink)';
    if (isCorrect) { Progress.addXP(25); Progress.playSound('correct'); }
    localStorage.setItem('fluentai_daily_done', JSON.stringify({ date: new Date().toDateString(), grammar: true }));
  };

  const _renderFallback = () => {
    render({
      grammar: {
        question: 'Which sentence is correct?',
        options: ["She don't work on Sundays.", "She doesn't work on Sundays.", "She not work on Sundays.", "She isn't work on Sundays."],
        answer: 1,
        explanation: "With he/she/it, negative present simple uses \"doesn't\" + base verb.",
        explanationPT: 'Com he/she/it, a negativa no presente simples usa "doesn\'t" + verbo base.'
      },
      vocabulary: CURRICULUM.wordOfDay?.[0]
    });
  };

  return { init, loadDailyChallenge, render };
})();
