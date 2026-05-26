/* viz: dlap-test-assets - paper Table I 정확 수치: 4 SDF models 의 SR/EV/XS-R² 비교 */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-test-assets'] = function (canvas, controls, params) {
    let metric = 'SR';
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'SR',     label: 'Sharpe ratio (monthly)' },
        { value: 'EV',     label: 'Explained Variation (EV)' },
        { value: 'XSR2',   label: 'Cross-Sectional R² (XS-R²)' }
      ],
      value: 'SR',
      onChange: (v) => { metric = v; draw(); }
    });

    // paper Table I exact values (Test column)
    const data = {
      LS:  { name: 'LS (Least Squares)',  SR: 0.42, EV: 0.03, XSR2: 0.14, color: '#94a3b8' },
      EN:  { name: 'EN (Elastic Net + no-arb)', SR: 0.50, EV: 0.04, XSR2: 0.19, color: '#9333ea' },
      FFN: { name: 'FFN (forecast only)', SR: 0.44, EV: 0.04, XSR2: 0.15, color: '#0891b2' },
      GAN: { name: 'GAN (paper benchmark) ★', SR: 0.75, EV: 0.08, XSR2: 0.23, color: '#dc2626' },
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('paper Table I — 4 SDF Models (1992-2016 Test)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const metricNames = { SR: 'Monthly Sharpe Ratio', EV: 'Explained Variation', XSR2: 'Cross-Sectional R²' };
      ctx.fillText(`${metricNames[metric]} — GAN 의 no-arbitrage + GAN moment selection 의 dominance`, w/2, 40);

      const padL = 200, padR = 50, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = ['LS', 'EN', 'FFN', 'GAN'];
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const values = models.map(m => data[m][metric]);
      const maxV = Math.max(...values) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[m][metric];
        const barLen = plotW * (v / maxV);
        ctx.fillStyle = data[m].color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(data[m].name, padL - 8, y + barH/2);
        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(v.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      // GAN 우위 annotation
      const ganRatio = data.GAN[metric] / data.EN[metric];
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText(`★ GAN/EN ratio = ${ganRatio.toFixed(1)}× — no-arbitrage + GAN moment 의 결합 효과`,
                   padL + plotW * 0.1, padT + plotH - 8);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Test period (1992-2016) — higher = better', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
