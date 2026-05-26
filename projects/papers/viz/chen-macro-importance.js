/* viz: chen-macro-importance — paper Figure A.4 GAN macro variable importance (top 50 visible) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chen-macro-importance'] = function (canvas, controls, params) {
    let topN = 15;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 30, step: 1, value: 15,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    /* paper Fig A.4 ranking — order matches paper figure (top 30 of 178 macros + chars).
       Importance values normalized: paper text §III.F notes Spread + FEDFUNDS stand out,
       while "most macroeconomic variables have a very similar importance" — figure shows
       a slight drop from top to bottom but ~0.95 floor. Raw values 0.005-0.006 normalized. */
    const macros = [
      { name: 'Spread (bid-ask)',         importance: 1.00, paperTop: true },
      { name: 'FEDFUNDS (Fed funds)',     importance: 0.98, paperTop: true },
      { name: 'CF',                       importance: 0.97 },
      { name: 'tms (term spread)',        importance: 0.97 },
      { name: 'DTCTHFNM',                 importance: 0.97 },
      { name: 'RETAILx',                  importance: 0.97 },
      { name: 'LT_Rev',                   importance: 0.97 },
      { name: 'AC',                       importance: 0.97 },
      { name: 'S2P',                      importance: 0.97 },
      { name: 'Rel2High',                 importance: 0.97 },
      { name: 'BEME',                     importance: 0.96 },
      { name: 'NONREVSL',                 importance: 0.96 },
      { name: 'BAAFFM',                   importance: 0.96 },
      { name: 'CES3000000008',            importance: 0.96 },
      { name: 'RNA',                      importance: 0.96 },
      { name: 'NOA',                      importance: 0.96 },
      { name: 'r12_2',                    importance: 0.96 },
      { name: 'COMPAPFFx',                importance: 0.96 },
      { name: 'RPI',                      importance: 0.96 },
      { name: 'WPSID62',                  importance: 0.96 },
      { name: 'CPITRNSL',                 importance: 0.96 },
      { name: 'VXOCLSx',                  importance: 0.96 },
      { name: 'OILPRICEx',                importance: 0.96 },
      { name: 'CPIMEDSL',                 importance: 0.96 },
      { name: 'DPI2A',                    importance: 0.96 },
      { name: 'CUSR0000SA0L2',            importance: 0.96 },
      { name: 'AWOTMAN',                  importance: 0.96 },
      { name: 'TYFFM',                    importance: 0.96 },
      { name: 'IPFUELS',                  importance: 0.96 },
      { name: 'IPMAT',                    importance: 0.95 }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Macro Variable Importance — paper Fig A.4 (GAN SDF)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 178 macros + 46 chars · normalized importance (Σ=1)`, w/2, 40);

      const padL = 200, padR = 40, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = macros.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;

      visible.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        // Scale bar from 0.94 floor to emphasize the small but visible variation
        const barLen = plotW * Math.max(0, (m.importance - 0.94) / 0.06);
        if (m.paperTop) {
          ctx.fillStyle = '#dc2626';
        } else {
          ctx.fillStyle = '#3b82f6';
        }
        ctx.fillRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name + (m.paperTop ? ' ★' : ''), padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 35) ctx.fillText(m.importance.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      // Footer caption
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ paper top 2 (§III.F: "Spread + FEDFUNDS stand out")', padL + plotW/2, h - 18);
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Bar zero point at 0.94 — paper text: "most macros have very similar importance"', padL + plotW/2, h - 4);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
