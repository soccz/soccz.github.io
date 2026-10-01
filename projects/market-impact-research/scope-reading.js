/* Recorded research comparisons; nothing is inferred in the browser. */
(() => {
  'use strict';
  const explorer = document.querySelector('[data-scope-explorer]');
  if (!explorer) return;
  const select = document.getElementById('scope-case');
  const labels = {supported: '지지', contradicted: '반박', not_established: '근거로 확정 불가', abstain: '출력 실패·보류'};
  const put = (id, value) => { document.getElementById(id).textContent = value; };
  fetch('/projects/market-impact-research/scope-cases.json')
    .then(response => { if (!response.ok) throw new Error('unavailable'); return response.json(); })
    .then(cases => {
      if (!Array.isArray(cases) || !cases.length) throw new Error('invalid');
      const render = () => {
        const row = cases.find(c => c.id === select.value);
        const mode = explorer.querySelector('input[name="scope-mode"]:checked').value;
        const state = row.variants[mode];
        put('scope-context', state.context);
        put('scope-claim', row.claim);
        put('scope-reference', '잠정 기준: ' + labels[state.reference]);
        const output = document.getElementById('scope-output');
        output.replaceChildren();
        state.methods.forEach(method => {
          const card = document.createElement('div');
          card.dataset.match = String(method.correct);
          const name = document.createElement('span'); name.textContent = method.label;
          const answer = document.createElement('strong'); answer.textContent = labels[method.decision];
          const status = document.createElement('small');
          status.textContent = (method.correct ? '기준 일치' : '기준 불일치') + ' · ' + (method.joint ? '필요 근거 포함' : '정답+필요 근거 미충족');
          card.append(name, answer, status); output.append(card);
        });
        const source = document.getElementById('scope-source');
        const url = new URL(row.source_url);
        if (url.protocol !== 'https:') throw new Error('invalid source');
        source.href = url.href; source.textContent = row.source_label + ' ↗';
      };
      select.addEventListener('change', render);
      explorer.querySelectorAll('input[name="scope-mode"]').forEach(input => input.addEventListener('change', render));
      render(); explorer.hidden = false;
    })
    .catch(() => { explorer.hidden = true; });
})();
