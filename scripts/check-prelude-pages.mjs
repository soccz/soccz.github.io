// Build-free presentation contracts. Run: node scripts/check-prelude-pages.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const {derive, forwardModel} = createRequire(import.meta.url)(fileURLToPath(new URL('projects/prelude/page-concepts.js', root)));
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
  const bars = [...html.matchAll(/width:([\d.]+)%" data-value="([\d.]+)" data-scale="([\d.]+)"/g)];
  assert.equal(bars.length, 6);
  assert.deepEqual(bars.map(m => +m[2]), [28.33, 21.67, 23.33, 21.67, 1.586, 1.959]);
  for (const [, width, value, scale] of bars) assert.ok(Math.abs(+width - value / scale * 100) < .001);
});
console.log(JSON.stringify({status:'PASS', contract_groups:checks}));
