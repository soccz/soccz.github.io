/* viz: dlap-macro-ablation
 * Chen-Pelger-Zhu (2021) paper Fig 6 재현 — macro inclusion 의 효과.
 * Hidden states (LSTM) vs No macro vs All macro raw vs UNC.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Fig 6 의 SR values (approximate, 본문 텍스트 기반) */
  const DATA = {
    'Hidden states (LSTM)': {
      LS:  { Train: 1.80, Valid: 0.58, Test: 0.42 },
      EN:  { Train: 1.37, Valid: 1.15, Test: 0.50 },
      FFN: { Train: 0.45, Valid: 0.42, Test: 0.44 },
      GAN: { Train: 2.68, Valid: 1.43, Test: 0.75 }
    },
    'No macro': {
      // GAN no-macro: paper 본문 "~10% lower" than baseline
      LS:  { Train: 1.50, Valid: 0.50, Test: 0.38 },
      EN:  { Train: 1.20, Valid: 1.00, Test: 0.45 },
      FFN: { Train: 0.40, Valid: 0.38, Test: 0.40 },
      GAN: { Train: 2.40, Valid: 1.30, Test: 0.68 }
    },
    'All macro (raw)': {
      // paper Fig 6: "completely collapses"
      LS:  { Train: 0.30, Valid: 0.10, Test: 0.05 },
      EN:  { Train: 0.40, Valid: 0.20, Test: 0.10 },
      FFN: { Train: 0.20, Valid: 0.10, Test: 0.08 },
      GAN: { Train: 0.50, Valid: 0.20, Test: 0.15 }
    },
    'UNC (g=const)': {
      // paper: ~20% lower SR than GAN
      GAN: { Train: 2.10, Valid: 1.15, Test: 0.60 }
    }
  };

  const REGIMES = ['Hidden states (LSTM)', 'No macro', 'All macro (raw)', 'UNC (g=const)'];
  const COLORS = {
    LS:  '#9ca3af',
    EN:  '#60a5fa',
    FFN: '#f59e0b',
    GAN: '#ef4444'
  };

  VIZ_REGISTRY['dlap-macro-ablation'] = function (canvas, controls, params) {
    let sample = params.sample || 'Test';

    /* sample buttons */
    const w1 = document.createElement('label');
    const l1 = document.createElement('span'); l1.textContent = 'Sample';
    w1.appendChild(l1);
    ['Train', 'Valid', 'Test'].forEach(s => {
      const b = document.createElement('button');
      b.textContent = s;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (s === sample) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        w1.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        sample = s; draw();
      });
      w1.appendChild(b);
    });
    controls.appendChild(w1);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 28, padT = 50, padB = 80;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = 0;
      const yMax = sample === 'Train' ? 3.0 : (sample === 'Valid' ? 1.6 : 0.8);
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const step = yMax > 2 ? 0.5 : 0.2;
      for (let yv = 0; yv <= yMax; yv += step) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* y labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = 0; yv <= yMax; yv += step) {
        ctx.fillText(yv.toFixed(1), padL - 8, yToPix(yv));
      }

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Sharpe Ratio (monthly)', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Fig 6 · Macro inclusion effect · ${sample}`, w / 2, padT - 36);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('LSTM hidden states is optimal · all-macro-raw collapses · UNC (g=const) ~20% lower', w / 2, padT - 18);

      /* grouped bars per regime */
      const groupW = innerW / REGIMES.length;
      const modelsInRegime = (r) => Object.keys(DATA[r]);

      REGIMES.forEach((reg, ri) => {
        const cx = padL + groupW * (ri + 0.5);
        const models = modelsInRegime(reg);
        const barW = (groupW * 0.7) / models.length;
        models.forEach((m, mi) => {
          const x = cx - (models.length * barW) / 2 + mi * barW;
          const v = DATA[reg][m][sample];
          const top = yToPix(Math.max(v, 0));
          const bot = yToPix(0);
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = 0.92;
          ctx.fillRect(x, top, barW, bot - top);
          ctx.globalAlpha = 1;

          /* value */
          ctx.fillStyle = U.text();
          ctx.font = '600 9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(2), x + barW / 2, top - 5);
        });

        /* regime label (wrap) */
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const parts = reg.split(' ');
        let y = h - padB + 8;
        let line = '';
        const maxW = groupW - 10;
        parts.forEach((p, i) => {
          const test = line ? line + ' ' + p : p;
          if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, cx, y);
            y += 13;
            line = p;
          } else line = test;
        });
        if (line) ctx.fillText(line, cx, y);
      });

      /* legend (top-right) */
      let lx = w - padR - 130;
      let ly = padT + 6;
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      Object.keys(COLORS).forEach((m, i) => {
        ctx.fillStyle = COLORS[m];
        ctx.fillRect(lx, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText(m, lx + 14, ly + 1);
        lx += 32;
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
