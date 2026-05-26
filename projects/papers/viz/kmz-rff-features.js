/* viz: kmz-rff-features - Random Fourier Features visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['kmz-rff-features'] = function (canvas, controls, params) {
    let numFeatures = 8;
    U.addSlider(controls, {
      label: 'Show features', min: 4, max: 16, step: 2, value: 8,
      onInput: (v) => { numFeatures = parseInt(v); draw(); },
      fmt: (v) => `K=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Random Fourier Features (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`φ_k(x) = cos(ω_k·x + b_k), ω_k ~ N(0, σ²), b_k ~ U[0, 2π]`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const subH = plotH / numFeatures - 4;

      // Generate features
      let seed = 42;
      function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

      const features = [];
      for (let k = 0; k < numFeatures; k++) {
        const omega = (rand() - 0.5) * 6;  // freq
        const bias = rand() * 2 * Math.PI;
        features.push({ omega, bias });
      }

      const T = 200;
      const xToPix = (i) => padL + plotW * (i / T);

      features.forEach((f, k) => {
        const yStart = padT + k * (subH + 4);
        const yEnd = yStart + subH;

        // Box
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, yStart, plotW, subH);

        // Label
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(`φ_${k+1}`, padL - 8, yStart + subH/2);

        // Plot wave
        ctx.strokeStyle = `hsl(${k * 360 / numFeatures}, 70%, 50%)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < T; i++) {
          const x = (i / T) * 4 * Math.PI;
          const v = Math.cos(f.omega * x + f.bias);
          const py = yStart + subH/2 - v * subH * 0.35;
          if (i === 0) ctx.moveTo(xToPix(i), py); else ctx.lineTo(xToPix(i), py);
        }
        ctx.stroke();
      });

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Linear combination of K diverse waves = expressive function',
                   padL + plotW/2, padT + plotH + 25);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
