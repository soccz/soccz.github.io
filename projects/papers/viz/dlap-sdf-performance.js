/* viz: dlap-sdf-performance
 * Chen-Pelger-Zhu (2021) paper Table I 재현 — 4 SDF models × 3 metrics × 3 samples.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table I exact values */
  const DATA = {
    SR: {
      LS:  { Train: 1.80, Valid: 0.58, Test: 0.42 },
      EN:  { Train: 1.37, Valid: 1.15, Test: 0.50 },
      FFN: { Train: 0.45, Valid: 0.42, Test: 0.44 },
      GAN: { Train: 2.68, Valid: 1.43, Test: 0.75 }
    },
    EV: {
      LS:  { Train: 0.09, Valid: 0.03, Test: 0.03 },
      EN:  { Train: 0.12, Valid: 0.05, Test: 0.04 },
      FFN: { Train: 0.11, Valid: 0.04, Test: 0.04 },
      GAN: { Train: 0.20, Valid: 0.09, Test: 0.08 }
    },
    'XS-R²': {
      LS:  { Train: 0.15, Valid: 0.00, Test: 0.14 },
      EN:  { Train: 0.17, Valid: 0.02, Test: 0.19 },
      FFN: { Train: 0.14, Valid: -0.00, Test: 0.15 },
      GAN: { Train: 0.12, Valid: 0.01, Test: 0.23 }
    }
  };

  const MODELS = ['LS', 'EN', 'FFN', 'GAN'];
  const SAMPLES = ['Train', 'Valid', 'Test'];
  const COLORS = {
    LS:  '#9ca3af',
    EN:  '#60a5fa',
    FFN: '#f59e0b',
    GAN: '#ef4444'
  };

  VIZ_REGISTRY['dlap-sdf-performance'] = function (canvas, controls, params) {
    let metric = params.metric || 'SR';
    let sample = params.sample || 'Test';

    /* metric buttons */
    const w1 = document.createElement('label');
    const l1 = document.createElement('span'); l1.textContent = 'Metric';
    w1.appendChild(l1);
    Object.keys(DATA).forEach(m => {
      const b = document.createElement('button');
      b.textContent = m;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (m === metric) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        w1.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        metric = m; draw();
      });
      w1.appendChild(b);
    });
    controls.appendChild(w1);

    /* sample buttons */
    const w2 = document.createElement('label');
    const l2 = document.createElement('span'); l2.textContent = 'Sample';
    w2.appendChild(l2);
    SAMPLES.forEach(s => {
      const b = document.createElement('button');
      b.textContent = s;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (s === sample) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        w2.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        sample = s; draw();
      });
      w2.appendChild(b);
    });
    controls.appendChild(w2);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 28, padT = 38, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const data = DATA[metric];
      const vals = MODELS.map(m => data[m][sample]);

      let yMin = 0, yMax = 1;
      if (metric === 'SR') { yMin = -0.2; yMax = Math.max(...vals, 3.0) * 1.1; }
      else if (metric === 'EV') { yMin = -0.02; yMax = 0.25; }
      else if (metric === 'XS-R²') { yMin = -0.05; yMax = 0.30; }

      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = metric === 'SR' ? [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0] : (metric === 'EV' ? [0, 0.05, 0.10, 0.15, 0.20, 0.25] : [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30]);
      ySteps.forEach(yv => {
        if (yv < yMin || yv > yMax) return;
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      /* y-axis labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ySteps.forEach(yv => {
        if (yv < yMin || yv > yMax) return;
        const fmt = metric === 'SR' ? yv.toFixed(1) : yv.toFixed(2);
        ctx.fillText(fmt, padL - 8, yToPix(yv));
      });

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const yLabel = metric === 'SR' ? 'Sharpe Ratio (monthly)' : (metric === 'EV' ? 'Explained Variation' : 'Cross-Sectional R²');
      ctx.fillText(yLabel, 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const sampleLabel = sample === 'Test' ? 'Test (OOS 1992–2016)' : (sample === 'Valid' ? 'Validation (1987–1991)' : 'Training (1967–1986)');
      ctx.fillText(`paper Table I · ${metric} · ${sampleLabel}`, w / 2, padT - 24);

      /* bars */
      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.6;

      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = data[m][sample];
        const top = yToPix(Math.max(v, 0));
        const bot = yToPix(Math.min(v, 0));
        const barH = bot - top;

        ctx.fillStyle = COLORS[m];
        ctx.globalAlpha = 0.92;
        ctx.fillRect(cx - barW / 2, top, barW, barH);
        ctx.globalAlpha = 1;

        const labY = v >= 0 ? top - 6 : bot + 14;
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const fmtVal = metric === 'SR' ? v.toFixed(2) : v.toFixed(2);
        ctx.fillText(fmtVal, cx, labY);

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
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
