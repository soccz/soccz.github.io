/* viz: chronos-forecast - probabilistic forecast samples */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chronos-forecast'] = function (canvas, controls, params) {
    let numSamples = 50;

    U.addSlider(controls, {
      label: '# Samples', min: 1, max: 200, step: 1, value: 50,
      onInput: (v) => { numSamples = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    let seed;
    function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
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
      ctx.fillText('Probabilistic Forecast (paper §4)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${numSamples} autoregressive samples → Q05/Q50/Q95`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      const T_ctx = 60, T_fcst = 30;
      const T_total = T_ctx + T_fcst;
      const xToPix = (t) => padL + plotW * (t / T_total);
      const yMin = -1.0, yMax = 2.0;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Context
      const ctx_vals = [];
      for (let i = 0; i < T_ctx; i++) {
        ctx_vals.push(0.5 + 0.3 * Math.sin(i * 0.25) + 0.05 * (Math.random() - 0.5));
      }
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx_vals.forEach((v, i) => {
        const px = xToPix(i), py = yToPix(v);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Generate samples
      seed = 42;
      const allSamples = [];
      for (let s = 0; s < numSamples; s++) {
        const path = [];
        for (let i = 0; i < T_fcst; i++) {
          const t_total = T_ctx + i;
          const mean = 0.5 + 0.3 * Math.sin(t_total * 0.25);
          const sigma = 0.1 + 0.02 * i;  // growing uncertainty
          path.push(mean + sigma * gauss());
        }
        allSamples.push(path);
      }

      // Plot samples (light alpha)
      allSamples.forEach(path => {
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        path.forEach((v, i) => {
          const px = xToPix(T_ctx + i), py = yToPix(v);
          if (i === 0) ctx.moveTo(xToPix(T_ctx - 1), yToPix(ctx_vals[T_ctx - 1]));
          ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // Compute quantiles
      const q05 = [], q50 = [], q95 = [];
      for (let i = 0; i < T_fcst; i++) {
        const vals = allSamples.map(s => s[i]).sort((a, b) => a - b);
        q05.push(vals[Math.floor(vals.length * 0.05)]);
        q50.push(vals[Math.floor(vals.length * 0.5)]);
        q95.push(vals[Math.floor(vals.length * 0.95)]);
      }

      // Shaded uncertainty
      ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
      ctx.beginPath();
      ctx.moveTo(xToPix(T_ctx), yToPix(q95[0]));
      for (let i = 0; i < T_fcst; i++) ctx.lineTo(xToPix(T_ctx + i), yToPix(q95[i]));
      for (let i = T_fcst - 1; i >= 0; i--) ctx.lineTo(xToPix(T_ctx + i), yToPix(q05[i]));
      ctx.closePath();
      ctx.fill();

      // Median
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      q50.forEach((v, i) => {
        const px = xToPix(T_ctx + i), py = yToPix(v);
        if (i === 0) {
          ctx.moveTo(xToPix(T_ctx - 1), yToPix(ctx_vals[T_ctx - 1]));
          ctx.lineTo(px, py);
        } else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Divider
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(T_ctx), padT); ctx.lineTo(xToPix(T_ctx), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('context →   forecast →', xToPix(T_ctx), padT - 6);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 8, padT + plotH * i / 4);
      }

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
