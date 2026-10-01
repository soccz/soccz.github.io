/* Presentation only. No fetching, fitting, storage, new metrics or adoption logic. */
(function (global) {
  'use strict';
  const RECORDS = {
    not_due: '기록 예정', ready: '진입 전 저장 확인', missing: '기록 누락',
    late: '진입 시각 이후 저장', uncertain: '저장 완료 불확실',
  };
  const REGIMES = {bull_volatile:'상승 · 고변동', bull_quiet:'상승 · 저변동', bear_volatile:'하락 · 고변동', bear_quiet:'하락 · 저변동'};
  const VERDICTS = {
    waiting: '자료 대기', continue_observing: '관찰 연장',
    review_candidate: '채택 검토 대상', do_not_adopt: '현재 후보 비채택', blocked: '증거 확인 필요',
  };
  const METRICS = [
    ['dn5', '하방 경험', '낮을수록 유리', -1],
    ['up10', '상방 기회', '높을수록 유리', 1],
    ['eod_return_net', '24h 말 net', '높을수록 유리', 1],
  ];
  // Labels group existing server checks; this is not another decision engine.
  const CHECK_GROUPS = [
    ['자료가 충분한가', [['review_sample', '비교 날짜 수'], ['changed_dates', '선택이 달라진 날짜'], ['observed_date_coverage', '대상 날짜 기록 비율'], ['context_coverage', '시장 국면별 표본']]],
    ['득실이 함께 나아졌나', [['joint_down_up_safe_net', '하방·상방·safe-up·net'], ['positive_challenger_net', '후보 net 양수'], ['beats_matched_net', '매칭 무작위 대비 net'], ['chronological_consistency', '앞·뒤 구간 일관성']]],
    ['실사용 조건에도 견디나', [['leave_one_date_out_net', '하루 제외 시 net'], ['context_consistency', '시장 국면별 일관성'], ['execution_coverage', '지연 진입 검증 표본'], ['delayed_and_extra_cost', '진입 지연·추가 비용']]],
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

  // Presentation arithmetic only: missing months are not zero-return months.
  function compoundedReturn(values) {
    if (!Array.isArray(values) || !values.length || values.some(v => !finite(v) || v < -100)) return null;
    const result = (values.reduce((equity, value) => equity * (1 + value / 100), 1) - 1) * 100;
    return finite(result) ? result : null;
  }
  function recordLabel(value) {
    if (!value || !own(RECORDS, value.today_record)) return '확인 불가';
    if (value.today_record === 'not_due' && day(value.asof) && day(value.start_date) && value.asof < value.start_date)
      return `시험 시작 전 · ${value.start_date}부터`;
    return value.today_record === 'not_due' ? '기록 예정 · 아직 대상 아님' : RECORDS[value.today_record];
  }
  function chartTableModel(config) {
    const labels = config?.data?.labels || [];
    const sets = config?.data?.datasets || [];
    const cell = value => {
      if (value == null || typeof value === 'number' && !finite(value)) return '미제공';
      if (typeof value === 'number' || typeof value === 'string') return String(value);
      if (Array.isArray(value)) return value.map(cell).join(' ~ ');
      if (typeof value === 'object') return Object.entries(value).filter(([key]) => ['x','y','r'].includes(key)).map(([key,v]) => `${key}: ${cell(v)}`).join(' · ') || '미제공';
      return '미제공';
    };
    const n = Math.max(0, labels.length, ...sets.map(s => Array.isArray(s.data) ? s.data.length : 0));
    return {headers:['항목 / 관측 순서', ...sets.map((s,i) => typeof s.label === 'string' ? s.label : `계열 ${i+1}`)],
      rows:Array.from({length:n}, (_,i) => [cell(labels[i] ?? i+1), ...sets.map(s => cell(s.data?.[i]))])};
  }

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

  function predictionModel(value) {
    const empty = {up:null, down:null, deep:null, ratio:null};
    if (!value || value.schema !== 'prelude_recommend_prediction.v1'
        || value.source !== 'stored_recommend_ledger'
        || value.basis !== 'day_D_0900_KST_open_high_low') return empty;
    const probability = v => finite(v) && v >= 0 && v <= 1 ? v : null;
    const result = {up:probability(value.p_up10), down:probability(value.p_dn5),
      deep:probability(value.p_dn10), ratio:finite(value.rr_ratio) && value.rr_ratio >= 0 ? value.rr_ratio : null};
    if (result.down !== null && result.deep !== null && result.deep > result.down)
      return {...result, down:null, deep:null, ratio:null};
    return result;
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
      prediction:predictionModel(row.prediction_evidence),
      risk:row.dump_risk_flag === true ? 'flagged' : row.dump_risk_flag === false ? 'not_flagged' : 'unknown',
      price:finite(row.entry_open) && row.entry_open > 0 ? row.entry_open.toLocaleString('ko-KR', {maximumFractionDigits:8}) : '미제공',
      regime:own(REGIMES, row.btc_regime) ? REGIMES[row.btc_regime]
        : typeof row.btc_regime === 'string' && row.btc_regime.length <= 80 ? row.btc_regime : '미제공',
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
      record: recordLabel(value), recordKey: value.today_record,
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
  function checksModel(value) {
    if (!forwardModel(value)) return null;
    const checks = value.checks;
    const keys = CHECK_GROUPS.flatMap(([, rows]) => rows.map(([key]) => key));
    if (!checks || Array.isArray(checks) || typeof checks !== 'object'
        || Object.keys(checks).some(key => !keys.includes(key) || typeof checks[key] !== 'boolean')) return null;
    return CHECK_GROUPS.map(([title, rows]) => ({title, rows:rows.map(([key, label]) => ({key, label,
      state:!own(checks, key) ? 'unknown' : checks[key] ? 'met' : 'unmet',
    }))}));
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {derive, forwardModel, snapshotModel, attentionModel, recommendationModel, checksModel, compoundedReturn, recordLabel, chartTableModel};
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
      const estimates = node('div', 'prediction-estimates');
      [['+10% 상승 추정', row.prediction.up, 'up'], ['−5% 하락 추정', row.prediction.down, 'down']].forEach(([label, value, tone]) => {
        const item = node('div', 'prediction-axis'); item.dataset.axis = tone;
        const caption = node('div', 'prediction-label');
        caption.append(node('span', '', label), node('strong', '', value === null ? '미제공' : (value * 100).toFixed(1) + '%'));
        const track = node('div', 'prediction-track'); track.setAttribute('aria-hidden', 'true');
        const fill = node('span', ''); fill.style.width = value === null ? '0%' : (value * 100) + '%';
        track.append(fill); item.append(caption, track); estimates.append(item);
      });
      const ratio = row.prediction.ratio === null ? '미제공' : row.prediction.ratio.toFixed(4);
      card.append(estimates, node('p', 'prediction-ratio', `저장된 RR 비율 ${ratio}`),
        node('p', 'prediction-basis', '09:00 일봉 기준 · 모델 추정, 적중 보장 아님'));
      const values = node('dl', '');
      [['09:00 참고가격', row.price === '미제공' ? row.price : row.price + '원'], ['BTC 국면', row.regime]].forEach(([key, value]) => values.append(node('dt', '', key), node('dd', '', value)));
      const detail = node('details', 'score-detail');
      const deep = row.prediction.deep === null ? '미제공' : (row.prediction.deep * 100).toFixed(2) + '%';
      detail.append(node('summary', '', '동률 판단·보조 점수'),
        node('p', 'score-help', `−10% 하락 추정 ${deep} · RR 동률 시 낮은 값이 우선인 보조 기준입니다. 표시값은 반올림되어 같아 보일 수 있습니다.`),
        node('p', 'score-help', `보조 점수 ${row.score} · 정상 RR 경로에서는 최종 순위의 정렬키가 아닙니다. RR 모델 실패 시에만 점수 정렬로 대체됩니다. 상승 확률·안전 등급도 아닙니다.`));
      card.append(values, detail);
      root.append(card);
    });
    note.textContent = '장후(open) 원장에 저장된 추정치와 발송 원순위입니다. 두 막대는 각각 0~100% 척도이며 합이 100%가 아닙니다. 같은 일봉에서 상승·하락이 모두 발생할 수 있습니다. 기준은 해당일 09:00 시가부터 다음 날 09:00 직전 고가·저가이며, 알림 수신 이후의 수익 확률·선도달 확률이나 실사용 보정 검증 완료를 뜻하지 않습니다. 09:00 가격은 현재가·체결가가 아니며, 미제공 값과 RR 비율은 역산하지 않습니다.';
  }
  function render(summary) {
    const model = derive(summary);
    const root = document.getElementById('monitorOverview');
    if (!root) return;
    latestSummary = summary;
    renderContext(summary);
    renderRecommendations(summary);
    renderChecks(summary?.book_forward);
    // Keep daily overview short; sample/record details appear once below.
    root.replaceChildren(...[model.tiles[0], model.tiles[3]].map(item => {
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
    const axisRow = node('div', 'difference-scale');
    const ticks = node('div', 'plot-ticks');
    ticks.append(node('span', '', `−${max.toFixed(3)}`), node('span', '', '0'), node('span', '', `+${max.toFixed(3)}`));
    axisRow.append(ticks); figure.append(axisRow);
    figure.append(node('p', 'chart-reading-note', '가운데0선은 R1과 차이 없음입니다. 하방은 왼쪽, 상방·net은 오른쪽이 유리합니다.'));
    figure.append(node('figcaption', 'concept-note', '후보 − R1의 차이입니다. 청록은 유리한 방향, 황토색은 불리한 방향입니다. 이 사전 기록 자료에는 신뢰구간이 제공되지 않아 평균만 표시합니다. 평균 차이만으로 우위를 확정하지 않으며 아래 판정 조건을 함께 봅니다. 가상 픽 결과이지 실계좌 수익은 아닙니다.'));
    chart.append(figure);
  }

  function renderChecks(value) {
    const root = document.getElementById('forwardChecks');
    if (!root) return;
    root.replaceChildren();
    const groups = checksModel(value);
    if (!groups) return;
    const panel = node('section', 'checks-panel');
    const title = node('h3', '', '무엇이 확인됐고, 무엇이 남았나'); title.id = 'forwardChecksTitle';
    panel.setAttribute('aria-labelledby', title.id);
    panel.append(title, node('p', 'concept-note', '서버가 기록한 판정 조건을 세 질문으로 묶었습니다. 충족 개수를 성공률로 환산하지 않으며 실제 추천을 자동 변경하지 않습니다.'));
    const grid = node('div', 'checks-grid');
    const labels = {met:['✓', '충족'], unmet:['×', '미충족'], unknown:['—', '미평가·미제공']};
    groups.forEach((group, index) => {
      const column = node('div', 'check-group');
      column.append(node('span', 'evidence-index', `0${index + 1}`), node('h4', '', group.title));
      const list = node('ul', '');
      group.rows.forEach(row => {
        const item = node('li', 'check-cell'); item.dataset.state = row.state;
        const mark = node('span', 'check-symbol', labels[row.state][0]); mark.setAttribute('aria-hidden', 'true');
        const label = node('span', 'check-label', row.label);
        label.append(node('small', '', labels[row.state][1]));
        item.append(mark, label); list.append(item);
      });
      column.append(list); grid.append(column);
    });
    panel.append(grid, node('p', 'concept-note', '미충족에는 표본 부족도 포함됩니다. 미평가·미제공은 실패나 통과로 채우지 않습니다. 원 수치와 평가 조건은 상세 기록에서 확인하세요.'));
    root.append(panel);
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
  function renderChartTable(canvas, config) {
    const id = canvas.id + '-data';
    let detail = document.getElementById(id);
    if (!detail) { detail = node('details', 'chart-data'); detail.id = id; canvas.after(detail); }
    const title = canvas.closest('.chart-wrap')?.querySelector('.chart-title')?.textContent || canvas.id;
    canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', title + ' · 수치는 다음 데이터 표에서도 확인할 수 있습니다.');
    canvas.setAttribute('aria-describedby', id);
    canvas.textContent = title + ' — 바로 뒤의 차트 데이터 표를 이용하세요.';
    const model = chartTableModel(config);
    detail.replaceChildren(node('summary', '', '차트 데이터 표 보기'));
    if (!model.rows.length) { detail.append(node('p', 'concept-note', '자료를 아직 불러오지 않았거나 표시할 관측값이 없습니다. 0성과를 뜻하지 않습니다.')); return; }
    const wrap = node('div', 'chart-data-scroll'); wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', title + ' 데이터 표');
    const table = node('table', 'tbl');
    table.append(node('caption', '', title + ' · 차트 입력값 그대로. 단위·대상 기간은 위 차트 설명을 참고하세요. 미제공은 0이 아닙니다.'));
    const head = node('thead', ''); const tr = node('tr', '');
    model.headers.forEach(value => { const th = node('th', '', value); th.scope = 'col'; tr.append(th); }); head.append(tr);
    const body = node('tbody', '');
    model.rows.forEach(values => { const row = node('tr', ''); values.forEach((value,i) => { const cell = node(i ? 'td' : 'th', '', value); if (!i) cell.scope = 'row'; row.append(cell); }); body.append(row); });
    table.append(head, body); wrap.append(table); detail.append(wrap);
  }
  document.querySelectorAll('canvas').forEach(canvas => renderChartTable(canvas, {}));
  function prepareTableNavigation() {
    document.querySelectorAll('.table-wrap, .strat-table-wrap, .policy-timeline-wrap').forEach((wrap, index) => {
      const table = wrap.querySelector('table');
      if (!table) return;
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      const title = table.caption?.textContent || wrap.closest('section')?.querySelector('h2, h3')?.textContent || '자료';
      wrap.setAttribute('aria-label', `${title} · 표 ${index + 1} · 방향키로 좌우 스크롤`);
    });
  }
  prepareTableNavigation();
  global.PreludePages = Object.freeze({derive, render, compoundedReturn, recordLabel, renderChartTable, prepareTableNavigation});
})(typeof window === 'undefined' ? globalThis : window);
