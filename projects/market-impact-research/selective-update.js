(() => {
  'use strict';
  const root = document.querySelector('[data-update-explorer]');
  if (!root) return;
  const labels = {supported:'지지',contradicted:'반박',not_established:'확정 불가',abstain:'출력 실패·보류'};
  const caseSelect = document.getElementById('update-case');
  const contextSelect = document.getElementById('update-context');
  const modelSelect = document.getElementById('update-model');
  const text = (id,value) => { document.getElementById(id).textContent = value; };
  fetch('/projects/market-impact-research/update-cases.json')
    .then(r => { if (!r.ok) throw new Error('data'); return r.json(); })
    .then(data => {
      if (!Array.isArray(data) || data.length !== 4) throw new Error('schema');
      function render() {
        const c = data.find(x => x.id === caseSelect.value);
        const state = c.states[contextSelect.value][modelSelect.value];
        text('update-claim',c.claim);
        text('update-old',labels[state.old]);
        text('update-fresh',labels[state.fresh]);
        text('update-reference',labels[c.reference.after]);
        text('update-reference-note','이전 기준: '+labels[c.reference.before]);
        text('update-coverage',contextSelect.value === 'curated' ? '주석자가 선별한 관련 조항을 제공합니다.' : '검색이 가져온 지정 원문 구간: 이전 '+(c.coverage.before?'포함':'일부 누락')+' / 갱신 후 '+(c.coverage.after?'포함':'일부 누락')+'. 전체 문서 기준의 잠정 정답과 비교합니다.');
        const rows = document.getElementById('update-methods');
        rows.replaceChildren();
        for (const m of state.methods) {
          const row = document.createElement('div');
          row.className = 'update-result';
          row.dataset.correct = String(m.correct);
          row.dataset.method = m.method;
          const name = document.createElement('span'); name.textContent = m.label;
          const route = document.createElement('em'); route.textContent = m.refreshed?'다시 판독':'이전 답 유지';
          const answer = document.createElement('strong'); answer.textContent = labels[m.final];
          const status = document.createElement('small'); status.textContent = m.correct?'잠정 기준과 일치':'잠정 기준과 불일치';
          answer.append(status);row.append(name,route,answer);rows.append(row);
        }
        const link = document.getElementById('update-source');
        link.href = c.source_url; link.textContent = c.source_label+' ↗';
      }
      for (const control of [caseSelect,contextSelect,modelSelect]) {
        control.disabled = false; control.addEventListener('change',render);
      }
      render();
      text('update-load-status','실제 저장 응답을 비교합니다. 이 화면에서 모델을 실행하지 않습니다.');
    }).catch(() => {
      text('update-load-status','추가 비교 자료를 불러오지 못했습니다. 아래 기본 사례와 본문의 표는 그대로 읽을 수 있습니다.');
    });
})();
