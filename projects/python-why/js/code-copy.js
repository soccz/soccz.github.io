// Code Copy Button - 코드 블록 복사 기능
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block');
      const code = block.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const original = btn.textContent;
        btn.textContent = '복사됨!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
});
