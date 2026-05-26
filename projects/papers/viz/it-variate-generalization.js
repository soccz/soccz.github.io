/* viz: it-variate-generalization
 * Variate generalization (paper Figure 5).
 * Compare iTransformer vs CI-Transformer on unseen variates (trained on 20%).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-variate-generalization'] = function (canvas, controls, params) {
    const datasets = {
      'ECL (N=321)': {
        models: ['Transformer', 'Informer', 'Reformer', 'Flowformer'],
        ciValues: [0.420, 0.435, 0.450, 0.395],   // CI- on unseen variates (high MSE)
        itValues: [0.230, 0.245, 0.265, 0.245],    // iTransformer on unseen
        baseline: 0.178,                            // iTransformer on 100% variates
      },
      'Traffic (N=862)': {
        models: ['Transformer', 'Informer', 'Reformer', 'Flowformer'],
        ciValues: [0.945, 0.985, 0.920, 0.880],
        itValues: [0.520, 0.560, 0.575, 0.555],
        baseline: 0.428,
      },
      'Solar-Energy (N=137)': {
        models: ['Transformer', 'Informer', 'Reformer', 'Flowformer'],
        ciValues: [0.650, 0.685, 0.710, 0.640],
        itValues: [0.310, 0.335, 0.345, 0.325],
        baseline: 0.233,
      },
    };

    let dsName = 'ECL (N=321)';

    U.addSelect(controls, {
      label: 'Dataset',
      options: Object.keys(datasets).map(k => ({ value: k, label: k })),
      value: dsName,
      onChange: (v) => { dsName = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Variate Generalization — ${dsName} (paper Figure 5)`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Trained on 20% variates → forecast 100%. Lower MSE = better generalization.', w / 2, 40);

      const ds = datasets[dsName];
      const padL = 70, padR = 30, padT = 70, padB = 90;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const allVals = ds.ciValues.concat(ds.itValues).concat([ds.baseline]);
      const yMax = Math.max(...allVals) * 1.1;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax * (1 - i / 5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 5);
      }

      // Baseline line (iTransformer trained on 100% variates)
      const baseY = padT + innerH * (1 - ds.baseline / yMax);
      ctx.strokeStyle = '#16a34a';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, baseY); ctx.lineTo(padL + innerW, baseY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#16a34a';
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillText(`baseline (trained 100%): ${ds.baseline.toFixed(3)}`, padL + 4, baseY - 2);

      // Bars per model
      const groupW = innerW / ds.models.length;
      const barW = groupW * 0.32;

      ds.models.forEach((m, mi) => {
        const cx = padL + groupW * mi + groupW / 2;

        // CI bar (left)
        const ciH = innerH * (ds.ciValues[mi] / yMax);
        const ciX = cx - groupW * 0.36;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(ciX, padT + innerH - ciH, barW, ciH);

        // iTransformer bar (right)
        const itH = innerH * (ds.itValues[mi] / yMax);
        const itX = cx + groupW * 0.04;
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(itX, padT + innerH - itH, barW, itH);

        // Values
        ctx.fillStyle = U.text();
        ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(ds.ciValues[mi].toFixed(2), ciX + barW / 2, padT + innerH - ciH - 2);
        ctx.fillText(ds.itValues[mi].toFixed(2), itX + barW / 2, padT + innerH - itH - 2);

        // Model name
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(m, cx, padT + innerH + 6);

        // % degradation
        const ciDeg = ((ds.ciValues[mi] - ds.baseline) / ds.baseline * 100).toFixed(0);
        const itDeg = ((ds.itValues[mi] - ds.baseline) / ds.baseline * 100).toFixed(0);
        ctx.fillStyle = U.textMuted();
        ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(`+${ciDeg}% / +${itDeg}%`, cx, padT + innerH + 22);
      });

      // Legend
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 10, padT + 8, 14, 8);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('CI-Transformer (Channel Independence)', padL + 28, padT + 12);

      ctx.fillStyle = '#16a34a';
      ctx.fillRect(padL + 250, padT + 8, 14, 8);
      ctx.fillStyle = U.text();
      ctx.fillText('iTransformer', padL + 268, padT + 12);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Transformer Variant (CI vs Inverted)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('MSE on unseen variates', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
