/* viz: autoencoder-table4-tangency
 * paper Table 4 — Factor tangency Portfolio Sharpe Ratio (OOS 1987–2016).
 * 7 models × 6 K. Paper reports a single (volatility-scaled to 1% monthly) set.
 * Gu, Kelly, Xiu (2021).
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 4 exact values (annualized tangency Sharpe, scaled to 1%/mo vol) */
  const DATA = {
    'FF':    [0.51, 0.41, 0.53, 0.71, 0.71, 0.82],
    'PCA':   [0.35, 0.23, 0.25, 0.38, 0.48, 0.55],
    'IPCA':  [0.39, 0.44, 1.81, 3.14, 3.71, 3.72],
    'CA0':   [0.42, 0.48, 1.47, 1.76, 1.94, 1.97],
    'CA1':   [0.56, 0.91, 3.18, 3.82, 3.63, 4.58],
    'CA2':   [0.54, 0.75, 3.56, 4.26, 4.72, 2.77],
    'CA3':   [0.54, 0.77, 3.94, 4.75, 4.94, 4.37]
  };

  const MODELS = ['FF', 'PCA', 'IPCA', 'CA0', 'CA1', 'CA2', 'CA3'];
  const COLORS = {
    'FF': '#9ca3af', 'PCA': '#94a3b8', 'IPCA': '#60a5fa',
    'CA0': '#a78bfa', 'CA1': '#f59e0b', 'CA2': '#ef4444', 'CA3': '#10b981'
  };

  VIZ_REGISTRY['autoencoder-table4-tangency'] = function (canvas, controls, params) {
    let K = parseInt(params.K || '5', 10);

    /* K slider */
    U.addSlider(controls, {
      label: '요인 수 K', min: 1, max: 6, step: 1, value: K,
      fmt: (v) => 'K=' + Math.round(parseFloat(v)),
      onInput: (v) => { K = Math.round(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const data = DATA;

      const padL = 64, padR = 28, padT = 36, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = 0, yMax = 5.5;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* gridlines */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let yv = 0; yv <= 5; yv += 1) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* y labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = 0; yv <= 5; yv += 1) {
        ctx.fillText(yv.toFixed(1), padL - 8, yToPix(yv));
      }

      /* y title */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Annualized Tangency Sharpe (OOS 1987–2016)', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`${weight} Tangency Portfolio · K = ${K}`, w / 2, padT - 22);

      /* bars */
      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.6;
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = data[m][K - 1];
        const top = yToPix(v);
        const bot = yToPix(0);
        const barH = bot - top;

        ctx.fillStyle = COLORS[m];
        ctx.globalAlpha = 0.92;
        ctx.fillRect(cx - barW / 2, top, barW, barH);
        ctx.globalAlpha = 1;

        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(2), cx, top - 8);

        ctx.fillStyle = U.text();
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(m, cx, h - padB + 8);
      });

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();

      /* best 표기 */
      const best = MODELS.reduce((b, m) => data[m][K - 1] > data[b][K - 1] ? m : b, 'FF');
      const bestV = data[best][K - 1];
      ctx.fillStyle = U.accent();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(`Best: ${best} (${bestV.toFixed(2)})`, w - padR, padT - 4);

      /* note */
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('Tangency = 무제약 운용효율 (이론 최대). 실제 운용은 Table 3 (long-short decile).', padL + 4, padT - 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
