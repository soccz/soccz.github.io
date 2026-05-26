/* viz: protran-ssm - State-space model latent dynamics */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-ssm'] = function (canvas, controls, params) {
    let noiseLevel = 0.1;
    U.addSlider(controls, {
      label: 'Process noise σ', min: 0.05, max: 0.5, step: 0.05, value: 0.1,
      onInput: (v) => { noiseLevel = parseFloat(v); draw(); },
      fmt: (v) => `σ=${parseFloat(v).toFixed(2)}`
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
      ctx.fillText('SSM Latent Dynamics (paper §3.1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`z_t = A·z_{t-1} + ε_t, ε ~ N(0, σ²I)`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 100;
      const xToPix = (t) => padL + plotW * (t / T);
      const yMin = -2.5, yMax = 2.5;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Generate latent trajectories (5 samples)
      const numSamples = 5;
      for (let s = 0; s < numSamples; s++) {
        seedState = 100 + s * 17;
        const path = [0];
        for (let t = 1; t < T; t++) {
          // Linear SSM with mild oscillation: A = 0.95 with some drift
          const z_prev = path[t - 1];
          const z_new = 0.95 * z_prev + 0.05 * Math.sin(t * 0.1) + noiseLevel * gauss();
          path.push(z_new);
        }
        ctx.strokeStyle = `hsla(${s * 72}, 70%, 50%, 0.7)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        path.forEach((v, t) => {
          const px = xToPix(t), py = yToPix(v);
          if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(t => ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time t', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('latent z_t (5 samples)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
