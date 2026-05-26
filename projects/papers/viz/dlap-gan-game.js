/* viz: dlap-gan-game - GAN moment selection min-max game */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-gan-game'] = function (canvas, controls, params) {
    let step = 50;
    const maxStep = 100;
    U.addSlider(controls, {
      label: 'Training step', min: 0, max: maxStep, step: 1, value: 50,
      onInput: (v) => { step = parseInt(v); draw(); },
      fmt: (v) => `step ${v}/${maxStep}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('GAN Moment Selection — min-max game (paper §I.B Eq 3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('min_M max_g E[M·R^e · g(I_t)]² — generator (SDF) vs discriminator (moment)', w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Loss trajectories
      const xToPix = (t) => padL + plotW * (t / maxStep);
      const yMax = 0.05, yMin = 0;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // M loss (generator) — decreasing
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let t = 0; t <= maxStep; t++) {
        const v = 0.04 * Math.exp(-t / 25) + 0.005 + 0.003 * Math.sin(t * 0.4);
        const px = xToPix(t), py = yToPix(v);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Discriminator gain (adversarial moment importance) — oscillating then converging
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      for (let t = 0; t <= maxStep; t++) {
        const v = 0.045 - 0.040 * (1 - Math.exp(-t / 30)) + 0.005 * Math.sin(t * 0.5);
        const px = xToPix(t), py = yToPix(v);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Current step marker
      ctx.strokeStyle = U.text();
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(step), padT); ctx.lineTo(xToPix(step), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Convergence zone
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.07;
      ctx.fillRect(xToPix(70), padT, xToPix(maxStep) - xToPix(70), plotH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Nash equilibrium', xToPix(85), padT + 14);

      // Legend
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padL + 12, padT + 14); ctx.lineTo(padL + 28, padT + 14);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('Generator (M) loss', padL + 32, padT + 18);

      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(padL + 12, padT + 32); ctx.lineTo(padL + 28, padT + 32);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.text();
      ctx.fillText('Discriminator (g) gain', padL + 32, padT + 36);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(3), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(t => ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Training iteration', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
