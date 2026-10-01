(() => {
  'use strict';
  const node = key => document.getElementById(`dc-${key}`);
  const model = node('model');
  const control = node('case');
  if (!model || !control) return;
  const caseFields = ['scope', 'facts', 'note', 'origin', 'reference', 'retrieval'];
  const resultFields = ['direct', 'full', 'retrieved', 'explanation'];
  fetch('/projects/market-impact-research/closure-cases.json')
    .then(response => {
      if (!response.ok) throw new Error('Unavailable comparison');
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data.cases) || data.cases.length !== 6) throw new Error('Invalid cases');
      for (const item of data.cases) {
        if (!caseFields.every(key => typeof item[key] === 'string')) throw new Error('Invalid case');
        for (const name of ['qwen', 'kanana-public']) {
          if (![...resultFields, 'raw_json'].every(key => typeof item.states?.[name]?.[key] === 'string')) throw new Error('Invalid result');
          if (!Array.isArray(data.matrix?.[name]) || data.matrix[name].length !== 6) throw new Error('Invalid matrix');
          if (!data.matrix[name].every(row => Array.isArray(row.cells) && row.cells.length === 5 && row.cells.every(cell => Number.isInteger(cell.correct) && Number.isInteger(cell.n) && Number.isInteger(cell.abstain) && cell.n === 8 && cell.correct >= 0 && cell.abstain >= 0 && cell.correct + cell.abstain <= cell.n))) throw new Error('Invalid counts');
        }
      }
      const render = () => {
        const item = data.cases.find(value => value.id === control.value);
        if (!item) return;
        const state = item.states[model.value];
        for (const key of caseFields) node(key).textContent = item[key];
        for (const key of resultFields) node(key).textContent = state[key];
        node('json').textContent = state.raw_json;
        data.matrix[model.value].forEach((row, i) => row.cells.forEach((cell, j) => {
          const element = document.querySelector(`[data-dc-cell="${i}-${j}"]`);
          element.querySelector('strong').textContent = `${cell.correct}/${cell.n}`;
          element.querySelector('small').textContent = cell.abstain ? `${cell.abstain}개 보류` : '보류 없음';
          element.style.setProperty('--dc-score', String(cell.correct / cell.n));
        }));
      };
      render();
      model.addEventListener('change', render);
      control.addEventListener('change', render);
      model.disabled = false;
      control.disabled = false;
      node('load').textContent = '실제 저장 결과를 불러왔습니다. 모델 선택은 표와 사례에 함께 적용됩니다.';
    })
    .catch(() => {
      node('load').textContent = '비교 자료를 불러오지 못했습니다. 기본 표와 사례, 연구 결론은 그대로 읽을 수 있습니다.';
    });
})();
