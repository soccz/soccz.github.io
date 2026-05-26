/* viz: tg-crps-vs-d
 * CRPS_sum vs D (dimension) scatter plot for 6 datasets.
 * Shows TimeGrad's CRPS doesn't degrade with D (linear-ish, not exponential).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-crps-vs-d'] = function (canvas, controls, params) {
    // 6 datasets
    const datasets = [
      { name: 'Exchange', D: 8, freq: 'Day', timegrad: 0.006, transmaf: 0.005, gpcop: 0.007 },
      { name: 'Solar', D: 137, freq: 'Hour', timegrad: 0.287, transmaf: 0.301, gpcop: 0.337 },
      { name: 'Electricity', D: 370, freq: 'Hour', timegrad: 0.0206, transmaf: 0.0207, gpcop: 0.0245 },
      { name: 'Traffic', D: 963, freq: 'Hour', timegrad: 0.044, transmaf: 0.056, gpcop: 0.078 },
      { name: 'Taxi', D: 1214, freq: '30min', timegrad: 0.114, transmaf: 0.179, gpcop: 0.208 },
      { name: 'Wikipedia', D: 2000, freq: 'Day', timegrad: 0.0485, transmaf: 0.063, gpcop: 0.086 },
    ];

    let showModel = 'all';

    U.addSelect(controls, {
      label: 'Models',
      options: [
        { value: 'all', label: 'All 3 models' },
        { value: 'timegrad', label: 'TimeGrad only' },
        { value: 'compare', label: 'TimeGrad vs Trans-MAF' },
      ],
      value: 'all',
      onChange: (v) => { showModel = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // log-log scale
      const logD = datasets.map(d => Math.log10(d.D));
      const allCrps = [];
      datasets.forEach(d => { allCrps.push(d.timegrad, d.transmaf, d.gpcop); });
      const logCrps = allCrps.map(v => Math.log10(v));
      const yMin = Math.min(...logCrps) - 0.2;
      const yMax = Math.max(...logCrps) + 0.2;
      const xMin = Math.log10(5);
      const xMax = Math.log10(3000);

      const xToPix = (lx) => padL + innerW * (lx - xMin) / (xMax - xMin);
      const yToPix = (ly) => padT + innerH * (1 - (ly - yMin) / (yMax - yMin));

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS_sum vs Dimension D — 250× D variation, single hyperparameter config', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('log-log scale; TimeGrad robust across all D', w / 2, 40);

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y axis ticks (log)
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const ly = yMax - (yMax - yMin) * i / 5;
        const v = Math.pow(10, ly);
        ctx.fillText(v.toFixed(v < 0.01 ? 4 : v < 0.1 ? 3 : 2), padL - 8, padT + innerH * i / 5);
      }
      // X axis ticks (log)
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [10, 30, 100, 300, 1000, 3000].forEach(n => {
        if (Math.log10(n) >= xMin && Math.log10(n) <= xMax) {
          ctx.fillText(String(n), xToPix(Math.log10(n)), padT + innerH + 6);
        }
      });

      // Plot points + connecting line per model
      const series = [
        { key: 'timegrad', label: 'TimeGrad', color: U.accent(), show: showModel === 'all' || showModel === 'timegrad' || showModel === 'compare' },
        { key: 'transmaf', label: 'Trans-MAF', color: '#ea580c', show: showModel === 'all' || showModel === 'compare' },
        { key: 'gpcop', label: 'GP-Copula', color: '#9333ea', show: showModel === 'all' },
      ];

      series.forEach(s => {
        if (!s.show) return;

        // Sort by D for line
        const points = datasets.map((d, i) => ({ x: logD[i], y: Math.log10(d[s.key]), name: d.name, D: d.D, v: d[s.key] }));
        points.sort((a, b) => a.x - b.x);

        // Connecting line
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        points.forEach((p, i) => {
          const px = xToPix(p.x); const py = yToPix(p.y);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Points
        ctx.fillStyle = s.color;
        points.forEach(p => {
          const px = xToPix(p.x); const py = yToPix(p.y);
          ctx.beginPath(); ctx.arc(px, py, 5, 0, 2 * Math.PI); ctx.fill();
        });
      });

      // Dataset labels (always show with TimeGrad point)
      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      datasets.forEach((d, i) => {
        const px = xToPix(logD[i]);
        const py = yToPix(Math.log10(d.timegrad));
        ctx.fillText(`${d.name} (D=${d.D})`, px + 8, py - 4);
      });

      // Legend
      const legendY = padT + 10;
      let legendX = padL + 10;
      series.forEach(s => {
        if (!s.show) return;
        ctx.fillStyle = s.color;
        ctx.fillRect(legendX, legendY - 4, 12, 4);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(s.label, legendX + 18, legendY);
        legendX += ctx.measureText(s.label).width + 40;
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Dimension D (log scale)', padL + innerW / 2, h - 12);
      ctx.save();
      ctx.translate(16, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('CRPS_sum (log scale)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
