/* viz: tg-sampling-trajectory
 * Inference reverse trajectory x^N → x^0 visualization.
 * Show how noise pure Gaussian progressively becomes structured time series.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-sampling-trajectory'] = function (canvas, controls, params) {
    const N = 100; // diffusion steps
    const D = 6;   // visualized dimensions
    const T = 24;  // time steps in prediction window

    // Pre-compute trajectory: x[n][d][t] for n=0..N
    // True signal x^0 = sin + cos pattern per dim
    const target = [];
    for (let d = 0; d < D; d++) {
      const arr = [];
      const freq = 0.3 + d * 0.15;
      const phase = d * 0.6;
      const amp = 0.4 + d * 0.05;
      for (let t = 0; t < T; t++) {
        arr.push(amp * Math.sin(freq * t + phase) + 0.05 * Math.sin(2 * t));
      }
      target.push(arr);
    }

    // Sample at fixed step indices
    const stepIndices = [100, 80, 60, 40, 20, 10, 5, 1, 0];
    const trajectories = stepIndices.map(n => {
      const noiseAmp = Math.sqrt(n / N);  // approximate sigma at step n
      const signalAmp = Math.sqrt(1 - n / N);
      const traj = [];
      for (let d = 0; d < D; d++) {
        const arr = [];
        for (let t = 0; t < T; t++) {
          // pseudo-random noise determined by seed (d, t, n)
          const seed = Math.sin(d * 13.7 + t * 7.3 + n * 0.91) * 1000;
          const noise = ((seed - Math.floor(seed)) - 0.5) * 2;
          arr.push(signalAmp * target[d][t] + noiseAmp * noise * 0.6);
        }
        traj.push(arr);
      }
      return traj;
    });

    let currentStep = 0; // index in stepIndices

    U.addSlider(controls, {
      label: 'Diffusion step n', min: 0, max: stepIndices.length - 1, step: 1, value: 0,
      onInput: (v) => { currentStep = parseInt(v); draw(); },
      fmt: (v) => `n=${stepIndices[parseInt(v)]}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 56, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const n = stepIndices[currentStep];
      const traj = trajectories[currentStep];

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const phase = n > 80 ? 'pure noise' : n > 40 ? 'noisy structure' : n > 10 ? 'emerging signal' : 'clean prediction';
      ctx.fillText(`Reverse sampling x⁰ ← x^${n}  (${phase})`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${D} dimensions × ${T} time-steps — slide n from 100 → 0 to see denoising`, w / 2, 40);

      // Compute y-range
      let ymin = Infinity, ymax = -Infinity;
      for (let d = 0; d < D; d++) {
        for (let t = 0; t < T; t++) {
          ymin = Math.min(ymin, traj[d][t]); ymax = Math.max(ymax, traj[d][t]);
        }
      }
      const yPad = (ymax - ymin) * 0.1;
      ymin -= yPad; ymax += yPad;

      const xToPix = (t) => padL + innerW * (t / (T - 1));
      const yToPix = (v) => padT + innerH * (1 - (v - ymin) / (ymax - ymin));

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 4);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = ymax - (ymax - ymin) * i / 4;
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 4);
      }
      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let t = 0; t < T; t += 4) {
        ctx.fillText(String(t), xToPix(t), padT + innerH + 6);
      }

      // Draw each dimension
      const colors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2'];
      for (let d = 0; d < D; d++) {
        ctx.strokeStyle = colors[d];
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const px = xToPix(t), py = yToPix(traj[d][t]);
          if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Legend
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      for (let d = 0; d < D; d++) {
        const lx = padL + 8 + d * 70;
        const ly = padT + 8;
        ctx.fillStyle = colors[d];
        ctx.fillRect(lx, ly - 4, 10, 8);
        ctx.fillStyle = U.text();
        ctx.fillText(`dim ${d}`, lx + 14, ly);
      }

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Time step (prediction window)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Value (per-dim)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
