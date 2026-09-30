/* Browse recorded predictions. This does not run an NLP model in the browser. */
(() => {
  'use strict';
  const root = document.querySelector('[data-policy-reader]');
  if (!root) return;
  const data = JSON.parse(document.getElementById('policy-reader-data').textContent);
  const select = root.querySelector('select');
  select.disabled = false;
  const put = (name, value) => { root.querySelector(`[data-reader="${name}"]`).textContent = value; };
  function render() {
    const item = data.cases.find(row => row.id === select.value);
    if (!item) return;
    put('query', item.query);
    const quote = root.querySelector('[data-reader="quote"]');
    quote.replaceChildren();
    const boundaries = [...new Set([0, item.text.length, ...item.prediction.evidence.flatMap(s => [s.start, s.end])])].sort((a, b) => a - b);
    for (let i = 0; i < boundaries.length - 1; i++) {
      const start = boundaries[i], end = boundaries[i + 1];
      const evidence = item.prediction.evidence.find(s => s.start <= start && s.end >= end);
      const part = document.createElement(evidence ? 'mark' : 'span');
      if (evidence) {
        part.className = `reader-mark-${evidence.kind}`;
        part.title = evidence.kind === 'relation' ? '모델이 찾은 관계 근거' : '모델이 찾은 상태 근거';
      }
      part.textContent = item.text.slice(start, end);
      quote.append(part);
    }
    put('reference', `${data.relations[item.relation]} · ${data.states[item.state]}`);
    put('earlier', `${data.relations[item.earlier.relation]} · ${data.states[item.earlier.state]}`);
    put('prediction', `${data.relations[item.prediction.relation]} · ${data.states[item.prediction.state]}`);
    put('before', item.prediction.spans.filter(s => s.role === 'before').map(s => s.text).join(' / ') || '연결한 금액 없음');
    put('after', item.prediction.spans.filter(s => s.role === 'after').map(s => s.text).join(' / ') || '연결한 금액 없음');
    const verdict = root.querySelector('[data-reader="verdict"]');
    verdict.textContent = item.prediction.matches.joint ? '관계·상태·금액 역할이 임시 판독과 일치' : '임시 판독과 불일치 — 원문과 임시 판독을 함께 확인';
    verdict.classList.toggle('reader-mismatch', !item.prediction.matches.joint);
    put('score', `선택 점수 ${item.prediction.confidence.toFixed(3)} · 정답 확률로 보정된 값이 아닙니다.`);
    put('gate', item.prediction.accepted ? '검증에서 고른 기준으로 채택한 출력입니다.' : '선택적 답변에서는 보류되는 출력입니다. 위에는 분석용 원예측을 표시합니다.');
    const source = root.querySelector('[data-reader="source"]');
    source.href = item.url;
    source.textContent = `${item.publisher} · ${item.date} 원문 ↗`;
    put('note', item.ambiguity ? '발표된 결정과 향후 실행의 경계에 이견이 있을 수 있는 사례입니다. 독립 판독에서 대안 해석을 보존해야 합니다.' : '원문에서 고른 짧은 구절의 판독입니다. 실제 정책의 진실성·현행 시행 여부를 확정하지 않습니다.');
  }
  select.addEventListener('change', render);
  render();
})();
