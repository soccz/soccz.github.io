/* viz: master-stock-universe - cross-sectional stock universe view */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['master-stock-universe'] = function (canvas, controls, params) {
    let numStocks = 30;
    U.addSlider(controls, {
      label: 'Stock count', min: 10, max: 100, step: 5, value: 30,
      onInput: (v) => { numStocks = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Stock Universe Cross-Sectional View (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Day t snapshot: ${numStocks} stocks ranked by predicted return`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / numStocks * 0.7;
      const gap = plotH / numStocks * 0.3;

      // Generate stock returns with bias toward bell curve
      let seed = 7;
      function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      const stocks = [];
      for (let i = 0; i < numStocks; i++) {
        stocks.push({
          name: `S${String(i+1).padStart(3, '0')}`,
          predRet: (rand() - 0.5) * 0.08,  // -4% ~ +4%
          actualRet: (rand() - 0.5) * 0.06
        });
      }
      stocks.sort((a, b) => b.predRet - a.predRet);

      const topK = Math.max(1, Math.floor(numStocks * 0.1));
      const bottomK = topK;

      const maxAbs = Math.max(...stocks.map(s => Math.abs(s.predRet))) * 1.1;
      const cx = padL + plotW / 2;
      const halfW = plotW / 2;

      // Center line
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, padT); ctx.lineTo(cx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      stocks.forEach((s, i) => {
        const y = padT + i * (barH + gap);
        const isLong = (i < topK);
        const isShort = (i >= numStocks - bottomK);
        const color = isLong ? '#16a34a' : (isShort ? '#dc2626' : '#94a3b8');
        const barLen = halfW * Math.abs(s.predRet) / maxAbs;
        ctx.fillStyle = color;
        ctx.globalAlpha = isLong || isShort ? 1.0 : 0.5;
        if (s.predRet >= 0) ctx.fillRect(cx, y, barLen, barH);
        else ctx.fillRect(cx - barLen, y, barLen, barH);
        ctx.globalAlpha = 1;

        // Label small only
        if (numStocks <= 50) {
          ctx.fillStyle = U.textMuted();
          ctx.font = '9px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(s.name, padL - 5, y + barH/2);
        }
      });

      // Annotations
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(`★ LONG top ${topK} (10%)`, padL + plotW - 5, padT + 5);
      ctx.fillStyle = '#dc2626';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`★ SHORT bottom ${bottomK} (10%)`, padL + plotW - 5, padT + plotH - 5);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Predicted return (long-short ranking)', cx, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
