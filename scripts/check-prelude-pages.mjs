// Build-free presentation contracts. Run: node scripts/check-prelude-pages.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const {derive, forwardModel, snapshotModel, attentionModel, recommendationModel, checksModel, compoundedReturn, recordLabel, chartTableModel} = createRequire(import.meta.url)(fileURLToPath(new URL('projects/prelude/page-concepts.js', root)));
const waiting = {schema:'prelude_dashboard_book_forward.v1', status:'observed',
  automatic_promotion:false, scope:'pre_entry_paper_not_actual_trades', attention_required:false,
  today_record:'not_due', verdict:'waiting', paired_dates:0, expected_dates:0, changed_dates:0,
  execution_dates:0, difference:null};
const observed = {...waiting, today_record:'ready', verdict:'continue_observing',
  paired_dates:4, expected_dates:5, changed_dates:2, execution_dates:3,
  difference:{dn5:-.02, up10:.01, eod_return_net:-.003}};
let checks = 0;
function test(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }
test('missing data is not zero', () => {
  for (const value of [undefined, null, {}, {current_system:{}}, {book_forward:{}}]) {
    const result = derive(value);
    assert.equal(result.forward, null);
    assert.equal(result.tiles[0].value, '확인 불가');
    assert.equal(result.tiles[2].value, '자료 미제공');
  }
});
test('zero samples have no invented performance', () => {
  assert.equal(forwardModel(waiting).difference, null);
  assert.equal(forwardModel({...waiting, verdict:'blocked'}).n, 0);
  for (const difference of [{dn5:0, up10:0, eod_return_net:0}, undefined])
    assert.equal(forwardModel({...waiting, difference}), null);
  assert.equal(forwardModel({...waiting, verdict:'review_candidate'}), null);
});
test('signed percentage-point comparison and direction', () => {
  const f = forwardModel(observed);
  assert.deepEqual(f.difference.map(r => r.value), [-2, 1, -.3]);
  assert.deepEqual(f.difference.map(r => r.tone), ['good', 'good', 'warning']);
  const other = forwardModel({...observed, difference:{dn5:.1, up10:-.02, eod_return_net:0}});
  assert.deepEqual(other.difference.map(r => r.tone), ['warning', 'warning', 'neutral']);
});
test('invalid counts, non-finite numbers and overflow fail closed', () => {
  for (const key of ['paired_dates', 'expected_dates', 'changed_dates', 'execution_dates'])
    for (const value of [-1, 1.5, '4', NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
      assert.equal(forwardModel({...observed, [key]:value}), null, `${key}: ${value}`);
  for (const row of [{paired_dates:6}, {changed_dates:5}, {execution_dates:5}, {verdict:'waiting'}])
    assert.equal(forwardModel({...observed, ...row}), null);
  for (const key of ['dn5', 'up10', 'eod_return_net'])
    for (const value of [null, '0.1', undefined, NaN, Infinity, -Infinity, Number.MAX_VALUE])
      assert.equal(forwardModel({...observed, difference:{...observed.difference, [key]:value}}), null);
  assert.equal(forwardModel({...observed, difference:{...observed.difference, dn5:1.01}}), null);
});
test('unknown schemas, prototype keys and HTML are never accepted', () => {
  for (const key of ['today_record', 'verdict'])
    for (const value of ['__proto__', 'constructor', 'toString', '<img src=x onerror=alert(1)>'])
      assert.equal(forwardModel({...observed, [key]:value}), null);
  for (const row of [{schema:'future'}, {status:'unavailable'}, {automatic_promotion:true},
    {scope:'actual_trades'}, {attention_required:'false'}]) assert.equal(forwardModel({...observed, ...row}), null);
  assert.doesNotMatch(read('projects/prelude/page-concepts.js'), /\.innerHTML\s*=/);
});
test('review never means adoption; incomplete records stay visible', () => {
  assert.equal(forwardModel({...observed, verdict:'review_candidate'}).verdict, '채택 검토 대상');
  for (const state of ['missing', 'late', 'uncertain'])
    assert.equal(forwardModel({...observed, today_record:state, attention_required:true}).recordTone, 'warning');
});
test('delivery receipts, unknown states and KST timestamps', () => {
  const system = {schema:'prelude_dashboard_current.v1', automatic_orders:false, automatic_promotion:false,
    observed_at:'2026-10-01T01:00:00Z', live:{preopen:{state:'delivered_empty', attention_required:false},
      open:{state:'delivered_candidates', attention_required:false}}};
  assert.equal(derive({current_system:system}).tiles[0].value, '2 / 2슬롯');
  assert.equal(derive({current_system:system}).tiles[0].tone, 'good');
  assert.notEqual(derive({current_system:system}).observed, '미제공');
  for (const state of ['delivery_uncertain', 'pending', 'probe_unavailable']) {
    const live = {...system.live, open:{state, attention_required:true}};
    assert.equal(derive({current_system:{...system, live}}).tiles[0].value, '1 / 2슬롯');
    assert.equal(derive({current_system:{...system, live}}).tiles[0].tone, 'warning');
  }
  const live = {...system.live, open:{state:'unknown', attention_required:false}};
  assert.equal(derive({current_system:{...system, live}}).tiles[0].value, '확인 불가');
  assert.equal(derive({current_system:{...system, observed_at:'not a date'}}).observed, '미제공');
});
test('page roles, links, loading order and preserved locking', () => {
  for (const [path, role] of [['projects/prelude/index.html', '개발일지'],
    ['projects/prelude/dashboard/index.html', '운영 현황·검증']]) {
    const html = read(path);
    assert.match(html, new RegExp(`<title>[^<]*${role}`));
    const menu = html.match(/<ul class="page-switch">[\s\S]*?<\/ul>/)[0];
    assert.match(menu, /href="\/projects\/prelude\/"/);
    assert.match(menu, /href="\/projects\/prelude\/dashboard\/"/);
    assert.equal((menu.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(html.indexOf('page-concepts.css') > html.indexOf('</style>'));
    assert.ok(html.indexOf('page-concepts.js') < html.lastIndexOf('<script>'));
  }
  const dash = read('projects/prelude/dashboard/index.html');
  assert.ok(dash.indexOf('id="recSection"') < dash.indexOf('id="bookForwardSection"'));
  assert.match(dash, /await showPinModal\(\)/);
  assert.match(dash, /await decryptPayload\(await probe.json\(\), pin\)/);
  assert.match(dash, /window.PreludePages\?\.render\(summary\)/);
  assert.match(dash, /window.PreludePages\?\.render\(undefined\)/);
  assert.match(dash, /getElementById\('monitorSnapshot'\).textContent = '데이터 로드 실패:/);
  for (const id of ['researchArchive', 'legacyArchive'])
    assert.match(dash, new RegExp(`<details class="archive-panel" id="${id}">`));
});
test('historical graphic uses its stated scale and data', () => {
  const html = read('projects/prelude/index.html');
  const dots = [...html.matchAll(/left:([\d.]+)%" data-value="([\d.]+)" data-scale="([\d.]+)"/g)];
  assert.equal(dots.length, 6);
  assert.deepEqual(dots.map(m => +m[2]), [28.33, 21.67, 23.33, 21.67, 1.586, 1.959]);
  for (const [, left, value, scale] of dots) assert.ok(Math.abs(+left - value / scale * 100) < .001);
  const links = [...html.matchAll(/class="pair-link" style="left:([\d.]+)%;width:([\d.]+)%"/g)];
  assert.equal(links.length, 3);
  links.forEach(([,left,width], index) => {
    const pair = dots.slice(index * 2, index * 2 + 2).map(d => +d[1]);
    assert.ok(Math.abs(+left - Math.min(...pair)) < .001);
    assert.ok(Math.abs(+width - Math.abs(pair[0] - pair[1])) < .001);
  });
});
test('historical uncertainty has a shared zero axis and original values', () => {
  const html = read('projects/prelude/index.html');
  const estimates = [...html.matchAll(/left:([\d.]+)%" data-estimate="(-?[\d.]+)"/g)];
  assert.deepEqual(estimates.map(m => +m[2]), [.372, .942, -.197]);
  for (const [,left,value] of estimates) assert.ok(Math.abs(+left - (+value + 2.5) / 5 * 100) < .001);
  const [,left,width,low,high] = html.match(/left:([\d.]+)%;width:([\d.]+)%" data-low="(-?[\d.]+)" data-high="([\d.]+)"/);
  assert.equal(+low, -1.916); assert.equal(+high, 2.315);
  assert.ok(Math.abs(+left - (+low + 2.5) / 5 * 100) < .001);
  assert.ok(Math.abs(+width - (+high - +low) / 5 * 100) < .001);
  assert.ok(+left < 50 && +left + +width > 50);
  assert.match(html, /앞·뒤10일은 평균만 표시/);
});
test('gate matrix preserves true, false and absent without scoring', () => {
  const source = {...waiting, checks:{review_sample:false, changed_dates:true}};
  const before = JSON.stringify(source);
  const groups = checksModel(source), rows = groups.flatMap(g => g.rows);
  assert.equal(groups.length, 3); assert.equal(rows.length, 12);
  assert.equal(new Set(rows.map(r => r.key)).size, 12);
  assert.equal(rows.find(r => r.key === 'review_sample').state, 'unmet');
  assert.equal(rows.find(r => r.key === 'changed_dates').state, 'met');
  assert.equal(rows.filter(r => r.state === 'unknown').length, 10);
  assert.equal(JSON.stringify(source), before);
  assert.equal(checksModel({...waiting, checks:{}}).flatMap(g => g.rows).filter(r => r.state === 'unknown').length, 12);
  for (const checks of [undefined,null,[],true, {review_sample:null}, {review_sample:'false'}, {extra:true}, JSON.parse('{"__proto__":true}')])
    assert.equal(checksModel({...waiting, checks}), null);
  const inherited = Object.create({review_sample:true});
  assert.equal(checksModel({...waiting, checks:inherited})[0].rows[0].state, 'unknown');
  assert.equal(checksModel({...source, automatic_promotion:true}), null);
});
const clockNow = Date.parse('2026-10-01T14:00:00+09:00');
const snapshot = {schema:'prelude_dashboard_current.v1', asof:'2026-10-01', observed_at:'2026-10-01T13:00:00+09:00'};
test('snapshot age is explicit and never live health', () => {
  const context = snapshotModel(snapshot, clockNow);
  assert.equal(context.key, 'same_day');
  assert.match(context.title, /실시간 조회 아님/);
  assert.match(context.detail, /1시간 0분/);
  assert.equal(snapshotModel(snapshot, Date.parse('2026-10-02T00:00:00+09:00')).key, 'old');
  assert.equal(snapshotModel({...snapshot, observed_at:'2026-10-01T04:00:00Z'}, clockNow).key, 'same_day');
  assert.equal(snapshotModel(snapshot, clockNow - 2 * 3600000).key, 'clock');
  assert.equal(snapshotModel(snapshot, Date.parse('2026-10-01T23:59:59+09:00')).key, 'same_day');
});
test('invalid dates and device clocks do not report freshness', () => {
  for (const row of [null, {}, {...snapshot, asof:'2026-02-30'}, {...snapshot, asof:'2026-09-30'},
    {...snapshot, observed_at:'2026-10-01T13:00:00'}, {...snapshot, observed_at:'2026-02-30T13:00:00Z'},
    {...snapshot, observed_at:'<img src=x>'}, {...snapshot, schema:'future'}])
    assert.equal(snapshotModel(row, clockNow).key, 'unknown');
  for (const time of [NaN, Infinity, null, 'today', Number.MAX_VALUE]) assert.equal(snapshotModel(snapshot, time).key, 'unknown');
});
test('attention comes from recorded state, not a new trading rule', () => {
  const system = {...snapshot, live:{preopen:{state:'delivered_empty',attention_required:false}, open:{state:'delivered_candidates',attention_required:false}}};
  const value = {current_system:system, book_forward:waiting};
  assert.equal(attentionModel(value, clockNow).items.length, 0);
  const troubled = structuredClone(value);
  troubled.current_system.live.open = {state:'delivery_uncertain', attention_required:true};
  troubled.current_system.research = {microstructure:{attention_required:true}};
  troubled.book_forward = {...waiting, today_record:'late', attention_required:true};
  assert.equal(attentionModel(troubled, clockNow).items.length, 3);
  assert.ok(attentionModel(troubled, clockNow).items.every(item => item.href.startsWith('#')));
  assert.ok(attentionModel(undefined, clockNow).items.some(item => item.text.includes('확인 불가')));
  assert.ok(attentionModel(value, clockNow + 86400000).items.some(item => item.text.includes('오늘 상태가 아닙니다')));
});
const candidate = {coin:'KRW-EXAMPLE', rank:1, score:.756, dump_risk_flag:false, entry_open:25.6, btc_regime:'bull_volatile'};
const recommendation = (rows, date = '2026-10-01') => ({channels:{recommend:{latest_radar_date:date, latest_radar:rows}}});
test('recommendation cards preserve order and distinguish unknown risk', () => {
  const rows = [candidate, {...candidate, coin:'KRW-SECOND', rank:2, dump_risk_flag:true}, {...candidate, coin:'KRW-THIRD', rank:3, dump_risk_flag:null}];
  const before = JSON.stringify(rows);
  const result = recommendationModel(recommendation(rows));
  assert.deepEqual(result.rows.map(row => row.coin), rows.map(row => row.coin));
  assert.deepEqual(result.rows.map(row => row.risk), ['not_flagged', 'flagged', 'unknown']);
  assert.equal(result.rows[0].score, '0.756');
  assert.equal(JSON.stringify(rows), before);
  assert.equal(recommendationModel(recommendation([])).state, 'empty');
  assert.equal(recommendationModel({}).state, 'unknown');
  // Native dashboard publisher strips KRW-; both representations stay intact.
  const native = recommendationModel(recommendation([{...candidate, coin:'EXAMPLE'}]));
  assert.equal(native.state, 'observed');
  assert.equal(native.rows[0].coin, 'EXAMPLE');
  const older = {...recommendation([candidate], '2026-09-30'), current_system:snapshot};
  assert.equal(recommendationModel(older).dateMismatch, true);
  assert.equal(recommendationModel({...recommendation([candidate]), current_system:snapshot}).dateMismatch, false);
});
test('malformed candidate rows fail closed without reselecting', () => {
  for (const row of [null, {...candidate, coin:'<img src=x>'}, {...candidate, coin:{toString:'bad'}}, {...candidate, rank:1.5}])
    assert.equal(recommendationModel(recommendation([candidate, row])).state, 'unknown');
  assert.equal(recommendationModel(recommendation([candidate, candidate])).state, 'unknown');
  assert.equal(recommendationModel(recommendation([candidate, {...candidate, coin:'EXAMPLE', rank:2}])).state, 'unknown');
  assert.equal(recommendationModel(recommendation([candidate], '2026-02-30')).state, 'unknown');
  const result = recommendationModel(recommendation([{...candidate, score:NaN, entry_open:Infinity, dump_risk_flag:'false'}]));
  assert.equal(result.rows[0].score, '미제공');
  assert.equal(result.rows[0].price, '미제공');
  assert.equal(result.rows[0].risk, 'unknown');
});
test('stored prediction evidence preserves ratios, zeros and the original horizon', () => {
  const evidence={schema:'prelude_recommend_prediction.v1',source:'stored_recommend_ledger',
    basis:'day_D_0900_KST_open_high_low',p_up10:.2764,p_dn5:.2686,p_dn10:.0344,rr_ratio:1.0291};
  const project=value=>recommendationModel(recommendation([{...candidate,prediction_evidence:value}])).rows[0].prediction;
  assert.deepEqual(project(evidence),{up:.2764,down:.2686,deep:.0344,ratio:1.0291});
  assert.deepEqual(project({...evidence,p_up10:0,p_dn5:1,p_dn10:0,rr_ratio:0}),{up:0,down:1,deep:0,ratio:0});
  const empty={up:null,down:null,deep:null,ratio:null};
  for(const value of [undefined,null,{}, {...evidence,basis:'post_send_24h'},{...evidence,schema:'future'},{...evidence,source:'refitted'}]) assert.deepEqual(project(value),empty);
  for(const value of [null,undefined,NaN,Infinity,-Infinity,true,false,'0.2',-.01,1.01]) {
    const r=project({...evidence,p_up10:value,p_dn5:value,p_dn10:value});
    assert.equal(r.up,null);assert.equal(r.down,null);assert.equal(r.deep,null);
  }
  assert.deepEqual(project({...evidence,p_dn10:.9}),{up:.2764,down:null,deep:null,ratio:null});
  assert.equal(project({...evidence,rr_ratio:null}).ratio,null); // never infer from rounded heads
  const js=read('projects/prelude/page-concepts.js');
  assert.match(js,/합이 100%가 아닙니다/);assert.match(js,/실사용 보정 검증 완료를 뜻하지 않습니다/);
  assert.match(js,/알림 수신 이후의 수익 확률·선도달 확률/);
});
test('keyboard and assistive navigation stay available after rendering', () => {
  const html=read('projects/prelude/dashboard/index.html'),js=read('projects/prelude/page-concepts.js');
  assert.match(html,/background.forEach\(\(\[el\]\) => \{ el.inert = true/);
  assert.match(html,/el.inert = wasInert/);
  assert.match(html,/main.focus\(\{preventScroll:true\}\)/);
  assert.match(html,/aria-describedby="pinDescription pinError"/);
  assert.match(html,/window.PreludePages\?\.prepareTableNavigation\?\.\(\)/);
  assert.match(js,/wrap.tabIndex = 0/);
  assert.match(html,/button.className = 'table-sort'/);
  assert.match(html,/th.setAttribute\('aria-sort'/);
  assert.doesNotMatch(html,/<h4 class="pump-h">/);
  assert.match(read('projects/prelude/index.html'),/id="selectionUncertainty" role="group"/);
});
test('every universe heatmap shade keeps readable text without changing counts', () => {
  const html=read('projects/prelude/dashboard/index.html');
  const source=html.slice(html.indexOf('function renderCoinUniverse('),html.indexOf('function renderTimeOfDay('));
  const start=source.indexOf('const cell ='),end=source.indexOf('const trs =');
  const cell=vm.runInNewContext(source.slice(start,end)+';cell');
  const lum=x=>{const s=x/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;};
  for(let value=1;value<=1000;value++){
    const text=cell(value,1000),match=text.match(/rgb\((\d+),\d+,\d+\);color:(#[0-9a-f]+)/);
    assert.ok(text.endsWith('>'+value+'</td>'));
    const l=lum(+match[1]),ink=match[2]==='#ffffff'?1:0;
    assert.ok((Math.max(l,ink)+.05)/(Math.min(l,ink)+.05)>=4.5);
  }
});
test('reader controls keep all evidence accessible', () => {
  const story = read('projects/prelude/index.html');
  for (const id of ['earlyNumbers', 'earlyExperiments', 'technicalAppendix'])
    assert.match(story, new RegExp(`<details[^>]*id="${id}"[^>]*data-reader-detail`));
  assert.match(story, /id="readerToggle"[^>]*hidden/);
  assert.match(story, /문서 스크롤 위치 · 내용 이해도나 검증 진척도가 아님/);
  const dash = read('projects/prelude/dashboard/index.html');
  for (const id of ['recommendCards', 'snapshotContext', 'monitorAttention']) assert.ok(dash.includes(`id="${id}"`));
});
test('YTD compounds monthly returns without inventing missing months', () => {
  assert.ok(Math.abs(compoundedReturn([10,-10]) + 1) < 1e-10);
  assert.ok(Math.abs(compoundedReturn([10,10]) - 21) < 1e-10);
  assert.equal(compoundedReturn([0]), 0);
  assert.equal(compoundedReturn([-100,30]), -100);
  for (const values of [[],null,[null],[undefined],[NaN],[Infinity],[-101],['10']]) assert.equal(compoundedReturn(values),null);
  const html=read('projects/prelude/dashboard/index.html');
  assert.match(html,/compoundedReturn\(yearReturns\)/);
  assert.doesNotMatch(html,/ytd \+= v/);
});
test('not due does not falsely claim the current clock is before record time', () => {
  assert.match(recordLabel({...waiting,asof:'2026-10-01',start_date:'2026-10-02'}),/시험 시작 전/);
  assert.match(recordLabel(waiting),/기록 예정/);
  assert.equal(recordLabel({...waiting,today_record:'ready'}),'진입 전 저장 확인');
  assert.equal(recordLabel({today_record:'constructor'}),'확인 불가');
  assert.doesNotMatch(read('projects/prelude/dashboard/index.html'),/오늘 기록 시각 전/);
});
test('chart tables preserve zero, missing, negative and scatter inputs', () => {
  const config={data:{labels:['A','B','C'],datasets:[{label:'수익 %',data:[0,null,-2]},{label:'좌표',data:[{x:1,y:2},{x:2,y:NaN}]}]}};
  const model=chartTableModel(config);
  assert.deepEqual(model.rows,[['A','0','x: 1 · y: 2'],['B','미제공','x: 2 · y: 미제공'],['C','-2','미제공']]);
  assert.deepEqual(chartTableModel({}).rows,[]);
  assert.deepEqual(chartTableModel({data:{datasets:[{data:[[1,3]]}]}}).rows,[['1','1 ~ 3']]);
});
test('ranking explanation does not promote auxiliary scores to probabilities', () => {
  const html=read('projects/prelude/dashboard/index.html');
  assert.match(html,/id="rankingExplanation"/);
  assert.match(html,/개별 상·하방 추정치가 없는 게시 자료에서는 확률을 역산하지 않습니다/);
  assert.match(read('projects/prelude/page-concepts.js'),/최종 순위의 정렬키가 아닙니다/);
  assert.equal(recommendationModel(recommendation([candidate])).rows[0].regime,'상승 · 고변동');
  assert.equal(recommendationModel(recommendation([{...candidate,btc_regime:'constructor'}])).rows[0].regime,'constructor');
});
test('main reading path is short and original anchors remain in dated evidence', () => {
  const journal=read('projects/prelude/index.html'),dash=read('projects/prelude/dashboard/index.html');
  assert.match(journal,/<ol class="story-turns">/);
  assert.equal((journal.match(/class="turn-date"/g)||[]).length,6);
  assert.ok(journal.indexOf('id="selectionTradeoff"')<journal.indexOf('id="evidenceArchive"'));
  assert.ok(journal.indexOf('id="nextQuestion"')<journal.indexOf('id="evidenceArchive"'));
  assert.ok(dash.indexOf('id="recSection"')<dash.indexOf('id="currentSystemSection"'));
  for(const id of ['operationsDetail','replayDetail','otherResearchDetail','methodologyDetail']) assert.match(dash,new RegExp(`<details[^>]*id="${id}"`));
  assert.match(dash,/if \(!window.PreludePages\) cards \+=/);
});
test('a failed optional renderer does not clear current recommendations or stop later panels', () => {
  const html=read('projects/prelude/dashboard/index.html');
  const fn=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
  const panel=fn('function renderPanel(', '\n/* ───────── Crypto');
  const current=fn('function renderDashboardCurrent(', '\nfunction renderDashboardArchive');
  const archive=fn('function renderDashboardArchive(', '\n(async function main');
  const calls=[];
  const element=()=>({hidden:true,append(){},replaceChildren(){}});
  const context={console:{error(){}},document:{createElement:element,getElementById:element},window:{PreludePages:{render:s=>calls.push(s?'current':'cleared'),prepareTableNavigation:()=>calls.push('tables')}},HISTORY_ROWS:[]};
  for(const name of [...new Set((current+archive).match(/\b(?:render\w+|attachSort|attachFilters|downloadCsv)(?=\()/g))]) if(!['renderPanel','renderDashboardCurrent','renderDashboardArchive'].includes(name)) context[name]=()=>calls.push(name);
  context.renderFindings=()=>{throw new Error('injected optional failure');};
  vm.createContext(context);vm.runInContext(panel+'\n'+current+'\n'+archive,context);
  context.renderDashboardCurrent({});context.renderDashboardArchive({},null,null,{});
  assert.ok(calls.includes('current'));assert.ok(calls.includes('renderChampionGate'));assert.ok(!calls.includes('cleared'));
  assert.ok(html.indexOf('renderDashboardCurrent(summary);')<html.indexOf("['history.json','accuracy.json','findings.json'].map(optional)"));
});
test('every chart construction passes through the accessible isolated wrapper', () => {
  const html=read('projects/prelude/dashboard/index.html');
  assert.equal((html.match(/new Chart\(/g)||[]).length,1);
  assert.match(html,/renderChartTable\(el, config\)/);
  assert.match(html,/typeof Chart === 'undefined'/);
  assert.match(read('projects/prelude/page-concepts.js'),/canvas.setAttribute\('aria-describedby', id\)/);
});
console.log(JSON.stringify({status:'PASS', contract_groups:checks}));
