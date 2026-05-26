/* viz: chen-macro-importance — paper §III.F macro variable importance (top 2: Spread + FEDFUNDS) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chen-macro-importance'] = function (canvas, controls, params) {
    let topN = 10;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 16, step: 1, value: 10,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    /* paper §III.F: "The two most relevant variables that stand out in our importance ranking are
       the median bid-ask spread (Spread) and the federal fund rate (FEDFUNDS)."
       Paper also states "most macroeconomic variables have a very similar importance" — so
       most values are flat. Top 2 stand out per paper.
       Values approximate (paper Fig A.4 in Appendix not shown in main text). */
    const macros = [
      { name: 'Spread (bid-ask)',       importance: 1.00, paperTop: true },
      { name: 'FEDFUNDS (Fed Funds)',   importance: 0.92, paperTop: true },
      { name: 'Industrial Production',  importance: 0.55 },
      { name: 'Employment (CES)',       importance: 0.52 },
      { name: 'CPI',                    importance: 0.50 },
      { name: 'Money supply M2',        importance: 0.48 },
      { name: 'PPI',                    importance: 0.46 },
      { name: 'Housing starts',         importance: 0.45 },
      { name: 'Unemployment rate',      importance: 0.44 },
      { name: 'PCE',                    importance: 0.43 },
      { name: 'Real personal income',   importance: 0.42 },
      { name: 'Capacity utilization',   importance: 0.41 },
      { name: '10Y Treasury yield',     importance: 0.40 },
      { name: 'AAA corp bond yield',    importance: 0.39 },
      { name: 'Term spread',            importance: 0.38 },
      { name: 'Default spread',         importance: 0.37 }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Macro Variable Importance (paper §III.F)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 178 FRED-MD macros · Spread + FEDFUNDS stand out (paper)`, w/2, 40);

      const padL = 180, padR = 40, padT = 60, padB = 30;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = macros.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;

      visible.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * m.importance;
        if (m.paperTop) {
          ctx.fillStyle = '#dc2626';
        } else {
          const r = Math.round(180 - m.importance * 60);
          const g = Math.round(120 + m.importance * 60);
          const b = Math.round(180 - m.importance * 40);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        }
        ctx.fillRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name + (m.paperTop ? ' ★' : ''), padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 30) ctx.fillText(m.importance.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Normalized importance (★ = paper top 2)', padL + plotW/2, h - 5);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
