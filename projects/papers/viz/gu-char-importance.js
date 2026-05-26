/* viz: gu-char-importance - paper Figure 4 top 20 characteristics for CA2 (K=5) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-char-importance'] = function (canvas, controls, params) {
    let topN = 10;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 20, step: 1, value: 10,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    // paper Figure 4 — CA2 (K=5) top 20 characteristics by variable importance
    // (values approximate from Figure 4 bar lengths; CA0–CA3 share the same top order)
    const chars = [
      { name: 'mvel1 (size)',                importance: 0.165 },
      { name: 'mom1m (short-term reversal)', importance: 0.140 },
      { name: 'idiovol (idiosync vol)',      importance: 0.090 },
      { name: 'retvol (return vol)',         importance: 0.080 },
      { name: 'mom6m',                       importance: 0.070 },
      { name: 'beta',                        importance: 0.060 },
      { name: 'mom12m',                      importance: 0.050 },
      { name: 'turn (turnover)',             importance: 0.048 },
      { name: 'ill (Amihud illiquidity)',    importance: 0.042 },
      { name: 'baspread (bid-ask)',          importance: 0.040 },
      { name: 'betasq',                      importance: 0.038 },
      { name: 'mom36m',                      importance: 0.035 },
      { name: 'dolvol',                      importance: 0.032 },
      { name: 'std_turn',                    importance: 0.030 },
      { name: 'dy (dividend yield)',         importance: 0.028 },
      { name: 'maxret',                      importance: 0.026 },
      { name: 'zerotrade',                   importance: 0.024 },
      { name: 'indmom',                      importance: 0.022 },
      { name: 'nincr',                       importance: 0.020 },
      { name: 'bm (book/market)',            importance: 0.018 }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('paper Fig 4 — CA2 (K=5) Top Characteristics', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 94 characteristics — normalized variable importance (sum=1)`, w/2, 40);

      const padL = 200, padR = 40, padT = 60, padB = 30;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = chars.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;
      const maxV = Math.max(...visible.map(c => c.importance));

      visible.forEach((c, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * (c.importance / maxV);
        const r = Math.round(220 - (c.importance/maxV) * 100);
        const g = Math.round(38 + (c.importance/maxV) * 100);
        const b = Math.round(38 + (c.importance/maxV) * 100);
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
        if (barLen > 35) ctx.fillText(c.importance.toFixed(3), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Variable importance (CA2, K=5)', padL + plotW/2, h - 5);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
