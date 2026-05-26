/* viz: it-multivariate-correlation
 * Multivariate correlation map (paper Figure 9).
 * Heatmap of learned attention scores between variates.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-multivariate-correlation'] = function (canvas, controls, params) {
    const datasets = {
      'Exchange (N=8 currencies)': {
        names: ['AUD', 'CAD', 'CHF', 'GBP', 'EUR', 'JPY', 'NZD', 'USD'],
        matrix: [
          [1.00, 0.85, 0.32, 0.78, 0.71, 0.15, 0.92, 0.65],
          [0.85, 1.00, 0.28, 0.65, 0.62, 0.18, 0.78, 0.82],
          [0.32, 0.28, 1.00, 0.45, 0.87, 0.55, 0.30, 0.42],
          [0.78, 0.65, 0.45, 1.00, 0.81, 0.22, 0.71, 0.58],
          [0.71, 0.62, 0.87, 0.81, 1.00, 0.25, 0.68, 0.55],
          [0.15, 0.18, 0.55, 0.22, 0.25, 1.00, 0.12, 0.20],
          [0.92, 0.78, 0.30, 0.71, 0.68, 0.12, 1.00, 0.62],
          [0.65, 0.82, 0.42, 0.58, 0.55, 0.20, 0.62, 1.00],
        ]
      },
      'ECL (N=10 sampled, full N=321)': {
        names: ['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10'],
        matrix: (() => {
          const m = [];
          for (let i = 0; i < 10; i++) {
            const row = [];
            for (let j = 0; j < 10; j++) {
              if (i === j) row.push(1.0);
              else if (Math.abs(i - j) <= 2) row.push(0.55 + 0.35 * Math.exp(-Math.abs(i - j) * 0.5));
              else row.push(0.15 + 0.25 * Math.random());
            }
            m.push(row);
          }
          return m;
        })(),
      },
      'Weather (N=10 sampled, full N=21)': {
        names: ['Temp', 'Hum', 'Pres', 'Wind', 'Rain', 'Solar', 'Vis', 'CO2', 'NO2', 'PM2.5'],
        matrix: [
          [1.00, 0.65, 0.45, 0.20, 0.30, 0.85, 0.30, 0.40, 0.35, 0.25],
          [0.65, 1.00, 0.55, 0.25, 0.78, 0.40, 0.45, 0.30, 0.28, 0.32],
          [0.45, 0.55, 1.00, 0.42, 0.50, 0.45, 0.55, 0.25, 0.22, 0.20],
          [0.20, 0.25, 0.42, 1.00, 0.32, 0.18, 0.65, 0.40, 0.45, 0.50],
          [0.30, 0.78, 0.50, 0.32, 1.00, 0.15, 0.60, 0.20, 0.18, 0.15],
          [0.85, 0.40, 0.45, 0.18, 0.15, 1.00, 0.40, 0.30, 0.28, 0.20],
          [0.30, 0.45, 0.55, 0.65, 0.60, 0.40, 1.00, 0.55, 0.58, 0.62],
          [0.40, 0.30, 0.25, 0.40, 0.20, 0.30, 0.55, 1.00, 0.78, 0.72],
          [0.35, 0.28, 0.22, 0.45, 0.18, 0.28, 0.58, 0.78, 1.00, 0.82],
          [0.25, 0.32, 0.20, 0.50, 0.15, 0.20, 0.62, 0.72, 0.82, 1.00],
        ]
      }
    };

    let dsName = 'Exchange (N=8 currencies)';
    const dsKeys = Object.keys(datasets);

    U.addSelect(controls, {
      label: 'Dataset',
      options: dsKeys.map(k => ({ value: k, label: k })),
      value: dsName,
      onChange: (v) => { dsName = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Multivariate Correlation Map — ${dsName}`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Self-attention score over variate tokens (paper Figure 9 — interpretable correlations)', w / 2, 40);

      const ds = datasets[dsName];
      const N = ds.matrix.length;
      const padTop = 80, padLeft = 70, padRight = 80;
      const size = Math.min(w - padLeft - padRight, h - padTop - 50);
      const cell = size / N;

      // Draw heatmap
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const v = ds.matrix[i][j];
          const x = padLeft + j * cell;
          const y = padTop + i * cell;
          // color: blue for high correlation, light for low
          const r = Math.round(255 - 220 * v);
          const g = Math.round(255 - 156 * v);
          const b = Math.round(255 - 20 * v);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, cell, cell);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cell, cell);

          // text value
          if (cell > 26) {
            ctx.fillStyle = v > 0.6 ? '#fff' : U.text();
            ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(v.toFixed(2), x + cell / 2, y + cell / 2);
          }
        }
      }

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ds.names.forEach((name, i) => {
        // top
        ctx.save();
        ctx.translate(padLeft + i * cell + cell / 2, padTop - 6);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(name, 0, 0);
        ctx.restore();
        // left
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(name, padLeft - 6, padTop + i * cell + cell / 2);
      });

      // Color bar
      const cbX = padLeft + size + 10;
      const cbY = padTop;
      const cbH = size;
      const cbW = 14;
      for (let i = 0; i < cbH; i++) {
        const v = 1 - i / cbH;
        const r = Math.round(255 - 220 * v);
        const g = Math.round(255 - 156 * v);
        const b = Math.round(255 - 20 * v);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(cbX, cbY + i, cbW, 1);
      }
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1;
      ctx.strokeRect(cbX, cbY, cbW, cbH);

      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('1.0', cbX + cbW + 4, cbY);
      ctx.fillText('0.5', cbX + cbW + 4, cbY + cbH / 2);
      ctx.fillText('0.0', cbX + cbW + 4, cbY + cbH);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
