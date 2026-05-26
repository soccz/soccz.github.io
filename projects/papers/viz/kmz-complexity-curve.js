/* viz: kmz-complexity-curve - R² and Sharpe vs complexity P */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['kmz-complexity-curve'] = function (canvas, controls, params) {
    let metric = 'r2';
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'r2',     label: 'OOS R²' },
        { value: 'sharpe', label: 'Sharpe ratio' }
      ],
      value: 'r2',
      onChange: (v) => { metric = v; draw(); }
    });

    const Ps = [1, 10, 100, 1000, 10000];
    const r2 = [0.005, 0.018, 0.034, 0.058, 0.082];
    const sharpe = [0.18, 0.42, 0.71, 1.05, 1.43];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Complexity Benefits (paper Table 1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${metric === 'r2' ? 'OOS R²' : 'Sharpe'} vs # parameters (RFF + Ridge, T=600)`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = 0, xMax = Math.log10(10000) + 0.3;
      const xToPix = (P) => padL + plotW * (Math.log10(P) - xMin) / (xMax - xMin);
      const values = metric === 'r2' ? r2 : sharpe;
      const yMax = Math.max(...values) * 1.15;
      const yToPix = (v) => padT + plotH * (1 - v / yMax);

      // Bar chart
      const barW = plotW / Ps.length * 0.7;
      Ps.forEach((P, i) => {
        const x = xToPix(P) - barW / 2;
        const v = values[i];
        const barH = plotH * v / yMax;
        const isBest = (i === Ps.length - 1);
        ctx.fillStyle = isBest ? '#dc2626' : `hsl(${200 + i * 30}, 60%, 50%)`;
        ctx.fillRect(x, padT + plotH - barH, barW, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, padT + plotH - barH, barW, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(`P=${P}`, xToPix(P), padT + plotH + 6);

        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(metric === 'r2' ? v.toFixed(3) : v.toFixed(2),
                     xToPix(P), padT + plotH - barH - 4);
      });

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax * (1 - i/5);
        ctx.fillText(metric === 'r2' ? v.toFixed(3) : v.toFixed(2), padL - 6, padT + plotH * i / 5);
      }

      // Annotation
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const gain = metric === 'r2' ? (r2[4] / r2[0]).toFixed(0) : (sharpe[4] / sharpe[0]).toFixed(0);
      ctx.fillText(`★ ${gain}× ${metric === 'r2' ? 'R²' : 'Sharpe'} gain (P=1 → P=10000)`,
                   padL + plotW / 2, padT + 18);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Number of RFF features (log scale)', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
