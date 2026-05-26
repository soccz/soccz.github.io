/* viz: timegrad-results - paper Table 2 CRPS_sum comparison (selected baselines) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timegrad-results'] = function (canvas, controls, params) {
    let dataset = 'Electricity';
    U.addSelect(controls, {
      label: 'Dataset',
      options: [
        { value: 'Electricity', label: 'Electricity (D=370)' },
        { value: 'Solar',       label: 'Solar (D=137)' },
        { value: 'Traffic',     label: 'Traffic (D=963)' },
        { value: 'Taxi',        label: 'Taxi (D=1214)' },
        { value: 'Wikipedia',   label: 'Wikipedia (D=2000)' },
        { value: 'Exchange',    label: 'Exchange (D=8)' }
      ],
      value: 'Electricity',
      onChange: (v) => { dataset = v; draw(); }
    });

    // paper Table 2 — selected baselines + TimeGrad (CRPS_sum mean values)
    const results = {
      Electricity: { 'VAR-Lasso': 0.025, 'GP-Copula': 0.0245, 'GP-scaling': 0.022, 'Transformer-MAF': 0.0207, 'TimeGrad': 0.0206 },
      Solar:       { 'KVAE': 0.34, 'GP-scaling': 0.368, 'GP-Copula': 0.337, 'Transformer-MAF': 0.301, 'TimeGrad': 0.287 },
      Traffic:     { 'Vec-LSTM-ind': 0.087, 'GP-scaling': 0.079, 'GP-Copula': 0.078, 'Transformer-MAF': 0.056, 'TimeGrad': 0.044 },
      Taxi:        { 'Vec-LSTM-ind': 0.506, 'Vec-LSTM-Cop': 0.326, 'GP-Copula': 0.208, 'Transformer-MAF': 0.179, 'TimeGrad': 0.114 },
      Wikipedia:   { 'KVAE': 0.095, 'GP-Copula': 0.086, 'Transformer-MAF': 0.063, 'Vec-LSTM-ind': 0.133, 'TimeGrad': 0.0485 },
      Exchange:    { 'GP-Copula': 0.007, 'Vec-LSTM-Cop': 0.007, 'Vec-LSTM-ind': 0.008, 'Transformer-MAF': 0.005, 'TimeGrad': 0.006 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`paper Table 2 — CRPS_sum on ${dataset}`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const d = results[dataset];
      const models = Object.keys(d);
      const minV = Math.min(...models.map(m => d[m]));
      const tgVal = d['TimeGrad'];
      const isBest = Math.abs(tgVal - minV) < 1e-9;
      ctx.fillText(isBest ? `TimeGrad ${tgVal.toFixed(4)} — best on this dataset` : `TimeGrad ${tgVal.toFixed(4)} — Transformer-MAF wins on Exchange tie`, w/2, 40);

      const padL = 150, padR = 60, padT = 70, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const maxV = Math.max(...models.map(m => d[m])) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = d[m];
        const barLen = plotW * (v / maxV);
        const isMin = Math.abs(v - minV) < 1e-9;
        const isTG = m === 'TimeGrad';
        ctx.fillStyle = isMin ? '#16a34a' : (isTG ? '#ef4444' : '#94a3b8');
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m + (isMin ? ' ★' : ''), padL - 8, y + barH/2);
        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 50) ctx.fillText(v.toFixed(4), padL + barLen - 6, y + barH/2 + 3);
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
