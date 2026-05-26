/* viz: gu-r2-comparison - R² OOS model comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-r2-comparison'] = function (canvas, controls, params) {
    const models = [
      { name: 'FF5 (linear)', r2: 0.014, sharpe: 0.42, color: '#94a3b8' },
      { name: 'PCA (10F)', r2: 0.038, sharpe: 0.62, color: '#0891b2' },
      { name: 'Standard AE', r2: 0.026, sharpe: 0.58, color: '#9333ea' },
      { name: 'CA1', r2: 0.045, sharpe: 0.71, color: '#ca8a04' },
      { name: 'CA2', r2: 0.058, sharpe: 0.84, color: '#16a34a' },
      { name: 'CA3 ★', r2: 0.072, sharpe: 0.96, color: '#dc2626' }
    ];

    let metric = 'r2';
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'r2', label: 'Out-of-sample R²' },
        { value: 'sharpe', label: 'Sharpe ratio' }
      ],
      value: 'r2',
      onChange: (v) => { metric = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Model Comparison (paper Table 1)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Metric: ${metric === 'r2' ? 'Out-of-sample R²' : 'Sharpe ratio'} (1991-2018)`, w/2, 40);

      const padL = 130, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;

      const values = models.map(m => metric === 'r2' ? m.r2 : m.sharpe);
      const maxV = Math.max(...values) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const value = metric === 'r2' ? m.r2 : m.sharpe;
        const barLen = plotW * (value / maxV);
        ctx.fillStyle = m.color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        // Model name
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name, padL - 8, y + barH/2);

        // Value
        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(metric === 'r2' ? value.toFixed(3) : value.toFixed(2),
                                       padL + barLen - 6, y + barH/2 + 3);
        else {
          ctx.fillStyle = U.text();
          ctx.textAlign = 'left';
          ctx.fillText(metric === 'r2' ? value.toFixed(3) : value.toFixed(2),
                       padL + barLen + 6, y + barH/2 + 3);
        }
      });

      // Best annotation
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText(`★ ${metric === 'r2' ? '5× over linear' : '2.3× Sharpe'}`,
                   padL + plotW * 0.7, padT + plotH - 10);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric === 'r2' ? 'R² (out-of-sample)' : 'Sharpe ratio',
                   padL + plotW/2, h - 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
