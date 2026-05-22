const App = (() => {
  let currentPage = 'dashboard';
  let onboardingStep = 1;
  const selectedLevel = { value: null };
  const selectedGoal = { value: null };

  // ───── NAVIGATION ─────
  const navigate = (page, navItem) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navItem) navItem.classList.add('active');
    else {
      const matching = document.querySelector(`.nav-item[data-page="${page}"]`);
      if (matching) matching.classList.add('active');
    }
    currentPage = page;
    closeSidebar();
    switch (page) {
      case 'dashboard': Dashboard.init(); break;
      case 'lessons': Lessons.init(); break;
      case 'exercises': if (typeof Exercises !== 'undefined') Exercises.init(); break;
      case 'vocabulary': Vocabulary.init(); break;
      case 'chat': Chat.init(); break;
      case 'speaking': Speech.init(); break;
      case 'news': News.init(); break;
      case 'it-english': ITEnglish.render(); break;
      case 'settings': Settings.render(); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.Effects) Effects.reinit(page);
  };

  // ───── ONBOARDING ─────
  const onboardNext = (step) => {
    if (step === 1) {
      const name = document.getElementById('inputName')?.value?.trim();
      if (!name) { Progress.toast('Please enter your name!', 'warning'); return; }
      Progress.update({ name });
    }
    if (step === 2) {
      if (!selectedLevel.value) { Progress.toast('Please select a level!', 'warning'); return; }
      Progress.update({ level: selectedLevel.value });
    }
    if (step === 3) {
      if (!selectedGoal.value) { Progress.toast('Please select a goal!', 'warning'); return; }
      Progress.update({ goal: selectedGoal.value, onboardingDone: true });
      _finishOnboarding();
      return;
    }
    const current = document.getElementById(`step${step}`);
    const next = document.getElementById(`step${step + 1}`);
    if (current) current.classList.remove('active');
    if (next) next.classList.add('active');
  };

  const selectLevel = (card) => {
    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedLevel.value = card.dataset.level;
  };

  const selectGoal = (card) => {
    document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedGoal.value = card.dataset.goal;
  };

  const _finishOnboarding = () => {
    const onboarding = document.getElementById('onboarding');
    const mainApp = document.getElementById('mainApp');
    if (!onboarding || !mainApp) return;

    const complete = () => {
      onboarding.style.display = 'none';
      mainApp.classList.remove('hidden');
      I18n.apply();
      Progress.updateUIStats();
      Progress.checkStreak();
      Dashboard.init();
      Dashboard.loadDailyChallenge();
    };

    if (window.gsap) {
      gsap.to(onboarding, {
        opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.in',
        onComplete: complete
      });
    } else {
      complete();
    }
  };

  // ───── GLASSMORPHISM CONFIRM MODAL ─────
  const showConfirmModal = ({ title = 'Are you sure?', message = '', confirmLabel = 'Confirm', onConfirm } = {}) => {
    const existing = document.getElementById('confirmModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'confirm-modal-overlay';
    modal.innerHTML = `
      <div class="glass-card confirm-modal">
        <div class="confirm-modal-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="confirm-modal-title">${sanitizeHTML(title)}</h3>
        <p class="confirm-modal-message">${sanitizeHTML(message)}</p>
        <div class="confirm-modal-actions">
          <button class="btn-secondary" id="confirmModalCancel">
            ${I18n.getCurrent() === 'pt' ? 'Cancelar' : 'Cancel'}
          </button>
          <button class="btn-danger" id="confirmModalConfirm">
            ${sanitizeHTML(confirmLabel)}
          </button>
        </div>
      </div>
    `;

    document.getElementById('confirmModalCancel')?.addEventListener('click', () => modal.remove(), { once: true });
    document.getElementById('confirmModalConfirm')?.addEventListener('click', () => {
      modal.remove();
      if (typeof onConfirm === 'function') onConfirm();
    }, { once: true });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    document.body.appendChild(modal);

    if (window.gsap) {
      const inner = modal.querySelector('.confirm-modal');
      gsap.from(inner, { opacity: 0, scale: 0.92, duration: 0.25, ease: 'power2.out' });
    }
  };

  // ───── THEME ─────
  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') !== 'light';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('fluentai_theme', isDark ? 'light' : 'dark');
  };

  // ───── SIDEBAR ─────
  const toggleSidebar = () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  };

  const closeSidebar = () => {
    document.getElementById('sidebar')?.classList.remove('open');
  };

  // ───── CURSOR GLOW ─────
  const _initCursorGlow = () => {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  };

  // ───── GSAP SCROLL ANIMATIONS ─────
  const _initScrollAnimations = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.glass-card').forEach(card => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        opacity: 0, y: 24, duration: 0.5, ease: 'power2.out'
      });
    });
  };

  // ───── SERVER HEALTH CHECK ─────
  let _serverOnline = true;
  const checkServerHealth = async () => {
    const banner = document.getElementById('offlineBanner');
    const bannerText = document.getElementById('offlineBannerText');
    try {
      const res = await fetch('/api/status', { signal: AbortSignal.timeout(3000) });
      const online = res.ok;
      if (banner) banner.style.display = online ? 'none' : 'flex';
      _serverOnline = online;
    } catch {
      if (banner) banner.style.display = 'flex';
      if (bannerText) {
        bannerText.textContent = I18n.getCurrent() === 'pt'
          ? 'Servidor offline — funcionalidades de IA indisponíveis'
          : 'Server offline — AI features unavailable';
      }
      _serverOnline = false;
    }
  };

  // ───── INIT ─────
  const init = () => {
    try {
      const savedTheme = localStorage.getItem('fluentai_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);

      I18n.init();

      const progress = Progress.get();
      if (progress.onboardingDone) {
        document.getElementById('onboarding').style.display = 'none';
        const mainApp = document.getElementById('mainApp');
        mainApp.classList.remove('hidden');
        I18n.apply();
        Progress.updateUIStats();
        Progress.checkStreak();
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-dashboard').classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector('.nav-item[data-page="dashboard"]')?.classList.add('active');
        Dashboard.init();
        Dashboard.loadDailyChallenge();
      }

      Particles.init();
      if (window.Effects) Effects.init();
      _initCursorGlow();
      setTimeout(_initScrollAnimations, 500);
      checkServerHealth();
      setInterval(checkServerHealth, 30000);

      document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburger');
        if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !hamburger?.contains(e.target)) {
          closeSidebar();
        }
      });

      if (window.gsap) {
        gsap.from('.logo-hero', { opacity: 0, y: -30, duration: 0.8, ease: 'power3.out' });
        gsap.from('.onboarding-tagline', { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: 'power3.out' });
        gsap.from('.onboard-step.active', { opacity: 0, y: 30, duration: 0.8, delay: 0.4, ease: 'power3.out' });
      }
    } catch (err) {
      console.error('FluentAI init error:', err);
    }
  };

  return {
    navigate, onboardNext, selectLevel, selectGoal,
    toggleTheme, toggleSidebar,
    showConfirmModal,
    checkServerHealth, init
  };
})();

// ───── BOOT ─────
document.addEventListener('DOMContentLoaded', App.init);
