/* viz: nsde-wasserstein - Wasserstein distance convergence over training */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['nsde-wasserstein'] = function (canvas, controls, params) {
    let epoch = 0;
    const maxEpoch = 100;

    U.addSlider(controls, {
      label: 'Training epoch (×500 steps)', min: 0, max: maxEpoch, step: 1, value: 0,
      onInput: (v) => { epoch = parseInt(v); draw(); },
      fmt: (v) => `epoch ${v}/${maxEpoch}`
    });

    // Simulated convergence curves
    function w1_sde(e) { return 0.35 * Math.exp(-e / 25) + 0.038; }
    function w1_lstm(e) { return 0.35 * Math.exp(-e / 40) + 0.064; }
    function w1_garch(e) { return 0.082; }  // constant (parametric)

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Wasserstein-1 Convergence (paper §3.4)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(
        `Epoch ${epoch}: Neural SDE W_1 = ${w1_sde(epoch).toFixed(3)}, LSTM-GAN = ${w1_lstm(epoch).toFixed(3)}, GARCH = ${w1_garch(epoch).toFixed(3)}`,
        w/2, 40
      );

      const padL = 70, padR = 40, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const yMin = 0, yMax = 0.45;
      const xToPix = (e) => padL + plotW * (e / maxEpoch);
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(e => {
        ctx.fillText(e.toString(), xToPix(e), padT + plotH + 6);
      });

      const series = [
        { fn: w1_sde, color: '#2563eb', name: 'Neural SDE GAN' },
        { fn: w1_lstm, color: '#9333ea', name: 'LSTM-GAN' },
        { fn: w1_garch, color: '#94a3b8', name: 'GARCH (baseline)' },
      ];

      series.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let e = 0; e <= maxEpoch; e++) {
          const px = xToPix(e), py = yToPix(s.fn(e));
          if (e === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Selected dot
        const px = xToPix(epoch), py = yToPix(s.fn(epoch));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2*Math.PI);
        ctx.fill();
      });

      // Selected vertical line
      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(epoch), padT); ctx.lineTo(xToPix(epoch), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend
      const legX = padL + plotW - 160, legY = padT + 20;
      series.forEach((s, i) => {
        ctx.fillStyle = s.color;
        ctx.fillRect(legX, legY + i*20 - 6, 14, 3);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText(s.name, legX + 20, legY + i*20);
      });

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('training epoch', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Wasserstein-1 distance', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
