'use strict';

// HTML starts expanded for script-free reading. Only the overview is folded by
// this enhancement; every original section and URL remains in the document.
(() => {
  const bundles = [...document.querySelectorAll('[data-record-bundle]')];
  const button = document.getElementById('record-toggle');
  if (!bundles.length || !button) return;
  bundles.forEach(bundle => { bundle.open = false; });
  button.hidden = false;
  function syncButton() {
    const allOpen = bundles.every(bundle => bundle.open);
    button.textContent = allOpen ? '핵심 흐름으로 접기' : '전체 실험 기록 펼치기';
    button.setAttribute('aria-expanded', String(allOpen));
  }
  button.addEventListener('click', () => {
    const open = !bundles.every(bundle => bundle.open);
    bundles.forEach(bundle => { bundle.open = open; });
    syncButton();
  });
  bundles.forEach(bundle => bundle.addEventListener('toggle', syncButton));
  let beforePrint;
  window.addEventListener('beforeprint', () => {
    beforePrint = bundles.map(bundle => bundle.open);
    bundles.forEach(bundle => { bundle.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (beforePrint) bundles.forEach((bundle, index) => { bundle.open = beforePrint[index]; });
    syncButton();
  });
  syncButton();
})();
