/* viz: autoformer-results - paper Table 1 정확 수치 (4-horizon 평균 MSE) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['autoformer-results'] = function (canvas, controls, params) {
    let dataset = 'ETT';
    U.addSelect(controls, {
      label: 'Dataset',
      options: [
        { value: 'ETT',         label: 'ETTm2 (electricity transformer)' },
        { value: 'Electricity', label: 'Electricity (hourly load)' },
        { value: 'Exchange',    label: 'Exchange (FX rates)' },
        { value: 'Traffic',     label: 'Traffic (road occupancy)' },
        { value: 'Weather',     label: 'Weather (meteorology)' }
      ],
      value: 'ETT',
      onChange: (v) => { dataset = v; draw(); }
    });

    // paper Table 1 exact values — average MSE across 4 prediction horizons (96, 192, 336, 720)
    const results = {
      ETT:         { Autoformer: 0.324, Informer: 1.410, LogTrans: 2.116, Reformer: 1.751, LSTNet: 2.247, LSTM: 1.451, TCN: 1.945 },
      Electricity: { Autoformer: 0.227, Informer: 0.311, LogTrans: 0.272, Reformer: 0.338, LSTNet: 0.701, LSTM: 0.541, TCN: 1.062 },
      Exchange:    { Autoformer: 0.613, Informer: 1.401, LogTrans: 1.402, Reformer: 1.280, LSTNet: 1.692, LSTM: 1.512, TCN: 2.246 },
      Traffic:     { Autoformer: 0.628, Informer: 0.764, LogTrans: 0.705, Reformer: 0.741, LSTNet: 1.092, LSTM: 0.749, TCN: 1.452 },
      Weather:     { Autoformer: 0.338, Informer: 0.634, LogTrans: 0.696, Reformer: 0.803, LSTNet: 0.694, LSTM: 0.502, TCN: 0.603 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`paper Table 1 — Average MSE (4 horizons: 96/192/336/720)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${dataset} dataset — Autoformer 의 38% averaged MSE reduction`, w/2, 40);

      const padL = 130, padR = 60, padT = 70, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const data = results[dataset];
      const models = Object.keys(data);
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const maxV = Math.max(...Object.values(data)) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[m];
        const barLen = plotW * (v / maxV);
        const isBest = (m === 'Autoformer');
        ctx.fillStyle = isBest ? '#16a34a' : '#94a3b8';
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

      // Improvement annotation
      const baseAvg = (data.Informer + data.LogTrans + data.Reformer + data.LSTM) / 4;
      const improvement = ((baseAvg - data.Autoformer) / baseAvg * 100).toFixed(0);
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText(`★ ${improvement}% MSE reduction vs Transformer baselines (avg)`,
                   padL + plotW * 0.4, padT + plotH - 12);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE (lower = better)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
