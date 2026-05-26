/* viz: contiformer-asymmetric - Q/K/V asymmetric paths */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['contiformer-asymmetric'] = function (canvas, controls, params) {
    let showQ = true, showK = true, showV = true;

    U.addSelect(controls, {
      label: 'Show paths',
      options: [
        { value: 'all',   label: 'All three (Q+K+V)' },
        { value: 'q',     label: 'Only Query (InterpLinear)' },
        { value: 'kv',    label: 'Only Key/Value (OdeLinear)' },
        { value: 'compare', label: 'Q vs K side-by-side' }
      ],
      value: 'all',
      onChange: (v) => {
        showQ = (v === 'all' || v === 'q' || v === 'compare');
        showK = (v === 'all' || v === 'kv' || v === 'compare');
        showV = (v === 'all' || v === 'kv');
        draw();
      }
    });

    const obs = [0.0, 1.5, 3.0, 5.0, 6.5, 8.5];
    const obs_vals = obs.map(t => Math.sin(t * 0.6) * 0.4 + 0.5);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Q/K/V Asymmetric Paths (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Query=InterpLinear (linear), Key/Value=OdeLinear (ODE flow)', w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const tMax = 10;
      const yMin = 0, yMax = 1.2;
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

      // Observation dots
      obs.forEach((t, i) => {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(xToPix(t), yToPix(obs_vals[i]), 5, 0, 2*Math.PI);
        ctx.fill();
      });

      // Query path: linear interpolation
      if (showQ) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        obs.forEach((t, i) => {
          const px = xToPix(t), py = yToPix(obs_vals[i] * 0.85);  // shifted slightly down for clarity
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
        // Label
        ctx.fillStyle = '#2563eb';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText('Query (linear interp)', xToPix(8.7), yToPix(obs_vals[5] * 0.85));
      }

      // Key path: ODE flow
      if (showK) {
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < obs.length - 1; i++) {
          const t0 = obs[i], t1 = obs[i+1];
          let x = obs_vals[i] + 0.15;  // shifted up
          ctx.moveTo(xToPix(t0), yToPix(x));
          const steps = 25;
          for (let k = 1; k <= steps; k++) {
            const t_cur = t0 + (t1 - t0) * k / steps;
            const target = Math.cos(t_cur * 0.8) * 0.3 + 0.6;
            x = x + (t1 - t0) / steps * (-0.5 * (x - target));
            ctx.lineTo(xToPix(t_cur), yToPix(x));
          }
          // Reset at next obs
          if (i < obs.length - 2) {
            const next_x = obs_vals[i+1] + 0.15;
            ctx.moveTo(xToPix(t1), yToPix(next_x));
          }
        }
        ctx.stroke();
        ctx.fillStyle = '#16a34a';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText('Key (ODE flow + reset)', xToPix(0.2), yToPix(obs_vals[0] + 0.22));
      }

      // Value path
      if (showV) {
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i < obs.length - 1; i++) {
          const t0 = obs[i], t1 = obs[i+1];
          let x = obs_vals[i] - 0.15;  // shifted down
          ctx.moveTo(xToPix(t0), yToPix(x));
          const steps = 25;
          for (let k = 1; k <= steps; k++) {
            const t_cur = t0 + (t1 - t0) * k / steps;
            const target = Math.sin(t_cur * 0.5) * 0.25 + 0.35;
            x = x + (t1 - t0) / steps * (-0.4 * (x - target));
            ctx.lineTo(xToPix(t_cur), yToPix(x));
          }
          if (i < obs.length - 2) {
            const next_x = obs_vals[i+1] - 0.15;
            ctx.moveTo(xToPix(t1), yToPix(next_x));
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#9333ea';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText('Value (ODE flow, dashed)', xToPix(0.2), yToPix(obs_vals[0] - 0.22));
      }

      // X axis labels
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = U.textMuted();
      for (let t = 0; t <= 10; t += 2) {
        ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6);
      }

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
