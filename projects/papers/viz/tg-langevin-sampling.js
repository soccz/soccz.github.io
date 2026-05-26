/* viz: tg-langevin-sampling
 * Algorithm 2 — Annealed Langevin Sampling step-by-step.
 * x^N ~ N(0, I) → reverse loop N→1 → x^0.
 * Sliders: n (current step, N→1 direction), seed
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-langevin-sampling'] = function (canvas, controls, params) {
    const N = 100;
    let nStep = parseInt(params.n || '50');
    let seed = parseInt(params.seed || '7');
    const D = 12;
    const betaMax = 0.1;

    // Schedule
    function computeSchedule() {
      const betas = new Array(N);
      const alphas = new Array(N);
      const alphaBars = new Array(N);
      let prev = 1;
      for (let i = 0; i < N; i++) {
        betas[i] = 1e-4 + (betaMax - 1e-4) * i / (N - 1);
        alphas[i] = 1 - betas[i];
        prev = prev * alphas[i];
        alphaBars[i] = prev;
      }
      return { betas, alphas, alphaBars };
    }

    // Target signal (mock x^0)
    function targetX0() {
      const x = new Array(D);
      for (let i = 0; i < D; i++) {
        x[i] = 0.7 * Math.sin(2 * Math.PI * i / D) + 0.2 * Math.sin(4 * Math.PI * i / D + 0.5);
      }
      return x;
    }

    // Pseudo-random
    function rand(s) {
      const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    }
    function gauss(s) {
      const u1 = rand(s);
      const u2 = rand(s + 0.5);
      return Math.sqrt(-2 * Math.log(u1 + 1e-12)) * Math.cos(2 * Math.PI * u2);
    }

    // Simulate reverse process from N down to nStep
    function reverseTrajectory() {
      const { betas, alphas, alphaBars } = computeSchedule();
      const x0 = targetX0();

      // Start: x^N ~ N(0, I)
      let x = new Array(D);
      for (let i = 0; i < D; i++) x[i] = gauss(seed * 11 + i * 3);

      // Reverse loop N -> nStep
      for (let n = N - 1; n >= nStep; n--) {
        const alpha = alphas[n];
        const beta = betas[n];
        const alphaBar = alphaBars[n];

        // Mock noise prediction (oracle: ε_θ ≈ (x^n - √ᾱ x^0) / √(1-ᾱ))
        const newX = new Array(D);
        for (let i = 0; i < D; i++) {
          const epsPred = (x[i] - Math.sqrt(alphaBar) * x0[i]) / Math.sqrt(1 - alphaBar);
          const mean = (1 / Math.sqrt(alpha)) * (x[i] - (beta / Math.sqrt(1 - alphaBar)) * epsPred);
          const sigma = n > 0 ? Math.sqrt(beta * 0.6) : 0;
          const z = n > 0 ? gauss(seed * 31 + n * 7 + i * 5) : 0;
          newX[i] = mean + sigma * z;
        }
        x = newX;
      }
      return { x, x0 };
    }

    U.addSlider(controls, {
      label: 'n (reverse step, N=100 → 1)', min: 0, max: N, step: 1, value: nStep,
      onInput: (v) => { nStep = parseInt(v); draw(); },
      fmt: (v) => String(parseInt(v))
    });
    U.addSlider(controls, {
      label: 'seed', min: 1, max: 50, step: 1, value: seed,
      onInput: (v) => { seed = parseInt(v); draw(); },
      fmt: (v) => String(parseInt(v))
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 36, padB = 52;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const { x, x0 } = reverseTrajectory();

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const phase = nStep === N ? 'Pure noise (start)' :
                    nStep === 0 ? 'Clean prediction (x^0)' :
                    `Reverse step n=${nStep}  →  ${(N - nStep)}/${N} steps denoised`;
      ctx.fillText(phase, w / 2, padT - 16);

      // Grid + axes
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';

      // y axis: -2 to 2
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

      // Target x^0 (dashed)
      ctx.strokeStyle = U.good();
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < D; i++) {
        const px = xToPix(i); const py = yToPix(x0[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Current sample (solid)
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i < D; i++) {
        const px = xToPix(i); const py = yToPix(x[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = U.accent();
      for (let i = 0; i < D; i++) {
        const px = xToPix(i); const py = yToPix(x[i]);
        ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fill();
      }

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('entity index i (D=12)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('signal value', 0, 0);
      ctx.restore();

      // Legend
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillStyle = U.good();
      ctx.globalAlpha = 0.7;
      ctx.fillText('— — target x^0', padL + 8, padT + 12);
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.accent();
      ctx.fillText(`──  current x^${nStep}`, padL + 8, padT + 28);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
