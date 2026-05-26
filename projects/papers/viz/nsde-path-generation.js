/* viz: nsde-path-generation - Neural SDE path samples + real */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['nsde-path-generation'] = function (canvas, controls, params) {
    let driftStrength = 0.02;
    let diffStrength = 0.15;

    U.addSlider(controls, {
      label: 'Drift μ', min: -0.1, max: 0.1, step: 0.01, value: 0.02,
      onInput: (v) => { driftStrength = parseFloat(v); draw(); },
      fmt: (v) => `μ=${parseFloat(v).toFixed(2)}`
    });
    U.addSlider(controls, {
      label: 'Diffusion σ', min: 0.05, max: 0.4, step: 0.01, value: 0.15,
      onInput: (v) => { diffStrength = parseFloat(v); draw(); },
      fmt: (v) => `σ=${parseFloat(v).toFixed(2)}`
    });

    // Pseudo-random for reproducibility
    let seedState = 12345;
    function rand() {
      seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
      return seedState / 0x7fffffff;
    }
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
      ctx.fillText('Neural SDE Path Samples (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`dz = μ·z dt + σ·z dW (Geometric Brownian-like), 50 generated paths`, w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 1.0;
      const steps = 100;
      const dt = T / steps;

      // Generate paths
      seedState = 12345;
      const nPaths = 50;
      const allPaths = [];
      let minY = Infinity, maxY = -Infinity;
      for (let p = 0; p < nPaths; p++) {
        let z = 1.0;
        const path = [z];
        for (let i = 0; i < steps; i++) {
          const drift = driftStrength * z * dt;
          const noise = diffStrength * z * Math.sqrt(dt) * gauss();
          z = z + drift + noise;
          path.push(z);
          if (z < minY) minY = z;
          if (z > maxY) maxY = z;
        }
        allPaths.push(path);
      }
      // Bound y
      minY = Math.max(0.3, minY * 0.95);
      maxY = Math.min(3.0, maxY * 1.05);

      const xToPix = (t) => padL + plotW * (t / T);
      const yToPix = (y) => padT + plotH * (1 - (y - minY) / (maxY - minY));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = minY + (maxY - minY) * (1 - i/4);
        ctx.fillText(v.toFixed(2), padL - 8, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 0.25, 0.5, 0.75, 1.0].forEach(t => {
        ctx.fillText(t.toFixed(2), xToPix(t), padT + plotH + 6);
      });

      // Plot paths
      allPaths.forEach((path, p) => {
        ctx.strokeStyle = `hsla(${(p * 31) % 360}, 60%, 50%, 0.4)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = i / steps * T;
          const px = xToPix(t), py = yToPix(path[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Mean path
      const meanPath = [];
      for (let i = 0; i <= steps; i++) {
        let s = 0;
        allPaths.forEach(p => s += p[i]);
        meanPath.push(s / nPaths);
      }
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      meanPath.forEach((v, i) => {
        const t = i / steps * T;
        const px = xToPix(t), py = yToPix(v);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Legend
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 8, padT + 8, 14, 3);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('Mean path', padL + 28, padT + 12);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('z(t)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
