/* viz: protran-motion-trajectory - motion prediction trajectory */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-motion-trajectory'] = function (canvas, controls, params) {
    let sampleCount = 20;
    U.addSlider(controls, {
      label: '# samples', min: 5, max: 50, step: 5, value: 20,
      onInput: (v) => { sampleCount = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
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
      ctx.fillText('Motion Trajectory Prediction (paper Fig 3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Human3.6M joint trajectory · ${sampleCount} ProTran samples vs ground truth`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T_ctx = 25, T_fcst = 25, T = T_ctx + T_fcst;
      const xToPix = (t) => padL + plotW * (t / T);
      const yMin = -1, yMax = 2;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Context (observed motion)
      const ctxVals = [];
      for (let t = 0; t < T_ctx; t++) {
        ctxVals.push(0.5 + 0.4 * Math.sin(t * 0.3));
      }
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctxVals.forEach((v, t) => { if (t === 0) ctx.moveTo(xToPix(t), yToPix(v)); else ctx.lineTo(xToPix(t), yToPix(v)); });
      ctx.stroke();

      // Ground truth future (dashed)
      const trueFuture = [];
      for (let t = 0; t < T_fcst; t++) {
        trueFuture.push(0.5 + 0.4 * Math.sin((T_ctx + t) * 0.3) + 0.1 * Math.cos(t * 0.15));
      }
      ctx.strokeStyle = '#000';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      trueFuture.forEach((v, t) => {
        const px = xToPix(T_ctx + t), py = yToPix(v);
        if (t === 0) {
          ctx.moveTo(xToPix(T_ctx - 1), yToPix(ctxVals[T_ctx - 1]));
          ctx.lineTo(px, py);
        } else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // ProTran samples (faded)
      seedState = 100;
      for (let s = 0; s < sampleCount; s++) {
        ctx.strokeStyle = `rgba(37, 99, 235, ${Math.max(0.1, 1 / Math.sqrt(sampleCount))})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let t = 0; t < T_fcst; t++) {
          const noise = 0.08 + 0.005 * t;
          const v = trueFuture[t] + noise * gauss();
          const px = xToPix(T_ctx + t), py = yToPix(v);
          if (t === 0) {
            ctx.moveTo(xToPix(T_ctx - 1), yToPix(ctxVals[T_ctx - 1]));
            ctx.lineTo(px, py);
          } else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Divider
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(T_ctx), padT); ctx.lineTo(xToPix(T_ctx), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('observed | predicted', xToPix(T_ctx), padT - 6);

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, T_ctx/2, T_ctx, T_ctx + T_fcst/2, T].forEach(t => ctx.fillText(t.toFixed(0), xToPix(t), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('frame', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
