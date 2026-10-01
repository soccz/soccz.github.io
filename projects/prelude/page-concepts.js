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
  const day = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)
    && /(Z|[+-]\d{2}:\d{2})$/.test(value) && day(value.slice(0, 10)) ? Date.parse(value) : NaN;
  const kstDay = value => new Date(value + 9 * 3600000).toISOString().slice(0, 10);
  const stamp = value => {
    if (typeof value !== 'string' || !/(Z|[+-]\d{2}:\d{2})$/.test(value)) return '미제공';
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short',
    }) : '미제공';
  };

  function snapshotModel(system, now = Date.now()) {
    const time = timestamp(system?.observed_at);
    const unknown = {key:'unknown', tone:'warning', title:'게시 시각 확인 불가', detail:'자료의 기준일과 확인 시각을 검증할 수 없습니다. 이를 현재 상태로 해석하지 마세요.'};
    if (system?.schema !== 'prelude_dashboard_current.v1' || !day(system.asof)
        || !finite(time) || !finite(now) || Math.abs(now) > 8e15 || system.asof !== kstDay(time)) return unknown;
    if (time > now) return {key:'clock', tone:'warning', title:'게시 시각과 기기 시각 확인 필요', detail:'게시된 확인 시각이 기기 시각보다 앞섭니다. 날짜와 시계를 확인하세요. 실시간 상태를 판정하지 않습니다.'};
    const minutes = Math.floor((now - time) / 60000);
    const age = minutes < 1 ? '1분 미만' : minutes < 60 ? `${minutes}분` : minutes < 1440 ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분` : `${Math.floor(minutes / 1440)}일 ${Math.floor(minutes % 1440 / 60)}시간`;
    const old = system.asof !== kstDay(now);
    return {key:old ? 'old' : 'same_day', tone:old ? 'warning' : 'neutral',
      title:old ? `${system.asof} 과거 게시본 · 오늘 상태가 아닙니다` : `${system.asof} 확인본 · 실시간 조회 아님`,
      detail:`마지막 운영 확인 ${age} 전 · 기기 시각 기준 KST 날짜 비교입니다. 서버를 다시 조회한 결과가 아니며 새로고침해도 새 게시본이 없으면 바뀌지 않습니다.`};
  }

  function attentionModel(summary, now = Date.now()) {
    const items = [];
    const context = snapshotModel(summary?.current_system, now);
    if (context.key !== 'same_day') items.push({text:context.title, href:'#currentSystemSection'});
    const labels = {preopen:'장전 R1', open:'장후 R1'};
    const stateLabels = {waiting:'아직 실행 시각 전', pending:'처리 중', delivered_candidates:'후보 전달 확인',
      delivered_empty:'후보 없음 전달 확인', not_delivered:'전달 안 됨', delivery_uncertain:'전달 확인 불확실',
      invalid_evidence:'증거 불일치', missing_decision:'추천 결정 기록 없음', probe_unavailable:'점검 자료 미제공'};
    for (const slot of ['preopen', 'open']) {
      const row = summary?.current_system?.live?.[slot];
      if (!row || !own(stateLabels, row.state) || typeof row.attention_required !== 'boolean')
        items.push({text:`${labels[slot]}: 상태 확인 불가`, href:'#currentSystemSection'});
      else if (row.attention_required) items.push({text:`${labels[slot]}: ${stateLabels[row.state]}`, href:'#currentSystemSection'});
    }
    const research = summary?.current_system?.research;
    for (const [key, label] of [['microstructure','체결 정보 수집'], ['trade_shortlist','체결 재선별']])
      if (research?.[key]?.attention_required === true) items.push({text:`${label}: 게시본에 점검 필요 표시`, href:'#currentSystemSection'});
    const forward = forwardModel(summary?.book_forward);
    if (!forward) items.push({text:'L1 사전 기록 검증: 자료 확인 불가', href:'#bookForwardSection'});
    else if (summary.book_forward.attention_required || !['ready','not_due'].includes(forward.recordKey))
      items.push({text:`L1 사전 기록: ${forward.record} · 점검 필요`, href:'#bookForwardSection'});
    if (summary?.book_validation?.status === 'incomplete') items.push({text:'새 날짜 사후 재생: 불완전 자료 확인', href:'#bookValidationSection'});
    if (summary?.research_progress?.status === 'incomplete') items.push({text:'다른 시험: 불완전 자료 확인', href:'#researchProgressSection'});
    return {context, items};
  }

  function recommendationModel(summary) {
    const rec = summary?.channels?.recommend;
    const unknown = {state:'unknown', date:null, dateMismatch:false, rows:[]};
    if (!rec || !day(rec.latest_radar_date) || !Array.isArray(rec.latest_radar)) return unknown;
    const rows = rec.latest_radar;
    if (rows.some(row => !row || typeof row.coin !== 'string' || !/^(?:KRW-)?[A-Z0-9]{1,24}$/.test(row.coin)
        || !Number.isSafeInteger(row.rank) || row.rank < 1)
        || new Set(rows.map(row => row.coin.replace(/^KRW-/, ''))).size !== rows.length
        || new Set(rows.map(row => row.rank)).size !== rows.length) return unknown;
    return {state:rows.length ? 'observed' : 'empty', date:rec.latest_radar_date,
      dateMismatch:day(summary?.current_system?.asof) && summary.current_system.asof !== rec.latest_radar_date,
      rows:rows.map(row => ({
      coin:row.coin, rank:row.rank, score:finite(row.score) ? row.score.toFixed(3) : '미제공',
      risk:row.dump_risk_flag === true ? 'flagged' : row.dump_risk_flag === false ? 'not_flagged' : 'unknown',
      price:finite(row.entry_open) && row.entry_open > 0 ? row.entry_open.toLocaleString('ko-KR', {maximumFractionDigits:8}) : '미제공',
      regime:typeof row.btc_regime === 'string' && row.btc_regime.length <= 80 ? row.btc_regime : '미제공',
    }))};
  }

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
  if (typeof module !== 'undefined' && module.exports) module.exports = {derive, forwardModel, snapshotModel, attentionModel, recommendationModel};
  if (!global.document) return;
  const document = global.document;
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  let latestSummary;
  function renderContext(summary) {
    const contextRoot = document.getElementById('snapshotContext');
    const attentionRoot = document.getElementById('monitorAttention');
    if (!contextRoot || !attentionRoot) return;
    const {context, items} = attentionModel(summary);
    contextRoot.hidden = false; contextRoot.dataset.tone = context.tone;
    contextRoot.replaceChildren(node('strong', '', context.title), node('p', '', context.detail));
    const signature = JSON.stringify(items);
    if (attentionRoot.dataset.signature === signature) return;
    attentionRoot.hidden = false; attentionRoot.dataset.signature = signature;
    attentionRoot.replaceChildren(node('h2', '', items.length ? '먼저 확인할 항목' : '게시본의 주의 표시'));
    if (!items.length) attentionRoot.append(node('p', 'attention-empty', '표시된 주의 항목은 없습니다. 실시간 정상 확인이나 추천 성능 인증은 아닙니다.'));
    else {
      const list = node('ul', '');
      items.forEach(item => { const li = node('li', ''); const a = node('a', '', item.text + ' →'); a.href = item.href; li.append(a); list.append(li); });
      attentionRoot.append(list);
    }
  }
  function renderRecommendations(summary) {
    const root = document.getElementById('recommendCards');
    const note = document.getElementById('recommendCardsNote');
    if (!root || !note) return;
    const model = recommendationModel(summary);
    const asof = document.getElementById('recommendCardsAsOf');
    if (asof) {
      asof.dataset.tone = model.dateMismatch || !model.date ? 'warning' : 'neutral';
      asof.textContent = model.date ? `추천 기준 ${model.date} · 장후 R1${model.dateMismatch ? ' · 운영 확인 기준일과 다릅니다. 새 날짜의 추천으로 해석하지 마세요.' : ' · 실시간 추천 화면이 아닙니다.'}` : '추천 기준일 확인 불가';
    }
    root.replaceChildren();
    if (model.state !== 'observed') {
      root.append(node('p', 'concept-note', model.state === 'empty' ? '게시된 종목 목록이 비어 있습니다. 전달 여부와 무추천 사유는 운영 기록에서 확인하세요.' : '추천 목록 확인 불가 · 미제공을 무추천으로 해석하지 마세요.'));
    } else model.rows.forEach(row => {
      const card = node('article', 'recommend-card'); card.dataset.risk = row.risk;
      const header = node('header', '');
      header.append(node('h3', '', row.coin), node('span', 'recommend-rank', `#${row.rank}`));
      card.append(header, node('span', 'recommend-risk', row.risk === 'flagged' ? '하방 경고 있음' : row.risk === 'not_flagged' ? '하방 경고 미표시 · 안전 인증 아님' : '하방 경고 자료 미제공'));
      const values = node('dl', '');
      [['원래 점수', row.score], ['09:00 참고가격', row.price === '미제공' ? row.price : row.price + '원'], ['BTC 국면', row.regime]].forEach(([key, value]) => values.append(node('dt', '', key), node('dd', '', value)));
      card.append(values, node('p', 'score-help', '점수는 원래 추천값을 그대로 표시하며, 상승 확률이나 안전 등급으로 바꾸지 않습니다.'));
      root.append(card);
    });
    note.textContent = `${model.date ? '추천 기준일 ' + model.date + ' · ' : ''}장후(open) R1 게시 기록입니다. 장전 추천은 합치지 않습니다. 09:00 가격은 현재가·실제 체결가가 아닙니다. 원본 확률 추정치와 누적 집계는 아래 상세표에 보존합니다.`;
  }
  function render(summary) {
    const model = derive(summary);
    const root = document.getElementById('monitorOverview');
    if (!root) return;
    latestSummary = summary;
    renderContext(summary);
    renderRecommendations(summary);
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

  function revealHash(hash) {
    let id;
    try { id = decodeURIComponent((typeof hash === 'string' ? hash : global.location.hash).slice(1)); } catch (_) { return; }
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
  document.addEventListener('click', event => {
    const href = event.target.closest?.('a[href]')?.getAttribute('href');
    if (href?.startsWith('#')) revealHash(href);
  });
  revealHash();
  // No refresh/fetch: only reconsider the age of the already-unlocked snapshot.
  if (document.getElementById('monitorOverview')) {
    const updateContext = () => { if (latestSummary !== undefined && !document.hidden) renderContext(latestSummary); };
    global.setInterval(updateContext, 60000);
    document.addEventListener('visibilitychange', updateContext);
  }

  const readerDetails = [...document.querySelectorAll('[data-reader-detail]')];
  const readerToggle = document.getElementById('readerToggle');
  const syncReader = () => {
    if (!readerToggle) return;
    const allOpen = readerDetails.every(item => item.open);
    readerToggle.textContent = allOpen ? '핵심 흐름으로 접기' : '상세 자료 모두 펼치기';
    readerToggle.setAttribute('aria-expanded', String(allOpen));
  };
  if (readerToggle) {
    readerToggle.hidden = false; syncReader();
    readerToggle.addEventListener('click', () => { const open = !readerDetails.every(item => item.open); readerDetails.forEach(item => { item.open = open; }); syncReader(); });
  }
  const navigation = document.querySelector('.section-jumps');
  const chapterLinks = [...(navigation?.querySelectorAll('.jump-inner a[href^="#"]') || [])];
  const readingPosition = document.getElementById('readingPosition');
  if (readingPosition) readingPosition.hidden = false;
  let navigationPending = false;
  function updateNavigation() {
    navigationPending = false;
    const firstTarget = chapterLinks.length && document.getElementById(chapterLinks[0].hash.slice(1));
    const margin = firstTarget ? parseFloat(global.getComputedStyle(firstTarget).scrollMarginTop) || 0 : 0;
    const offset = Math.max(margin, (navigation?.getBoundingClientRect().height || 0) + parseFloat(global.getComputedStyle(document.body).getPropertyValue('--header-height'))) + 2;
    let active = null;
    chapterLinks.forEach(link => {
      const target = document.getElementById(link.hash.slice(1));
      let visible = !!target;
      for (let parent = target?.closest('details'); parent; parent = parent.parentElement?.closest('details')) if (!parent.open) visible = false;
      if (visible && target.getBoundingClientRect().top <= offset) active = link;
    });
    chapterLinks.forEach(link => {
      const changed = link === active && link.getAttribute('aria-current') !== 'location';
      if (link === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      if (changed) {
        const viewport = link.parentElement;
        const box = link.getBoundingClientRect(), bounds = viewport.getBoundingClientRect();
        if (box.left < bounds.left || box.right > bounds.right) viewport.scrollLeft += box.left - bounds.left - 20;
      }
    });
    if (readingPosition) {
      const max = document.documentElement.scrollHeight - global.innerHeight;
      const percent = max > 0 ? Math.round(Math.max(0, Math.min(1, global.scrollY / max)) * 100) : 0;
      readingPosition.setAttribute('aria-valuenow', String(percent));
      readingPosition.firstElementChild.style.width = `${percent}%`;
    }
  }
  function scheduleNavigation() { if (!navigationPending) { navigationPending = true; global.requestAnimationFrame(updateNavigation); } }
  global.addEventListener('scroll', scheduleNavigation, {passive:true});
  global.addEventListener('resize', scheduleNavigation);
  document.querySelectorAll('details').forEach(item => item.addEventListener('toggle', () => { syncReader(); scheduleNavigation(); }));
  if (typeof global.ResizeObserver === 'function') new global.ResizeObserver(scheduleNavigation).observe(document.body);
  scheduleNavigation();
  global.PreludePages = Object.freeze({derive, render});
})(typeof window === 'undefined' ? globalThis : window);
