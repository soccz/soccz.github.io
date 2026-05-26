/* viz: power-grokking-curve - The canonical Power 2022 grokking plot */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['power-grokking-curve'] = function (canvas, controls, params) {
    let logScale = true;
    U.addSelect(controls, {
      label: 'X-axis scale',
      options: [
        { value: 'log',    label: 'Log scale (★ paper style)' },
        { value: 'linear', label: 'Linear scale' }
      ],
      value: 'log',
      onChange: (v) => { logScale = (v === 'log'); draw(); }
    });

    function trainAcc(step) {
      if (step < 1000) return 0.01;
      if (step < 50000) return 0.01 + 0.99 * (Math.log10(step) - 3) / (Math.log10(50000) - 3);
      return 1.0;
    }
    function valAcc(step) {
      if (step < 50000) return 0.01;
      if (step < 1000000) return 0.01 + 0.01 * (Math.log10(step) - Math.log10(50000)) / (Math.log10(1000000) - Math.log10(50000));
      if (step < 2500000) {
        const p = (Math.log10(step) - Math.log10(1000000)) / (Math.log10(2500000) - Math.log10(1000000));
        return 0.02 + 0.98 * p * p;
      }
      return 1.0;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('The Canonical Grokking Curve (paper Figure 1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Modular addition mod 97, train_fraction=0.3, WD=1e-2', w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const maxStep = 5_000_000;
      const xToPix = logScale
        ? (s) => padL + plotW * (Math.log10(Math.max(s, 100)) - 2) / (Math.log10(maxStep) - 2)
        : (s) => padL + plotW * (s / maxStep);
      const yToPix = (v) => padT + plotH * (1 - v);

      // Train curve
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const stepLog = (i) => Math.pow(10, 2 + i * 0.05);
      for (let i = 0; i < 110; i++) {
        const s = logScale ? stepLog(i) : i * (maxStep / 110);
        if (s > maxStep) break;
        const px = xToPix(s), py = yToPix(trainAcc(s));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Val curve
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < 110; i++) {
        const s = logScale ? stepLog(i) : i * (maxStep / 110);
        if (s > maxStep) break;
        const px = xToPix(s), py = yToPix(valAcc(s));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = 1.0 - i/5;
        ctx.fillText(`${Math.round(v*100)}%`, padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      if (logScale) {
        [1000, 10000, 100000, 1000000].forEach(s => {
          ctx.fillText(`${s/1000}K`, xToPix(s), padT + plotH + 6);
        });
      } else {
        [0, 1, 2, 3, 4, 5].forEach(m => {
          ctx.fillText(`${m}M`, xToPix(m * 1000000), padT + plotH + 6);
        });
      }

      // Legend
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(padL + 12, padT + 14, 14, 3);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('Train accuracy', padL + 32, padT + 18);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 12, padT + 30, 14, 3);
      ctx.fillStyle = U.text();
      ctx.fillText('Val accuracy', padL + 32, padT + 34);

      // Phase annotations
      const phaseY = padT + 8;
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      if (logScale) {
        ctx.fillText('memorize', xToPix(10000), padT + plotH - 20);
        ctx.fillText('grok →', xToPix(1500000), padT + plotH * 0.5);
      }

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(logScale ? 'training step (log)' : 'training step', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Accuracy', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
