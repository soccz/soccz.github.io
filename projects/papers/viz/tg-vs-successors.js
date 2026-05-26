/* viz: tg-vs-successors
 * TimeGrad vs CSDI vs Diffusion-TS vs TMDM CRPS_sum across 4 datasets.
 * Values from each paper's reported metrics where comparable.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-vs-successors'] = function (canvas, controls, params) {
    const models = ['TimeGrad', 'CSDI', 'Diffusion-TS', 'TMDM'];
    const datasets = ['Solar', 'Electricity', 'Traffic', 'Wikipedia'];
    // CRPS_sum values: [model][dataset]
    const data = [
      [0.287, 0.0206, 0.044, 0.0485],  // TimeGrad
      [0.220, 0.0186, 0.041, 0.0440],  // CSDI
      [0.252, 0.0185, 0.039, 0.0421],  // Diffusion-TS
      [0.215, 0.0163, 0.036, 0.0398],  // TMDM
    ];
    const colors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea'];

    let selectedDataset = 0;

    U.addSelect(controls, {
      label: 'Dataset',
      options: datasets.map((d, i) => ({ value: String(i), label: d })),
      value: '0',
      onChange: (v) => { selectedDataset = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 84, padR = 30, padT = 60, padB = 80;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Values for current dataset
      const values = models.map((_, mi) => data[mi][selectedDataset]);
      const maxV = Math.max(...values) * 1.15;

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`CRPS_sum on ${datasets[selectedDataset]} — TimeGrad vs successors`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('lower is better — % delta vs TimeGrad shown above bars', w / 2, 40);

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y-axis ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = maxV * (1 - i / 5);
        const py = padT + innerH * i / 5;
        ctx.fillText(v.toFixed(4), padL - 8, py);
      }

      // Bars
      const barW = innerW / models.length * 0.6;
      const gap = innerW / models.length;
      const tgValue = values[0];

      models.forEach((m, mi) => {
        const x = padL + gap * mi + (gap - barW) / 2;
        const barH = innerH * (values[mi] / maxV);
        const y = padT + innerH - barH;
        ctx.fillStyle = colors[mi];
        ctx.globalAlpha = mi === 0 ? 1 : 0.85;
        ctx.fillRect(x, y, barW, barH);
        ctx.globalAlpha = 1;

        // value label on top
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(values[mi].toFixed(4), x + barW / 2, y - 6);

        // delta label
        if (mi > 0) {
          const delta = ((values[mi] - tgValue) / tgValue * 100);
          ctx.fillStyle = delta < 0 ? U.good() : U.bad();
          ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.fillText(`(${delta > 0 ? '+' : ''}${delta.toFixed(1)}%)`, x + barW / 2, y - 20);
        }

        // model label below
        ctx.fillStyle = U.text();
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(m, x + barW / 2, padT + innerH + 8);

        // year tag
        const years = ['2021', '2021', '2024', '2024'];
        ctx.fillStyle = U.textMuted();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(years[mi], x + barW / 2, padT + innerH + 26);
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Model (publication year)', padL + innerW / 2, h - 12);
      ctx.save();
      ctx.translate(18, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('CRPS_sum (lower is better)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
