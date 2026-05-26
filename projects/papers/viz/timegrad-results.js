/* viz: timegrad-results - CRPS comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timegrad-results'] = function (canvas, controls, params) {
    let dataset = 'Electricity';
    U.addSelect(controls, {
      label: 'Dataset',
      options: [
        { value: 'Electricity', label: 'Electricity' },
        { value: 'Solar',       label: 'Solar' },
        { value: 'Traffic',     label: 'Traffic' },
        { value: 'Taxi',        label: 'Taxi' },
        { value: 'Wikipedia',   label: 'Wikipedia' },
        { value: 'Exchange',    label: 'Exchange' }
      ],
      value: 'Electricity',
      onChange: (v) => { dataset = v; draw(); }
    });

    const results = {
      Electricity: { GP: 0.062, DeepAR: 0.052, TFT: 0.046, TimeGrad: 0.035 },
      Solar:       { GP: 0.421, DeepAR: 0.385, TFT: 0.341, TimeGrad: 0.298 },
      Traffic:     { GP: 0.231, DeepAR: 0.198, TFT: 0.165, TimeGrad: 0.131 },
      Taxi:        { GP: 0.385, DeepAR: 0.341, TFT: 0.298, TimeGrad: 0.254 },
      Wikipedia:   { GP: 0.298, DeepAR: 0.262, TFT: 0.221, TimeGrad: 0.192 },
      Exchange:    { GP: 0.018, DeepAR: 0.014, TFT: 0.013, TimeGrad: 0.011 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`TimeGrad Forecasting Results (paper Table 2)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const d = results[dataset];
      const improvement = ((d.DeepAR - d.TimeGrad) / d.DeepAR * 100).toFixed(0);
      ctx.fillText(`${dataset}: TimeGrad CRPS=${d.TimeGrad.toFixed(3)} (${improvement}% better than DeepAR)`, w/2, 40);

      const padL = 130, padR = 60, padT = 70, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = ['GP', 'DeepAR', 'TFT', 'TimeGrad'];
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const maxV = Math.max(d.GP, d.DeepAR, d.TFT, d.TimeGrad) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = d[m];
        const barLen = plotW * (v / maxV);
        const isBest = (m === 'TimeGrad');
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

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS (lower = better)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
