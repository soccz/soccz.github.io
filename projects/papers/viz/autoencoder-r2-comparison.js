/* viz: autoencoder-r2-comparison
 * paper Tables 1, 2 재현 — Total R² and Predictive R² across K.
 * Gu, Kelly, Xiu (2021).
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 1 (Total R² %, r_t individual stocks) */
  const TOTAL = {
    'FF':   [ 4.8,  4.6,  3.4,  0.1, -2.3, -6.1],
    'PCA':  [ 7.3,  3.3,  5.0,  5.3,  4.2,  3.9],
    'IPCA': [11.2, 12.4, 13.3, 13.7, 14.3, 14.5],
    'CA0':  [10.9, 11.8, 12.3, 12.2, 12.5, 12.4],
    'CA1':  [10.4, 11.5, 12.2, 12.9, 13.4, 14.3],
    'CA2':  [10.7, 11.8, 12.6, 13.2, 13.6, 13.8],
    'CA3':  [10.7, 11.8, 12.5, 13.3, 13.7, 13.8]
  };

  /* paper Table 2 (Predictive R² %, r_t individual stocks). <0 represented as -0.05 for plot. */
  const PRED = {
    'FF':   [0.08, 0.08, -0.05, -0.05, -0.05, -0.05],
    'PCA':  [-0.05, -0.05, -0.05, -0.05, -0.05, -0.05],
    'IPCA': [0.10, 0.10, 0.23, 0.31, 0.31, 0.30],
    'CA0':  [0.11, 0.11, 0.23, 0.25, 0.27, 0.27],
    'CA1':  [0.13, 0.17, 0.45, 0.52, 0.56, 0.53],
    'CA2':  [0.15, 0.17, 0.50, 0.57, 0.57, 0.58],
    'CA3':  [0.14, 0.17, 0.52, 0.55, 0.54, 0.57]
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

  VIZ_REGISTRY['autoencoder-r2-comparison'] = function (canvas, controls, params) {
    let metric = params.metric || 'pred'; // total | pred
    let activeModels = new Set(['FF', 'PCA', 'IPCA', 'CA1', 'CA2', 'CA3']);

    /* metric buttons */
    const wrap1 = document.createElement('label');
    const lab1 = document.createElement('span');
    lab1.textContent = 'R² type';
    wrap1.appendChild(lab1);
    [
      { id: 'total', name: 'Total R²' },
      { id: 'pred',  name: 'Predictive R²' }
    ].forEach(opt => {
      const b = document.createElement('button');
      b.textContent = opt.name;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (opt.id === metric) {
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
        metric = opt.id;
        draw();
      });
      wrap1.appendChild(b);
    });
    controls.appendChild(wrap1);

    /* model toggles */
    const wrap2 = document.createElement('label');
    const lab2 = document.createElement('span');
    lab2.textContent = 'Models';
    wrap2.appendChild(lab2);
    MODELS.forEach(m => {
      const b = document.createElement('button');
      b.textContent = m;
      const isOn = activeModels.has(m);
      b.style.cssText = 'margin-left:4px;padding:3px 8px;border-radius:5px;border:1px solid var(--border);cursor:pointer;font-family:inherit;font-size:0.78rem;';
      const setStyle = (on) => {
        if (on) {
          b.style.background = COLORS[m];
          b.style.color = '#fff';
          b.style.borderColor = COLORS[m];
        } else {
          b.style.background = 'var(--surface)';
          b.style.color = 'var(--text-secondary)';
          b.style.borderColor = 'var(--border)';
        }
      };
      setStyle(isOn);
      b.addEventListener('click', () => {
        if (activeModels.has(m)) activeModels.delete(m);
        else activeModels.add(m);
        setStyle(activeModels.has(m));
        draw();
      });
      wrap2.appendChild(b);
    });
    controls.appendChild(wrap2);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const data = metric === 'total' ? TOTAL : PRED;
      const isTotal = metric === 'total';

      const padL = 60, padR = 110, padT = 38, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = isTotal ? -8 : -0.1;
      const yMax = isTotal ? 16 : 0.65;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;
      const xToPix = (k) => padL + (k - 1) / 5 * innerW;

      /* horizontal grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = isTotal ? [-8, -4, 0, 4, 8, 12, 16] : [-0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
      ySteps.forEach(yv => {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(padL + innerW, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      /* y labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ySteps.forEach(yv => {
        ctx.fillText(isTotal ? yv.toFixed(0) : yv.toFixed(2), padL - 8, yToPix(yv));
      });

      /* x labels (K=1..6) */
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let k = 1; k <= 6; k++) {
        ctx.fillStyle = U.text();
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText('K=' + k, xToPix(k), h - padB + 6);
      }

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText((isTotal ? 'Total R² (%)' : 'Predictive R² (%)') + '  — OOS individual stocks', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(isTotal ? 'paper Table 1 · Total R² across K' : 'paper Table 2 · Predictive R² across K',
                   padL + innerW / 2, padT - 26);

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(padL + innerW, h - padB);
      ctx.stroke();

      /* lines */
      MODELS.forEach(m => {
        if (!activeModels.has(m)) return;
        ctx.strokeStyle = COLORS[m];
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let k = 1; k <= 6; k++) {
          const x = xToPix(k);
          const y = yToPix(data[m][k - 1]);
          if (k === 1) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        /* dots */
        ctx.fillStyle = COLORS[m];
        for (let k = 1; k <= 6; k++) {
          ctx.beginPath();
          ctx.arc(xToPix(k), yToPix(data[m][k - 1]), 3.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      /* legend (right side) */
      let ly = padT;
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      MODELS.forEach(m => {
        if (!activeModels.has(m)) return;
        const v = data[m][5];
        ctx.fillStyle = COLORS[m];
        ctx.fillRect(padL + innerW + 16, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText(m + (isTotal ? ` (${v.toFixed(1)})` : ` (${v.toFixed(2)})`),
                     padL + innerW + 30, ly + 1);
        ly += 18;
      });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
