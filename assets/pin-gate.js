/* PIN 게이트 — 모든 보호 노트 페이지 공통
 * 사용: <body class="pin-locked"> + <script src="/assets/pin-gate.js" data-title="페이지명" defer></script>
 * 동일 PBKDF2 SHA-256 300k iters, 메인 PIN과 동일.
 */
(function(){
  const PIN_HASH='18a8e3cd1a2fcc3f36b20359ef349fad60f28324d343f563ab91c1f6582330f3';
  const PIN_SALT='soccz-pin-v2-2026';
  const PIN_ITERS=300000;
  const PIN_MAX_ATTEMPTS=5;
  const PIN_LOCKOUT_MS=60000;
  const STORE_KEY='soccz-pin-master';

  // 이미 통과 (master token) — 메인에서 PIN 입력 후 들어온 경우 자동 통과
  try{
    if(sessionStorage.getItem(STORE_KEY)===PIN_HASH){
      document.body.classList.remove('pin-locked');
      return;
    }
  }catch(e){}

  // <script data-title="..."> 에서 페이지명 추출
  const self=document.currentScript||document.querySelector('script[src*="pin-gate.js"]');
  const pageTitle=(self&&self.dataset.title)||'Protected';

  // 모달 마크업 inject
  const gate=document.createElement('div');
  gate.id='pinGate';
  gate.setAttribute('role','dialog');
  gate.setAttribute('aria-modal','true');
  gate.innerHTML=`
    <div class="pin-gate-card">
      <span class="pin-gate-badge">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Protected
      </span>
      <div class="pin-gate-title">${pageTitle}</div>
      <div class="pin-gate-sub">4자리 PIN을 입력하세요</div>
      <div class="pin-gate-dots" id="pinGateDots">
        <span class="pin-gate-dot"></span>
        <span class="pin-gate-dot"></span>
        <span class="pin-gate-dot"></span>
        <span class="pin-gate-dot"></span>
      </div>
      <div class="pin-gate-error" id="pinGateError"></div>
      <div class="pin-gate-pad" id="pinGatePad"></div>
      <a class="pin-gate-back" href="/">&larr; Home</a>
    </div>`;
  document.body.appendChild(gate);

  let pinValue='',pinBusy=false;
  const dots=gate.querySelectorAll('#pinGateDots .pin-gate-dot');
  const err=gate.querySelector('#pinGateError');
  const pad=gate.querySelector('#pinGatePad');

  function pinDerive(pin){
    const enc=new TextEncoder();
    return crypto.subtle.importKey('raw',enc.encode(pin),{name:'PBKDF2'},false,['deriveBits'])
      .then(k=>crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(PIN_SALT),iterations:PIN_ITERS,hash:'SHA-256'},k,256))
      .then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''));
  }
  function lockRemain(){
    const until=parseInt(sessionStorage.getItem('pinLockUntil')||'0',10);
    return Math.max(0,until-Date.now());
  }
  function registerFail(){
    const f=parseInt(sessionStorage.getItem('pinFails')||'0',10)+1;
    sessionStorage.setItem('pinFails',String(f));
    if(f>=PIN_MAX_ATTEMPTS){
      sessionStorage.setItem('pinLockUntil',String(Date.now()+PIN_LOCKOUT_MS));
      sessionStorage.setItem('pinFails','0');
    }
    return f;
  }
  function resetFails(){sessionStorage.removeItem('pinFails');sessionStorage.removeItem('pinLockUntil')}

  function render(){dots.forEach((d,i)=>d.classList.toggle('filled',i<pinValue.length))}

  async function input(d){
    if(pinBusy)return;
    const remain=lockRemain();
    if(remain>0){err.textContent=`잠금됨 — ${Math.ceil(remain/1000)}초 후 재시도`;return}
    if(pinValue.length>=4)return;
    pinValue+=d;render();
    if(pinValue.length===4){
      pinBusy=true;err.textContent='확인 중…';
      try{
        const h=await pinDerive(pinValue);
        if(h===PIN_HASH){
          resetFails();
          try{sessionStorage.setItem(STORE_KEY,h)}catch(e){}
          document.body.classList.remove('pin-locked');
          gate.remove();
        }else{
          const f=registerFail();
          const r=lockRemain();
          err.textContent=r>0?`잠금됨 — ${Math.ceil(r/1000)}초 후 재시도`:`번호가 틀렸습니다 (${f}/${PIN_MAX_ATTEMPTS})`;
          setTimeout(()=>{pinValue='';render();pinBusy=false;if(!lockRemain())err.textContent=''},800);
        }
      }catch(e){err.textContent='오류';pinBusy=false}
    }
  }
  function backspace(){if(pinBusy)return;pinValue=pinValue.slice(0,-1);render();err.textContent=''}

  // 키패드
  pad.innerHTML=[1,2,3,4,5,6,7,8,9,'','0','⌫'].map(k=>{
    if(k==='')return `<button class="pin-gate-key action" disabled style="opacity:0;cursor:default"></button>`;
    if(k==='⌫')return `<button class="pin-gate-key action" data-act="back">⌫</button>`;
    return `<button class="pin-gate-key" data-digit="${k}">${k}</button>`;
  }).join('');
  pad.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.act==='back')backspace();
    else if(b.dataset.digit)input(b.dataset.digit);
  });

  // 키보드
  document.addEventListener('keydown',e=>{
    if(!document.body.classList.contains('pin-locked'))return;
    if(/^[0-9]$/.test(e.key))input(e.key);
    else if(e.key==='Backspace')backspace();
  });

  // 초기 lockout 표시
  const r=lockRemain();
  if(r>0)err.textContent=`잠금됨 — ${Math.ceil(r/1000)}초 후 재시도`;
})();
</content>
</invoke>