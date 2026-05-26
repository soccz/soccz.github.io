/* viz: contiformer-rk4-step - RK4 solver step visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['contiformer-rk4-step'] = function (canvas, controls, params) {
    let stepSize = 0.4;

    U.addSlider(controls, {
      label: 'Step size h', min: 0.05, max: 1.0, step: 0.05, value: 0.4,
      onInput: (v) => { stepSize = parseFloat(v); draw(); },
      fmt: (v) => `h=${parseFloat(v).toFixed(2)}`
    });

    // ODE: dz/dt = -0.5 * z + sin(t)
    function f(z, t) { return -0.5 * z + Math.sin(t); }
    // True solution (analytical-ish)
    function trueZ(t) {
      // Use small Euler for "ground truth"
      let z = 0;
      const dt = 0.001;
      for (let s = 0; s < t; s += dt) z += dt * f(z, s);
      return z;
    }

    function rk4(z, t, h) {
      const k1 = f(z, t);
      const k2 = f(z + h/2 * k1, t + h/2);
      const k3 = f(z + h/2 * k2, t + h/2);
      const k4 = f(z + h * k3, t + h);
      return z + h/6 * (k1 + 2*k2 + 2*k3 + k4);
    }

    function euler(z, t, h) { return z + h * f(z, t); }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('RK4 ODE Solver Step (paper §3.3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const tMax = 6;
      const yMin = -0.4, yMax = 1.2;
      const xToPix = (t) => padL + plotW * (t / tMax);
      const yToPix = (y) => padT + plotH * (1 - (y - yMin) / (yMax - yMin));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * i / 4;
        ctx.fillText(v.toFixed(1), padL - 8, padT + plotH * (1 - i/4));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let t = 0; t <= 6; t++) {
        ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6);
      }

      // True trajectory
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= tMax; t += 0.02) {
        const px = xToPix(t), py = yToPix(trueZ(t));
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // RK4 steps
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let zRK = 0, t = 0;
      ctx.moveTo(xToPix(t), yToPix(zRK));
      while (t < tMax) {
        const zNext = rk4(zRK, t, Math.min(stepSize, tMax - t));
        const tNext = t + Math.min(stepSize, tMax - t);
        ctx.lineTo(xToPix(tNext), yToPix(zNext));
        zRK = zNext;
        t = tNext;
      }
      ctx.stroke();

      // RK4 step dots
      zRK = 0; t = 0;
      while (t <= tMax) {
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(xToPix(t), yToPix(zRK), 4, 0, 2*Math.PI);
        ctx.fill();
        if (t < tMax) {
          const zNext = rk4(zRK, t, Math.min(stepSize, tMax - t));
          zRK = zNext;
          t += Math.min(stepSize, tMax - t);
        } else break;
      }

      // Euler comparison
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      let zE = 0; t = 0;
      ctx.moveTo(xToPix(t), yToPix(zE));
      while (t < tMax) {
        const zNext = euler(zE, t, Math.min(stepSize, tMax - t));
        const tNext = t + Math.min(stepSize, tMax - t);
        ctx.lineTo(xToPix(tNext), yToPix(zNext));
        zE = zNext;
        t = tNext;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Compute final errors
      const trueFinal = trueZ(tMax);
      // Re-compute RK4 final
      let zRK_f = 0; t = 0;
      while (t < tMax) {
        zRK_f = rk4(zRK_f, t, Math.min(stepSize, tMax - t));
        t += Math.min(stepSize, tMax - t);
      }
      let zE_f = 0; t = 0;
      while (t < tMax) {
        zE_f = euler(zE_f, t, Math.min(stepSize, tMax - t));
        t += Math.min(stepSize, tMax - t);
      }
      const errRK = Math.abs(trueFinal - zRK_f);
      const errEu = Math.abs(trueFinal - zE_f);
      const numSteps = Math.ceil(tMax / stepSize);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(
        `h=${stepSize.toFixed(2)}, ${numSteps} steps — RK4 err: ${errRK.toExponential(2)}, Euler err: ${errEu.toExponential(2)}`,
        w/2, 40
      );

      // Legend
      const legX = padL + 8, legY = padT + plotH - 60;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(legX, legY - 4); ctx.lineTo(legX + 20, legY - 4);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('True (dense)', legX + 26, legY);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(legX, legY + 18 - 4); ctx.lineTo(legX + 20, legY + 18 - 4);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('RK4 (4-eval)', legX + 26, legY + 18);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(legX, legY + 36 - 4); ctx.lineTo(legX + 20, legY + 36 - 4);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.text();
      ctx.fillText('Euler (1-eval)', legX + 26, legY + 36);

      // Labels
      ctx.fillStyle = U.text();
      ctx.textAlign = 'center';
      ctx.fillText('time t', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('z(t)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
