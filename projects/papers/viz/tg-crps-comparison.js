/* viz: tg-crps-comparison
 * Table 2 — 6 datasets × 11 models CRPS_sum (lower is better).
 * paper exact values (Rasul et al. 2021 Table 2).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-crps-comparison'] = function (canvas, controls, params) {
    const datasets = ['Exchange', 'Solar', 'Electricity', 'Traffic', 'Taxi', 'Wikipedia'];

    // paper Table 2 (mean only, std omitted for clarity)
    // null = paper did not report (− in Table 2)
    const data = {
      'VES':                       [0.005, 0.9, 0.88, 0.35, null, null],
      'VAR':                       [0.005, 0.83, 0.039, 0.29, null, null],
      'VAR-Lasso':                 [0.012, 0.51, 0.025, 0.15, null, 3.1],
      'GARCH':                     [0.023, 0.88, 0.19, 0.37, null, null],
      'KVAE':                      [0.014, 0.34, 0.051, 0.10, null, 0.095],
      'Vec-LSTM-ind-scaling':      [0.008, 0.391, 0.025, 0.087, 0.506, 0.133],
      'Vec-LSTM-lowrank-Copula':   [0.007, 0.319, 0.064, 0.103, 0.326, 0.241],
      'GP-scaling':                [0.009, 0.368, 0.022, 0.079, 0.183, 1.483],
      'GP-Copula':                 [0.007, 0.337, 0.0245, 0.078, 0.208, 0.086],
      'Transformer-MAF':           [0.005, 0.301, 0.0207, 0.056, 0.179, 0.063],
      'TimeGrad':                  [0.006, 0.287, 0.0206, 0.044, 0.114, 0.0485]
    };
    const models = Object.keys(data);

    let datasetIdx = parseInt(params.dataset || '4'); // Taxi default (biggest difference)

    U.addSlider(controls, {
      label: 'Dataset', min: 0, max: datasets.length - 1, step: 1, value: datasetIdx,
      onInput: (v) => { datasetIdx = parseInt(v); draw(); },
      fmt: (v) => datasets[parseInt(v)]
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 180, padR = 60, padT = 44, padB = 30;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Table 2 — CRPS_sum on ${datasets[datasetIdx]} (lower is better)`, w / 2, padT - 22);

      // Filter valid values for the dataset
      const values = [];
      for (const m of models) {
        const v = data[m][datasetIdx];
        if (v !== null) values.push({ model: m, val: v });
      }

      const maxVal = Math.max(...values.map(x => x.val));
      const minVal = Math.min(...values.map(x => x.val));

      const rowH = innerH / values.length;
      const xToPix = (v) => padL + innerW * v / (maxVal * 1.05);

      // Draw bars
      values.forEach((item, i) => {
        const y = padT + rowH * i;
        const barH = Math.max(rowH * 0.55, 8);
        const isBest = Math.abs(item.val - minVal) < 1e-6;
        const isTG = item.model === 'TimeGrad';

        ctx.fillStyle = isBest ? U.good() : (isTG ? U.accent() : U.textMuted());
        ctx.globalAlpha = isBest ? 1 : (isTG ? 0.85 : 0.5);
        ctx.fillRect(padL, y + (rowH - barH) / 2, xToPix(item.val) - padL, barH);
        ctx.globalAlpha = 1;

        // Model name
        ctx.fillStyle = isTG ? U.accent() : U.text();
        ctx.font = (isTG ? '600 ' : '') + '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(item.model, padL - 8, y + rowH / 2);

        // Value annotation
        ctx.fillStyle = isBest ? U.good() : U.text();
        ctx.font = (isBest ? '600 ' : '') + '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        const valStr = item.val < 0.01 ? item.val.toExponential(2) : item.val.toFixed(3);
        const valSuffix = isBest ? ' ★ best' : '';
        ctx.fillText(valStr + valSuffix, xToPix(item.val) + 6, y + rowH / 2);
      });

      // X axis label
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS_sum →', padL + innerW / 2, h - 6);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
