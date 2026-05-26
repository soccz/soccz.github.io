/* viz: kmz-double-descent - double descent curve */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['kmz-double-descent'] = function (canvas, controls, params) {
    let regParam = 0.001;
    U.addSlider(controls, {
      label: 'Ridge λ', min: 0, max: 5, step: 1, value: 3,
      onInput: (v) => { regParam = [0, 0.0001, 0.001, 0.01, 0.1, 1.0][parseInt(v)]; draw(); },
      fmt: (v) => `λ=${[0, 0.0001, 0.001, 0.01, 0.1, 1.0][parseInt(v)]}`
    });

    function ridgeR2(P, T, lambda) {
      const ratio = P / T;
      // Simulated double descent curve
      let val;
      if (lambda === 0) {
        // No regularization: classic U-curve with spike at P=T
        if (ratio < 1) val = 0.005 + 0.05 * ratio;
        else if (ratio < 1.1) val = -0.5 + (ratio - 1) * 50;  // catastrophic spike
        else val = 0.02 + 0.04 * Math.log(ratio);
      } else {
        // With regularization: monotonic increase (virtue of complexity)
        val = 0.005 + 0.08 * (1 - Math.exp(-ratio / 5)) * Math.exp(-lambda * 0.5);
      }
      return Math.max(0, val);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Virtue of Complexity / Double Descent (paper Fig 7 Panel A)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`OOS R² vs P/T (parameters/samples), λ=${regParam}`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 600;
      const xMin = -1.0, xMax = 1.5;  // log10 of P/T
      const xToPix = (logR) => padL + plotW * (logR - xMin) / (xMax - xMin);
      const yMin = -0.05, yMax = 0.15;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const points = 200;
      for (let i = 0; i <= points; i++) {
        const logR = xMin + (xMax - xMin) * (i / points);
        const ratio = Math.pow(10, logR);
        const P = ratio * T;
        const r2 = ridgeR2(P, T, regParam);
        const px = xToPix(logR), py = yToPix(r2);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // P/T = 1 interpolation threshold
      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xToPix(0), padT); ctx.lineTo(xToPix(0), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#dc2626';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('P/T = 1', xToPix(0), padT - 6);
      ctx.fillText('(interpolation threshold)', xToPix(0), padT + 8);

      // Virtue zone
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.08;
      ctx.fillRect(xToPix(0.5), padT, xToPix(xMax) - xToPix(0.5), plotH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Virtue of complexity', (xToPix(0.5) + xToPix(xMax)) / 2, padT + plotH - 14);

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(2), padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [-1, 0, 1].forEach(logR => {
        const ratio = Math.pow(10, logR);
        ctx.fillText(ratio < 1 ? `1/${(1/ratio).toFixed(0)}` : ratio.toFixed(0), xToPix(logR), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('P/T (parameters / samples, log scale)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('OOS R²', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
