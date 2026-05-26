/* viz: lyle-rewarm-cycle - LR schedule with re-warm */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lyle-rewarm-cycle'] = function (canvas, controls, params) {
    let cyclePeriod = 10000;
    U.addSlider(controls, {
      label: 'Cycle period', min: 2000, max: 30000, step: 1000, value: 10000,
      onInput: (v) => { cyclePeriod = parseInt(v); draw(); },
      fmt: (v) => `${parseInt(v)/1000}K steps`
    });

    function lr_at(step) {
      const warmup = 500;
      const baseLR = 1e-3, maxLR = 3e-3;
      const pos = step % cyclePeriod;
      if (pos < warmup) {
        return baseLR + (maxLR - baseLR) * (pos / warmup);
      } else {
        const decay = (pos - warmup) / (cyclePeriod - warmup);
        return baseLR + 0.5 * (maxLR - baseLR) * (1 + Math.cos(decay * Math.PI));
      }
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Re-warm LR Schedule (paper §4)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const cycles = 40000 / cyclePeriod;
      ctx.fillText(`Cycle=${cyclePeriod}, ${cycles.toFixed(1)} cycles in 40K steps`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const maxStep = 40000;
      const xToPix = (s) => padL + plotW * (s / maxStep);
      const yMax = 4e-3, yMin = 0;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // LR curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let s = 0; s <= maxStep; s += 100) {
        const px = xToPix(s), py = yToPix(lr_at(s));
        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Cycle markers
      for (let cycle = 1; cycle * cyclePeriod < maxStep; cycle++) {
        const px = xToPix(cycle * cyclePeriod);
        ctx.strokeStyle = '#dc2626';
        ctx.setLineDash([2, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, padT); ctx.lineTo(px, padT + plotH);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(4), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 10, 20, 30, 40].forEach(s => {
        ctx.fillText(`${s}K`, xToPix(s * 1000), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('training step', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Learning Rate', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
