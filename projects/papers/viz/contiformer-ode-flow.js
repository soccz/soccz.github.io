/* viz: contiformer-ode-flow - irregular obs + ODE flow trajectory */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['contiformer-ode-flow'] = function (canvas, controls, params) {
    let spacing = 'irregular';

    U.addSelect(controls, {
      label: 'Obs pattern',
      options: [
        { value: 'irregular',  label: 'Irregular (clinical-like)' },
        { value: 'dense',      label: 'Dense uniform' },
        { value: 'sporadic',   label: 'Sporadic (very sparse)' }
      ],
      value: 'irregular',
      onChange: (v) => { spacing = v; draw(); }
    });

    const patterns = {
      irregular: [0.0, 0.6, 1.4, 1.7, 3.2, 4.0, 6.5, 7.9, 8.2, 9.5],
      dense:     [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
      sporadic:  [0.0, 2.4, 5.8, 9.0]
    };

    function ode_flow(t_prev, x_prev, t) {
      // Simulated ODE: dx/dt = -0.3 * (x - target(t))
      const dt = t - t_prev;
      const target = Math.sin(t * 0.7) * 0.4 + 0.5;
      return x_prev + dt * (-0.3 * (x_prev - target));
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Irregular Observations + ODE Flow (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const obs = patterns[spacing];
      ctx.fillText(`${obs.length} observations, ${spacing} pattern`, w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const tMax = 10;
      const yMin = -0.2, yMax = 1.4;
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
      for (let t = 0; t <= 10; t += 2) {
        ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6);
      }

      // Generate observation values
      const obs_vals = obs.map(t => Math.sin(t * 0.7) * 0.4 + 0.5 + (Math.sin(t * 3.1) * 0.1));

      // Plot ODE flow (continuous interpolation between obs)
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < obs.length - 1; i++) {
        const t0 = obs[i], t1 = obs[i+1];
        const x0 = obs_vals[i];
        ctx.moveTo(xToPix(t0), yToPix(x0));
        let x = x0;
        const steps = 30;
        for (let k = 1; k <= steps; k++) {
          const t_prev = t0 + (t1 - t0) * (k-1) / steps;
          const t_cur = t0 + (t1 - t0) * k / steps;
          x = ode_flow(t_prev, x, t_cur);
          ctx.lineTo(xToPix(t_cur), yToPix(x));
        }
      }
      ctx.stroke();

      // Plot observations as dots
      obs.forEach((t, i) => {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(xToPix(t), yToPix(obs_vals[i]), 6, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Query at random middle time
      const t_query = obs[Math.floor(obs.length / 2)] + 0.5;
      if (t_query < tMax) {
        ctx.strokeStyle = '#9333ea';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xToPix(t_query), padT);
        ctx.lineTo(xToPix(t_query), padT + plotH);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#9333ea';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('t_query', xToPix(t_query), padT - 4);
      }

      // Legend
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(padL + 10, padT + plotH - 30, 5, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('observations (reset)', padL + 20, padT + plotH - 26);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(padL, padT + plotH - 12); ctx.lineTo(padL + 18, padT + plotH - 12);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('ODE flow', padL + 22, padT + plotH - 8);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('value', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
