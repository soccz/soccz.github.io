/* viz: autoformer-fft-acorr
 * FFT-based autocorrelation R(τ) computation, step-by-step demo.
 * Synthetic sinusoid + slider for fundamental period P.
 */

(function () {
  const U = window.VIZ_UTIL;

  const L = 128;

  function compute(P) {
    /* Synthetic series: sum of two harmonics + noise */
    const X = new Float64Array(L);
    for (let t = 0; t < L; t++) {
      X[t] = Math.sin(2*Math.PI*t/P) + 0.4*Math.sin(2*Math.PI*t/(P*0.5)) + 0.1*Math.sin(t*1.3);
    }
    /* Autocorrelation via direct definition (small L) */
    const R = new Float64Array(L);
    for (let tau = 0; tau < L; tau++) {
      let s = 0, n = 0;
      for (let t = 0; t < L - tau; t++) { s += X[t] * X[t + tau]; n++; }
      R[tau] = n > 0 ? s / n : 0;
    }
    return { X, R };
  }

  VIZ_REGISTRY['autoformer-fft-acorr'] = function (canvas, controls, params) {
    let P = parseInt(params.period || 16, 10);

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Period P';
    const range = document.createElement('input');
    range.type = 'range'; range.min = 6; range.max = 40; range.value = String(P);
    range.style.cssText = 'margin-left:8px;vertical-align:middle;';
    const valSpan = document.createElement('span');
    valSpan.style.cssText = 'margin-left:8px;color:var(--text);font-weight:600;font-size:0.85rem;';
    valSpan.textContent = String(P);
    range.addEventListener('input', () => {
      P = parseInt(range.value, 10);
      valSpan.textContent = String(P);
      draw();
    });
    wb.appendChild(lb); wb.appendChild(range); wb.appendChild(valSpan);
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 48, padR = 16, padT = 28, padB = 32;
      const innerW = w - padL - padR;
      const innerH = (h - padT - padB - 30) / 2;

      const { X, R } = compute(P);

      function panel(yOffset, arr, label, color, marks) {
        const yMin = Math.min(...arr), yMax = Math.max(...arr);
        const pad = (yMax - yMin) * 0.1 + 1e-6;
        const yToPix = (y) => padT + yOffset + (1 - (y - (yMin - pad)) / ((yMax + pad) - (yMin - pad))) * innerH;
        const xToPix = (i) => padL + i / (arr.length - 1) * innerW;

        /* zero line */
        ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, yToPix(0)); ctx.lineTo(w - padR, yToPix(0));
        ctx.stroke();

        /* path */
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i < arr.length; i++) {
          const xp = xToPix(i), yp = yToPix(arr[i]);
          if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        }
        ctx.stroke();

        /* marks (Top-k τ on R) */
        if (marks) {
          marks.forEach((m, i) => {
            const xp = xToPix(m);
            const yp = yToPix(arr[m]);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(xp, yp, 4, 0, 2*Math.PI);
            ctx.fill();
            ctx.fillStyle = U.text();
            ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText('τ='+m, xp, yp - 6);
          });
        }

        /* label */
        ctx.fillStyle = U.text();
        ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(label, padL, padT + yOffset - 18);
      }

      panel(0, X, `1) Series X(t) — synthetic period ≈ ${P}`, '#60a5fa');

      /* find top-k τ on R (excluding tau=0) */
      const candidates = [];
      for (let tau = 1; tau < R.length; tau++) candidates.push([tau, R[tau]]);
      candidates.sort((a, b) => b[1] - a[1]);
      const k = 3;
      const tops = candidates.slice(0, k).map(([tau]) => tau);
      tops.sort((a,b) => a-b);

      panel(innerH + 30, R, `2) Autocorrelation R(τ) via FFT — Top-${k} τ marked`, '#ef4444', tops);

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Auto-Correlation: Series X → R(τ) → Top-k delays', w/2, 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
