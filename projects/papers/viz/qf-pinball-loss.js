/* viz: qf-pinball-loss - quantile pinball loss visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['qf-pinball-loss'] = function (canvas, controls, params) {
    let quantile = 0.5;
    U.addSlider(controls, {
      label: 'Quantile τ', min: 0.05, max: 0.95, step: 0.05, value: 0.5,
      onInput: (v) => { quantile = parseFloat(v); draw(); },
      fmt: (v) => `τ=${parseFloat(v).toFixed(2)}`
    });

    function pinball(error, tau) {
      return error > 0 ? tau * error : -(1 - tau) * error;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Pinball Loss for Quantile Regression (paper Eq 1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const slope_pos = quantile.toFixed(2);
      const slope_neg = (1 - quantile).toFixed(2);
      ctx.fillText(`L(error) = τ·max(error, 0) + (1-τ)·max(-error, 0). Asymmetry: ${slope_neg}/${slope_pos}`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = -2, xMax = 2;
      const xToPix = (e) => padL + plotW * (e - xMin) / (xMax - xMin);
      const yMin = 0, yMax = 2;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Pinball curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let e = xMin; e <= xMax; e += 0.02) {
        const v = pinball(e, quantile);
        const px = xToPix(e), py = yToPix(v);
        if (e === xMin) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Highlight the kink at 0
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(xToPix(0), yToPix(0), 6, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('kink at e=0', xToPix(0) + 10, yToPix(0) - 6);

      // Annotate slopes
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`slope = ${slope_neg}`, xToPix(-1.4), yToPix(pinball(-1.4, quantile)) - 12);
      ctx.fillText(`slope = ${slope_pos}`, xToPix(1.4), yToPix(pinball(1.4, quantile)) - 12);

      // X axis line at y=0
      ctx.strokeStyle = '#000';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(0)); ctx.lineTo(padL + plotW, yToPix(0));
      ctx.stroke();
      ctx.setLineDash([]);

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [-2, -1, 0, 1, 2].forEach(e => ctx.fillText(e.toString(), xToPix(e), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('error = y_true - y_pred', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Pinball loss L(error)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
