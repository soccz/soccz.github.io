/* viz: chen-sharpe-comparison - Sharpe ratio comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chen-sharpe-comparison'] = function (canvas, controls, params) {
    const models = [
      { name: 'CAPM', sharpe: 0.32, color: '#94a3b8' },
      { name: 'Fama-French 3F', sharpe: 0.45, color: '#94a3b8' },
      { name: 'Fama-French 5F', sharpe: 0.52, color: '#94a3b8' },
      { name: 'PCA factors', sharpe: 0.68, color: '#0891b2' },
      { name: 'IPCA (Kelly 2019)', sharpe: 0.84, color: '#0891b2' },
      { name: 'FFN only', sharpe: 0.95, color: '#9333ea' },
      { name: 'LSTM only', sharpe: 1.08, color: '#9333ea' },
      { name: 'Chen-Pelger GAN ★', sharpe: 1.53, color: '#dc2626' }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Sharpe Ratio Comparison (paper Table 2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('1996-2016 OOS test period', w/2, 40);

      const padL = 160, padR = 50, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const maxV = 2.0;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * (m.sharpe / maxV);
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
        if (barLen > 40) ctx.fillText(m.sharpe.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      // Annotation
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('★ 3× CAPM Sharpe', padL + plotW * 0.65, padT + plotH - 15);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Sharpe ratio (higher = better)', padL + plotW/2, h - 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
