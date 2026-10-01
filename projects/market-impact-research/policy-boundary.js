'use strict';

// Authored age-only example. It makes no model call or real eligibility decision.
(() => {
  const slider = document.getElementById('boundary-age');
  if (!slider) return;
  const plot = document.querySelector('.boundary-plot');
  const before = document.getElementById('boundary-before');
  const after = document.getElementById('boundary-after');
  const explanation = document.getElementById('boundary-explanation');
  const output = document.getElementById('boundary-age-value');
  function render() {
    const age = Number(slider.value);
    const wasEligible = age <= 34;
    const isEligible = age <= 39;
    output.value = `${age}세`;
    plot.style.setProperty('--age-position', `${(age - 20) / 30 * 100}%`);
    before.textContent = wasEligible ? '충족' : '불충족';
    after.textContent = isEligible ? '충족' : '불충족';
    explanation.textContent = wasEligible !== isEligible
      ? `${age}세는 변경 구간에 있어, 판단을 갱신합니다.`
      : `${age}세는 두 조건에서 모두 ${isEligible ? '충족' : '불충족'}하므로, 판단을 유지합니다.`;
    explanation.dataset.changed = String(wasEligible !== isEligible);
  }
  slider.disabled = false;
  slider.addEventListener('input', render);
  render();
})();
