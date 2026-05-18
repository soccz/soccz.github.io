/* viz: autoformer-seasonal-trend
 * AvgPool moving-average progressive decomposition.
 * Apply SeriesDecomp 0, 1, 2, or 3 times to synthetic series.
 */

(function () {
  const U = window.VIZ_UTIL;

  const L = 200;
  const KERNEL = 25;

  /* Generate synthetic: trend (linear) + seasonal (cosine) + noise */
  function synth() {
    const X = new Float64Array(L);
    for (let t = 0; t < L; t++) {
      const trend = 0.02 * t;
      const seasonal = 0.8 * Math.cos(2*Math.PI*t/30) + 0.3 * Math.cos(2*Math.PI*t/7);
      const noise = 0.15 * (Math.random() * 2 - 1);
      X[t] = trend + seasonal + noise;
    }
    return X;
  }

  function movingAvg(X, k) {
    const half = Math.floor((k - 1) / 2);
    const out = new Float64Array(X.length);
    for (let i = 0; i < X.length; i++) {
      let s = 0, n = 0;
      for (let j = i - half; j <= i + half; j++) {
        if (j < 0) { s += X[0]; n++; }
        else if (j >= X.length) { s += X[X.length-1]; n++; }
        else { s += X[j]; n++; }
      }
      out[i] = s / n;
    }
    return out;
  }

  let cachedX = null;

  VIZ_REGISTRY['autoformer-seasonal-trend'] = function (canvas, controls, params) {
    let steps = parseInt(params.steps || 1, 10);
    if (cachedX === null) cachedX = synth();

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Decomp passes';
    wb.appendChild(lb);
    [0,1,2,3].forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = String(s);
      btn.style.cssText = 'margin-left:6px;padding:4px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (s === steps) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        steps = s; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    const wregen = document.createElement('button');
    wregen.textContent = '↻ Regenerate';
    wregen.style.cssText = 'margin-left:14px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
    wregen.addEventListener('click', () => { cachedX = synth(); draw(); });
    controls.appendChild(wregen);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 48, padR = 16, padT = 32, padB = 28;
      const innerW = w - padL - padR;

      /* Apply progressive decomp */
      let trend = cachedX.slice();
      let seasonal = new Float64Array(L);
      for (let i = 0; i < steps; i++) {
        const t = movingAvg(trend, KERNEL);
        for (let j = 0; j < L; j++) {
          seasonal[j] += trend[j] - t[j];
          trend[j] = t[j];
        }
      }

      const series = [
        { name: 'Original X', arr: cachedX, color: '#9ca3af' },
        { name: `Trend (after ${steps} decomp pass${steps===1?'':'es'})`, arr: trend, color: '#ef4444' },
        { name: `Seasonal (accumulated residuals)`, arr: seasonal, color: '#60a5fa' }
      ];

      const panelH = (h - padT - padB) / 3 - 8;

      series.forEach((s, idx) => {
        const yOff = padT + idx * (panelH + 8);
        const yMin = Math.min(...s.arr), yMax = Math.max(...s.arr);
        const pad = Math.max((yMax-yMin)*0.1, 0.05);
        const yToPix = (y) => yOff + (1 - (y - (yMin-pad)) / ((yMax+pad) - (yMin-pad))) * panelH;
        const xToPix = (i) => padL + i / (L - 1) * innerW;

        /* baseline */
        ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(0)); ctx.lineTo(w-padR, yToPix(0)); ctx.stroke();

        /* path */
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        for (let i = 0; i < L; i++) {
          const xp = xToPix(i), yp = yToPix(s.arr[i]);
          if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        }
        ctx.stroke();

        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(s.name, padL, yOff - 14);
      });

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Series Decomposition (Eq 1): X = Trend + Seasonal', w/2, 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
