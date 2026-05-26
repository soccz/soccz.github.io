/* viz: anie-tvd-jsd-2d
 * 2D scatter: TVD vs JSD for adversarial attention search.
 * Shows the feasible region where adversarial attention exists.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-tvd-jsd-2d'] = function (canvas, controls, params) {
    let dataset = 'SST';

    function generatePoints(ds) {
      const points = [];
      const N = 250;
      let seed = ds.length * 13 + ds.charCodeAt(0);
      function rand() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }

      const adversarialDifficult = ds === 'Diabetes';

      for (let i = 0; i < N; i++) {
        let tvd, jsd;
        if (adversarialDifficult) {
          // Diabetes: high JSD requires high TVD (difficult)
          jsd = rand() * 0.55;
          tvd = 0.05 + jsd * 0.7 + (rand() - 0.5) * 0.1;
        } else {
          // Most: JSD high, TVD low (easy adversarial)
          jsd = rand() * 0.55;
          tvd = (rand() * 0.12) * (1 - jsd * 0.6);
        }
        tvd = Math.max(0, Math.min(0.35, tvd));
        jsd = Math.max(0, jsd);
        points.push({ tvd, jsd });
      }
      return points;
    }

    const datasets = ['SST', 'IMDB', 'ADR', 'AG News', 'Diabetes', 'Anemia', 'SNLI'];

    U.addSelect(controls, {
      label: 'Dataset',
      options: datasets.map(d => ({ value: d, label: d })),
      value: 'SST',
      onChange: (v) => { dataset = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const eps = 0.10;
      const points = generatePoints(dataset);

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Adversarial Feasible Region — ${dataset}`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const note = dataset === 'Diabetes'
        ? 'Diabetes: adversarial difficult — high JSD requires high TVD (attention truly matters here)'
        : 'Adversarial easy — many points with high JSD AND low TVD (TVD < 0.10) ★ failure of attention-as-explanation';
      ctx.fillText(note, w / 2, 40);

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMax = 0.35, yMax = 0.6;
      const xToPix = (x) => padL + innerW * (x / xMax);
      const yToPix = (y) => padT + innerH * (1 - y / yMax);

      // Constraint region (TVD < eps)
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.12;
      ctx.fillRect(padL, padT, xToPix(eps) - padL, innerH);
      ctx.globalAlpha = 1;

      // Vertical line at eps
      ctx.strokeStyle = '#16a34a';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xToPix(eps), padT); ctx.lineTo(xToPix(eps), padT + innerH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 6; i++) {
        const v = yMax * (1 - i / 6);
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 6);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 7; i++) {
        const v = xMax * i / 7;
        ctx.fillText(v.toFixed(2), padL + innerW * i / 7, padT + innerH + 6);
      }

      // Points
      for (const p of points) {
        const inRegion = p.tvd < eps;
        ctx.fillStyle = inRegion ? '#16a34a' : '#9ca3af';
        ctx.globalAlpha = inRegion ? 0.75 : 0.3;
        ctx.beginPath();
        ctx.arc(xToPix(p.tvd), yToPix(p.jsd), 3, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Statistics
      const inRegionCount = points.filter(p => p.tvd < eps).length;
      const highJSDinRegion = points.filter(p => p.tvd < eps && p.jsd > 0.30).length;

      ctx.fillStyle = U.text();
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(`${inRegionCount}/${points.length} (${(inRegionCount/points.length*100).toFixed(0)}%) in TVD<${eps} region`, padL + 10, padT + innerH - 30);
      ctx.fillText(`★ ${highJSDinRegion} of those with JSD>0.30 (adversarial exists)`, padL + 10, padT + innerH - 14);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('TVD(ŷ, ŷ̃) — prediction change', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('JSD(α, α̃) — attention divergence', 0, 0);
      ctx.restore();

      // Eps annotation
      ctx.fillStyle = '#16a34a';
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillText(`ε=${eps}`, xToPix(eps) + 4, padT + 14);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
