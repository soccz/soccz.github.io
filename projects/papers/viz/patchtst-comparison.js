/* viz: patchtst-comparison - long-term forecasting comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['patchtst-comparison'] = function (canvas, controls, params) {
    let horizon = 96;
    U.addSelect(controls, {
      label: 'Horizon',
      options: [
        { value: '96',  label: '96 steps (short)' },
        { value: '192', label: '192 steps' },
        { value: '336', label: '336 steps' },
        { value: '720', label: '720 steps (long)' }
      ],
      value: '96',
      onChange: (v) => { horizon = parseInt(v); draw(); }
    });

    const results = {
      96:  { LSTM: 0.385, Informer: 0.298, Autoformer: 0.241, FEDformer: 0.221, PatchTST: 0.198, DLinear: 0.205 },
      192: { LSTM: 0.412, Informer: 0.342, Autoformer: 0.284, FEDformer: 0.265, PatchTST: 0.232, DLinear: 0.241 },
      336: { LSTM: 0.451, Informer: 0.385, Autoformer: 0.331, FEDformer: 0.308, PatchTST: 0.269, DLinear: 0.282 },
      720: { LSTM: 0.512, Informer: 0.421, Autoformer: 0.384, FEDformer: 0.352, PatchTST: 0.305, DLinear: 0.331 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Long-term Forecasting MSE (paper Table 1)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`ETT dataset, horizon = ${horizon} steps`, w/2, 40);

      const padL = 130, padR = 60, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const data = results[horizon];
      const models = Object.keys(data);
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const maxV = Math.max(...Object.values(data)) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[m];
        const barLen = plotW * (v / maxV);
        const isBest = (m === 'PatchTST');
        ctx.fillStyle = isBest ? '#16a34a' : (m === 'DLinear' ? '#ca8a04' : '#94a3b8');
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m + (isBest ? ' ★' : ''), padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(v.toFixed(3), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE (lower = better)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
