/* viz: protran-forecast - paper Table 1 CRPS_sum selected baselines */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-forecast'] = function (canvas, controls, params) {
    let dataset = 'Electricity';
    U.addSelect(controls, {
      label: 'Dataset',
      options: [
        { value: 'Solar',       label: 'Solar' },
        { value: 'Electricity', label: 'Electricity' },
        { value: 'Traffic',     label: 'Traffic' },
        { value: 'Taxi',        label: 'Taxi' },
        { value: 'Wikipedia',   label: 'Wikipedia' }
      ],
      value: 'Electricity',
      onChange: (v) => { dataset = v; draw(); }
    });

    // paper Table 1 — CRPS_sum (mean only; std omitted)
    const results = {
      Solar:       { DeepAR: 0.336, 'GP-Copula': 0.337, 'Transformer-MAF': 0.301, TimeGrad: 0.287, ProTran: 0.194 },
      Electricity: { DeepAR: 0.023, 'GP-Copula': 0.024, 'Transformer-MAF': 0.021, TimeGrad: 0.021, ProTran: 0.016 },
      Traffic:     { DeepAR: 0.055, 'GP-Copula': 0.078, 'Transformer-MAF': 0.056, TimeGrad: 0.044, ProTran: 0.028 },
      Taxi:        { 'LSTM-Copula': 0.326, 'GP-Copula': 0.208, 'Transformer-MAF': 0.179, TimeGrad: 0.114, ProTran: 0.084 },
      Wikipedia:   { DeepAR: 0.127, 'GP-Copula': 0.086, 'Transformer-MAF': 0.063, TimeGrad: 0.049, ProTran: 0.047 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`paper Table 1 — CRPS_sum on ${dataset}`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const d = results[dataset];
      ctx.fillText(`ProTran best on all 5 datasets — top 5 baselines shown`, w/2, 40);

      const padL = 150, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = Object.keys(d);
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const maxV = Math.max(...models.map(m => d[m])) * 1.15;
      const minV = Math.min(...models.map(m => d[m]));

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = d[m];
        const barLen = plotW * (v / maxV);
        const isBest = (Math.abs(v - minV) < 1e-9);
        ctx.fillStyle = isBest ? '#16a34a' : (m === 'ProTran' ? '#ef4444' : '#94a3b8');
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
        if (barLen > 50) ctx.fillText(v.toFixed(3), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS_sum (lower = better)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
