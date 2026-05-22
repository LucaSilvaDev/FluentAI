/**
 * Escapes HTML special characters to prevent XSS.
 * Use instead of directly inserting untrusted strings into innerHTML.
 * @param {string} str - Raw string to escape
 * @returns {string} - Safe string for insertion into HTML
 */
const sanitizeHTML = (str) => {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const I18n = (() => {
  let current = 'pt';

  const get = (key) => (TRANSLATIONS[current]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key);

  const apply = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = get(key);
      if (text && text !== key) el.textContent = text;
    });
    document.getElementById('langLabel')?.textContent !== undefined &&
      (document.getElementById('langLabel').textContent = current.toUpperCase());
  };

  const set = (lang) => {
    current = lang;
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('fluentai_lang', lang);
    apply();
  };

  const toggle = () => set(current === 'pt' ? 'en' : 'pt');

  const init = () => {
    const saved = localStorage.getItem('fluentai_lang') || 'pt';
    current = saved;
    document.documentElement.setAttribute('data-lang', saved);
    apply();
  };

  const getCurrent = () => current;

  return { get, apply, set, toggle, init, getCurrent };
})();
