// Navigation - 공통 헤더/푸터 + 테마 전환
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const saved = localStorage.getItem('python-why-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('python-why-theme', next);
      btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  });

  // Back to top
  const topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('visible', window.scrollY > 400);
    });
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
