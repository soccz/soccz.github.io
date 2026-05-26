/* viz: acdc-threshold-sweep - τ vs circuit size */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['acdc-threshold-sweep'] = function (canvas, controls, params) {
    const thresholds = [0.001, 0.003, 0.01, 0.03, 0.06, 0.1, 0.3, 0.5, 1.0];
    const circuit_sizes = [87, 73, 51, 38, 26, 18, 12, 6, 3];
    const kl_losses = [0.0008, 0.0024, 0.012, 0.035, 0.058, 0.097, 0.230, 0.420, 0.850];
    let selected = 4; // index of τ=0.06

    U.addSlider(controls, {
      label: 'Threshold τ', min: 0, max: thresholds.length-1, step: 1, value: 4,
      onInput: (v) => { selected = parseInt(v); draw(); },
      fmt: (v) => `τ=${thresholds[parseInt(v)]}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Threshold τ vs Circuit Size (paper §5)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Current: τ=${thresholds[selected]}, circuit=${circuit_sizes[selected]} edges, KL loss=${kl_losses[selected].toFixed(3)}`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = Math.log10(0.001), xMax = Math.log10(1.0);
      const xToPix = (t) => padL + plotW * (Math.log10(t) - xMin) / (xMax - xMin);
      const yMax = 100;
      const yToPix = (c) => padT + plotH * (1 - c / yMax);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax * (1 - i/5);
        ctx.fillText(v.toFixed(0), padL - 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0.001, 0.01, 0.1, 1.0].forEach(t => {
        ctx.fillText(t.toString(), xToPix(t), padT + plotH + 6);
      });

      // Plot circuit size curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < thresholds.length; i++) {
        const px = xToPix(thresholds[i]), py = yToPix(circuit_sizes[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points
      for (let i = 0; i < thresholds.length; i++) {
        const px = xToPix(thresholds[i]), py = yToPix(circuit_sizes[i]);
        ctx.fillStyle = i === selected ? '#dc2626' : '#2563eb';
        ctx.beginPath();
        ctx.arc(px, py, i === selected ? 8 : 4, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(circuit_sizes[i].toString(), px, py - 6);
      }

      // Goldilocks zone
      const gl_left = xToPix(0.05);
      const gl_right = xToPix(0.1);
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.1;
      ctx.fillRect(gl_left, padT, gl_right - gl_left, plotH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Goldilocks zone', (gl_left + gl_right)/2, padT + 16);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Threshold τ (log scale)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Circuit Size (edges)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
