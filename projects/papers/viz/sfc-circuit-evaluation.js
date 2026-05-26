/* viz: sfc-circuit-evaluation - 3-fold metric (faithfulness / completeness / minimality) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['sfc-circuit-evaluation'] = function (canvas, controls, params) {
    const thresholds = [0.001, 0.003, 0.01, 0.03, 0.06, 0.1, 0.3];
    const circuit_sizes = [200, 110, 50, 28, 18, 11, 5];
    const faithfulness = [0.99, 0.98, 0.95, 0.88, 0.78, 0.62, 0.41];
    const completeness = [0.99, 0.99, 0.97, 0.92, 0.84, 0.70, 0.52];
    const minimality   = [0.42, 0.58, 0.93, 0.95, 0.91, 0.86, 0.81];
    let selected = 2; // τ=0.01

    U.addSlider(controls, {
      label: 'Threshold τ', min: 0, max: thresholds.length-1, step: 1, value: 2,
      onInput: (v) => { selected = parseInt(v); draw(); },
      fmt: (v) => `τ=${thresholds[parseInt(v)]}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SFC 3-Fold Circuit Metric (paper §4)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const F = faithfulness[selected], C = completeness[selected], M = minimality[selected];
      ctx.fillText(`τ=${thresholds[selected]}, circuit=${circuit_sizes[selected]} features — F=${F.toFixed(2)}, C=${C.toFixed(2)}, M=${M.toFixed(2)}`, w/2, 40);

      const padL = 70, padR = 40, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = Math.log10(0.001), xMax = Math.log10(0.3);
      const xToPix = (t) => padL + plotW * (Math.log10(t) - xMin) / (xMax - xMin);
      const yToPix = (v) => padT + plotH * (1 - v);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = 1.0 - i/5;
        ctx.fillText(v.toFixed(1), padL - 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0.001, 0.01, 0.1].forEach(t => {
        ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6);
      });

      // 3 curves
      const series = [
        { color: '#2563eb', name: 'Faithfulness', data: faithfulness },
        { color: '#16a34a', name: 'Completeness', data: completeness },
        { color: '#dc2626', name: 'Minimality',   data: minimality }
      ];
      series.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < thresholds.length; i++) {
          const px = xToPix(thresholds[i]), py = yToPix(s.data[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        for (let i = 0; i < thresholds.length; i++) {
          const px = xToPix(thresholds[i]), py = yToPix(s.data[i]);
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(px, py, i === selected ? 6 : 3, 0, 2*Math.PI);
          ctx.fill();
        }
      });

      // Sweet zone (τ=0.01)
      const sz_left = xToPix(0.005);
      const sz_right = xToPix(0.02);
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.08;
      ctx.fillRect(sz_left, padT, sz_right - sz_left, plotH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Sweet zone', (sz_left + sz_right)/2, padT + 16);

      // Selected vertical line
      const sx = xToPix(thresholds[selected]);
      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, padT); ctx.lineTo(sx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend
      const legX = padL + 8, legY = padT + plotH - 80;
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
      ctx.fillText('Threshold τ (log scale)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Metric score (0-1)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
