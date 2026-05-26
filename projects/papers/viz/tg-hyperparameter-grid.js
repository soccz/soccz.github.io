/* viz: tg-hyperparameter-grid
 * 6 datasets × 6 hyperparameter table heatmap.
 * Hyperparameters all identical across datasets — paper's robustness claim.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-hyperparameter-grid'] = function (canvas, controls, params) {
    const datasets = ['Exchange', 'Solar', 'Electricity', 'Traffic', 'Taxi', 'Wikipedia'];
    const hyperparams = [
      { name: 'RNN cells', values: [40, 40, 40, 40, 40, 40], unit: '' },
      { name: 'RNN layers', values: [2, 2, 2, 2, 2, 2], unit: '' },
      { name: 'Diff steps N', values: [100, 100, 100, 100, 100, 100], unit: '' },
      { name: 'β_end', values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1], unit: '' },
      { name: 'Batch size', values: [64, 64, 64, 64, 64, 64], unit: '' },
      { name: 'Learning rate', values: [1e-3, 1e-3, 1e-3, 1e-3, 1e-3, 1e-3], unit: '' },
    ];
    const dimensions = [8, 137, 370, 963, 1214, 2000];
    const crps = [0.006, 0.287, 0.0206, 0.044, 0.114, 0.0485];

    let viewMode = 'identical'; // identical, results

    U.addSelect(controls, {
      label: 'View',
      options: [
        { value: 'identical', label: 'Hyperparameter identity' },
        { value: 'results', label: 'CRPS_sum + D scaling' },
      ],
      value: 'identical',
      onChange: (v) => { viewMode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 110, padR = 30, padT = 70, padB = 40;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const cellW = innerW / datasets.length;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      if (viewMode === 'identical') {
        ctx.fillText('Hyperparameters identical across 6 datasets — robustness claim', w / 2, 22);
      } else {
        ctx.fillText('CRPS_sum and dimension D — 250× D variation, same model config', w / 2, 22);
      }

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const subtitle = viewMode === 'identical'
        ? 'paper Table 1: no dataset-specific tuning required'
        : 'lower CRPS = better; D = number of variables (multivariate)';
      ctx.fillText(subtitle, w / 2, 40);

      // Dataset column headers
      ctx.fillStyle = U.text();
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      datasets.forEach((d, di) => {
        const x = padL + cellW * di + cellW / 2;
        ctx.fillText(d, x, padT - 24);
        // D below dataset name
        ctx.fillStyle = U.textMuted();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(`D=${dimensions[di]}`, x, padT - 10);
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      });

      if (viewMode === 'identical') {
        const rowH = innerH / hyperparams.length;
        hyperparams.forEach((hp, hi) => {
          const y = padT + rowH * hi;
          // Row label
          ctx.fillStyle = U.text();
          ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(hp.name, padL - 10, y + rowH / 2);

          // Cells — all green since identical
          datasets.forEach((d, di) => {
            const x = padL + cellW * di;
            ctx.fillStyle = U.good();
            ctx.globalAlpha = 0.15;
            ctx.fillRect(x + 2, y + 2, cellW - 4, rowH - 4);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = U.good();
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 2, y + 2, cellW - 4, rowH - 4);

            ctx.fillStyle = U.text();
            ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const val = hp.values[di];
            const display = val < 0.01 ? val.toExponential(0) : String(val);
            ctx.fillText(display, x + cellW / 2, y + rowH / 2);
          });
        });
      } else {
        // Bar chart: CRPS per dataset
        const maxC = Math.max(...crps) * 1.15;
        datasets.forEach((d, di) => {
          const x = padL + cellW * di;
          const barH = innerH * 0.6 * (crps[di] / maxC);
          const yBar = padT + innerH * 0.7 - barH;
          ctx.fillStyle = U.accent();
          ctx.fillRect(x + 8, yBar, cellW - 16, barH);

          // CRPS value
          ctx.fillStyle = U.text();
          ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(crps[di].toFixed(4), x + cellW / 2, yBar - 4);

          // Dimension label below bar
          ctx.fillStyle = U.textMuted();
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(`${dimensions[di]} dims`, x + cellW / 2, padT + innerH * 0.7 + 6);
        });

        // Y axis label
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.save();
        ctx.translate(padL - 30, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('CRPS_sum (lower=better)', 0, 0);
        ctx.restore();
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
