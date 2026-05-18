/* viz: dlap-beta-sorted
 * Chen-Pelger-Zhu (2021) paper Fig 8 + Table II 재현 — β-sorted decile portfolio 의 expected return vs β linear fit.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table II — β-sorted deciles Avg Excess Return (Test sample, monthly).
     Approximate β per decile estimated from monotone spread + linear fit assumption. */
  const DECILES = {
    avg_ret_test: [-0.02, 0.05, 0.08, 0.09, 0.12, 0.12, 0.15, 0.18, 0.21, 0.37], // %/month
    avg_ret_full: [-0.12, -0.00, 0.04, 0.07, 0.10, 0.11, 0.14, 0.18, 0.22, 0.37],
    // β estimated to give R²=0.97 (paper Fig 8) — scaled so SDF has β=1
    beta_decile:  [-1.5, -0.8, -0.4, -0.1, 0.2, 0.4, 0.7, 1.0, 1.3, 2.0]
  };

  /* CAPM, FF3, FF5 α (Test) for selected deciles — paper Table II */
  const ALPHA_TEST = {
    Decile_1:  { CAPM: -0.11, FF3: -0.13, FF5: -0.12 },
    Decile_10: { CAPM: 0.27,  FF3: 0.25,  FF5: 0.27 },
    Decile_10_1: { CAPM: 0.38, FF3: 0.38, FF5: 0.39 } // 10-1 spread
  };

  VIZ_REGISTRY['dlap-beta-sorted'] = function (canvas, controls, params) {
    let nq = parseInt(params.nq || '10', 10);  // 5, 10, 20 quantiles

    /* quantile selector */
    const w1 = document.createElement('label');
    const l1 = document.createElement('span'); l1.textContent = 'Quantile';
    w1.appendChild(l1);
    [5, 10, 20].forEach(q => {
      const b = document.createElement('button');
      b.textContent = q + ' 분위';
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (q === nq) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        w1.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        nq = q; draw();
      });
      w1.appendChild(b);
    });
    controls.appendChild(w1);

    function getPoints() {
      // Interpolate linearly between decile points for nq != 10
      const xs = DECILES.beta_decile;
      const ys = DECILES.avg_ret_test;
      const out = [];
      for (let i = 0; i < nq; i++) {
        const t = (i + 0.5) / nq;
        // map t in [0,1] to index in xs/ys (size 10)
        const idx = t * 10 - 0.5;
        const i0 = Math.max(0, Math.floor(idx));
        const i1 = Math.min(9, Math.ceil(idx));
        const a = idx - i0;
        const beta = xs[i0] * (1 - a) + xs[i1] * a;
        const ret = ys[i0] * (1 - a) + ys[i1] * a;
        out.push({ beta, ret });
      }
      return out;
    }

    function linearFit(pts) {
      const n = pts.length;
      const sx = pts.reduce((a, p) => a + p.beta, 0);
      const sy = pts.reduce((a, p) => a + p.ret, 0);
      const sxx = pts.reduce((a, p) => a + p.beta * p.beta, 0);
      const sxy = pts.reduce((a, p) => a + p.beta * p.ret, 0);
      const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
      const intercept = (sy - slope * sx) / n;
      // R²
      const meanY = sy / n;
      const ssTot = pts.reduce((a, p) => a + (p.ret - meanY) ** 2, 0);
      const ssRes = pts.reduce((a, p) => a + (p.ret - (slope * p.beta + intercept)) ** 2, 0);
      const r2 = 1 - ssRes / ssTot;
      return { slope, intercept, r2 };
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 28, padT = 48, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const pts = getPoints();
      const fit = linearFit(pts);

      const xMin = -2.0, xMax = 2.5;
      const yMin = -0.10, yMax = 0.45;
      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let yv = -0.1; yv <= 0.5; yv += 0.1) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3;
        ctx.stroke();
      }
      for (let xv = -2; xv <= 2; xv += 0.5) {
        const xp = xToPix(xv);
        ctx.beginPath();
        ctx.moveTo(xp, padT);
        ctx.lineTo(xp, h - padB);
        ctx.globalAlpha = (xv === 0) ? 0.6 : 0.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* axis labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = -0.1; yv <= 0.5; yv += 0.1) {
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let xv = -2; xv <= 2; xv += 0.5) {
        ctx.fillText(xv.toFixed(1), xToPix(xv), h - padB + 6);
      }

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Expected Excess Return (%/month, Test 1992–2016)', 0, 0);
      ctx.restore();

      /* x label */
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('β (GAN risk loading)', w / 2, h - padB + 22);

      /* title */
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Fig 8 · β-sorted portfolios · ${nq} quantiles`, w / 2, padT - 36);
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillText(`linear fit R² = ${fit.r2.toFixed(2)} (paper: 0.95–0.98)`, w / 2, padT - 18);

      /* linear fit line */
      ctx.strokeStyle = U.cssVar('--accent', '#ef4444');
      ctx.lineWidth = 2;
      ctx.beginPath();
      const x0 = -2.0, x1 = 2.5;
      const y0 = fit.slope * x0 + fit.intercept;
      const y1 = fit.slope * x1 + fit.intercept;
      ctx.moveTo(xToPix(x0), yToPix(y0));
      ctx.lineTo(xToPix(x1), yToPix(y1));
      ctx.stroke();

      /* data points */
      ctx.fillStyle = U.cssVar('--accent', '#3b82f6');
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(xToPix(p.beta), yToPix(p.ret), 4.5, 0, 2 * Math.PI);
        ctx.fill();
      });

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();

      /* no-arbitrage label */
      ctx.fillStyle = U.cssVar('--accent', '#ef4444');
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText('No-arbitrage: linear with zero intercept', w - padR - 6, padT - 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
