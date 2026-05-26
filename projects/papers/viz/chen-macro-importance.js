/* viz: chen-macro-importance - Macroeconomic variable importance */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chen-macro-importance'] = function (canvas, controls, params) {
    let topN = 10;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 16, step: 1, value: 10,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    const macros = [
      { name: 'Term spread', importance: 1.00 },
      { name: 'Default spread', importance: 0.92 },
      { name: 'Inflation', importance: 0.85 },
      { name: 'Industrial production', importance: 0.81 },
      { name: 'Unemployment rate', importance: 0.76 },
      { name: 'Dividend yield', importance: 0.71 },
      { name: 'Earnings yield', importance: 0.67 },
      { name: 'Market vol (VIX)', importance: 0.64 },
      { name: 'TED spread', importance: 0.58 },
      { name: 'Credit growth', importance: 0.54 },
      { name: 'M2 growth', importance: 0.51 },
      { name: 'Oil price change', importance: 0.47 },
      { name: 'Yield curve slope', importance: 0.43 },
      { name: 'PCE inflation', importance: 0.40 },
      { name: 'Real estate', importance: 0.37 },
      { name: 'Consumer sentiment', importance: 0.33 }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Macro Variable Importance (paper §6)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 16 macro indicators by SDF importance`, w/2, 40);

      const padL = 180, padR = 40, padT = 60, padB = 30;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = macros.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;

      visible.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * m.importance;
        const r = Math.round(220 - m.importance * 120);
        const g = Math.round(38 + m.importance * 80);
        const b = Math.round(38 + m.importance * 100);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name, padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 30) ctx.fillText(m.importance.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
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
