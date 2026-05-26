/* viz: gu-factor-extraction - latent factor F_t extraction from returns */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-factor-extraction'] = function (canvas, controls, params) {
    let nFactors = 3;
    U.addSlider(controls, {
      label: '# factors K', min: 1, max: 6, step: 1, value: 3,
      onInput: (v) => { nFactors = parseInt(v); draw(); },
      fmt: (v) => `K=${v}`
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
      ctx.fillText('Latent Factor F_t Extraction (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Autoencoder extracts K=${nFactors} latent factors from N=3000 stock returns monthly`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 120;
      const xToPix = (t) => padL + plotW * (t / T);
      const yMin = -3, yMax = 3;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];

      // Generate K factor time series
      for (let k = 0; k < nFactors; k++) {
        seedState = 42 + k * 17;
        const series = [];
        let v = 0;
        for (let t = 0; t < T; t++) {
          // Different patterns per factor
          let target;
          if (k === 0) target = Math.sin(t * 0.1) * 1.2;             // market-like
          else if (k === 1) target = Math.sin(t * 0.25 + 1) * 0.8;   // size-like
          else if (k === 2) target = Math.cos(t * 0.18 + 2) * 0.6;   // value-like
          else if (k === 3) target = Math.sin(t * 0.3 + 3) * 0.5;    // momentum
          else target = Math.cos(t * 0.4 + k) * 0.4;
          v = 0.7 * v + 0.3 * target + 0.2 * gauss();
          series.push(v);
        }
        ctx.strokeStyle = colors[k];
        ctx.lineWidth = 2;
        ctx.beginPath();
        series.forEach((s, t) => {
          if (t === 0) ctx.moveTo(xToPix(t), yToPix(s));
          else ctx.lineTo(xToPix(t), yToPix(s));
        });
        ctx.stroke();
      }

      // Legend
      const lgX = padL + 10, lgY = padT + 10;
      for (let k = 0; k < nFactors; k++) {
        ctx.strokeStyle = colors[k];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lgX, lgY + k * 18); ctx.lineTo(lgX + 18, lgY + k * 18);
        ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(`Factor F_${k+1}(t)`, lgX + 22, lgY + k * 18);
      }

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 30, 60, 90, 120].forEach(t => ctx.fillText(`m${t}`, xToPix(t), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time (months)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('factor return (std)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
