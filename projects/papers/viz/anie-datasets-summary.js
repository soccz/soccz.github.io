/* viz: anie-datasets-summary
 * 12 datasets summary heatmap — τ_g, τ_loo, permutation, adversarial.
 * Visual summary of paper Table 2 + key findings.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-datasets-summary'] = function (canvas, controls, params) {
    const datasets = ['SST', 'IMDB', 'ADR', '20News', 'AG News', 'Diabetes', 'Anemia', 'CNN-QA', 'bAbI 1', 'bAbI 2', 'bAbI 3', 'SNLI'];
    const metrics = {
      'τ_g (BiLSTM)': [0.40, 0.37, 0.45, 0.11, 0.39, 0.43, 0.43, 0.20, 0.23, 0.17, 0.30, 0.39],
      'τ_loo (BiLSTM)': [0.34, 0.30, 0.35, 0.10, 0.34, 0.41, 0.43, 0.16, 0.23, 0.11, 0.31, 0.44],
      'τ_g (Average)': [0.69, 0.66, 0.71, 0.66, 0.76, 0.68, 0.81, 0.48, 0.66, 0.84, 0.76, 0.55],
      '∆ŷ (permute, median)': [0.005, 0.010, 0.012, 0.025, 0.008, 0.150, 0.110, 0.018, 0.020, 0.025, 0.025, 0.030],
      'Adv. JSD (mean, TVD<0.10)': [0.42, 0.45, 0.43, 0.41, 0.46, 0.18, 0.22, 0.40, 0.38, 0.43, 0.44, 0.41],
    };

    let metric = 'τ_g (BiLSTM)';

    U.addSelect(controls, {
      label: 'Metric',
      options: Object.keys(metrics).map(k => ({ value: k, label: k })),
      value: 'τ_g (BiLSTM)',
      onChange: (v) => { metric = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 40, padR = 30, padT = 60, padB = 110;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`12 Datasets Summary — ${metric}`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Color: red = low (fail interpretation) → blue = high (good interpretation), except permutation where reverse', w / 2, 40);

      const values = metrics[metric];
      const cellW = innerW / datasets.length;
      const cellH = innerH;

      // Color scheme depends on metric direction
      const reverseColor = metric.startsWith('∆ŷ') || metric.startsWith('Adv');
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);

      datasets.forEach((d, i) => {
        const x = padL + cellW * i;
        const v = values[i];
        const norm = (v - vMin) / (vMax - vMin + 1e-9);
        const cVal = reverseColor ? norm : (1 - norm);
        // red-blue scale
        const r = Math.round(255 * cVal);
        const b = Math.round(255 * (1 - cVal));
        const g = Math.round(80 + 80 * (1 - Math.abs(cVal - 0.5) * 2));

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x + 2, padT + 2, cellW - 4, cellH - 4);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = U.textMuted();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, padT + 2, cellW - 4, cellH - 4);

        // Value
        ctx.fillStyle = '#fff';
        ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(3), x + cellW / 2, padT + cellH / 2 - 8);

        // Dataset name below
        ctx.save();
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.translate(x + cellW / 2, padT + cellH + 16);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'right';
        ctx.fillText(d, 0, 0);
        ctx.restore();
      });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
