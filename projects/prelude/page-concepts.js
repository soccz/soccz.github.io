/* Presentation only. No fetching, fitting, storage, new metrics or adoption logic. */
(function (global) {
  'use strict';
  const RECORDS = {
    not_due: '기록 예정', ready: '진입 전 저장 확인', missing: '기록 누락',
    late: '진입 시각 이후 저장', uncertain: '저장 완료 불확실',
  };
  const VERDICTS = {
    waiting: '자료 대기', continue_observing: '관찰 연장',
    review_candidate: '채택 검토 대상', do_not_adopt: '현재 후보 비채택', blocked: '증거 확인 필요',
  };
  const METRICS = [
    ['dn5', '하방 경험', '낮을수록 유리', -1],
    ['up10', '상방 기회', '높을수록 유리', 1],
    ['eod_return_net', '24h 말 net', '높을수록 유리', 1],
  ];
  const LIVE_STATES = ['waiting', 'pending', 'delivered_candidates', 'delivered_empty',
    'not_delivered', 'delivery_uncertain', 'invalid_evidence', 'missing_decision', 'probe_unavailable'];
  const own = (object, key) => typeof key === 'string' && Object.hasOwn(object, key);
  const count = value => Number.isSafeInteger(value) && value >= 0;
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const stamp = value => {
    if (typeof value !== 'string' || !/(Z|[+-]\d{2}:\d{2})$/.test(value)) return '미제공';
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short',
    }) : '미제공';
  };

  function forwardModel(value) {
    if (!value || value.schema !== 'prelude_dashboard_book_forward.v1'
        || value.status !== 'observed' || value.automatic_promotion !== false
        || value.scope !== 'pre_entry_paper_not_actual_trades'
        || typeof value.attention_required !== 'boolean'
        || !own(RECORDS, value.today_record) || !own(VERDICTS, value.verdict)
        || !['paired_dates', 'expected_dates', 'changed_dates', 'execution_dates'].every(k => count(value[k]))
        || value.paired_dates > value.expected_dates || value.changed_dates > value.paired_dates
        || value.execution_dates > value.paired_dates) return null;
    const n = value.paired_dates;
    if (!n && (value.difference !== null || !['waiting', 'blocked'].includes(value.verdict))) return null;
    if (n && (value.verdict === 'waiting' || !METRICS.every(([key]) => finite(value.difference?.[key]) && finite(value.difference[key] * 100)
        && (key === 'eod_return_net' || Math.abs(value.difference[key]) <= 1)))) return null;
    return {
      record: RECORDS[value.today_record], recordKey: value.today_record,
      recordTone: value.today_record === 'ready' ? 'good' : value.today_record === 'not_due' ? 'neutral' : 'warning',
      verdict: VERDICTS[value.verdict], verdictKey: value.verdict,
      tone: value.attention_required || ['blocked', 'do_not_adopt'].includes(value.verdict) ? 'warning' : 'neutral',
      n, expected: value.expected_dates, changed: value.changed_dates, execution: value.execution_dates,
      difference: n ? METRICS.map(([key, title, hint, direction]) => ({
        key, title, hint, value: value.difference[key] * 100,
        tone: value.difference[key] === 0 ? 'neutral' : value.difference[key] * direction > 0 ? 'good' : 'warning',
      })) : null,
    };
  }

  function derive(summary) {
    const system = summary?.current_system;
    const liveValid = system?.schema === 'prelude_dashboard_current.v1'
      && system.automatic_orders === false && system.automatic_promotion === false
      && ['preopen', 'open'].every(k => LIVE_STATES.includes(system.live?.[k]?.state)
        && typeof system.live[k].attention_required === 'boolean');
    const received = liveValid ? ['preopen', 'open'].filter(k =>
      ['delivered_candidates', 'delivered_empty'].includes(system.live[k].state)).length : null;
    const forward = forwardModel(summary?.book_forward);
    return {
      observed: liveValid ? stamp(system.observed_at) : '미제공', forward,
      tiles: [
        {title: '게시 기준 · R1 전달', value: received === null ? '확인 불가' : `${received} / 2슬롯`,
          note: '서버 접수 영수증 기준입니다. 사용자 열람 확인은 아닙니다.',
          tone: !liveValid ? 'neutral' : ['preopen', 'open'].some(k => system.live[k].attention_required) ? 'warning' : received === 2 ? 'good' : 'neutral'},
        {title: '기준일 · L1 사전 기록', value: forward?.record ?? '확인 불가',
          note: '늦음·누락·중단은 정상 기록으로 복구하지 않습니다.', tone: forward?.recordTone ?? 'neutral'},
        {title: '새 구간 · 완결 비교', value: forward ? `${forward.n}일` : '자료 미제공',
          note: forward ? `대상 ${forward.expected}일 · 선택 변경 ${forward.changed}일. 과거 개발20일과 별도입니다.` : '미제공은 0일이나 0수익이 아닙니다.', tone: 'neutral'},
        {title: '새 후보 · 검토 결론', value: forward?.verdict ?? '확인 불가',
          note: '어떤 판정도 실추천을 자동 교체하지 않습니다.', tone: forward?.tone ?? 'neutral'},
      ],
    };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {derive, forwardModel};
  if (!global.document) return;
  const document = global.document;
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function render(summary) {
    const model = derive(summary);
    const root = document.getElementById('monitorOverview');
    if (!root) return;
    root.replaceChildren(...model.tiles.map(item => {
      const tile = node('article', 'monitor-tile');
      tile.dataset.tone = item.tone;
      tile.append(node('span', 'tile-label', item.title), node('strong', '', item.value), node('p', '', item.note));
      return tile;
    }));
    document.getElementById('monitorSnapshot').textContent = `운영 확인 ${model.observed} (KST) · 게시된 확인본입니다. 실시간 가격·서버 상태 화면이 아닙니다.`;
    const visual = document.getElementById('forwardVisual');
    const chart = document.getElementById('forwardDifference');
    if (!visual || !chart) return;
    visual.replaceChildren(); chart.replaceChildren();
    const f = model.forward;
    if (!f) {
      const message = node('div', 'difference-empty');
      message.append(node('strong', '', '검증 자료 확인 불가'), node('p', '', '이전 게시본·자료 누락·검사 실패일 수 있습니다. 그래프나 0성과로 대체하지 않습니다.'));
      chart.append(message); return;
    }
    const track = node('ol', 'evidence-track');
    const steps = [
      ['기준일 사전 기록', f.record, '진입 전에 저장된 선택만 정상 표본으로 인정합니다.', f.recordTone],
      ['누적 완결 비교', `${f.n} / ${f.expected}일`, `결과가 완결된 날짜 기준입니다. 지연 진입까지 검증된 날짜는 ${f.execution}일입니다.`, 'neutral'],
      ['현재 검토 결론', f.verdict, '하방·상방·net과 일관성을 함께 확인합니다. 자동 교체는 없습니다.', f.tone],
    ];
    steps.forEach(([title, value, note, tone], index) => {
      const item = node('li', ''); item.dataset.tone = tone;
      item.append(node('span', 'evidence-index', `0${index + 1}`), node('h3', '', title), node('strong', '', value));
      if (index === 1 && f.expected > 0) {
        const progress = node('progress', ''); progress.max = f.expected; progress.value = f.n;
        progress.setAttribute('aria-label', `평가 대상 ${f.expected}일 중 완결 ${f.n}일. 채택 확률이 아닙니다.`);
        item.append(progress);
      }
      item.append(node('p', '', note)); track.append(item);
    });
    visual.append(track);
    if (!f.difference) {
      const message = node('div', 'difference-empty');
      message.append(node('strong', '', '아직 그릴 성과가 없습니다'), node('p', '', '완결된 같은 날짜의 R1과 새 후보가 모이면 하방·상방·net 차이를 표시합니다. 기다리는 시간을 성과 0%로 그리지 않습니다.'));
      chart.append(message); return;
    }
    const figure = node('figure', 'difference-chart');
    figure.append(node('h3', '', '새 후보는 R1과 무엇이 달랐나'), node('p', 'concept-note', `${f.n}일의 날짜 동일가중 관측 평균입니다. 하방은 감소, 상방·net은 증가할수록 유리합니다.`));
    const max = Math.max(.001, ...f.difference.map(row => Math.abs(row.value)));
    figure.append(node('p', 'chart-unit', `공통 축 −${max.toFixed(3)} / 0 / +${max.toFixed(3)} %p`));
    f.difference.forEach(metric => {
      const row = node('div', 'difference-row');
      const label = node('div', 'difference-label', metric.title); label.append(node('small', '', metric.hint));
      const axis = node('div', 'difference-axis'); axis.setAttribute('aria-hidden', 'true');
      const bar = node('i', 'difference-bar');
      const width = Math.abs(metric.value) / max * 50;
      bar.style.width = `${width}%`; bar.style.left = `${metric.value < 0 ? 50 - width : 50}%`;
      bar.dataset.tone = metric.tone; axis.append(bar);
      const value = node('div', 'difference-value', `${metric.value > 0 ? '+' : ''}${metric.value.toFixed(3)}%p`);
      value.append(node('small', '', metric.tone === 'good' ? '유리한 방향' : metric.tone === 'warning' ? '불리한 방향' : '변화 없음'));
      row.append(label, axis, value); figure.append(row);
    });
    figure.append(node('figcaption', 'concept-note', '후보 − R1의 차이입니다. 청록은 유리한 방향, 황토색은 불리한 방향입니다. 평균 차이만으로 우위를 확정하지 않으며 아래 판정 조건을 함께 봅니다. 가상 픽 결과이지 실계좌 수익은 아닙니다.'));
    chart.append(figure);
  }

  function revealHash() {
    let id;
    try { id = decodeURIComponent(global.location.hash.slice(1)); } catch (_) { return; }
    const target = id && document.getElementById(id);
    if (!target) return;
    let details = target.closest('details');
    let opened = false;
    while (details) { details.open = true; opened = true; details = details.parentElement?.closest('details'); }
    if (opened) global.requestAnimationFrame(() => target.scrollIntoView({block: 'start', behavior: 'instant'}));
  }
  document.querySelectorAll('.archive-panel').forEach(panel => panel.addEventListener('toggle', () => {
    if (!panel.open) return;
    global.requestAnimationFrame(() => {
      Object.values(global.Chart?.instances || {}).forEach(chart => {
        if (panel.contains(chart.canvas) && chart.canvas.getClientRects().length) chart.resize();
      });
    });
  }));
  global.addEventListener('hashchange', revealHash);
  revealHash();
  global.PreludePages = Object.freeze({derive, render});
})(typeof window === 'undefined' ? globalThis : window);
