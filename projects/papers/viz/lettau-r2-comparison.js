/* viz: lettau-r2-comparison - R² OOS model comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lettau-r2-comparison'] = function (canvas, controls, params) {
    let metric = 'r2';
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'r2',     label: 'OOS R²' },
        { value: 'sharpe', label: 'Sharpe' },
        { value: 'error',  label: 'Pricing error' }
      ],
      value: 'r2',
      onChange: (v) => { metric = v; draw(); }
    });

    const models = [
      { name: 'CAPM',         r2: 0.018, sharpe: 0.32, error: 0.234, color: '#94a3b8' },
      { name: 'Fama-French 3F', r2: 0.038, sharpe: 0.55, error: 0.197, color: '#94a3b8' },
      { name: 'Fama-French 5F', r2: 0.052, sharpe: 0.71, error: 0.165, color: '#94a3b8' },
      { name: 'PCA (5F)',     r2: 0.041, sharpe: 0.62, error: 0.183, color: '#0891b2' },
      { name: 'IPCA',         r2: 0.063, sharpe: 0.89, error: 0.142, color: '#0891b2' },
      { name: 'RP-PCA ★',     r2: 0.078, sharpe: 1.12, error: 0.105, color: '#dc2626' }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('RP-PCA vs Baselines (paper Table 1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const metricName = metric === 'r2' ? 'OOS R²' : metric === 'sharpe' ? 'Sharpe ratio' : 'Pricing error';
      ctx.fillText(`Metric: ${metricName} (US equities 1963-2018)`, w/2, 40);

      const padL = 140, padR = 50, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const values = models.map(m => m[metric]);
      const maxV = Math.max(...values) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = m[metric];
        const barLen = plotW * (v / maxV);
        ctx.fillStyle = m.color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name, padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(metric === 'error' ? v.toFixed(3) : v.toFixed(metric === 'sharpe' ? 2 : 3),
                                        padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric === 'error' ? 'Pricing error (lower better)' : `${metricName} (higher better)`,
                   padL + plotW/2, h - 10);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
