/* viz: tg-noise-prediction
 * ε_θ noise prediction visualization.
 * Show: noisy x^n vs predicted noise ε_pred vs true noise ε vs reconstructed x^0_pred.
 * Slider: n (noise step) — see how prediction quality varies.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-noise-prediction'] = function (canvas, controls, params) {
    const N = 100;
    let nStep = parseInt(params.n || '40');
    let mode = params.mode || 'all'; // all | noisy | pred | clean
    const D = 16;
    const betaMax = 0.1;

    function rand(s) { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
    function gauss(s) { return Math.sqrt(-2 * Math.log(rand(s) + 1e-12)) * Math.cos(2 * Math.PI * rand(s + 0.5)); }

    function targetX0() {
      const x = new Array(D);
      for (let i = 0; i < D; i++) {
        x[i] = 0.7 * Math.sin(2 * Math.PI * i / D) + 0.3 * Math.cos(4 * Math.PI * i / D + 0.2);
      }
      return x;
    }

    function computeAlphaBar(n) {
      let acc = 1;
      for (let i = 0; i < n; i++) {
        const beta = 1e-4 + (betaMax - 1e-4) * i / (N - 1);
        acc *= (1 - beta);
      }
      return acc;
    }

    U.addSlider(controls, {
      label: 'n (noise step)', min: 1, max: N, step: 1, value: nStep,
      onInput: (v) => { nStep = parseInt(v); draw(); },
      fmt: (v) => String(parseInt(v))
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 36, padB = 52;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Compute series
      const x0 = targetX0();
      const alphaBar = computeAlphaBar(nStep);
      const eps = new Array(D);
      const xn = new Array(D);
      for (let i = 0; i < D; i++) {
        eps[i] = gauss(13 + i * 2);
        xn[i] = Math.sqrt(alphaBar) * x0[i] + Math.sqrt(1 - alphaBar) * eps[i];
      }

      // Mock ε_θ prediction (with small error proportional to noise level)
      const noiseErr = (1 - alphaBar) * 0.06;
      const epsPred = new Array(D);
      for (let i = 0; i < D; i++) {
        epsPred[i] = eps[i] + gauss(89 + i * 3) * noiseErr;
      }

      // Reconstructed x^0 from x^n and predicted ε
      const x0Pred = new Array(D);
      for (let i = 0; i < D; i++) {
        x0Pred[i] = (xn[i] - Math.sqrt(1 - alphaBar) * epsPred[i]) / Math.sqrt(alphaBar);
      }

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Noise prediction at n=${nStep}  (ᾱ_n=${alphaBar.toExponential(2)}, noise level=${Math.sqrt(1-alphaBar).toFixed(3)})`, w / 2, padT - 16);

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const val = 2 - i;
        ctx.fillText(val.toFixed(1), padL - 8, padT + innerH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 5; i++) {
        const idx = Math.floor((D - 1) * i / 5);
        ctx.fillText(String(idx), padL + innerW * i / 5, padT + innerH + 6);
      }

      const xToPix = (i) => padL + innerW * i / (D - 1);
      const yToPix = (v) => padT + innerH * (1 - (v + 2) / 4);

      // Draw lines: x^0 (target, dashed), x^n (solid noisy), x^0_pred (dotted reconstruction)
      function plotLine(arr, color, dash, alpha, width) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.setLineDash(dash);
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let i = 0; i < D; i++) {
          const px = xToPix(i); const py = yToPix(arr[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      plotLine(x0, U.good(), [4, 3], 0.7, 2);            // target x^0 dashed
      plotLine(xn, U.accent(), [], 0.9, 2.4);             // noisy x^n solid
      plotLine(x0Pred, U.info(), [2, 3], 0.85, 2);        // reconstructed x^0_pred dotted

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('entity index i (D=16)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('signal value', 0, 0);
      ctx.restore();

      // Legend (top right)
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillStyle = U.good();
      ctx.fillText('— — target x^0', padL + 8, padT + 12);
      ctx.fillStyle = U.accent();
      ctx.fillText('────  noisy x^n', padL + 8, padT + 28);
      ctx.fillStyle = U.info();
      ctx.fillText('· · ·  predicted x^0', padL + 8, padT + 44);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
