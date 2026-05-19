/* viz: qf-gmm-decomp
 * GMM decomposition (Eq 7) — divergence histogram + K Gaussian fit.
 */

(function () {
  const U = window.VIZ_UTIL;

  const N = 2000;

  function synthDivergence() {
    // Mixture of 3 Gaussians as ground truth
    const data = [];
    for (let i = 0; i < N; i++) {
      const r = Math.random();
      let mu, sigma;
      if (r < 0.4) { mu = -2; sigma = 0.6; }
      else if (r < 0.7) { mu = 0.5; sigma = 0.8; }
      else { mu = 2.5; sigma = 0.5; }
      const u1 = Math.random(), u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      data.push(mu + sigma * z);
    }
    return data;
  }

  function fitKGaussians(data, K) {
    // Simple K-means initialization + 10 EM iterations
    const min = Math.min(...data), max = Math.max(...data);
    let mus = [];
    for (let k = 0; k < K; k++) mus.push(min + (max - min) * (k + 0.5) / K);
    let sigmas = new Array(K).fill(1.0);
    let weights = new Array(K).fill(1.0 / K);

    for (let iter = 0; iter < 30; iter++) {
      // E-step
      const resp = data.map(x => {
        const probs = mus.map((mu, k) => weights[k] * Math.exp(-0.5 * Math.pow((x - mu) / sigmas[k], 2)) / (sigmas[k] * Math.sqrt(2 * Math.PI)));
        const sum = probs.reduce((a, b) => a + b, 1e-9);
        return probs.map(p => p / sum);
      });
      // M-step
      for (let k = 0; k < K; k++) {
        const Nk = resp.reduce((a, r) => a + r[k], 0);
        const newMu = resp.reduce((a, r, i) => a + r[k] * data[i], 0) / Nk;
        const newSigma = Math.sqrt(resp.reduce((a, r, i) => a + r[k] * Math.pow(data[i] - newMu, 2), 0) / Nk);
        mus[k] = newMu;
        sigmas[k] = Math.max(newSigma, 0.1);
        weights[k] = Nk / data.length;
      }
    }
    return { mus, sigmas, weights };
  }

  let cachedData = null;

  VIZ_REGISTRY['qf-gmm-decomp'] = function (canvas, controls, params) {
    let K = parseInt(params.K || 3, 10);
    if (cachedData === null) cachedData = synthDivergence();

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'K';
    wb.appendChild(lb);
    [2, 3, 5, 8, 10].forEach(kv => {
      const btn = document.createElement('button');
      btn.textContent = String(kv);
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (kv === K) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        K = kv; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 56, padR = 24, padT = 40, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Histogram bins
      const nBins = 50;
      const xMin = -5, xMax = 5;
      const bins = new Array(nBins).fill(0);
      cachedData.forEach(x => {
        const idx = Math.floor((x - xMin) / (xMax - xMin) * nBins);
        if (idx >= 0 && idx < nBins) bins[idx]++;
      });
      const histMax = Math.max(...bins);

      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - y / (histMax * 1.1)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, yToPix(0)); ctx.lineTo(w-padR, yToPix(0)); ctx.stroke();

      // Histogram
      ctx.fillStyle = '#60a5fa';
      ctx.globalAlpha = 0.4;
      const binW = innerW / nBins;
      for (let i = 0; i < nBins; i++) {
        const x = xMin + (i + 0.5) * (xMax - xMin) / nBins;
        const top = yToPix(bins[i]);
        ctx.fillRect(xToPix(x) - binW/2, top, binW * 0.9, yToPix(0) - top);
      }
      ctx.globalAlpha = 1;

      // GMM fit
      const fit = fitKGaussians(cachedData, K);
      const numPts = 200;
      const colors = ['#ef4444','#10b981','#f59e0b','#a78bfa','#fb7185','#22d3ee','#fbbf24','#84cc16','#06b6d4','#d946ef'];

      for (let k = 0; k < K; k++) {
        ctx.strokeStyle = colors[k % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < numPts; i++) {
          const x = xMin + (xMax - xMin) * i / (numPts - 1);
          const pdf = fit.weights[k] * Math.exp(-0.5 * Math.pow((x - fit.mus[k]) / fit.sigmas[k], 2)) / (fit.sigmas[k] * Math.sqrt(2 * Math.PI));
          // Scale to histogram counts
          const yScaled = pdf * cachedData.length * (xMax - xMin) / nBins;
          if (i === 0) ctx.moveTo(xToPix(x), yToPix(yScaled));
          else ctx.lineTo(xToPix(x), yToPix(yScaled));
        }
        ctx.stroke();
      }

      // Mixture sum (black)
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let i = 0; i < numPts; i++) {
        const x = xMin + (xMax - xMin) * i / (numPts - 1);
        let sum = 0;
        for (let k = 0; k < K; k++) {
          sum += fit.weights[k] * Math.exp(-0.5 * Math.pow((x - fit.mus[k]) / fit.sigmas[k], 2)) / (fit.sigmas[k] * Math.sqrt(2 * Math.PI));
        }
        const yScaled = sum * cachedData.length * (xMax - xMin) / nBins;
        if (i === 0) ctx.moveTo(xToPix(x), yToPix(yScaled));
        else ctx.lineTo(xToPix(x), yToPix(yScaled));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      for (let xv = xMin; xv <= xMax; xv += 1) {
        ctx.fillText(xv.toString(), xToPix(xv), h - padB + 6);
      }

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`GMM Decomposition (Eq 7) · K=${K}`, w/2, 4);

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('divergence value', w/2, h - 8);
      ctx.fillText('blue bars = histogram · colored curves = K Gaussians · dashed black = mixture', w/2, padT - 8);

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
