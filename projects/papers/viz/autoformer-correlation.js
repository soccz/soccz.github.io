/* viz: autoformer-correlation - auto-correlation pattern */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['autoformer-correlation'] = function (canvas, controls, params) {
    let period = 24;
    U.addSelect(controls, {
      label: 'Series type',
      options: [
        { value: '24',  label: 'Daily (period 24h)' },
        { value: '168', label: 'Weekly (168h)' },
        { value: '12',  label: 'Monthly (12)' }
      ],
      value: '24',
      onChange: (v) => { period = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Auto-Correlation (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Periodicity = ${period} | Top-k delays from autocorr peaks`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Compute autocorr (synthetic)
      const maxLag = 300;
      const acf = [];
      for (let lag = 0; lag < maxLag; lag++) {
        // Peaks at multiples of period
        let val = 0.1;
        for (let p of [period, period * 2, period * 3, period * 4]) {
          if (Math.abs(lag - p) < 5) val += (1.0 - 0.2 * Math.floor((lag + 2) / period)) * Math.exp(-Math.pow(lag - p, 2) / 8);
        }
        val += 0.05 * Math.exp(-lag / 50);
        if (lag === 0) val = 1.0;
        acf.push(Math.min(1.0, val));
      }

      const xToPix = (lag) => padL + plotW * (lag / maxLag);
      const yToPix = (v) => padT + plotH * (1 - v);

      // Bars
      acf.forEach((v, lag) => {
        if (lag === 0) return;
        const px = xToPix(lag);
        const py = yToPix(v);
        const isTop = v > 0.3;
        ctx.fillStyle = isTop ? '#dc2626' : '#2563eb';
        ctx.globalAlpha = isTop ? 1.0 : 0.6;
        ctx.fillRect(px, py, plotW / maxLag * 0.85, padT + plotH - py);
      });
      ctx.globalAlpha = 1;

      // Annotate peaks
      [period, period * 2, period * 3].forEach(p => {
        if (p < maxLag) {
          const px = xToPix(p);
          const py = yToPix(acf[p] || 0.1);
          ctx.fillStyle = '#dc2626';
          ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'center';
          ctx.fillText(`lag=${p}`, px, py - 6);
        }
      });

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = 1.0 - i / 4;
        ctx.fillText(v.toFixed(2), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 50, 100, 150, 200, 250, 300].forEach(l => {
        if (l <= maxLag) ctx.fillText(l.toString(), xToPix(l), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('lag (time delay)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Autocorrelation', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
