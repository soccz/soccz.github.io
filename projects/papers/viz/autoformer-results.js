/* viz: autoformer-results - long-term forecasting comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['autoformer-results'] = function (canvas, controls, params) {
    let dataset = 'ETT';
    U.addSelect(controls, {
      label: 'Dataset',
      options: [
        { value: 'ETT', label: 'ETT (electricity)' },
        { value: 'Weather', label: 'Weather' },
        { value: 'Traffic', label: 'Traffic' },
        { value: 'ECL', label: 'ECL' }
      ],
      value: 'ETT',
      onChange: (v) => { dataset = v; draw(); }
    });

    const results = {
      ETT: { Informer: 0.385, LSTM: 0.412, TCN: 0.394, Reformer: 0.422, Autoformer: 0.241 },
      Weather: { Informer: 0.298, LSTM: 0.321, TCN: 0.305, Reformer: 0.334, Autoformer: 0.182 },
      Traffic: { Informer: 0.652, LSTM: 0.681, TCN: 0.664, Reformer: 0.695, Autoformer: 0.421 },
      ECL: { Informer: 0.198, LSTM: 0.215, TCN: 0.204, Reformer: 0.224, Autoformer: 0.142 }
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
      ctx.fillText(`${dataset} dataset, 96 → 720 horizon`, w/2, 40);

      const padL = 120, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const data = results[dataset];
      const models = Object.keys(data);
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
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
      const baseAvg = (data.Informer + data.LSTM + data.TCN + data.Reformer) / 4;
      const improvement = ((baseAvg - data.Autoformer) / baseAvg * 100).toFixed(0);
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText(`★ ${improvement}% MSE reduction over baselines`,
                   padL + plotW * 0.5, padT + plotH - 15);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE (lower = better)', padL + plotW/2, h - 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
