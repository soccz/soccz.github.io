/* Display committed Python outputs. No eligibility rules or remote model in the browser. */
(() => {
  'use strict';
  const root = document.querySelector('[data-semantic-explorer]');
  if (!root) return;
  const state = {pass: '선택 조건 충족', fail: '선택 조건 미충족', unknown: '확인 필요'};
  const short = {pass: '충족', fail: '미충족', unknown: '확인 필요'};
  const exclusion = {pass: '명시된 제외에 해당 없음', fail: '명시된 제외에 해당', unknown: '확인 필요'};
  const changes = {included: '미충족 → 충족', excluded: '충족 → 미충족', retained: '충족 유지', outside: '미충족 유지', unresolved: '확인 필요'};
  const reasons = {evidence_hidden: '원문 근거 구절 다시 확인', missing_benefits: '복지급여 수급 종류 확인', missing_housing: '보증금·월세의 빠진 값 확인', interpretation_disagreement: '2022년 환산 문구와 구간표의 연결 해석 확인'};
  const benefits = {education:'교육급여', livelihood:'생계급여', medical:'의료급여', housing:'주거급여'};
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  const money = value => value === null ? '미확인' : value.toLocaleString('ko-KR') + '원';
  fetch('/projects/market-impact-research/semantic-cases.json').then(r => {
    if (!r.ok) throw new Error('scenario data unavailable');
    return r.json();
  }).then(cases => {
    const caseInput = document.getElementById('semantic-case');
    const evidenceInput = document.getElementById('semantic-evidence');
    function render() {
      const c = cases.find(row => row.id === caseInput.value);
      const r = c.modes[evidenceInput.value];
      const p = c.profile;
      const b = p.benefits === null ? '수급 종류 미확인' : p.benefits.length ? p.benefits.map(x => benefits[x]).join('·') : '지정 급여 비수급';
      text('semantic-profile', `보증금 ${money(p.deposit_won)} · 월세 ${money(p.rent_won)} · ${b}`);
      for (const [version, prefix] of [['2022','old'], ['2023','new']]) {
        const v = r[version];
        text(`semantic-${prefix}-state`, state[v.state]);
        document.getElementById(`semantic-${prefix}-state`).dataset.state = v.state;
        for (const kind of ['housing','welfare']) {
          const part = v.components[kind];
          const extra = part.reason === 'interpretation_disagreement' ? ' · 환산 문구 후보와 표의 판독이 다름' : part.state === 'unknown' ? ' · ' + reasons[part.reason] : '';
          text(`semantic-${prefix}-${kind}`, (kind === 'housing' ? '주거 조건: ' + short[part.state] : '급여 제외 점검: ' + exclusion[part.state]) + extra);
        }
      }
      const minimal = r.minimal_rule_changes.map(s => s.map(k => k === 'housing' ? '주거 규칙' : '급여 제외 규칙').join(' + ')).join(' 또는 ');
      text('semantic-verdict', '선택 조건의 변화: ' + changes[r.change] + (minimal ? ' · 최소 변경 원인: ' + minimal : ''));
      text('semantic-explanation', c.note + (evidenceInput.value !== 'complete' ? ' 현재는 선택한 연도의 근거를 가린 통제 결과를 표시합니다.' : ''));
      const checks = [...new Set([...r['2022'].next_checks, ...r['2023'].next_checks])];
      text('semantic-next', checks.length ? '다음 확인: ' + checks.map(k => reasons[k]).join(' / ') : '선택한 두 조건에서는 추가 확인 없이 판독됩니다. 다른 자격·선정 조건은 평가하지 않았습니다.');
      root.dataset.case = c.id;
      root.dataset.mode = evidenceInput.value;
    }
    caseInput.addEventListener('change', render);
    evidenceInput.addEventListener('change', render);
    render();
    root.hidden = false;
  }).catch(() => {
    // The source explanations and all fourteen static cases remain available.
    root.hidden = true;
  });
})();
