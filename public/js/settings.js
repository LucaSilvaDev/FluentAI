const Settings = (() => {

  // ── RENDER ──
  const render = () => {
    const container = document.getElementById('settingsContent');
    if (!container) return;
    const lang = I18n.getCurrent();
    const progress = Progress.get();
    const s = progress.settings || {};

    container.innerHTML = `
      <div class="settings-grid">

        <!-- API Key -->
        <div class="glass-card settings-section">
          <h3><i class="fa-solid fa-key" style="color:var(--accent-orange)"></i> API Key</h3>
          <p class="settings-desc">
            ${lang === 'pt'
              ? 'A chave do Gemini já está configurada no servidor. Este campo é opcional para uso local.'
              : 'The Gemini API key is already configured on the server. This field is optional for local use.'}
          </p>
          <input type="password" id="apiKeyInput" class="api-key-input" placeholder="AIza..." />
          <button class="btn-primary" id="saveApiKeyBtn">
            <i class="fa-solid fa-save"></i> ${lang === 'pt' ? 'Salvar chave' : 'Save key'}
          </button>
          <div id="apiStatus" style="margin-top:12px"></div>
        </div>

        <!-- Appearance -->
        <div class="glass-card settings-section">
          <h3><i class="fa-solid fa-palette" style="color:var(--accent-purple)"></i>
            ${lang === 'pt' ? 'Aparência' : 'Appearance'}
          </h3>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>${lang === 'pt' ? 'Tema Escuro' : 'Dark Theme'}</strong>
              <small>${lang === 'pt' ? 'Alternar tema claro/escuro' : 'Toggle light/dark theme'}</small>
            </div>
            <div class="toggle-switch ${document.documentElement.getAttribute('data-theme') !== 'light' ? 'on' : ''}" id="themeToggle"></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>${lang === 'pt' ? 'Idioma do Sistema' : 'System Language'}</strong>
              <small>${lang === 'pt' ? 'Português / English' : 'Portuguese / English'}</small>
            </div>
            <button class="btn-lang" id="langToggleBtn">
              <i class="fa-solid fa-globe"></i>
              ${lang === 'pt' ? 'PT → EN' : 'EN → PT'}
            </button>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>${lang === 'pt' ? 'Efeitos Sonoros' : 'Sound Effects'}</strong>
            </div>
            <div class="toggle-switch ${s.soundEffects !== false ? 'on' : ''}" id="soundToggle"></div>
          </div>
        </div>

        <!-- Profile -->
        <div class="glass-card settings-section">
          <h3><i class="fa-solid fa-user" style="color:var(--accent-blue)"></i>
            ${lang === 'pt' ? 'Perfil' : 'Profile'}
          </h3>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>${lang === 'pt' ? 'Nome' : 'Name'}</strong>
            </div>
            <input type="text" id="settingsName" class="settings-name-input"
              value="${sanitizeHTML(progress.name || '')}" />
          </div>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>${lang === 'pt' ? 'Nível Atual' : 'Current Level'}</strong>
            </div>
            <span class="level-tag" style="font-size:16px">${sanitizeHTML(progress.level)}</span>
          </div>
          <div class="settings-row">
            <div class="settings-row-label"><strong>Total XP</strong></div>
            <span style="font-weight:700;color:var(--accent-orange)">${progress.xp.toLocaleString()}</span>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="glass-card settings-section danger-zone">
          <h3><i class="fa-solid fa-triangle-exclamation" style="color:var(--accent-pink)"></i>
            ${lang === 'pt' ? 'Zona de Perigo' : 'Danger Zone'}
          </h3>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>${lang === 'pt' ? 'Resetar Progresso' : 'Reset Progress'}</strong>
              <small>${lang === 'pt' ? 'Apaga todo o seu progresso' : 'Erases all your progress'}</small>
            </div>
            <button class="btn-danger" id="resetBtn">
              <i class="fa-solid fa-trash"></i> ${lang === 'pt' ? 'Resetar' : 'Reset'}
            </button>
          </div>
        </div>

      </div>

      <!-- About -->
      <div class="glass-card settings-about">
        <div class="logo-icon-sm" style="margin:0 auto 12px"><span>F</span></div>
        <strong>FluentAI v1.0</strong>
        <p class="settings-about-tagline">
          ${lang === 'pt' ? 'Sua plataforma pessoal de inglês com IA' : 'Your personal AI English learning platform'}
        </p>
        <p class="settings-about-powered">Powered by Gemini AI • Built for developers</p>
      </div>
    `;

    // Bind all events — no inline onclick needed
    document.getElementById('saveApiKeyBtn')?.addEventListener('click', saveApiKey);
    document.getElementById('themeToggle')?.addEventListener('click', (e) => {
      App.toggleTheme();
      e.currentTarget.classList.toggle('on');
    });
    document.getElementById('langToggleBtn')?.addEventListener('click', () => {
      I18n.toggle();
      render(); // re-render with new language
    });
    document.getElementById('soundToggle')?.addEventListener('click', (e) => {
      _toggleSetting('soundEffects', e.currentTarget);
    });
    document.getElementById('settingsName')?.addEventListener('change', (e) => {
      _saveName(e.target.value);
    });
    document.getElementById('resetBtn')?.addEventListener('click', _confirmReset);

    checkApiStatus();
  };

  // ── API KEY ──
  const saveApiKey = async () => {
    const key = document.getElementById('apiKeyInput')?.value?.trim();
    if (!key) return;
    Progress.update({ apiKey: key });
    await _sendKeyToServer(key);
    checkApiStatus();
    Progress.toast('API key saved!', 'success');
  };

  const _sendKeyToServer = async (key) => {
    try {
      await fetch('/api/set-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
    } catch {}
  };

  const checkApiStatus = async () => {
    const el = document.getElementById('apiStatus');
    if (!el) return;
    const lang = I18n.getCurrent();
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      el.innerHTML = data.hasKey
        ? `<span class="api-status connected"><i class="fa-solid fa-circle-check"></i> ${lang === 'pt' ? 'API conectada' : 'API connected'}</span>`
        : `<span class="api-status not-set"><i class="fa-solid fa-triangle-exclamation"></i> ${lang === 'pt' ? 'Chave não configurada' : 'Key not set'}</span>`;
    } catch {
      el.innerHTML = `<span class="api-status not-set"><i class="fa-solid fa-triangle-exclamation"></i> Server not connected</span>`;
    }
  };

  const _saveName = (name) => {
    if (name.trim()) { Progress.update({ name: name.trim() }); Progress.updateUIStats(); }
  };

  const _toggleSetting = (key, toggleEl) => {
    const progress = Progress.get();
    const settings = { ...(progress.settings || {}), [key]: !progress.settings?.[key] };
    Progress.update({ settings });
    toggleEl.classList.toggle('on');
  };

  // ── CONFIRM RESET — uses glassmorphism modal instead of browser confirm() ──
  const _confirmReset = () => {
    const lang = I18n.getCurrent();
    App.showConfirmModal({
      title: lang === 'pt' ? 'Resetar Progresso?' : 'Reset Progress?',
      message: lang === 'pt'
        ? 'Tem certeza? Todo o seu progresso será apagado permanentemente!'
        : 'Are you sure? All your progress will be permanently erased!',
      confirmLabel: lang === 'pt' ? 'Sim, apagar' : 'Yes, erase',
      onConfirm: () => { localStorage.clear(); location.reload(); }
    });
  };

  return { render, saveApiKey, checkApiStatus };
})();
