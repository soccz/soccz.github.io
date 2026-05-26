/* viz: it-datasets-summary
 * 7 datasets × 11 models MSE/MAE summary (paper Table 1).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-datasets-summary'] = function (canvas, controls, params) {
    const datasets = ['ECL', 'ETT(avg)', 'Exchange', 'Traffic', 'Weather', 'Solar', 'PEMS'];
    const models = [
      'iTransformer', 'RLinear', 'PatchTST', 'Crossformer', 'TiDE',
      'TimesNet', 'DLinear', 'SCINet', 'FEDformer', 'Stationary', 'Autoformer'
    ];

    const mseData = {
      'iTransformer': [0.178, 0.383, 0.360, 0.428, 0.258, 0.233, 0.119],
      'RLinear':       [0.219, 0.380, 0.378, 0.626, 0.272, 0.369, 0.514],
      'PatchTST':      [0.205, 0.381, 0.367, 0.481, 0.259, 0.270, 0.217],
      'Crossformer':   [0.244, 0.685, 0.940, 0.550, 0.259, 0.641, 0.220],
      'TiDE':          [0.251, 0.482, 0.370, 0.760, 0.271, 0.347, 0.375],
      'TimesNet':      [0.192, 0.391, 0.416, 0.620, 0.259, 0.301, 0.148],
      'DLinear':       [0.212, 0.442, 0.354, 0.625, 0.265, 0.330, 0.320],
      'SCINet':        [0.268, 0.689, 0.750, 0.804, 0.292, 0.282, 0.121],
      'FEDformer':     [0.214, 0.408, 0.519, 0.610, 0.309, 0.291, 0.224],
      'Stationary':    [0.193, 0.471, 0.461, 0.624, 0.288, 0.261, 0.151],
      'Autoformer':    [0.227, 0.465, 0.613, 0.628, 0.338, 0.885, 0.614],
    };

    let highlight = 'iTransformer';

    U.addSelect(controls, {
      label: 'Highlight model',
      options: models.map(m => ({ value: m, label: m })),
      value: highlight,
      onChange: (v) => { highlight = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('7 Datasets × 11 Models MSE (paper Table 1)', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`★ best per dataset highlighted. iTransformer: 6/7 SOTA (lower = better)`, w / 2, 40);

      const padL = 80, padR = 30, padT = 80, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const cellW = innerW / datasets.length;
      const cellH = innerH / models.length;

      // Best per dataset
      const bestPerDataset = datasets.map((_, di) => {
        let bestVal = Infinity, bestModel = null;
        models.forEach(m => {
          if (mseData[m][di] < bestVal) {
            bestVal = mseData[m][di];
            bestModel = m;
          }
        });
        return { val: bestVal, model: bestModel };
      });

      // Dataset headers
      datasets.forEach((d, di) => {
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(padL + cellW * di + cellW / 2, padT - 18);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(d, 0, 0);
        ctx.restore();
      });

      // Model rows
      models.forEach((m, mi) => {
        const isHighlight = m === highlight;
        ctx.fillStyle = isHighlight ? U.accent() : U.text();
        ctx.font = isHighlight ? '700 11px ' + U.cssVar('--font-display', 'Inter, sans-serif') : '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m, padL - 6, padT + cellH * mi + cellH / 2);

        // Cells
        datasets.forEach((d, di) => {
          const v = mseData[m][di];
          const isBest = bestPerDataset[di].model === m;
          const x = padL + di * cellW;
          const y = padT + mi * cellH;

          // Color scale: blue for low MSE (good), red for high
          const allVals = datasets.flatMap((_, j) => models.map(mm => mseData[mm][j]));
          const minV = 0.1, maxV = 1.0;
          const norm = Math.max(0, Math.min(1, (v - minV) / (maxV - minV)));
          const r = Math.round(80 + 175 * norm);
          const g = Math.round(180 - 130 * norm);
          const b = Math.round(220 - 200 * norm);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.globalAlpha = isHighlight ? 1 : 0.6;
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          ctx.globalAlpha = 1;

          if (isBest) {
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);
          } else {
            ctx.strokeStyle = U.textMuted();
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
          }

          ctx.fillStyle = norm > 0.5 ? '#fff' : U.text();
          ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(3), x + cellW / 2, y + cellH / 2);
          if (isBest) {
            ctx.font = '8px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('★', x + cellW - 8, y + 8);
          }
        });
      });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
