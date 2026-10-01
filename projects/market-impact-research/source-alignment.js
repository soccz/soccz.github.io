(() => {
  'use strict';
  const node = name => document.getElementById(`sa-${name}`);
  const caseControl = node('case');
  const modelControl = node('model');
  if (!caseControl || !modelControl) return;
  const stateFields = ['read', 'repair', 'before', 'after', 'reference', 'trigger'];
  const caseFields = ['claim', 'scope', 'origin', 'note'];
  fetch('/projects/market-impact-research/alignment-cases.json')
    .then(response => {
      if (!response.ok) throw new Error('Unavailable saved cases');
      return response.json();
    })
    .then(cases => {
      if (!Array.isArray(cases) || !cases.length) throw new Error('Invalid saved cases');
      for (const item of cases) {
        if (!caseFields.every(key => typeof item[key] === 'string')) throw new Error('Invalid case');
        for (const model of ['qwen', 'kanana-public']) {
          const state = item.states?.[model];
          if (!state || ![...stateFields, 'raw_json'].every(key => typeof state[key] === 'string')) throw new Error('Invalid saved state');
        }
      }
      const render = () => {
        const item = cases.find(value => value.id === caseControl.value);
        if (!item || !item.states[modelControl.value]) return;
        const state = item.states[modelControl.value];
        for (const key of caseFields) node(key).textContent = item[key];
        for (const key of stateFields) node(key).textContent = state[key];
        node('json').textContent = state.raw_json;
      };
      render();
      caseControl.addEventListener('change', render);
      modelControl.addEventListener('change', render);
      caseControl.disabled = false;
      modelControl.disabled = false;
      node('load').textContent = '저장된 비교 자료를 불러왔습니다. 실시간 추론이 아닌 실제 실험 결과입니다.';
    })
    .catch(() => {
      node('load').textContent = '비교 자료를 불러오지 못했습니다. 아래 기본 사례와 본문은 그대로 읽을 수 있습니다.';
    });
})();
