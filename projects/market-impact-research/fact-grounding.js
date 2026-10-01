(() => {
  'use strict';
  const root = document.getElementById('fact-grounding');
  if (!root) return;
  const el = id => document.getElementById('fg-' + id);
  const set = (id, text) => { el(id).textContent = text; };
  fetch('/projects/market-impact-research/grounding-cases.json')
    .then(r => { if (!r.ok) throw new Error('data'); return r.json(); })
    .then(cases => {
      function render() {
        const c = cases.find(x => x.id === el('case').value);
        const s = c.states[el('model').value];
        for (const key of ['source', 'before', 'after', 'changes', 'raw', 'corrected', 'reject', 'facts', 'joint', 'pair']) set(key, s[key]);
        for (const key of ['claim', 'scope', 'note']) set(key, c[key]);
        set('origin', c.source); set('reference', c.label); set('json', s.raw_json);
        el('pair').hidden = !s.pair;
      }
      render();
      for (const id of ['case', 'model']) { el(id).disabled = false; el(id).addEventListener('change', render); }
      set('load', '저장된 응답 비교 · 페이지 이동 없이 사례와 모델을 바꿀 수 있습니다.');
    })
    .catch(() => { set('load', '비교 자료를 불러오지 못했습니다. 아래 기본 사례는 그대로 읽을 수 있습니다.'); });
})();
