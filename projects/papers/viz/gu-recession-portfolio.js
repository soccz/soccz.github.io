/* viz: gu-recession-portfolio - portfolio cumulative return with NBER recessions */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-recession-portfolio'] = function (canvas, controls, params) {
    let model = 'CA2';
    U.addSelect(controls, {
      label: 'Model',
      options: [
        { value: 'FF5',  label: 'Fama-French 5F' },
        { value: 'IPCA', label: 'IPCA' },
        { value: 'CA2',  label: 'CA2 (★ paper best)' }
      ],
      value: 'CA2',
      onChange: (v) => { model = v; draw(); }
    });

    let seedState;
    function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }
    function gauss() {
      const u1 = Math.max(rand(), 1e-9), u2 = rand();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    const config = {
      FF5:  { mu: 0.0035, sigma: 0.045, color: '#94a3b8' },
      IPCA: { mu: 0.0072, sigma: 0.048, color: '#0891b2' },
      CA2:  { mu: 0.0125, sigma: 0.052, color: '#dc2626' },
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Long-Short Portfolio Cumulative Return — illustrative (SR per paper Table 3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const c = config[model];
      const annual = Math.pow(1 + c.mu, 12) - 1;
      ctx.fillText(`${model}: μ_monthly = ${(c.mu*100).toFixed(2)}%, annual ≈ ${(annual*100).toFixed(1)}%`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T_months = 720;  // 60 years
      const xToPix = (t) => padL + plotW * (t / T_months);
      const yMin = 0, yMax = 100;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // NBER recession bars (approximate, monthly)
      const recessions = [
        { start: 70, end: 80 },   // 1969-70
        { start: 130, end: 145 }, // 1973-75
        { start: 195, end: 205 }, // 1980
        { start: 215, end: 230 }, // 1981-82
        { start: 308, end: 318 }, // 1990-91
        { start: 442, end: 450 }, // 2001
        { start: 504, end: 522 }, // 2008-09
        { start: 624, end: 628 }, // 2020 COVID
      ];

      recessions.forEach(r => {
        ctx.fillStyle = '#dc2626';
        ctx.globalAlpha = 0.12;
        ctx.fillRect(xToPix(r.start), padT, xToPix(r.end) - xToPix(r.start), plotH);
        ctx.globalAlpha = 1;
      });

      // Generate cumulative return path
      seedState = 1234;
      let cum = 1.0;
      const path = [cum];
      for (let t = 0; t < T_months; t++) {
        const inRec = recessions.some(r => t >= r.start && t < r.end);
        const drag = inRec ? -0.005 : 0;  // small recession drag
        const r = c.mu + drag + c.sigma * gauss() * 0.3;
        cum *= (1 + r);
        path.push(cum);
      }

      // Plot path
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      path.forEach((v, t) => {
        const px = xToPix(t), py = yToPix(v);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(0) + 'x', padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const years = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
      years.forEach(y => {
        const t = (y - 1960) * 12;
        if (t >= 0 && t <= T_months) ctx.fillText(y.toString(), xToPix(t), padT + plotH + 6);
      });

      // Recession legend
      ctx.fillStyle = '#dc2626';
      ctx.globalAlpha = 0.15;
      ctx.fillRect(padL + plotW - 130, padT + 8, 12, 12);
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('NBER recessions', padL + plotW - 114, padT + 18);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time (years)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('cumulative return (× initial)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
