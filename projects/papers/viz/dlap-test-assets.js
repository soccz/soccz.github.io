/* viz: dlap-test-assets - test assets vs predicted vs FF baselines */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-test-assets'] = function (canvas, controls, params) {
    let model = 'DLAP';
    U.addSelect(controls, {
      label: 'Model',
      options: [
        { value: 'CAPM',  label: 'CAPM' },
        { value: 'FF3',   label: 'Fama-French 3-factor' },
        { value: 'FF5',   label: 'Fama-French 5-factor' },
        { value: 'IPCA',  label: 'IPCA (Kelly 2019)' },
        { value: 'DLAP',  label: 'DLAP (this paper) ★' }
      ],
      value: 'DLAP',
      onChange: (v) => { model = v; draw(); }
    });

    const config = {
      CAPM: { spread: 0.045, color: '#94a3b8', r2: 0.18 },
      FF3:  { spread: 0.038, color: '#94a3b8', r2: 0.31 },
      FF5:  { spread: 0.030, color: '#0891b2', r2: 0.42 },
      IPCA: { spread: 0.020, color: '#0891b2', r2: 0.58 },
      DLAP: { spread: 0.008, color: '#16a34a', r2: 0.81 },
    };

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
      ctx.fillText('Test Assets: Predicted vs Realized E[R^e] (paper Fig 3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const c = config[model];
      ctx.fillText(`${model}: cross-sectional R² = ${c.r2.toFixed(2)}, avg |alpha| = ${(c.spread*100).toFixed(1)}%`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const range = 0.15;
      const xToPix = (v) => padL + plotW * (v + range/2) / range;
      const yToPix = (v) => padT + plotH * (1 - (v + range/2) / range);

      // 45-degree line (perfect prediction)
      ctx.strokeStyle = '#000';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xToPix(-range/2), yToPix(-range/2));
      ctx.lineTo(xToPix(range/2), yToPix(range/2));
      ctx.stroke();
      ctx.setLineDash([]);

      // Plot 50 test assets
      seedState = 42;
      const n = 50;
      for (let i = 0; i < n; i++) {
        const realized = (rand() - 0.5) * range * 0.85;
        const pred = realized + gauss() * c.spread;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(xToPix(pred), yToPix(realized), 4, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = -range/2 + range * (1 - i/4);
        ctx.fillText((v*100).toFixed(1) + '%', padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 4; i++) {
        const v = -range/2 + range * (i/4);
        ctx.fillText((v*100).toFixed(1) + '%', padL + plotW * i/4, padT + plotH + 6);
      }

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Predicted excess return', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Realized excess return', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
