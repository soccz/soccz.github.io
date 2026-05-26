/* viz: anie-correlation-hist
 * Kendall τ histograms (BiLSTM vs Average encoder).
 * Reproduces paper Figure 2 pattern.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-correlation-hist'] = function (canvas, controls, params) {
    // Paper Table 2 means + std → synthetic histograms
    const datasets = {
      'SST': { bilstm_mean: 0.40, bilstm_std: 0.21, avg_mean: 0.69, avg_std: 0.15 },
      'IMDB': { bilstm_mean: 0.37, bilstm_std: 0.07, avg_mean: 0.66, avg_std: 0.05 },
      'ADR': { bilstm_mean: 0.45, bilstm_std: 0.17, avg_mean: 0.71, avg_std: 0.13 },
      '20News': { bilstm_mean: 0.11, bilstm_std: 0.16, avg_mean: 0.66, avg_std: 0.09 },
      'AG News': { bilstm_mean: 0.39, bilstm_std: 0.12, avg_mean: 0.76, avg_std: 0.08 },
      'Diabetes': { bilstm_mean: 0.43, bilstm_std: 0.07, avg_mean: 0.68, avg_std: 0.02 },
      'Anemia': { bilstm_mean: 0.43, bilstm_std: 0.06, avg_mean: 0.81, avg_std: 0.01 },
      'bAbI 2': { bilstm_mean: 0.17, bilstm_std: 0.12, avg_mean: 0.84, avg_std: 0.09 },
      'SNLI': { bilstm_mean: 0.39, bilstm_std: 0.21, avg_mean: 0.55, avg_std: 0.19 },
    };

    let ds = 'SST';
    let metric = 'tau_g';

    const dsKeys = Object.keys(datasets);

    U.addSelect(controls, {
      label: 'Dataset',
      options: dsKeys.map(k => ({ value: k, label: k })),
      value: 'SST',
      onChange: (v) => { ds = v; draw(); }
    });
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'tau_g', label: 'τ_g (gradient)' },
        { value: 'tau_loo', label: 'τ_loo (leave-one-out)' },
      ],
      value: 'tau_g',
      onChange: (v) => { metric = v; draw(); }
    });

    function gaussianBins(mean, std, nBins, xMin, xMax) {
      const bins = new Array(nBins).fill(0);
      const dx = (xMax - xMin) / nBins;
      for (let i = 0; i < nBins; i++) {
        const x = xMin + (i + 0.5) * dx;
        bins[i] = Math.exp(-0.5 * ((x - mean) / std) ** 2);
      }
      // normalize
      const sum = bins.reduce((a, b) => a + b, 0);
      return bins.map(b => b / sum);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 30, padT = 60, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Kendall τ Histogram — ${ds} (${metric === 'tau_g' ? 'τ_g vs gradient' : 'τ_loo vs LOO'})`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('BiLSTM (red) vs Average (blue) — Average shifts strongly right (better correlation)', w / 2, 40);

      const stats = datasets[ds];
      const bilstmMean = stats.bilstm_mean;
      const bilstmStd = stats.bilstm_std;
      const avgMean = stats.avg_mean;
      const avgStd = stats.avg_std;

      // Bins
      const nBins = 40;
      const xMin = -1.0, xMax = 1.0;
      const bilstmBins = gaussianBins(bilstmMean, bilstmStd, nBins, xMin, xMax);
      const avgBins = gaussianBins(avgMean, avgStd, nBins, xMin, xMax);

      const maxFreq = Math.max(...bilstmBins, ...avgBins) * 1.1;

      // Axes
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = maxFreq * (1 - i / 5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 5);
      }
      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 4; i++) {
        const x = xMin + (xMax - xMin) * i / 4;
        ctx.fillText(x.toFixed(1), padL + innerW * i / 4, padT + innerH + 6);
      }

      // Plot bins
      const barW = innerW / nBins;
      function plotBins(bins, color, alpha) {
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        for (let i = 0; i < nBins; i++) {
          const x = padL + barW * i;
          const barH = innerH * (bins[i] / maxFreq);
          ctx.fillRect(x + 1, padT + innerH - barH, barW - 2, barH);
        }
        ctx.globalAlpha = 1;
      }

      plotBins(bilstmBins, '#dc2626', 0.55);
      plotBins(avgBins, '#2563eb', 0.55);

      // Mean markers
      function vline(meanX, color, label) {
        const px = padL + innerW * (meanX - xMin) / (xMax - xMin);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, padT); ctx.lineTo(px, padT + innerH);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(label, px, padT - 4);
      }
      vline(bilstmMean, '#dc2626', `BiLSTM μ=${bilstmMean.toFixed(2)}`);
      vline(avgMean, '#2563eb', `Average μ=${avgMean.toFixed(2)}`);

      // Legend
      const legendY = padT + 14;
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 10, legendY - 4, 14, 8);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('BiLSTM', padL + 28, legendY);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(padL + 90, legendY - 4, 14, 8);
      ctx.fillStyle = U.text();
      ctx.fillText('Average', padL + 108, legendY);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Kendall τ', padL + innerW / 2, h - 8);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Frequency (normalized)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
