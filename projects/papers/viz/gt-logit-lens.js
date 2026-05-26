/* viz: gt-logit-lens
 * Layer-by-layer prediction confidence (paper Figure 4 - Logit Lens).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['gt-logit-lens'] = function (canvas, controls, params) {
    const layers = 8;
    let task = 'composition';

    // Synthetic logit confidence per layer
    const data = {
      composition: [0.02, 0.05, 0.12, 0.28, 0.55, 0.78, 0.89, 0.95],
      comparison:  [0.04, 0.10, 0.25, 0.48, 0.72, 0.88, 0.94, 0.97],
    };

    U.addSelect(controls, {
      label: 'Task',
      options: [
        { value: 'composition', label: 'Composition' },
        { value: 'comparison', label: 'Comparison' },
      ],
      value: 'composition',
      onChange: (v) => { task = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Logit Lens — ${task} task (paper Figure 4)`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Each layer hidden state → unembed → confidence on correct answer', w / 2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xToPix = (l) => padL + innerW * (l + 0.5) / layers;
      const yToPix = (c) => padT + innerH * (1 - c);

      const values = data[task];

      // Bar chart
      const barW = innerW / layers * 0.6;
      values.forEach((v, l) => {
        const x = xToPix(l) - barW / 2;
        const barH = innerH * v;
        const y = padT + innerH - barH;
        // Color intensity
        const r = Math.round(220 - 130 * v);
        const g = Math.round(80 + 130 * v);
        const b = Math.round(120 - 50 * v);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, barW, barH);

        // Value label
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(`${(v*100).toFixed(0)}%`, x + barW / 2, y - 2);
      });

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = 1.0 - i * 0.2;
        ctx.fillText(v.toFixed(1), padL - 8, padT + innerH * i / 5);
      }

      // X labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let l = 0; l < layers; l++) {
        ctx.fillText(`L${l+1}`, xToPix(l), padT + innerH + 6);
      }

      // Annotations
      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('★ generalization circuit emerges here', xToPix(4), padT + innerH * 0.4);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Transformer Layer', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Prediction Confidence', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
