/* viz: dlap-no-arbitrage - SDF no-arbitrage equation E[M·R^e]=0 */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-no-arbitrage'] = function (canvas, controls, params) {
    let nAssets = 50;
    U.addSlider(controls, {
      label: 'Assets N', min: 10, max: 200, step: 10, value: 50,
      onInput: (v) => { nAssets = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('No-Arbitrage Pricing Equation (paper Eq 1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('E[M_{t+1} · R^e_{i,t+1} | I_t] = 0  ∀ asset i, time t', w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      let seed = 42;
      function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      function gauss() {
        const u1 = Math.max(rand(), 1e-9), u2 = rand();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      }

      // For each asset, plot E[M·R^e] across N assets
      // Two panels: misspecified SDF (left, big errors) vs correct SDF (right, near zero)
      const halfW = plotW / 2;
      const yMin = -0.08, yMax = 0.08;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Zero line
      ctx.strokeStyle = '#000';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(0)); ctx.lineTo(padL + plotW, yToPix(0));
      ctx.stroke();
      ctx.setLineDash([]);

      // Misspecified (left side)
      ctx.fillStyle = '#dc2626';
      seed = 7;
      for (let i = 0; i < nAssets; i++) {
        const x = padL + halfW * (i + 0.5) / nAssets;
        const v = gauss() * 0.025;  // big errors
        ctx.beginPath();
        ctx.arc(x, yToPix(v), 3.5, 0, 2*Math.PI);
        ctx.fill();
      }

      // Correct DLAP (right side)
      ctx.fillStyle = '#16a34a';
      seed = 7;
      for (let i = 0; i < nAssets; i++) {
        const x = padL + halfW + halfW * (i + 0.5) / nAssets;
        const v = gauss() * 0.005;  // small errors (≈ 0)
        ctx.beginPath();
        ctx.arc(x, yToPix(v), 3.5, 0, 2*Math.PI);
        ctx.fill();
      }

      // Divider
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL + halfW, padT);
      ctx.lineTo(padL + halfW, padT + plotH);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Misspecified SDF (e.g., CAPM)', padL + halfW/2, padT + 16);
      ctx.fillText('large pricing errors', padL + halfW/2, padT + 32);

      ctx.fillStyle = '#16a34a';
      ctx.fillText('DLAP SDF (this paper)', padL + halfW * 1.5, padT + 16);
      ctx.fillText('errors ≈ 0', padL + halfW * 1.5, padT + 32);

      // Y axis
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(3), padL - 6, padT + plotH * i / 4);
      }
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('asset index', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('E[M·R^e_i]', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
