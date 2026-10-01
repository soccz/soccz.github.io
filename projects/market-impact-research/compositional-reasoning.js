(() => {
  'use strict';
  if (!document.querySelector('[data-composition-explorer]')) return;
  const labels = {supported:'지지',contradicted:'반박',not_established:'확정 불가',abstain:'출력 실패·보류'};
  const el = name => document.getElementById('composition-'+name);
  const text = (name,value) => {el(name).textContent=value;};
  const caseSelect=el('case'),stageSelect=el('stage'),modelSelect=el('model');
  fetch('/projects/market-impact-research/composition-cases.json')
    .then(r => {if (!r.ok) throw new Error('data'); return r.json();})
    .then(data => {
      if (!Array.isArray(data) || data.length!==4) throw new Error('schema');
      const getCase = () => data.find(c => c.id===caseSelect.value);
      function render() {
        const c=getCase(),s=c.states[stageSelect.value][modelSelect.value],r=s.row;
        text('claim',c.claim); text('source',c.source); text('case-note',c.note);
        text('facts',s.facts_text);text('fact-audit',s.fact_audit);text('scope-note','평가 범위: '+c.scope);text('assertion',s.assertion);text('status',s.status);
        // HTML is generated from escaped typed values by the publication script.
        el('rules').innerHTML=s.rules_html;
        text('direct',labels[r.direct.decision]);text('pipeline',labels[r.pipeline.decision]);text('reference',labels[c.reference]);
        text('ref-policy',labels[r.reference_policy.decision]);text('ref-profile',labels[r.reference_profile.decision]);
        text('explanation',s.explanation);text('reference-explanation',s.reference_explanation);
        const match=r.pipeline.decision===c.reference;
        text('match',match?'잠정 기준과 일치':'잠정 기준과 불일치');el('match').dataset.match=String(match);
        text('raw',JSON.stringify({policy:s.policy,profile:s.profile},null,2));
      }
      caseSelect.addEventListener('change',() => {
        const c=getCase();stageSelect.replaceChildren();
        c.stages.forEach(s => {const o=document.createElement('option');o.value=s.id;o.textContent=s.label;stageSelect.append(o);});
        stageSelect.value=c.stages[c.id.startsWith('cap-')?1:0].id;render();
      });
      stageSelect.addEventListener('change',render);modelSelect.addEventListener('change',render);
      [caseSelect,stageSelect,modelSelect].forEach(e => {e.disabled=false;});
      render();
      text('load-status','실제 저장 출력을 비교합니다. 화면에서 모델을 새로 실행하지 않습니다.');
    }).catch(() => {
      [caseSelect,stageSelect,modelSelect].forEach(e => {e.disabled=true;});
      text('load-status','추가 비교 자료를 불러오지 못했습니다. 기본 사례와 본문의 결과는 그대로 읽을 수 있습니다.');
    });
})();
