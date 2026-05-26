/* viz: protran-elbo - ELBO decomposition (reconstruction + KL) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-elbo'] = function (canvas, controls, params) {
    let beta = 1.0;
    U.addSlider(controls, {
      label: 'β (KL weight)', min: 0, max: 2, step: 0.1, value: 1.0,
      onInput: (v) => { beta = parseFloat(v); draw(); },
      fmt: (v) => `β=${parseFloat(v).toFixed(1)}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('ELBO Decomposition (paper Eq 3 single-layer / Eq 14-15 multi-layer)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`ELBO = E[log p(x|z)] - β · KL(q(z|x) || p(z))`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const maxStep = 100;
      const xToPix = (t) => padL + plotW * (t / maxStep);
      const yMin = -20, yMax = 10;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Reconstruction (negative): -log p(x|z) — decreases over training
      const recon = [];
      for (let t = 0; t <= maxStep; t++) {
        recon.push(-18 * Math.exp(-t / 25) - 0.5);
      }
      // KL term: increases initially (encoder commits to posterior), then stable
      const kl = [];
      for (let t = 0; t <= maxStep; t++) {
        kl.push(8 * (1 - Math.exp(-t / 15)) * beta);
      }
      const elbo = recon.map((r, i) => r - kl[i]);

      function plotLine(arr, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        arr.forEach((v, t) => {
          const px = xToPix(t), py = yToPix(v);
          if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      plotLine(recon, '#2563eb');
      plotLine(kl.map(k => -k), '#dc2626');
      plotLine(elbo, '#16a34a');

      // Zero line
      ctx.strokeStyle = '#000';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(0)); ctx.lineTo(padL + plotW, yToPix(0));
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend
      const series = [
        { c: '#2563eb', name: 'Reconstruction E[log p(x|z)]' },
        { c: '#dc2626', name: '-β · KL(q||p)' },
        { c: '#16a34a', name: 'ELBO (sum)' }
      ];
      series.forEach((s, i) => {
        ctx.strokeStyle = s.c;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padL + 8, padT + 14 + i * 18); ctx.lineTo(padL + 24, padT + 14 + i * 18);
        ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText(s.name, padL + 28, padT + 17 + i * 18);
      });

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(0), padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(t => ctx.fillText(`${t}`, xToPix(t), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('training epoch', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
