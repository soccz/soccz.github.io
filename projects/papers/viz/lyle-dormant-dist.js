/* viz: lyle-dormant-dist - neuron activation magnitude histogram */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lyle-dormant-dist'] = function (canvas, controls, params) {
    let threshold = 0.01;
    U.addSlider(controls, {
      label: 'NAP threshold', min: 0.001, max: 0.05, step: 0.001, value: 0.01,
      onInput: (v) => { threshold = parseFloat(v); draw(); },
      fmt: (v) => `τ=${parseFloat(v).toFixed(3)}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Dormant Neuron Distribution (paper §5)', w/2, 22);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Distribution: bimodal (dormant cluster + active cluster)
      const xMin = Math.log10(0.0001), xMax = Math.log10(2.0);
      const xToPix = (v) => padL + plotW * (Math.log10(Math.max(v, 1e-5)) - xMin) / (xMax - xMin);
      const yMax = 220;
      const yToPix = (cnt) => padT + plotH * (1 - cnt / yMax);

      // Generate bin data
      const bins = [];
      for (let lx = xMin; lx < xMax; lx += 0.1) {
        const v = Math.pow(10, lx);
        let cnt = 0;
        // Dormant peak around 0.001-0.01
        cnt += 200 * Math.exp(-Math.pow((lx - Math.log10(0.003)) / 0.4, 2));
        // Active peak around 0.1-0.5
        cnt += 150 * Math.exp(-Math.pow((lx - Math.log10(0.2)) / 0.5, 2));
        bins.push({ x: v, count: cnt });
      }

      // Compute dormant/active counts based on threshold
      let dormantCount = 0, activeCount = 0;
      bins.forEach(b => {
        if (b.x < threshold) dormantCount += b.count;
        else activeCount += b.count;
      });
      const totalCount = dormantCount + activeCount;

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'center';
      ctx.fillText(
        `Dormant (< τ): ${(100*dormantCount/totalCount).toFixed(0)}%, Active (≥ τ): ${(100*activeCount/totalCount).toFixed(0)}%`,
        w/2, 40
      );

      // Draw bars
      bins.forEach(b => {
        const isDormant = b.x < threshold;
        const px = xToPix(b.x);
        const next_v = b.x * Math.pow(10, 0.1);
        const px_next = xToPix(next_v);
        ctx.fillStyle = isDormant ? '#dc2626' : '#16a34a';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(px, yToPix(b.count), px_next - px, padT + plotH - yToPix(b.count));
      });
      ctx.globalAlpha = 1;

      // Threshold line
      const tx = xToPix(threshold);
      ctx.strokeStyle = '#000';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, padT); ctx.lineTo(tx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#000';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`τ=${threshold.toFixed(3)}`, tx, padT - 6);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMax * (1 - i/4);
        ctx.fillText(v.toFixed(0), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0.001, 0.01, 0.1, 1.0].forEach(v => {
        ctx.fillText(v.toString(), xToPix(v), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Mean activation magnitude (log)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Neuron count', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
