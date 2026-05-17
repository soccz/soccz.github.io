/* viz: autoencoder-sharpe-table
 * paper Table 3 재현 — long-short decile Sharpe (EW + VW), 7 models × 6 K.
 * Gu, Kelly, Xiu (2021).
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 3 exact values (annualized Sharpe ratio) */
  const DATA_EW = {
    'FF':    [-0.66, -0.85, -0.40, -0.30,  0.36, -0.21],
    'PCA':   [ 0.28,  0.09,  0.13, -0.08, -0.12,  0.15],
    'IPCA':  [ 0.20,  0.19,  1.26,  2.16,  2.31,  2.25],
    'CA0':   [ 0.23,  0.32,  1.34,  1.87,  2.10,  2.18],
    'CA1':   [ 0.30,  0.39,  2.12,  2.63,  2.67,  2.60],
    'CA2':   [ 0.30,  0.38,  2.16,  2.64,  2.68,  2.63],
    'CA3':   [ 0.31,  0.38,  2.19,  2.57,  2.57,  2.59]
  };
  const DATA_VW = {
    'FF':    [-0.82, -1.13, -0.69, -0.60,  0.18, -0.53],
    'PCA':   [ 0.12, -0.18,  0.05, -0.10, -0.30, -0.08],
    'IPCA':  [-0.15, -0.07,  0.59,  0.81,  1.05,  0.96],
    'CA0':   [-0.11, -0.03,  0.41,  0.81,  0.83,  0.88],
    'CA1':   [-0.03,  0.11,  0.91,  1.30,  1.48,  1.40],
    'CA2':   [-0.03,  0.08,  0.92,  1.39,  1.45,  1.53],
    'CA3':   [-0.02,  0.08,  1.09,  1.41,  1.34,  1.51]
  };

  const MODELS = ['FF', 'PCA', 'IPCA', 'CA0', 'CA1', 'CA2', 'CA3'];
  const COLORS = {
    'FF':   '#9ca3af',
    'PCA':  '#94a3b8',
    'IPCA': '#60a5fa',
    'CA0':  '#a78bfa',
    'CA1':  '#f59e0b',
    'CA2':  '#ef4444',
    'CA3':  '#10b981'
  };

  VIZ_REGISTRY['autoencoder-sharpe-table'] = function (canvas, controls, params) {
    let weight = params.weight || 'VW'; // EW | VW
    let K = parseInt(params.K || '6', 10);

    /* weight buttons */
    const wrap1 = document.createElement('label');
    const lab1 = document.createElement('span');
    lab1.textContent = 'Portfolio';
    wrap1.appendChild(lab1);
    ['EW', 'VW'].forEach(w => {
      const b = document.createElement('button');
      b.textContent = w;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (w === weight) {
        b.style.background = U.accent();
        b.style.color = '#fff';
        b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        wrap1.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)';
          x.style.color = 'var(--text-secondary)';
          x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent();
        b.style.color = '#fff';
        b.style.borderColor = U.accent();
        weight = w;
        draw();
      });
      wrap1.appendChild(b);
    });
    controls.appendChild(wrap1);

    /* K slider */
    U.addSlider(controls, {
      label: '요인 수 K',
      min: 1, max: 6, step: 1, value: K,
      fmt: (v) => 'K=' + Math.round(parseFloat(v)),
      onInput: (v) => { K = Math.round(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const data = weight === 'EW' ? DATA_EW : DATA_VW;

      const padL = 64, padR = 28, padT = 36, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = -1.2, yMax = 3.0;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;
      const zeroY = yToPix(0);

      /* horizontal grid lines */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let yv = -1; yv <= 3; yv += 0.5) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* y-axis labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = -1; yv <= 3; yv += 0.5) {
        ctx.fillText(yv.toFixed(1), padL - 8, yToPix(yv));
      }

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Annualized Sharpe Ratio (OOS 1987–2016)', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`${weight} long–short decile spread · K = ${K}`, w / 2, padT - 22);

      /* bars */
      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.6;

      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = data[m][K - 1];
        const top = yToPix(Math.max(v, 0));
        const bot = yToPix(Math.min(v, 0));
        const barH = bot - top;

        ctx.fillStyle = COLORS[m];
        ctx.globalAlpha = 0.92;
        ctx.fillRect(cx - barW / 2, top, barW, barH);
        ctx.globalAlpha = 1;

        /* value label */
        const labY = v >= 0 ? top - 6 : bot + 14;
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(2), cx, labY);

        /* model name */
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

      /* annotation: best model */
      const best = MODELS.reduce((b, m) => data[m][K - 1] > data[b][K - 1] ? m : b, 'FF');
      const bestV = data[best][K - 1];
      ctx.fillStyle = U.accent ? U.accent() : '#ef4444';
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(`Best: ${best} (${bestV.toFixed(2)})`, w - padR, padT - 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
