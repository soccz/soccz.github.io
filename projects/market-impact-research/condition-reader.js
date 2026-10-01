/* Display committed research traces. No inference or eligibility service here. */
(() => {
  'use strict';
  const explorer = document.querySelector('[data-condition-explorer]');
  if (!explorer) return;
  const select = document.getElementById('condition-case');
  const put = (id, value) => { document.getElementById(id).textContent = value; };
  fetch('/projects/market-impact-research/condition-cases.json')
    .then(response => { if (!response.ok) throw new Error('unavailable'); return response.json(); })
    .then(cases => {
      if (!Array.isArray(cases) || !cases.length) throw new Error('invalid');
      const render = () => {
        const item = cases.find(row => row.id === select.value);
        if (!item) return;
        ['kind', 'title', 'context', 'profile', 'before', 'after', 'evidence'].forEach(key => put('condition-' + key, item[key]));
        put('condition-before-label', item.before_label);
        put('condition-before-state', item.before_state);
        put('condition-after-state', item.after_state);
        put('condition-reference', '잠정 기준: ' + item.reference + ' · ' + item.reference_state);
        const source = document.getElementById('condition-source');
        const url = new URL(item.source_url);
        if (url.protocol !== 'https:') throw new Error('invalid source');
        source.href = url.href;
        source.textContent = item.source_label + ' ↗';
      };
      select.addEventListener('change', render);
      render();
      explorer.hidden = false;
    })
    .catch(() => { explorer.hidden = true; });
})();
