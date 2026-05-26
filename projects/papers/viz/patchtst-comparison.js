/* viz: patchtst-comparison - paper Table 3 ETTh1 long-term forecasting (MSE) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['patchtst-comparison'] = function (canvas, controls, params) {
    let horizon = 96;
    U.addSelect(controls, {
      label: 'Horizon T',
      options: [
        { value: '96',  label: '96 steps' },
        { value: '192', label: '192 steps' },
        { value: '336', label: '336 steps' },
        { value: '720', label: '720 steps' }
      ],
      value: '96',
      onChange: (v) => { horizon = parseInt(v); draw(); }
    });

    // paper Table 3 — ETTh1 row, MSE values across 4 horizons
    const results = {
      96:  { 'PatchTST/64': 0.370, 'PatchTST/42': 0.375, DLinear: 0.375, FEDformer: 0.376, Autoformer: 0.435, Informer: 0.941, Pyraformer: 0.664, LogTrans: 0.878 },
      192: { 'PatchTST/64': 0.413, 'PatchTST/42': 0.414, DLinear: 0.405, FEDformer: 0.423, Autoformer: 0.456, Informer: 1.007, Pyraformer: 0.790, LogTrans: 1.037 },
      336: { 'PatchTST/64': 0.422, 'PatchTST/42': 0.431, DLinear: 0.439, FEDformer: 0.444, Autoformer: 0.486, Informer: 1.038, Pyraformer: 0.891, LogTrans: 1.238 },
      720: { 'PatchTST/64': 0.447, 'PatchTST/42': 0.449, DLinear: 0.472, FEDformer: 0.469, Autoformer: 0.515, Informer: 1.144, Pyraformer: 0.963, LogTrans: 1.135 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`paper Table 3 — ETTh1 MSE (T=${horizon})`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`PatchTST best on 6 of 8 datasets (paper §4.1)`, w/2, 40);

      const padL = 140, padR = 60, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const data = results[horizon];
      const models = Object.keys(data);
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const maxV = Math.max(...Object.values(data)) * 1.15;
      const minV = Math.min(...Object.values(data));

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[m];
        const barLen = plotW * (v / maxV);
        const isBest = (Math.abs(v - minV) < 1e-9);
        ctx.fillStyle = isBest ? '#16a34a' : (m.startsWith('PatchTST') ? '#ef4444' : (m === 'DLinear' ? '#ca8a04' : '#94a3b8'));
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
