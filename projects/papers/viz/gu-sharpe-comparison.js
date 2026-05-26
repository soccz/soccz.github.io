/* viz: gu-sharpe-comparison - portfolio Sharpe vs models */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-sharpe-comparison'] = function (canvas, controls, params) {
    let portfolioType = 'VW';
    U.addSelect(controls, {
      label: 'Portfolio',
      options: [
        { value: 'EW',  label: 'Equal-weight' },
        { value: 'VW',  label: 'Value-weight (★ paper)' }
      ],
      value: 'VW',
      onChange: (v) => { portfolioType = v; draw(); }
    });

    const data = {
      EW: { CAPM: 0.42, FF3: 0.48, FF5: 0.55, IPCA: 0.78, CA0: 0.62, CA1: 0.85, CA2: 1.21, CA3: 1.34 },
      VW: { CAPM: 0.32, FF3: 0.39, FF5: 0.45, IPCA: 0.91, CA0: 0.71, CA1: 0.98, CA2: 1.53, CA3: 1.45 },
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Sharpe Ratio vs Models (paper Table 4)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${portfolioType} portfolio · 60 years OOS · 5 factors`, w/2, 40);

      const padL = 100, padR = 50, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = Object.keys(data[portfolioType]);
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const maxV = Math.max(...Object.values(data[portfolioType])) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[portfolioType][m];
        const barLen = plotW * (v / maxV);
        let color;
        if (m.startsWith('CA')) color = '#16a34a';
        else if (m === 'IPCA') color = '#0891b2';
        else color = '#94a3b8';
        if (m === 'CA2' && portfolioType === 'VW') color = '#dc2626';  // best
        ctx.fillStyle = color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        const isBest = (m === 'CA2' && portfolioType === 'VW') || (m === 'CA3' && portfolioType === 'EW');
        ctx.fillText(m + (isBest ? ' ★' : ''), padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(v.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Sharpe ratio (higher = better)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
