const Progress = (() => {
  const DEFAULTS = {
    name: '', level: 'A2', xp: 0, streak: 0,
    lastStudied: null, lessonsCompleted: [], exercisesCompleted: 0,
    correctAnswers: 0, totalAnswers: 0, wordOfDayIndex: 0,
    settings: { theme: 'dark', notifications: true, soundEffects: true, showTranslations: true, dailyGoal: 20 },
    apiKey: ''
  };

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('fluentai_progress') || '{}');
      const merged = { ...DEFAULTS, ...saved, settings: { ...DEFAULTS.settings, ...(saved.settings || {}) } };
      // safety: never start with a level up pending
      return merged;
    } catch {
      localStorage.removeItem('fluentai_progress');
      return { ...DEFAULTS };
    }
  };

  const save = (data) => localStorage.setItem('fluentai_progress', JSON.stringify(data));

  let state = load();

  const get = () => state;

  const update = (changes) => {
    state = { ...state, ...changes };
    save(state);
  };

  const addXP = (amount) => {
    const before = state.xp;
    state.xp += amount;
    const leveledUp = checkLevelUp(before, state.xp);
    save(state);
    showXPPopup(amount);
    updateUIStats();
    return leveledUp;
  };

  const checkLevelUp = (before, after) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const thresholds = { A1: 0, A2: 500, B1: 1500, B2: 3000, C1: 5000, C2: 8000 };
    const currentIdx = levels.indexOf(state.level);
    for (let i = currentIdx + 1; i < levels.length; i++) {
      if (before < thresholds[levels[i]] && after >= thresholds[levels[i]]) {
        state.level = levels[i];
        save(state);
        setTimeout(() => showLevelUp(levels[i]), 800);
        return levels[i];
      }
    }
    return null;
  };

  const showXPPopup = (amount) => {
    const el = document.getElementById('xpPopup');
    if (!el) return;
    document.getElementById('xpAmount').textContent = amount;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1500);
  };

  const showLevelUp = (newLevel) => {
    const overlay = document.getElementById('levelUpOverlay');
    if (!overlay) return;
    document.getElementById('newLevelBadge').textContent = newLevel;
    const info = CURRICULUM.levels[newLevel];
    document.getElementById('levelUpMessage').textContent =
      `You've reached ${info.name} level! Keep it up! 🚀`;
    overlay.style.display = 'flex';
    spawnConfetti();
    playSound('levelup');
  };

  const spawnConfetti = () => {
    const colors = ['#0096FF', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        animation-duration: ${1.5 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3000);
    }
  };

  const playSound = (type) => {
    if (!state.settings?.soundEffects) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    if (type === 'correct') { osc.frequency.setValueAtTime(523, ctx.currentTime); osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); }
    else if (type === 'wrong') { osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.setValueAtTime(150, ctx.currentTime + 0.2); }
    else if (type === 'levelup') { osc.frequency.setValueAtTime(523, ctx.currentTime); osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.3); }
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  const checkStreak = () => {
    const today = new Date().toDateString();
    const last = state.lastStudied;
    if (last === today) return; // already counted today
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === yesterday) {
      state.streak += 1;         // consecutive day — extend streak
    } else {
      state.streak = 1;          // gap in study — reset streak to 1
    }
    state.lastStudied = today;
    save(state);
  };

  const completeLesson = (lessonId) => {
    if (!state.lessonsCompleted.includes(lessonId)) {
      state.lessonsCompleted.push(lessonId);
    }
    checkStreak();
    save(state);
    updateUIStats();
  };

  const recordAnswer = (correct) => {
    state.totalAnswers += 1;
    if (correct) state.correctAnswers += 1;
    save(state);
  };

  const getAccuracy = () => {
    if (!state.totalAnswers) return '-';
    return Math.round((state.correctAnswers / state.totalAnswers) * 100) + '%';
  };

  const getLevelProgress = () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const info = CURRICULUM.levels[state.level] || CURRICULUM.levels.A2;
    const next = levels[levels.indexOf(state.level) + 1];
    const nextInfo = next ? CURRICULUM.levels[next] : null;
    const currentXP = state.xp - info.xpRequired;
    const neededXP = info.xpToNext || 1; // guard: never divide by zero
    const pct = neededXP > 0 ? Math.min(100, Math.round((Math.max(0, currentXP) / neededXP) * 100)) : 100;
    return { current: state.level, next, currentXP: Math.max(0, currentXP), neededXP, pct, nextInfo };
  };

  const updateUIStats = () => {
    const s = state;
    const el = (id) => document.getElementById(id);
    // Animate numbers if Effects is available, else just set
    const setOrCount = (id, val) => {
      const node = el(id);
      if (!node) return;
      if (window.Effects && val > 0) Effects.countUp(node, val);
      else node.textContent = typeof val === 'number' ? val.toLocaleString() : val;
    };
    setOrCount('statStreak', s.streak);
    setOrCount('statXP', s.xp);
    setOrCount('statLessons', s.lessonsCompleted.length);
    if (el('statAccuracy')) el('statAccuracy').textContent = getAccuracy();
    if (el('sidebarName')) el('sidebarName').textContent = s.name;
    if (el('sidebarLevel')) el('sidebarLevel').textContent = s.level;
    if (el('sidebarAvatar')) el('sidebarAvatar').textContent = s.name.charAt(0).toUpperCase();
    if (el('currentLevelBadge')) el('currentLevelBadge').textContent = s.level;
    const info = CURRICULUM.levels[s.level] || CURRICULUM.levels.A2;
    if (el('currentLevelName')) el('currentLevelName').textContent = info.namePT;
    const prog = getLevelProgress();
    setOrCount('currentXP', prog.currentXP);
    if (el('nextLevelXP')) el('nextLevelXP').textContent = prog.neededXP;
    if (el('levelProgressBar')) {
      const bar = el('levelProgressBar');
      bar.style.transition = 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { bar.style.width = prog.pct + '%'; }, 100);
    }
    if (el('nextLevelBadge')) el('nextLevelBadge').textContent = prog.next || '🏆';
    updateGreeting();
  };

  const updateGreeting = () => {
    const el = document.getElementById('dashGreeting');
    if (!el) return;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const finalText = `${greeting}, ${state.name}! 👋`;
    if (window.Effects) Effects.scramble(el, finalText, 800);
    else el.textContent = finalText;
  };

  const newWordOfDay = () => {
    const words = CURRICULUM.wordOfDay;
    const today = new Date().toDateString();
    const saved = localStorage.getItem('fluentai_wod');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        renderWordOfDay(words[parsed.index]);
        return;
      }
    }
    const idx = Math.floor(Math.random() * words.length);
    localStorage.setItem('fluentai_wod', JSON.stringify({ date: today, index: idx }));
    renderWordOfDay(words[idx]);
  };

  const renderWordOfDay = (word) => {
    const el = document.getElementById('wordOfDayContent');
    if (!el || !word) return;
    el.innerHTML = `
      <div class="word-of-day-content">
        <div class="word-main">
          <span class="word-text">${sanitizeHTML(word.word)}</span>
          <span class="word-phonetic">${sanitizeHTML(word.phonetic)}</span>
          <span class="word-pos">${sanitizeHTML(word.pos)}</span>
        </div>
        <p class="word-meaning">${sanitizeHTML(word.meaning)}</p>
        <p class="word-meaning-pt">${sanitizeHTML(word.meaningPT)}</p>
        <div class="word-example">
          <em>"${sanitizeHTML(word.example)}"</em><br/>
          <span style="color:var(--text-muted);font-size:12px;margin-top:4px;display:block">${sanitizeHTML(word.examplePT)}</span>
        </div>
        <div class="word-actions">
          <button class="btn-secondary wod-speak-btn"><i class="fa-solid fa-volume-high"></i> Hear it</button>
          <button class="btn-secondary wod-add-btn"><i class="fa-solid fa-plus"></i> Add to cards</button>
        </div>
      </div>
    `;
    // Use event listeners — no inline onclick with raw word data
    el.querySelector('.wod-speak-btn')?.addEventListener('click', () => Speech.speak(word.word));
    el.querySelector('.wod-add-btn')?.addEventListener('click', () => Vocabulary.addToFlashcards(word.word));
  };

  const toast = (message, type = 'info', duration = 3000) => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i>${message}`;
    container.appendChild(t);
    setTimeout(() => {
      t.classList.add('fade-out');
      setTimeout(() => t.remove(), 300);
    }, duration);
  };

  return { load, get, update, addXP, playSound, checkStreak, completeLesson, recordAnswer, getAccuracy, getLevelProgress, updateUIStats, newWordOfDay, renderWordOfDay, toast };
})();
