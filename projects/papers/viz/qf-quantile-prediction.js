/* viz: qf-quantile-prediction
 * Probabilistic forecasting visualization (paper Figure 4 idea).
 * Synthetic Electricity-like data with predicted probabilistic intervals per model.
 */

(function () {
  const U = window.VIZ_UTIL;

  const L = 96;

  function synth() {
    // Synthetic Electricity-like signal with daily + weekly cycles + noise
    const X = new Float64Array(L);
    for (let t = 0; t < L; t++) {
      X[t] = 4 + 1.5 * Math.cos(2*Math.PI*t/24) + 0.5 * Math.cos(2*Math.PI*t/96) + 0.4 * (Math.random()*2-1);
    }
    return X;
  }

  // Model-specific PI characteristics (paper Fig 4 inspired)
  const MODEL_PROFILE = {
    QuantileFormer: { width: 0.6, accuracy: 0.95, color: '#ef4444' },
    iTransformer:   { width: 1.0, accuracy: 0.70, color: '#fbbf24' },
    DeepAR:         { width: 1.5, accuracy: 0.65, color: '#9ca3af' },
    PatchTST:       { width: 1.2, accuracy: 0.75, color: '#22d3ee' },
    TFT:            { width: 1.0, accuracy: 0.80, color: '#a78bfa' },
    Autoformer:     { width: 1.3, accuracy: 0.68, color: '#10b981' }
  };

  let cachedTruth = null;

  VIZ_REGISTRY['qf-quantile-prediction'] = function (canvas, controls, params) {
    let model = params.model || 'QuantileFormer';
    if (cachedTruth === null) cachedTruth = synth();

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Model';
    wb.appendChild(lb);
    Object.keys(MODEL_PROFILE).forEach(m => {
      const btn = document.createElement('button');
      btn.textContent = m;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.78rem;';
      if (m === model) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        model = m; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 56, padR = 24, padT = 40, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const profile = MODEL_PROFILE[model];
      // Simulate prediction: trend follow + offset based on accuracy + width PI
      const pred = new Float64Array(L);
      const upper = new Float64Array(L);
      const lower = new Float64Array(L);
      for (let i = 0; i < L; i++) {
        const ideal = cachedTruth[i];
        const offset = (1 - profile.accuracy) * (Math.sin(i * 0.3) * 0.6); // systematic deviation
        pred[i] = ideal + offset;
        upper[i] = pred[i] + profile.width;
        lower[i] = pred[i] - profile.width;
      }

      const allY = [];
      cachedTruth.forEach(v => allY.push(v));
      upper.forEach(v => allY.push(v));
      lower.forEach(v => allY.push(v));
      const yMin = Math.min(...allY), yMax = Math.max(...allY);
      const pad = (yMax - yMin) * 0.1;
      const yToPix = (y) => padT + (1 - (y - (yMin-pad)) / ((yMax+pad) - (yMin-pad))) * innerH;
      const xToPix = (i) => padL + i / (L - 1) * innerW;

      // Grid
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const yv = (yMin-pad) + ((yMax+pad) - (yMin-pad)) * i / ySteps;
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Shaded PI
      ctx.fillStyle = profile.color;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(xToPix(0), yToPix(upper[0]));
      for (let i = 1; i < L; i++) ctx.lineTo(xToPix(i), yToPix(upper[i]));
      for (let i = L - 1; i >= 0; i--) ctx.lineTo(xToPix(i), yToPix(lower[i]));
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // Upper bound (gray) and lower bound (yellow) — paper Fig 4 colors
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i < L; i++) {
        const xp = xToPix(i), yp = yToPix(upper[i]);
        if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
      }
      ctx.stroke();
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath();
      for (let i = 0; i < L; i++) {
        const xp = xToPix(i), yp = yToPix(lower[i]);
        if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Ground truth (dark)
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < L; i++) {
        const xp = xToPix(i), yp = yToPix(cachedTruth[i]);
        if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
      }
      ctx.stroke();

      // x-axis labels
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let xv = 0; xv <= L; xv += 24) {
        ctx.fillText(String(xv), xToPix(xv), h - padB + 6);
      }

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('value', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Figure 4 · ${model} · q=0.1 lower / q=0.9 upper`, w/2, padT - 24);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textBaseline = 'bottom';
      ctx.fillText('dark = ground truth · shaded = PI · gray dashed = upper · yellow dashed = lower', w/2, h - 8);

      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h-padB); ctx.lineTo(w-padR, h-padB);
      ctx.stroke();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
