/* viz: shao-quantile-output - quantile forecast visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['shao-quantile-output'] = function (canvas, controls, params) {
    let showQuantiles = 'all';
    U.addSelect(controls, {
      label: 'Quantiles',
      options: [
        { value: 'all',   label: 'All (Q05/Q25/Q50/Q75/Q95)' },
        { value: '50',    label: 'Q50 only (median)' },
        { value: '5095',  label: 'Q05/Q95 only (band)' }
      ],
      value: 'all',
      onChange: (v) => { showQuantiles = v; draw(); }
    });

    let seedState;
    function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }
    function gauss() {
      const u1 = Math.max(rand(), 1e-9), u2 = rand();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Multi-Quantile Forecast (paper §4)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Pinball loss → calibrated quantile prediction', w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T_ctx = 50, T_fcst = 30, T = T_ctx + T_fcst;
      const xToPix = (t) => padL + plotW * (t / T);
      const yMin = -1.5, yMax = 2.0;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      seedState = 42;
      // Context
      const ctxVals = [];
      for (let t = 0; t < T_ctx; t++) {
        ctxVals.push(0.5 + 0.3 * Math.sin(t * 0.3) + 0.05 * gauss());
      }

      // Forecast quantiles (widening uncertainty)
      const q05 = [], q25 = [], q50 = [], q75 = [], q95 = [];
      for (let t = 0; t < T_fcst; t++) {
        const mean = 0.5 + 0.3 * Math.sin((T_ctx + t) * 0.3);
        const sigma = 0.1 + 0.015 * t;
        q05.push(mean - 1.645 * sigma);
        q25.push(mean - 0.674 * sigma);
        q50.push(mean);
        q75.push(mean + 0.674 * sigma);
        q95.push(mean + 1.645 * sigma);
      }

      // Context line
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctxVals.forEach((v, i) => {
        const px = xToPix(i), py = yToPix(v);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Q05/Q95 band
      if (showQuantiles === 'all' || showQuantiles === '5095') {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
        ctx.beginPath();
        ctx.moveTo(xToPix(T_ctx), yToPix(q95[0]));
        for (let t = 0; t < T_fcst; t++) ctx.lineTo(xToPix(T_ctx + t), yToPix(q95[t]));
        for (let t = T_fcst - 1; t >= 0; t--) ctx.lineTo(xToPix(T_ctx + t), yToPix(q05[t]));
        ctx.closePath();
        ctx.fill();
      }

      // Q25/Q75 band
      if (showQuantiles === 'all') {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.30)';
        ctx.beginPath();
        ctx.moveTo(xToPix(T_ctx), yToPix(q75[0]));
        for (let t = 0; t < T_fcst; t++) ctx.lineTo(xToPix(T_ctx + t), yToPix(q75[t]));
        for (let t = T_fcst - 1; t >= 0; t--) ctx.lineTo(xToPix(T_ctx + t), yToPix(q25[t]));
        ctx.closePath();
        ctx.fill();
      }

      // Q50 line
      if (showQuantiles === 'all' || showQuantiles === '50') {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        q50.forEach((v, i) => {
          const px = xToPix(T_ctx + i), py = yToPix(v);
          if (i === 0) {
            ctx.moveTo(xToPix(T_ctx - 1), yToPix(ctxVals[T_ctx - 1]));
            ctx.lineTo(px, py);
          } else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      // Divider
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(T_ctx), padT); ctx.lineTo(xToPix(T_ctx), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend
      const lgX = padL + 10, lgY = padT + 10;
      ctx.fillStyle = 'rgba(37, 99, 235, 0.30)';
      ctx.fillRect(lgX, lgY, 14, 10);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('Q25-Q75 (50% interval)', lgX + 20, lgY + 5);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
      ctx.fillRect(lgX, lgY + 16, 14, 10);
      ctx.fillStyle = U.text();
      ctx.fillText('Q05-Q95 (90% interval)', lgX + 20, lgY + 21);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(lgX, lgY + 32 + 5); ctx.lineTo(lgX + 14, lgY + 32 + 5);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('Q50 (median)', lgX + 20, lgY + 37);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
