const Exercises = (() => {
  let currentExercises = [];
  let currentIdx = 0;
  let score = { correct: 0, total: 0 };
  let quizMode = false;
  let currentLesson = null;

  const SESSION_KEY = 'fluentai_exercise_session';

  // ── SESSION PERSISTENCE ──
  const saveSession = () => {
    if (!currentExercises.length || quizMode) return; // don't persist lesson quizzes
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      exercises: currentExercises,
      idx: currentIdx,
      score,
      savedAt: Date.now()
    }));
  };

  const loadSession = () => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      // Discard sessions older than 2 hours
      if (Date.now() - s.savedAt > 7200000) { clearSession(); return null; }
      return s;
    } catch { return null; }
  };

  const clearSession = () => sessionStorage.removeItem(SESSION_KEY);

  const EXERCISE_CATEGORIES = [
    { id: 'grammar', name: 'Grammar', namePT: 'Gramática', icon: 'fa-spell-check', color: 'var(--accent-blue)', desc: 'Practice grammar rules', descPT: 'Pratique regras gramaticais' },
    { id: 'vocabulary', name: 'Vocabulary', namePT: 'Vocabulário', icon: 'fa-book', color: 'var(--accent-purple)', desc: 'Test your vocabulary', descPT: 'Teste seu vocabulário' },
    { id: 'translation', name: 'Translation PT→EN', namePT: 'Tradução PT→EN', icon: 'fa-language', color: 'var(--accent-green)', desc: 'Translate from Portuguese', descPT: 'Traduza do português' },
    { id: 'fill-blank', name: 'Fill in the Blank', namePT: 'Preencher Lacunas', icon: 'fa-pen-to-square', color: 'var(--accent-orange)', desc: 'Complete the sentences', descPT: 'Complete as frases' },
    { id: 'mixed', name: 'Mixed Practice', namePT: 'Prática Mista', icon: 'fa-shuffle', color: 'var(--accent-cyan)', desc: 'All types mixed', descPT: 'Todos os tipos misturados' },
    { id: 'it-english', name: 'IT English', namePT: 'Inglês TI', icon: 'fa-terminal', color: 'var(--accent-pink)', desc: 'Tech vocabulary quiz', descPT: 'Quiz de vocabulário técnico' },
  ];

  const ALL_EXERCISES = [
    // Grammar exercises
    { type: 'multiple', category: 'grammar', level: 'A1',
      q: 'She ___ a developer.', qt: 'Ela ___ uma desenvolvedora.',
      options: ['am', 'is', 'are', 'be'], answer: 1,
      explanation: 'She/He/It → is', explanationPT: 'She/He/It → is' },
    { type: 'multiple', category: 'grammar', level: 'A1',
      q: 'They ___ from Brazil.', qt: 'Eles ___ do Brasil.',
      options: ['is', 'am', 'are', 'be'], answer: 2,
      explanation: 'They/We/You → are', explanationPT: 'They/We/You → are' },
    { type: 'multiple', category: 'grammar', level: 'A2',
      q: 'I ___ work yesterday.', qt: 'Eu ___ trabalhar ontem.',
      options: ["didn't", "don't", "wasn't", "not"], answer: 0,
      explanation: "Past simple negative: didn't + base verb", explanationPT: "Negativa passado simples: didn't + verbo base" },
    { type: 'multiple', category: 'grammar', level: 'B1',
      q: 'Have you ever ___ to London?', qt: 'Você já ___ em Londres?',
      options: ['go', 'went', 'been', 'gone'], answer: 2,
      explanation: '"Have been to" = visited a place. "Have gone to" = went and didn\'t return.', explanationPT: '"Have been to" = visitou um lugar. "Have gone to" = foi e não voltou.' },
    { type: 'multiple', category: 'grammar', level: 'B1',
      q: 'If it ___ tomorrow, I\'ll stay home.', qt: 'Se ___ amanhã, ficarei em casa.',
      options: ['rained', 'rains', 'will rain', 'rain'], answer: 1,
      explanation: '1st Conditional: If + Present Simple, will + verb', explanationPT: '1º Condicional: If + Presente Simples, will + verbo' },
    { type: 'multiple', category: 'grammar', level: 'B2',
      q: 'The code ___ by the senior dev.', qt: 'O código ___ pelo dev sênior.',
      options: ['reviewed', 'was reviewed', 'reviews', 'is reviewing'], answer: 1,
      explanation: 'Passive voice: was/were + past participle', explanationPT: 'Voz passiva: was/were + particípio passado' },
    { type: 'multiple', category: 'grammar', level: 'A2',
      q: 'She ___ English every day.', qt: 'Ela ___ inglês todo dia.',
      options: ['study', 'studys', 'studies', 'studying'], answer: 2,
      explanation: 'He/She/It + verb ending in consonant+y → -ies (study→studies)', explanationPT: 'He/She/It + verbo terminando em consoante+y → -ies (study→studies)' },
    { type: 'multiple', category: 'grammar', level: 'B1',
      q: 'You ___ use your phone during the meeting.', qt: 'Você ___ usar o celular durante a reunião.',
      options: ["wouldn't", "shouldn't", "mustn't", "needn't"], answer: 2,
      explanation: '"Mustn\'t" = prohibition (it\'s forbidden). "Shouldn\'t" = advice (it\'s not a good idea).', explanationPT: '"Mustn\'t" = proibição (é proibido). "Shouldn\'t" = conselho (não é uma boa ideia).' },
    // Translation exercises
    { type: 'multiple', category: 'translation', level: 'A1',
      q: 'Translate: "Eu trabalho em casa."', qt: 'Traduzir: "Eu trabalho em casa."',
      options: ['I worked at home.', 'I work from home.', 'I working home.', 'I work at home.'], answer: 1,
      explanation: '"Work from home" is the most natural phrase in English for remote work.', explanationPT: '"Work from home" é a frase mais natural em inglês para trabalho remoto.' },
    { type: 'multiple', category: 'translation', level: 'A2',
      q: 'Translate: "Ela está aprendendo inglês."', qt: 'Translate: "She is learning English."',
      options: ['She learns English.', 'She learned English.', 'She is learning English.', 'She has learned English.'], answer: 2,
      explanation: 'Present Continuous (-ing) = action in progress NOW.', explanationPT: 'Presente Contínuo (-ing) = ação em progresso AGORA.' },
    { type: 'multiple', category: 'translation', level: 'B1',
      q: 'Translate: "Você deveria testar o código antes."', qt: 'Translate: "You should test the code first."',
      options: ['You must test the code first.', 'You should test the code first.', 'You can test the code first.', 'You would test the code first.'], answer: 1,
      explanation: '"Should" = recommendation/advice.', explanationPT: '"Should" = recomendação/conselho.' },
    // IT English exercises
    { type: 'multiple', category: 'it-english', level: 'A2',
      q: 'What does "LGTM" mean in a code review?', qt: 'O que "LGTM" significa em uma code review?',
      options: ["Let's Go To Meeting", 'Looks Good To Me', 'Last Git To Merge', 'Load Global Test Module'], answer: 1,
      explanation: 'LGTM = "Looks Good To Me" — used to approve a pull request.', explanationPT: 'LGTM = "Looks Good To Me" (Parece bom para mim) — usado para aprovar um pull request.' },
    { type: 'multiple', category: 'it-english', level: 'A1',
      q: 'A "bug" in software means:', qt: 'Um "bug" em software significa:',
      options: ['A new feature', 'An error or flaw in the code', 'A type of variable', 'A database table'], answer: 1,
      explanation: 'A bug = an error, defect, or flaw in the software that causes unexpected behavior.', explanationPT: 'Um bug = um erro, defeito ou falha no software que causa comportamento inesperado.' },
    { type: 'multiple', category: 'it-english', level: 'B1',
      q: 'What does "deploy" mean?', qt: 'O que "deploy" significa?',
      options: ['To write new code', 'To test an application', 'To release software to a server/production', 'To delete old files'], answer: 2,
      explanation: '"Deploy" = to release/publish software so users can access it.', explanationPT: '"Deploy" = publicar/instalar software para que os usuários possam acessá-lo.' },
    // Fill in the blank
    { type: 'fill', category: 'fill-blank', level: 'A2',
      q: 'Complete: "I ___ working on this project since January."',
      qt: 'Complete: "Estou trabalhando neste projeto desde janeiro."',
      options: ['am', 'was', 'have been', 'had been'], answer: 2,
      explanation: '"Since" with a time reference = Present Perfect Continuous: have been + -ing.', explanationPT: '"Since" com referência de tempo = Presente Perfeito Contínuo: have been + -ing.' },
    { type: 'fill', category: 'fill-blank', level: 'B1',
      q: 'Complete: "The app ___ still being developed."',
      qt: 'Complete: "O app ___ ainda sendo desenvolvido."',
      options: ['am', 'is', 'are', 'be'], answer: 1,
      explanation: '"The app" = singular third person → "is". Passive: is + being + past participle.', explanationPT: '"The app" = terceira pessoa singular → "is". Passivo: is + being + particípio passado.' },
  ];

  const init = () => {
    if (quizMode) return;
    const session = loadSession();
    if (session && session.exercises?.length && session.idx < session.exercises.length) {
      // Resume in-progress session
      currentExercises = session.exercises;
      currentIdx = session.idx;
      score = session.score || { correct: 0, total: 0 };
      renderCategories(session);
    } else {
      clearSession();
      renderCategories(null);
    }
  };

  const renderCategories = (resumeSession = null) => {
    const container = document.getElementById('exercisesContent');
    if (!container) return;
    const lang = I18n.getCurrent();
    const userLevel = Progress.get().level || 'A2';
    container.innerHTML = `
      ${resumeSession ? `
      <div class="glass-card" style="padding:18px 24px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-left:3px solid var(--accent-cyan);flex-wrap:wrap">
        <div>
          <p style="font-weight:700;margin-bottom:2px">
            <i class="fa-solid fa-circle-play" style="color:var(--accent-cyan)"></i>
            ${lang === 'pt' ? 'Sessão em andamento' : 'Session in progress'}
          </p>
          <p style="font-size:13px;color:var(--text-muted)">
            ${lang === 'pt'
              ? `Questão ${resumeSession.idx + 1} de ${resumeSession.exercises.length} — ${resumeSession.score.correct} certa${resumeSession.score.correct !== 1 ? 's' : ''}`
              : `Question ${resumeSession.idx + 1} of ${resumeSession.exercises.length} — ${resumeSession.score.correct} correct`}
          </p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-primary" style="width:auto;padding:8px 20px;font-size:13px" onclick="Exercises.resumeSession()">
            <i class="fa-solid fa-play"></i> ${lang === 'pt' ? 'Continuar' : 'Continue'}
          </button>
          <button class="btn-secondary" style="width:auto;padding:8px 16px;font-size:13px" onclick="Exercises.discardSession()">
            ${lang === 'pt' ? 'Descartar' : 'Discard'}
          </button>
        </div>
      </div>` : ''}
      <div class="exercise-categories">
        ${EXERCISE_CATEGORIES.map(cat => `
          <div class="glass-card exercise-cat-card glass-shine hover-lift" style="position:relative">
            <div onclick="Exercises.startCategory('${cat.id}')" style="cursor:pointer">
              <i class="fa-solid ${cat.icon}" style="color:${cat.color}"></i>
              <h4>${lang === 'pt' ? cat.namePT : cat.name}</h4>
              <p>${lang === 'pt' ? cat.descPT : cat.desc}</p>
            </div>
            <button class="btn-primary" style="width:100%;margin-top:12px;padding:8px;font-size:12px;gap:6px"
              onclick="Exercises.generateAI('${cat.id}', event)">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              ${lang === 'pt' ? 'Gerar com IA' : 'Generate with AI'}
            </button>
          </div>
        `).join('')}
      </div>
      <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:8px">
        <i class="fa-solid fa-wand-magic-sparkles" style="color:var(--accent-purple)"></i>
        ${lang === 'pt'
          ? `"Gerar com IA" cria 8 exercícios únicos no nível ${userLevel} usando Gemini — infinita variedade!`
          : `"Generate with AI" creates 8 unique ${userLevel}-level exercises using Gemini — infinite variety!`}
      </p>
      <div id="exerciseRunner"></div>
    `;
  };

  const generateAI = async (categoryId, event) => {
    if (event) event.stopPropagation();
    const lang = I18n.getCurrent();
    const userLevel = Progress.get().level || 'A2';
    const runner = document.getElementById('exerciseRunner');
    if (!runner) return;

    Progress.toast(lang === 'pt' ? '⏳ Gerando exercícios com IA...' : '⏳ Generating exercises with AI...', 'info', 3000);
    runner.innerHTML = `
      <div style="text-align:center;padding:48px">
        <div class="spinner" style="margin:0 auto 16px"></div>
        <p style="color:var(--text-muted)">
          ${lang === 'pt' ? `Gerando exercícios de ${categoryId} com IA...` : `Generating ${categoryId} exercises with AI…`}
        </p>
      </div>
    `;
    runner.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryId, level: userLevel, count: 8 })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }
      const exercises = await res.json();
      if (!exercises || !exercises.length) throw new Error('No exercises returned');
      const formatted = exercises.map(e => ({
        ...e, type: 'multiple', category: categoryId, level: userLevel
      }));
      Progress.toast(lang === 'pt' ? `✨ ${formatted.length} exercícios gerados!` : `✨ ${formatted.length} exercises generated!`, 'success', 2500);
      runExercises(formatted);
    } catch (err) {
      runner.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted)">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:32px;color:var(--accent-orange);margin-bottom:12px"></i>
          <p>${lang === 'pt' ? 'Erro ao gerar exercícios:' : 'Failed to generate exercises:'}</p>
          <p style="font-size:12px;color:var(--accent-orange);margin-top:8px">${err.message}</p>
          <button class="btn-secondary" style="margin-top:16px;width:auto" onclick="Exercises.renderCategories()">
            ${lang === 'pt' ? 'Voltar' : 'Go back'}
          </button>
        </div>
      `;
      runner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const startCategory = (categoryId) => {
    const lang = I18n.getCurrent();
    const userLevel = Progress.get().level;
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userIdx = levelOrder.indexOf(userLevel);
    let exercises;
    if (categoryId === 'mixed') {
      exercises = ALL_EXERCISES.filter(e => levelOrder.indexOf(e.level) <= userIdx + 1);
    } else {
      exercises = ALL_EXERCISES.filter(e => e.category === categoryId && levelOrder.indexOf(e.level) <= userIdx + 1);
    }
    if (!exercises.length) {
      Progress.toast(lang === 'pt' ? 'Nenhum exercício disponível ainda!' : 'No exercises available yet!', 'info');
      return;
    }
    const shuffled = [...exercises].sort(() => Math.random() - 0.5).slice(0, 10);
    runExercises(shuffled);
  };

  const runLessonQuiz = (lesson) => {
    quizMode = true;
    currentLesson = lesson;
    const exercises = lesson.content.quiz.map(q => ({
      type: 'multiple', category: 'grammar', level: lesson.level,
      q: q.q, qt: q.qt, options: q.options, answer: q.answer,
      explanation: q.explanation, explanationPT: q.explanationPT
    }));
    const container = document.getElementById('exercisesContent');
    if (container) container.innerHTML = '<div id="exerciseRunner"></div>';
    runExercises(exercises);
  };

  const runExercises = (exercises) => {
    currentExercises = exercises;
    currentIdx = 0;
    score = { correct: 0, total: 0 };
    clearSession(); // new session — clear any old saved state
    renderQuestion();
  };

  const resumeSession = () => {
    const runner = document.getElementById('exerciseRunner');
    if (runner) runner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderQuestion();
  };

  const discardSession = () => {
    clearSession();
    currentExercises = [];
    currentIdx = 0;
    score = { correct: 0, total: 0 };
    renderCategories(null);
  };

  const renderQuestion = () => {
    const runner = document.getElementById('exerciseRunner');
    if (!runner) return;
    if (currentIdx >= currentExercises.length) {
      showResults();
      return;
    }
    const exercise = currentExercises[currentIdx];
    const lang = I18n.getCurrent();
    const q = lang === 'pt' ? exercise.qt : exercise.q;
    const letters = ['A', 'B', 'C', 'D'];

    runner.innerHTML = `
      <div class="exercise-runner">
        <div class="glass-card">
          <div style="padding:24px 32px;border-bottom:1px solid var(--glass-border)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span class="question-number">${lang === 'pt' ? 'Questão' : 'Question'} ${currentIdx + 1} / ${currentExercises.length}</span>
              <span class="tag tag-blue">${exercise.level}</span>
            </div>
            <div class="progress-bar-container" style="margin-bottom:0">
              <div class="progress-bar" style="width:${((currentIdx) / currentExercises.length) * 100}%"></div>
            </div>
          </div>
          <div class="exercise-question">
            <p class="question-text">${q}</p>
            <div class="question-options" id="questionOptions">
              ${exercise.options.map((opt, i) => `
                <button class="option-btn" onclick="Exercises.selectAnswer(${i})" data-idx="${i}">
                  <span class="option-letter">${letters[i]}</span>
                  ${opt}
                </button>
              `).join('')}
            </div>
            <div class="exercise-feedback" id="exerciseFeedback"></div>
          </div>
        </div>
      </div>
    `;

    gsap?.from('.exercise-runner', { opacity: 0, x: 30, duration: 0.3, ease: 'power2.out' });
  };

  const selectAnswer = (idx) => {
    const exercise = currentExercises[currentIdx];
    const lang = I18n.getCurrent();
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => btn.disabled = true);
    const isCorrect = idx === exercise.answer;
    score.total++;
    if (isCorrect) {
      score.correct++;
      options[idx].classList.add('correct');
      Progress.playSound('correct');
      Progress.recordAnswer(true);
    } else {
      options[idx].classList.add('wrong');
      options[exercise.answer].classList.add('correct');
      Progress.playSound('wrong');
      Progress.recordAnswer(false);
    }

    const feedback = document.getElementById('exerciseFeedback');
    const explanation = lang === 'pt' ? (exercise.explanationPT || exercise.explanation) : exercise.explanation;
    if (feedback) {
      feedback.className = `exercise-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
      feedback.innerHTML = `
        <strong>${isCorrect
          ? `<i class="fa-solid fa-circle-check" style="color:var(--accent-green)"></i> ${lang === 'pt' ? 'Correto!' : 'Correct!'}`
          : `<i class="fa-solid fa-circle-xmark" style="color:var(--accent-pink)"></i> ${lang === 'pt' ? 'Incorreto' : 'Incorrect'}`
        }</strong>
        <p>${explanation}</p>
        <button class="btn-primary" style="width:auto;padding:10px 24px;margin-top:12px" onclick="Exercises.next()">
          ${lang === 'pt' ? 'Próxima →' : 'Next →'}
        </button>
      `;
    }
    // Persist after each answer so nothing is lost on navigation
    saveSession();
  };

  const next = () => {
    currentIdx++;
    saveSession(); // persist navigation step
    renderQuestion();
  };

  const showResults = () => {
    clearSession(); // session is done — remove from storage
    const runner = document.getElementById('exerciseRunner');
    if (!runner) return;
    const lang = I18n.getCurrent();
    const pct = Math.round((score.correct / score.total) * 100);
    const xpEarned = currentLesson ? currentLesson.xp : Math.round(score.correct * 10);
    Progress.addXP(xpEarned);
    if (currentLesson) Progress.completeLesson(currentLesson.id);
    quizMode = false;

    runner.innerHTML = `
      <div class="glass-card" style="padding:48px;text-align:center;max-width:500px;margin:0 auto">
        <div style="font-size:64px;margin-bottom:16px">${pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 style="font-size:32px;font-weight:800;letter-spacing:-1px;margin-bottom:8px">
          ${lang === 'pt' ? 'Resultado' : 'Results'}
        </h2>
        <div style="font-size:56px;font-weight:900;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:16px 0">${pct}%</div>
        <p style="color:var(--text-secondary);margin-bottom:8px">${score.correct} / ${score.total} ${lang === 'pt' ? 'corretas' : 'correct'}</p>
        <div class="tag tag-orange" style="margin:8px auto;display:inline-flex">+${xpEarned} XP ${lang === 'pt' ? 'ganhos' : 'earned'}!</div>
        <p style="color:var(--text-secondary);margin:16px 0;font-size:15px">
          ${pct >= 80
            ? (lang === 'pt' ? 'Excelente trabalho! Você está arrasando! 🚀' : 'Excellent work! You\'re crushing it! 🚀')
            : pct >= 60
            ? (lang === 'pt' ? 'Bom trabalho! Continue praticando!' : 'Good job! Keep practicing!')
            : (lang === 'pt' ? 'Não desista! Revise a aula e tente novamente.' : "Don't give up! Review the lesson and try again.")}
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:24px">
          <button class="btn-secondary" onclick="Exercises.init()">
            <i class="fa-solid fa-list"></i> ${lang === 'pt' ? 'Mais exercícios' : 'More exercises'}
          </button>
          ${currentLesson ? `<button class="btn-secondary" onclick="App.navigate('lessons')">
            <i class="fa-solid fa-book"></i> ${lang === 'pt' ? 'Voltar às aulas' : 'Back to lessons'}
          </button>` : ''}
          <button class="btn-primary" style="width:auto" onclick="App.navigate('chat')">
            <i class="fa-solid fa-robot"></i> ${lang === 'pt' ? 'Pedir ajuda ao tutor' : 'Ask tutor for help'}
          </button>
        </div>
      </div>
    `;
  };

  return { init, renderCategories, startCategory, generateAI, runLessonQuiz, selectAnswer, next, resumeSession, discardSession };
})();
