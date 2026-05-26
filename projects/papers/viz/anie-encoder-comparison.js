/* viz: anie-encoder-comparison
 * BiLSTM vs CNN vs Average encoder — τ_g comparison across datasets.
 * Reproduces paper supplementary table pattern.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-encoder-comparison'] = function (canvas, controls, params) {
    const datasets = ['SST', 'IMDB', 'ADR', '20News', 'AG News', 'Diabetes', 'Anemia', 'bAbI 2', 'SNLI'];
    const tau_bilstm = [0.40, 0.37, 0.45, 0.11, 0.39, 0.43, 0.43, 0.17, 0.39];
    const tau_cnn =    [0.56, 0.54, 0.62, 0.45, 0.61, 0.58, 0.65, 0.55, 0.50];
    const tau_avg =    [0.69, 0.66, 0.71, 0.66, 0.76, 0.68, 0.81, 0.84, 0.55];

    let highlight = -1;

    U.addSelect(controls, {
      label: 'Highlight',
      options: [
        { value: '-1', label: 'All' },
        { value: '0', label: 'BiLSTM' },
        { value: '1', label: 'CNN' },
        { value: '2', label: 'Average' },
      ],
      value: '-1',
      onChange: (v) => { highlight = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 80, padR = 30, padT = 60, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Encoder Comparison — τ_g (Kendall correlation with gradient)', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Mixing strength continuum: BiLSTM (high) → CNN (mid) → Average (none) — explanation power inversely related', w / 2, 40);

      // Axes
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const yMax = 1.0;
      // Group bars per dataset
      const groupW = innerW / datasets.length;
      const barW = groupW * 0.27;

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax * (1 - i / 5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 5);
      }

      const colors = ['#dc2626', '#f59e0b', '#2563eb'];
      const labels = ['BiLSTM', 'CNN', 'Average'];
      const series = [tau_bilstm, tau_cnn, tau_avg];

      datasets.forEach((ds, di) => {
        const cx = padL + groupW * di + groupW / 2;
        // Dataset label
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(ds, cx, padT + innerH + 6);

        // 3 bars
        series.forEach((s, si) => {
          const bx = cx - groupW * 0.4 + si * barW;
          const v = s[di];
          const barH = innerH * v / yMax;
          ctx.fillStyle = colors[si];
          ctx.globalAlpha = (highlight === -1 || highlight === si) ? 1 : 0.2;
          ctx.fillRect(bx, padT + innerH - barH, barW, barH);

          // value label
          if (highlight === si || (highlight === -1 && barH > 30)) {
            ctx.fillStyle = U.text();
            ctx.globalAlpha = 1;
            ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(v.toFixed(2), bx + barW / 2, padT + innerH - barH - 2);
          }
          ctx.globalAlpha = 1;
        });
      });

      // Legend
      const legendY = padT + 14;
      let lx = padL + 8;
      labels.forEach((lbl, i) => {
        ctx.fillStyle = colors[i];
        ctx.globalAlpha = (highlight === -1 || highlight === i) ? 1 : 0.2;
        ctx.fillRect(lx, legendY - 4, 14, 8);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(lbl, lx + 20, legendY);
        lx += ctx.measureText(lbl).width + 50;
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Dataset', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(16, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Mean τ_g', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
