/* viz: autoencoder-sim-table6
 * paper Table 6 재현 — Monte Carlo simulation Total/Pred R² for Linear vs Nonlinear DGP.
 * Gu, Kelly, Xiu (2021).
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 6 (Total R² %, Linear DGP a) */
  const TOTAL_A = {
    'PCA':  [ 3.5,  4.7,  5.5,  6.3,  7.1,  7.8],
    'IPCA': [18.6, 32.2, 40.7, 41.0, 41.4, 41.7],
    'CA0':  [15.6, 26.7, 33.7, 33.5, 33.4, 33.2],
    'CA1':  [17.6, 30.3, 38.1, 37.7, 37.3, 37.1],
    'CA2':  [17.7, 29.2, 36.8, 36.5, 36.3, 35.9],
    'CA3':  [17.6, 25.6, 30.0, 29.5, 29.3, 23.4]
  };
  const PRED_A = {
    'PCA':  [0.17, 0.10, 0.04, 0.01, -0.01, -0.03],
    'IPCA': [2.20, 2.93, 3.33, 3.32, 3.32, 3.32],
    'CA0':  [2.04, 2.84, 3.17, 3.14, 3.12, 3.13],
    'CA1':  [2.11, 2.93, 3.27, 3.29, 3.26, 3.26],
    'CA2':  [2.10, 2.85, 3.22, 3.22, 3.23, 3.22],
    'CA3':  [2.06, 2.57, 2.89, 2.86, 2.58, 2.39]
  };
  /* Nonlinear DGP b */
  const TOTAL_B = {
    'PCA':  [ 3.4,  5.1,  6.0,  6.6,  7.3,  7.9],
    'IPCA': [11.0, 11.4, 11.9, 12.3, 12.7, 13.1],
    'CA0':  [ 8.5,  8.2,  7.9,  7.6,  7.4,  7.2],
    'CA1':  [15.0, 24.6, 31.8, 32.0, 31.9, 31.8],
    'CA2':  [15.7, 23.5, 30.9, 31.8, 30.2, 28.2],
    'CA3':  [15.9, 15.6, 14.6, 14.0, 11.2,  9.2]
  };
  const PRED_B = {
    'PCA':  [0.15, 0.19, 0.15, 0.12, 0.10, 0.09],
    'IPCA': [0.84, 0.82, 0.81, 0.80, 0.79, 0.79],
    'CA0':  [0.80, 0.81, 0.77, 0.76, 0.72, 0.70],
    'CA1':  [1.83, 2.31, 2.70, 2.70, 2.71, 2.73],
    'CA2':  [1.95, 2.24, 2.73, 2.80, 2.69, 2.53],
    'CA3':  [1.77, 1.43, 1.32, 1.06, 1.06, 0.86]
  };

  const MODELS = ['PCA', 'IPCA', 'CA0', 'CA1', 'CA2', 'CA3'];
  const COLORS = {
    'PCA':  '#94a3b8',
    'IPCA': '#60a5fa',
    'CA0':  '#a78bfa',
    'CA1':  '#f59e0b',
    'CA2':  '#ef4444',
    'CA3':  '#10b981'
  };

  VIZ_REGISTRY['autoencoder-sim-table6'] = function (canvas, controls, params) {
    let dgp = params.dgp || 'b'; // a (Linear) | b (Nonlinear)
    let metric = params.metric || 'total'; // total | pred

    const wrap1 = document.createElement('label');
    const lab1 = document.createElement('span');
    lab1.textContent = 'DGP';
    wrap1.appendChild(lab1);
    [
      { id: 'a', name: '(a) Linear' },
      { id: 'b', name: '(b) Nonlinear' }
    ].forEach(opt => {
      const b = document.createElement('button');
      b.textContent = opt.name;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (opt.id === dgp) {
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
        dgp = opt.id;
        draw();
      });
      wrap1.appendChild(b);
    });
    controls.appendChild(wrap1);

    const wrap2 = document.createElement('label');
    const lab2 = document.createElement('span');
    lab2.textContent = 'R² type';
    wrap2.appendChild(lab2);
    [
      { id: 'total', name: 'Total' },
      { id: 'pred',  name: 'Predictive' }
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
        wrap2.querySelectorAll('button').forEach(x => {
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
      wrap2.appendChild(b);
    });
    controls.appendChild(wrap2);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const data = dgp === 'a' ? (metric === 'total' ? TOTAL_A : PRED_A)
                               : (metric === 'total' ? TOTAL_B : PRED_B);
      const isTotal = metric === 'total';

      const padL = 60, padR = 110, padT = 40, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      let yMin, yMax, ySteps;
      if (isTotal) {
        yMin = 0; yMax = 45;
        ySteps = [0, 10, 20, 30, 40];
      } else {
        yMin = -0.5; yMax = 4.0;
        ySteps = [0, 1, 2, 3, 4];
      }
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;
      const xToPix = (k) => padL + (k - 1) / 5 * innerW;

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
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
        ctx.fillText(yv.toFixed(isTotal ? 0 : 1), padL - 8, yToPix(yv));
      });

      /* x labels */
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
      ctx.fillText(isTotal ? 'Total R² (%) — 100 MC reps' : 'Predictive R² (%) — 100 MC reps', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const dgpName = dgp === 'a'
        ? 'DGP (a): g*(c) = (1.2 × 2c₁, c₂, 0.8c₃)\' — Linear'
        : 'DGP (b): g*(c) = (c₁, 2·c₁·c₂, 0.6·sgn(c₃))\' — Nonlinear';
      ctx.fillText(dgpName, padL + innerW / 2, padT - 28);

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

        ctx.fillStyle = COLORS[m];
        for (let k = 1; k <= 6; k++) {
          ctx.beginPath();
          ctx.arc(xToPix(k), yToPix(data[m][k - 1]), 3.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      /* legend */
      let ly = padT;
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      MODELS.forEach(m => {
        const v = data[m][2]; // K=3 (true K)
        ctx.fillStyle = COLORS[m];
        ctx.fillRect(padL + innerW + 16, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText(m + ` (${v.toFixed(isTotal ? 1 : 2)})`, padL + innerW + 30, ly + 1);
        ly += 18;
      });

      /* K=3 annotation (true K) */
      ctx.strokeStyle = U.cssVar('--accent', '#ef4444');
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(xToPix(3), padT);
      ctx.lineTo(xToPix(3), h - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.cssVar('--accent', '#ef4444');
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('true K=3', xToPix(3), padT - 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
