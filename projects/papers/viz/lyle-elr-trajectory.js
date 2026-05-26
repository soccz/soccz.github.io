/* viz: lyle-elr-trajectory - ELR over training */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lyle-elr-trajectory'] = function (canvas, controls, params) {
    let useRewarm = false;
    U.addSelect(controls, {
      label: 'Method',
      options: [
        { value: 'off', label: 'No intervention (plasticity loss)' },
        { value: 'on',  label: 'With Re-warm (★ paper)' }
      ],
      value: 'off',
      onChange: (v) => { useRewarm = (v === 'on'); draw(); }
    });

    function elr_no(step) { return 0.045 * Math.exp(-step / 50000) + 0.0005; }
    function elr_rewarm(step) {
      const base = 0.012 + (0.030 - 0.012) * Math.exp(-step / 100000);
      const cyclePos = step % 10000;
      const cycle = cyclePos < 500 ? (cyclePos / 500) : (1 - (cyclePos - 500) / 9500);
      return base + 0.015 * Math.max(0, cycle);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('ELR Trajectory (paper §3)', w/2, 22);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const maxStep = 300000;
      const xToPix = (s) => padL + plotW * (s / maxStep);
      const yMax = 0.06, yMin = 0;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Threshold line
      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      const thy = yToPix(0.001);
      ctx.beginPath();
      ctx.moveTo(padL, thy); ctx.lineTo(padL + plotW, thy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#dc2626';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('ELR threshold = 0.001 (plasticity loss zone below)', padL + 10, thy - 4);

      // Curve
      const fn = useRewarm ? elr_rewarm : elr_no;
      ctx.strokeStyle = useRewarm ? '#16a34a' : '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let s = 0; s <= maxStep; s += 1000) {
        const px = xToPix(s), py = yToPix(fn(s));
        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Title
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'center';
      const finalELR = fn(maxStep);
      ctx.fillText(
        useRewarm
          ? `Final ELR=${finalELR.toFixed(4)} (healthy zone ✓)`
          : `Final ELR=${finalELR.toFixed(4)} (plasticity loss ✗)`,
        w/2, 40
      );

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 6; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/6);
        ctx.fillText(v.toFixed(3), padL - 6, padT + plotH * i / 6);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 100, 200, 300].forEach(s => {
        ctx.fillText(`${s}K`, xToPix(s * 1000), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('training step', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Effective LR', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
