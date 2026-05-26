/* viz: protran-smoothing-vs-filtering - smoothing q(z_t | x_{1:T}) vs filtering q(z_t | x_{1:t}) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-smoothing-vs-filtering'] = function (canvas, controls, params) {
    let mode = 'both';
    U.addSelect(controls, {
      label: 'Inference mode',
      options: [
        { value: 'both',     label: 'Both (compare)' },
        { value: 'filter',   label: 'Filtering only' },
        { value: 'smooth',   label: 'Smoothing only (★ ProTran)' }
      ],
      value: 'both',
      onChange: (v) => { mode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Smoothing vs Filtering Inference (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Filtering: q(z_t | x_{1:t}) — uses past only. Smoothing: q(z_t | x_{1:T}) — uses full sequence.', w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 60;
      const xToPix = (t) => padL + plotW * (t / T);
      const yMin = -2, yMax = 3;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // True latent z(t)
      const truePath = [];
      for (let t = 0; t < T; t++) {
        truePath.push(Math.sin(t * 0.25) + 0.3 * Math.cos(t * 0.8) + 0.5);
      }
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      truePath.forEach((v, t) => { if (t === 0) ctx.moveTo(xToPix(t), yToPix(v)); else ctx.lineTo(xToPix(t), yToPix(v)); });
      ctx.stroke();

      // Filtering estimate (with growing certainty)
      if (mode === 'both' || mode === 'filter') {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const lag = Math.max(0, t - 3);
          const v = truePath[lag] + 0.2 * Math.sin(t * 0.5);
          if (t === 0) ctx.moveTo(xToPix(t), yToPix(v)); else ctx.lineTo(xToPix(t), yToPix(v));
        }
        ctx.stroke();
        // Uncertainty band (wider)
        ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const lag = Math.max(0, t - 3);
          const v = truePath[lag] + 0.2 * Math.sin(t * 0.5);
          if (t === 0) ctx.moveTo(xToPix(t), yToPix(v + 0.4));
          else ctx.lineTo(xToPix(t), yToPix(v + 0.4));
        }
        for (let t = T - 1; t >= 0; t--) {
          const lag = Math.max(0, t - 3);
          const v = truePath[lag] + 0.2 * Math.sin(t * 0.5);
          ctx.lineTo(xToPix(t), yToPix(v - 0.4));
        }
        ctx.closePath();
        ctx.fill();
      }

      // Smoothing estimate (uses full sequence — closer to truth)
      if (mode === 'both' || mode === 'smooth') {
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const v = truePath[t] + 0.06 * Math.sin(t * 0.4);
          if (t === 0) ctx.moveTo(xToPix(t), yToPix(v)); else ctx.lineTo(xToPix(t), yToPix(v));
        }
        ctx.stroke();
        // Tighter band
        ctx.fillStyle = 'rgba(22, 163, 74, 0.15)';
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const v = truePath[t] + 0.06 * Math.sin(t * 0.4);
          if (t === 0) ctx.moveTo(xToPix(t), yToPix(v + 0.15));
          else ctx.lineTo(xToPix(t), yToPix(v + 0.15));
        }
        for (let t = T - 1; t >= 0; t--) {
          const v = truePath[t] + 0.06 * Math.sin(t * 0.4);
          ctx.lineTo(xToPix(t), yToPix(v - 0.15));
        }
        ctx.closePath();
        ctx.fill();
      }

      // Legend
      const lgX = padL + 8, lgY = padT + 10;
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(lgX, lgY); ctx.lineTo(lgX + 18, lgY); ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('True z(t)', lgX + 22, lgY);

      if (mode === 'both' || mode === 'filter') {
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(lgX, lgY + 18); ctx.lineTo(lgX + 18, lgY + 18); ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.fillText('Filtering q(z_t | x_{1:t}) — lag + wide band', lgX + 22, lgY + 18);
      }
      if (mode === 'both' || mode === 'smooth') {
        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(lgX, lgY + 36); ctx.lineTo(lgX + 18, lgY + 36); ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.fillText('Smoothing q(z_t | x_{1:T}) — sharp + tight ★', lgX + 22, lgY + 36);
      }

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 15, 30, 45, 60].forEach(t => ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time t', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('latent z(t)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
