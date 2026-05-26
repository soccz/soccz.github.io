/* viz: gu-sharpe-comparison - paper Table 3 정확 수치 (long-short SR, K=5) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-sharpe-comparison'] = function (canvas, controls, params) {
    let portfolioType = 'VW';
    U.addSelect(controls, {
      label: 'Portfolio',
      options: [
        { value: 'EW',  label: 'Equal-weight (paper Table 3 EW)' },
        { value: 'VW',  label: 'Value-weight (paper Table 3 VW)' }
      ],
      value: 'VW',
      onChange: (v) => { portfolioType = v; draw(); }
    });

    // paper Table 3 exact values for K=5 (paper의 main spec)
    const data = {
      EW: { FF: 0.36, PCA: -0.12, IPCA: 2.31, CA0: 2.10, CA1: 2.67, CA2: 2.68, CA3: 2.57 },
      VW: { FF: 0.18, PCA: -0.30, IPCA: 1.05, CA0: 0.83, CA1: 1.48, CA2: 1.53, CA3: 1.45 },
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`paper Table 3 — Long-Short Portfolio Sharpe (K=5)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const port = portfolioType === 'EW' ? 'Equal-weight' : 'Value-weight';
      ctx.fillText(`${port} long-short (decile 10 - decile 1) · 30 years OOS · K=5 factors`, w/2, 40);

      const padL = 100, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = Object.keys(data[portfolioType]);
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const values = Object.values(data[portfolioType]);
      // Allow negative values (PCA, FF in VW)
      const minV = Math.min(0, Math.min(...values));
      const maxV = Math.max(...values) * 1.15;
      const range = maxV - minV;
      const zeroX = padL + plotW * (-minV / range);

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[portfolioType][m];
        let color;
        if (m.startsWith('CA')) color = '#16a34a';
        else if (m === 'IPCA') color = '#0891b2';
        else color = '#94a3b8';
        // Highlight: CA2 VW = paper의 best
        const isBest = (m === 'CA2');
        if (isBest) color = '#dc2626';

        ctx.fillStyle = color;
        const barLen = plotW * (Math.abs(v) / range);
        if (v >= 0) ctx.fillRect(zeroX, y, barLen, barH);
        else        ctx.fillRect(zeroX - barLen, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(v >= 0 ? zeroX : zeroX - barLen, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m + (isBest ? ' ★' : ''), padL - 8, y + barH/2);

        ctx.fillStyle = barLen > 35 ? '#fff' : U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = v >= 0 ? 'right' : 'left';
        if (barLen > 35) {
          ctx.fillText(v.toFixed(2), v >= 0 ? zeroX + barLen - 6 : zeroX - barLen + 6, y + barH/2 + 3);
        } else {
          ctx.fillText(v.toFixed(2), v >= 0 ? zeroX + barLen + 4 : zeroX - barLen - 4, y + barH/2 + 3);
        }
      });

      // Zero line
      ctx.strokeStyle = '#000';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(zeroX, padT); ctx.lineTo(zeroX, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Sharpe ratio (annualized)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
