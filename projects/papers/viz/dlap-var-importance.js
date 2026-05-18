/* viz: dlap-var-importance
 * Chen-Pelger-Zhu (2021) paper Fig 11 / 12 재현 — 46 firm chars variable importance.
 * GAN vs FFN toggle.
 *
 * Values are approximate from paper Figs 11-12 visual reading.
 * Categories from paper Table A.II.
 */

(function () {
  const U = window.VIZ_UTIL;

  // Categories
  const CAT = {
    'Past Returns':       '#f59e0b',
    'Trading Frictions':  '#ef4444',
    'Investment':         '#10b981',
    'Profitability':      '#3b82f6',
    'Value':              '#8b5cf6',
    'Intangibles':        '#94a3b8'
  };

  // 46 chars × { GAN importance, FFN importance, category }
  // Values normalized so sum = 1 per model.
  // Source: paper Fig 11 (GAN) and Fig 12 (FFN), visual reading.
  const CHARS = [
    // GAN top order from Fig 11 (approximate)
    { name: 'ST_REV',   cat: 'Past Returns',      GAN: 0.041, FFN: 0.084 },
    { name: 'SUV',      cat: 'Trading Frictions', GAN: 0.038, FFN: 0.078 },
    { name: 'r12_2',    cat: 'Past Returns',      GAN: 0.034, FFN: 0.066 },
    { name: 'NOA',      cat: 'Investment',        GAN: 0.032, FFN: 0.014 },
    { name: 'SGA2S',    cat: 'Profitability',     GAN: 0.030, FFN: 0.022 },
    { name: 'LME',      cat: 'Trading Frictions', GAN: 0.029, FFN: 0.054 },
    { name: 'RNA',      cat: 'Profitability',     GAN: 0.028, FFN: 0.030 },
    { name: 'LTurnover',cat: 'Trading Frictions', GAN: 0.027, FFN: 0.046 },
    { name: 'Lev',      cat: 'Trading Frictions', GAN: 0.026, FFN: 0.018 },
    { name: 'Resid_Var',cat: 'Trading Frictions', GAN: 0.026, FFN: 0.040 },
    { name: 'ROA',      cat: 'Profitability',     GAN: 0.025, FFN: 0.026 },
    { name: 'E2P',      cat: 'Value',             GAN: 0.024, FFN: 0.020 },
    { name: 'D2P',      cat: 'Value',             GAN: 0.024, FFN: 0.018 },
    { name: 'Spread',   cat: 'Trading Frictions', GAN: 0.023, FFN: 0.036 },
    { name: 'CF2P',     cat: 'Value',             GAN: 0.023, FFN: 0.038 },
    { name: 'BEME',     cat: 'Value',             GAN: 0.022, FFN: 0.020 },
    { name: 'Variance', cat: 'Trading Frictions', GAN: 0.022, FFN: 0.030 },
    { name: 'D2A',      cat: 'Investment',        GAN: 0.021, FFN: 0.011 },
    { name: 'PCM',      cat: 'Trading Frictions', GAN: 0.021, FFN: 0.018 },
    { name: 'A2ME',     cat: 'Value',             GAN: 0.020, FFN: 0.020 },
    { name: 'AT',       cat: 'Intangibles',       GAN: 0.020, FFN: 0.030 },
    { name: 'Rel2High', cat: 'Trading Frictions', GAN: 0.020, FFN: 0.038 },
    { name: 'CF',       cat: 'Value',             GAN: 0.019, FFN: 0.010 },
    { name: 'Q',        cat: 'Value',             GAN: 0.019, FFN: 0.016 },
    { name: 'Investment',cat: 'Investment',       GAN: 0.018, FFN: 0.014 },
    { name: 'PM',       cat: 'Profitability',     GAN: 0.018, FFN: 0.026 },
    { name: 'DPI2A',    cat: 'Investment',        GAN: 0.018, FFN: 0.014 },
    { name: 'ROE',      cat: 'Profitability',     GAN: 0.017, FFN: 0.016 },
    { name: 'S2P',      cat: 'Value',             GAN: 0.017, FFN: 0.018 },
    { name: 'FC2Y',     cat: 'Profitability',     GAN: 0.017, FFN: 0.034 },
    { name: 'AC',       cat: 'Investment',        GAN: 0.016, FFN: 0.012 },
    { name: 'CTO',      cat: 'Profitability',     GAN: 0.016, FFN: 0.016 },
    { name: 'LT_Rev',   cat: 'Past Returns',      GAN: 0.015, FFN: 0.014 },
    { name: 'OP',       cat: 'Profitability',     GAN: 0.015, FFN: 0.018 },
    { name: 'PROF',     cat: 'Profitability',     GAN: 0.014, FFN: 0.018 },
    { name: 'IdioVol',  cat: 'Intangibles',       GAN: 0.014, FFN: 0.034 },
    { name: 'r12_7',    cat: 'Past Returns',      GAN: 0.013, FFN: 0.022 },
    { name: 'Beta',     cat: 'Intangibles',       GAN: 0.013, FFN: 0.046 },
    { name: 'OA',       cat: 'Investment',        GAN: 0.013, FFN: 0.018 },
    { name: 'ATO',      cat: 'Profitability',     GAN: 0.012, FFN: 0.018 },
    { name: 'MktBeta',  cat: 'Intangibles',       GAN: 0.012, FFN: 0.014 },
    { name: 'OL',       cat: 'Intangibles',       GAN: 0.011, FFN: 0.018 },
    { name: 'C',        cat: 'Value',             GAN: 0.011, FFN: 0.008 },
    { name: 'r36_13',   cat: 'Past Returns',      GAN: 0.010, FFN: 0.016 },
    { name: 'NI',       cat: 'Investment',        GAN: 0.010, FFN: 0.018 },
    { name: 'r2_1',     cat: 'Past Returns',      GAN: 0.009, FFN: 0.054 }
  ];

  VIZ_REGISTRY['dlap-var-importance'] = function (canvas, controls, params) {
    let model = params.model || 'GAN';
    let showTop = parseInt(params.top || '20', 10);

    /* model buttons */
    const w1 = document.createElement('label');
    const l1 = document.createElement('span'); l1.textContent = 'Model';
    w1.appendChild(l1);
    ['GAN', 'FFN'].forEach(m => {
      const b = document.createElement('button');
      b.textContent = m;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (m === model) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        w1.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        model = m; draw();
      });
      w1.appendChild(b);
    });
    controls.appendChild(w1);

    /* top-K slider */
    U.addSlider(controls, {
      label: 'Show top',
      min: 10, max: 46, step: 2, value: showTop,
      fmt: (v) => Math.round(parseFloat(v)) + ' chars',
      onInput: (v) => { showTop = Math.round(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      // Sort by current model
      const sorted = [...CHARS].sort((a, b) => b[model] - a[model]).slice(0, showTop);

      const padL = 100, padR = 130, padT = 50, padB = 40;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const maxImp = sorted[0][model];
      const xMax = maxImp * 1.15;

      const xToPix = (x) => padL + (x / xMax) * innerW;
      const rowH = innerH / sorted.length;

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Fig ${model === 'GAN' ? '11' : '12'} · Variable Importance · ${model} · Top ${showTop}`,
                   w / 2, padT - 36);
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      const note = model === 'GAN'
        ? 'GAN uses all 6 categories — no-arbitrage forces diversity'
        : 'FFN concentrates on trading frictions + past returns — suspect penny stock fitting';
      ctx.fillText(note, w / 2, padT - 18);

      /* bars */
      const fontSize = Math.max(8, Math.min(11, rowH - 4));
      ctx.font = '600 ' + fontSize + 'px ' + U.cssVar('--font-display', 'Inter, sans-serif');

      sorted.forEach((c, i) => {
        const y = padT + i * rowH;
        const barH = rowH - 2;
        const bw = xToPix(c[model]) - padL;

        // bar
        ctx.fillStyle = CAT[c.cat];
        ctx.fillRect(padL, y, bw, barH);

        // char name (left)
        ctx.fillStyle = U.text();
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(c.name, padL - 6, y + barH / 2);

        // value (right of bar)
        ctx.fillStyle = U.textMuted();
        ctx.font = (fontSize - 1) + 'px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(c[model].toFixed(3), padL + bw + 4, y + barH / 2);
        ctx.font = '600 ' + fontSize + 'px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      });

      /* legend (right side) */
      let ly = padT;
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      Object.entries(CAT).forEach(([cat, color]) => {
        ctx.fillStyle = color;
        ctx.fillRect(padL + innerW + 18, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText(cat, padL + innerW + 32, ly + 1);
        ly += 18;
      });

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(padL + innerW, h - padB);
      ctx.stroke();

      /* x axis label */
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Sensitivity (normalized, sum = 1)', padL + innerW / 2, h - padB + 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
