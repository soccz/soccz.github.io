/* Dark mode toggle (자동 + 수동, localStorage persist) */
(function () {
  const STORAGE_KEY = 'son-data-theme';
  const root = document.documentElement;

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveTheme(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* noop */ }
  }
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    updateButtons(theme);
  }
  function updateButtons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
      btn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    });
  }
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function toggle() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  }

  // 초기 적용 — saved > system
  const saved = getSavedTheme();
  applyTheme(saved || (systemPrefersDark() ? 'dark' : 'light'));

  // 시스템 변경 감지 (사용자가 수동 설정 안 했을 때만)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!getSavedTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  // 모든 .theme-toggle 버튼에 핸들러 부착
  function bind() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
    updateButtons(currentTheme());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  // expose globally
  window.SonDataTheme = { toggle, apply: applyTheme };
})();
