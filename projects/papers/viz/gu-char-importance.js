/* viz: gu-char-importance - top characteristics importance */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-char-importance'] = function (canvas, controls, params) {
    let topN = 10;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 20, step: 1, value: 10,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    const chars = [
      { name: 'Size (mvel1)', importance: 1.00 },
      { name: 'BM (Book/Market)', importance: 0.94 },
      { name: 'Momentum (mom12)', importance: 0.91 },
      { name: 'Op profitability', importance: 0.83 },
      { name: 'Investment', importance: 0.77 },
      { name: 'Idio volatility', importance: 0.72 },
      { name: 'Beta market', importance: 0.68 },
      { name: 'Asset growth', importance: 0.65 },
      { name: 'ROA', importance: 0.61 },
      { name: 'Accruals', importance: 0.58 },
      { name: 'Cashflow/Price', importance: 0.55 },
      { name: 'Sales growth', importance: 0.52 },
      { name: 'Earnings yield', importance: 0.49 },
      { name: 'Mom 36-month', importance: 0.46 },
      { name: 'Mom 6-month', importance: 0.44 },
      { name: 'Leverage', importance: 0.42 },
      { name: 'Dividend yield', importance: 0.40 },
      { name: 'Share turnover', importance: 0.38 },
      { name: 'Earnings volatility', importance: 0.36 },
      { name: 'R&D/Sales', importance: 0.34 }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Characteristics Importance (paper §6)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 94 characteristics by importance`, w/2, 40);

      const padL = 160, padR = 40, padT = 60, padB = 30;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = chars.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;

      visible.forEach((c, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * c.importance;
        // Color gradient
        const r = Math.round(220 - c.importance * 100);
        const g = Math.round(38 + c.importance * 100);
        const b = Math.round(38 + c.importance * 100);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(c.name, padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 30) ctx.fillText(c.importance.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Normalized importance', padL + plotW/2, h - 5);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
