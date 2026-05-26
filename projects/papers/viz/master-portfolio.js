/* viz: master-portfolio - long-short portfolio cumulative return */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['master-portfolio'] = function (canvas, controls, params) {
    let topK = 30;
    U.addSlider(controls, {
      label: 'Top-K stocks', min: 5, max: 100, step: 5, value: 30,
      onInput: (v) => { topK = parseInt(v); draw(); },
      fmt: (v) => `K=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Long-Short Portfolio Performance (paper §4)', w/2, 22);

      // Simulated cumulative returns over 1000 days
      const days = 1000;
      let seed = 1234 + topK;
      function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      function gauss() {
        const u1 = Math.max(rand(), 1e-9), u2 = rand();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      }

      // MASTER (better when smaller top-K, but diminishing returns)
      const dailyMaster = 0.00094 - 0.000005 * Math.abs(topK - 30);  // peak at K=30
      const dailySigmaMaster = 0.0085;
      // Baseline (LSTM) lower mean, higher vol
      const dailyBase = 0.000587;
      const dailySigmaBase = 0.0102;

      seed = 9999;
      const masterPath = [1.0];
      const basePath = [1.0];
      for (let d = 0; d < days; d++) {
        const rM = dailyMaster + dailySigmaMaster * gauss();
        const rB = dailyBase + dailySigmaBase * gauss();
        masterPath.push(masterPath[masterPath.length - 1] * (1 + rM));
        basePath.push(basePath[basePath.length - 1] * (1 + rB));
      }
      const annualMaster = Math.pow(masterPath[days], 252/days) - 1;
      const annualBase = Math.pow(basePath[days], 252/days) - 1;

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top-${topK}: MASTER annual=${(annualMaster*100).toFixed(1)}%, LSTM=${(annualBase*100).toFixed(1)}%`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const maxPath = Math.max(...masterPath, ...basePath) * 1.05;
      const minPath = Math.min(...masterPath, ...basePath) * 0.95;
      const xToPix = (d) => padL + plotW * (d / days);
      const yToPix = (v) => padT + plotH * (1 - (v - minPath) / (maxPath - minPath));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = minPath + (maxPath - minPath) * (1 - i/5);
        ctx.fillText(v.toFixed(2) + 'x', padL - 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 250, 500, 750, 1000].forEach(d => {
        ctx.fillText(`${(d/252).toFixed(1)}y`, xToPix(d), padT + plotH + 6);
      });

      // Baseline path
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      basePath.forEach((v, d) => {
        const px = xToPix(d), py = yToPix(v);
        if (d === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // MASTER path
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      masterPath.forEach((v, d) => {
        const px = xToPix(d), py = yToPix(v);
        if (d === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Legend
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(padL + 10, padT + 14, 14, 3);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('MASTER (long-short)', padL + 30, padT + 18);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(padL + 10, padT + 32, 14, 3);
      ctx.fillStyle = U.text();
      ctx.fillText('LSTM baseline', padL + 30, padT + 36);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time (years)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('cumulative return (x initial)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
