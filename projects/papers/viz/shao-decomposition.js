/* viz: shao-decomposition - pattern-mixture decomposition */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['shao-decomposition'] = function (canvas, controls, params) {
    let component = 'all';
    U.addSelect(controls, {
      label: 'Component',
      options: [
        { value: 'all',      label: 'All components' },
        { value: 'level',    label: 'Level only' },
        { value: 'trend',    label: 'Trend only' },
        { value: 'seasonal', label: 'Seasonal only' }
      ],
      value: 'all',
      onChange: (v) => { component = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Pattern-Mixture Decomposition (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('x_t = level + trend·t + seasonal(t) (VAE-learned)', w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 100;
      const xToPix = (t) => padL + plotW * (t / T);
      const yMin = -0.5, yMax = 1.5;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Components
      const levels = []; const trends = []; const seasonals = []; const fulls = [];
      for (let t = 0; t < T; t++) {
        const lvl = 0.5;
        const trd = 0.003 * t;
        const sea = 0.3 * Math.sin(2 * Math.PI * t / 20);
        levels.push(lvl);
        trends.push(lvl + trd);
        seasonals.push(lvl + sea);
        fulls.push(lvl + trd + sea);
      }

      function plotLine(data, color, lw=2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();
        data.forEach((v, i) => {
          const px = xToPix(i), py = yToPix(v);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      if (component === 'all' || component === 'level') plotLine(levels, '#94a3b8', 2);
      if (component === 'all' || component === 'trend') plotLine(trends, '#16a34a', 2);
      if (component === 'all' || component === 'seasonal') plotLine(seasonals, '#dc2626', 2);
      if (component === 'all') plotLine(fulls, '#2563eb', 3);

      // Legend
      const lgY = padT + 10;
      const series = [
        { color: '#94a3b8', name: 'Level (constant)' },
        { color: '#16a34a', name: 'Trend (slope)' },
        { color: '#dc2626', name: 'Seasonal (period=20)' },
        { color: '#2563eb', name: 'Full x_t = sum' }
      ];
      series.forEach((s, i) => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padL + 10, lgY + i * 18 - 6);
        ctx.lineTo(padL + 30, lgY + i * 18 - 6);
        ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText(s.name, padL + 36, lgY + i * 18);
      });

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(t => {
        ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
