/* viz: qf-drift-divergence
 * Drift-Divergence decomposition (Eq 4) demonstration.
 */

(function () {
  const U = window.VIZ_UTIL;

  const L = 200;
  const KERNEL = 25;

  function synth() {
    const X = new Float64Array(L);
    for (let t = 0; t < L; t++) {
      const trend = 0.02 * t;
      const seasonal = 1.2 * Math.cos(2*Math.PI*t/30) + 0.4 * Math.cos(2*Math.PI*t/7);
      const noise = 0.3 * (Math.random() * 2 - 1);
      X[t] = trend + seasonal + noise;
    }
    return X;
  }

  function quantileFilt(X, q, k) {
    const half = Math.floor((k - 1) / 2);
    const out = new Float64Array(X.length);
    for (let i = 0; i < X.length; i++) {
      const window = [];
      for (let j = i - half; j <= i + half; j++) {
        if (j < 0) window.push(X[0]);
        else if (j >= X.length) window.push(X[X.length - 1]);
        else window.push(X[j]);
      }
      window.sort((a, b) => a - b);
      const idx = q * (window.length - 1);
      const lo = Math.floor(idx), hi = Math.ceil(idx);
      out[i] = window[lo] + (idx - lo) * (window[hi] - window[lo]);
    }
    return out;
  }

  let cached = null;

  VIZ_REGISTRY['qf-drift-divergence'] = function (canvas, controls, params) {
    let q = parseFloat(params.q || 0.5);
    if (cached === null) cached = synth();

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Quantile q';
    wb.appendChild(lb);
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach(qv => {
      const btn = document.createElement('button');
      btn.textContent = qv.toFixed(1);
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (Math.abs(qv - q) < 1e-6) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        q = qv; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    const wregen = document.createElement('button');
    wregen.textContent = '↻ Regenerate';
    wregen.style.cssText = 'margin-left:14px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
    wregen.addEventListener('click', () => { cached = synth(); draw(); });
    controls.appendChild(wregen);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 48, padR = 16, padT = 32, padB = 28;
      const innerW = w - padL - padR;
      const panelH = (h - padT - padB) / 3 - 12;

      const drift_q = quantileFilt(cached, q, KERNEL);
      const drift_median = quantileFilt(cached, 0.5, KERNEL);
      const divergence = new Float64Array(L);
      for (let i = 0; i < L; i++) divergence[i] = cached[i] - drift_median[i];

      const series = [
        { name: `Original χ + χ^q (q=${q.toFixed(1)})`, arrs: [{a:cached, c:'#9ca3af'}, {a:drift_q, c:'#ef4444'}] },
        { name: 'Median drift χ^{0.5} (used to compute divergence)', arrs: [{a:drift_median, c:'#60a5fa'}] },
        { name: 'Divergence pattern χ^d = χ - χ^{0.5}', arrs: [{a:divergence, c:'#10b981'}] }
      ];

      series.forEach((s, idx) => {
        const yOff = padT + idx * (panelH + 12);
        let yMin = Infinity, yMax = -Infinity;
        s.arrs.forEach(({a}) => { a.forEach(v => { if (v < yMin) yMin = v; if (v > yMax) yMax = v; }); });
        const pad = Math.max((yMax-yMin)*0.1, 0.05);
        const yToPix = (y) => yOff + (1 - (y - (yMin-pad)) / ((yMax+pad) - (yMin-pad))) * panelH;
        const xToPix = (i) => padL + i / (L - 1) * innerW;

        ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(0)); ctx.lineTo(w-padR, yToPix(0)); ctx.stroke();

        s.arrs.forEach(({a, c}) => {
          ctx.strokeStyle = c;
          ctx.lineWidth = 1.7;
          ctx.beginPath();
          for (let i = 0; i < L; i++) {
            const xp = xToPix(i), yp = yToPix(a[i]);
            if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
          }
          ctx.stroke();
        });

        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(s.name, padL, yOff - 14);
      });

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Drift-Divergence Decomposition (Eq 4)', w/2, 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
