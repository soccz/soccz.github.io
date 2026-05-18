/* viz: autoformer-topk-delays
 * Top-k τ selection + Roll(V, τ) aggregation visualization.
 * Synthetic periodic series with adjustable k.
 */

(function () {
  const U = window.VIZ_UTIL;

  const L = 96;

  function synth() {
    const V = new Float64Array(L);
    for (let t = 0; t < L; t++) {
      V[t] = Math.sin(2*Math.PI*t/24) + 0.5*Math.sin(2*Math.PI*t/8) + 0.1*Math.cos(t*0.3);
    }
    return V;
  }

  function autocorr(V) {
    const R = new Float64Array(L);
    for (let tau = 0; tau < L; tau++) {
      let s = 0, n = 0;
      for (let t = 0; t < L - tau; t++) { s += V[t]*V[t+tau]; n++; }
      R[tau] = n > 0 ? s/n : 0;
    }
    return R;
  }

  function roll(V, tau) {
    const out = new Float64Array(L);
    for (let i = 0; i < L; i++) out[i] = V[(i + tau) % L];
    return out;
  }

  let cachedV = null;

  VIZ_REGISTRY['autoformer-topk-delays'] = function (canvas, controls, params) {
    let k = parseInt(params.k || 3, 10);
    if (cachedV === null) cachedV = synth();

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Top-k';
    wb.appendChild(lb);
    [1,2,3,4,5].forEach(kv => {
      const btn = document.createElement('button');
      btn.textContent = String(kv);
      btn.style.cssText = 'margin-left:6px;padding:4px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (kv === k) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        k = kv; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 48, padR = 16, padT = 32, padB = 28;
      const innerW = w - padL - padR;
      const panelH = (h - padT - padB) / 3 - 8;

      const R = autocorr(cachedV);
      const cand = [];
      for (let tau = 1; tau < L; tau++) cand.push([tau, R[tau]]);
      cand.sort((a,b) => b[1] - a[1]);
      const tops = cand.slice(0, k).map(([tau]) => tau);

      /* softmax weights */
      const rawW = tops.map(tau => R[tau]);
      const maxW = Math.max(...rawW);
      const expW = rawW.map(x => Math.exp(x - maxW));
      const sumW = expW.reduce((a,b) => a+b, 0);
      const weights = expW.map(x => x / sumW);

      /* aggregate */
      const agg = new Float64Array(L);
      tops.forEach((tau, i) => {
        const rolled = roll(cachedV, tau);
        for (let j = 0; j < L; j++) agg[j] += weights[i] * rolled[j];
      });

      function panel(yOff, arr, label, color, marks) {
        const yMin = Math.min(...arr), yMax = Math.max(...arr);
        const pad = Math.max((yMax-yMin)*0.1, 0.05);
        const yToPix = (y) => yOff + (1 - (y - (yMin-pad)) / ((yMax+pad) - (yMin-pad))) * panelH;
        const xToPix = (i) => padL + i / (arr.length - 1) * innerW;
        ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(0)); ctx.lineTo(w-padR, yToPix(0)); ctx.stroke();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        for (let i = 0; i < arr.length; i++) {
          const xp = xToPix(i), yp = yToPix(arr[i]);
          if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        }
        ctx.stroke();
        if (marks) {
          marks.forEach((m, idx) => {
            const xp = xToPix(m.tau);
            const yp = yToPix(arr[m.tau] || 0);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(xp, yp, 4, 0, 2*Math.PI); ctx.fill();
            ctx.fillStyle = U.text();
            ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText('τ='+m.tau+' w='+m.w.toFixed(2), xp, yp - 5);
          });
        }
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(label, padL, yOff - 14);
      }

      panel(padT, cachedV, '1) V(t) — synthetic series', '#60a5fa');
      panel(padT + panelH + 12, R, `2) R(τ) — Top-${k} delays selected (red)`, '#f59e0b', tops.map((tau, i) => ({ tau, w: weights[i] })));
      panel(padT + 2*(panelH + 12), agg, '3) Aggregated: Σ w_i · Roll(V, τ_i)', '#ef4444');

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Auto-Correlation (Eq 6): Top-k τ → Roll(V, τ) → weighted sum', w/2, 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
