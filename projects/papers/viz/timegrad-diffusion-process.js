/* viz: timegrad-diffusion-process - diffusion forward + reverse */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timegrad-diffusion-process'] = function (canvas, controls, params) {
    let step = 50;
    const T = 100;
    U.addSlider(controls, {
      label: 'Step t', min: 0, max: T, step: 1, value: 50,
      onInput: (v) => { step = parseInt(v); draw(); },
      fmt: (v) => `t=${v}/${T}`
    });

    let seedState;
    function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }
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
      ctx.fillText('Diffusion Process Forward (paper §3.1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const phase = step === 0 ? 'clean signal x_0' :
                    step === T ? 'pure noise x_T' :
                    `noised signal x_${step}`;
      const sigma = step / T;
      ctx.fillText(`q(x_t | x_0) — ${phase}, noise σ_t ≈ ${sigma.toFixed(2)}`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const tLen = 100;
      const xToPix = (i) => padL + plotW * (i / tLen);
      const yMin = -2, yMax = 2;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Original signal
      const original = [];
      for (let i = 0; i < tLen; i++) {
        original.push(Math.sin(i * 0.2) + 0.5 * Math.cos(i * 0.5));
      }

      // Noised signal
      seedState = 42 + step;
      const sqrt_alpha_bar = Math.sqrt(1 - sigma * sigma);
      const noised = original.map(v => sqrt_alpha_bar * v + sigma * gauss());

      // Plot original (light)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      original.forEach((v, i) => {
        if (i === 0) ctx.moveTo(xToPix(i), yToPix(v)); else ctx.lineTo(xToPix(i), yToPix(v));
      });
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Plot noised
      const hue = 220 - 220 * (step / T);  // blue to red
      ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      noised.forEach((v, i) => {
        if (i === 0) ctx.moveTo(xToPix(i), yToPix(v)); else ctx.lineTo(xToPix(i), yToPix(v));
      });
      ctx.stroke();

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(i => ctx.fillText(i.toString(), xToPix(i), padT + plotH + 6));

      // Legend
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL + 10, padT + 14); ctx.lineTo(padL + 24, padT + 14);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('Original x_0', padL + 30, padT + 18);
      ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padL + 10, padT + 32); ctx.lineTo(padL + 24, padT + 32);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText(`Noised x_${step}`, padL + 30, padT + 36);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
