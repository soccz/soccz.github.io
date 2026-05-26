/* viz: power-wd-ablation - weight decay ablation */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['power-wd-ablation'] = function (canvas, controls, params) {
    let wdIdx = 3;
    const wds = [0, 1e-4, 1e-3, 1e-2, 1e-1, 1.0];
    const labels = ['0', '1e-4', '1e-3', '1e-2 ★', '1e-1', '1.0'];
    const stepsToGrok = [Infinity, Infinity, 5e7, 5e6, 5e7, Infinity];
    const finalAcc = [0.014, 0.015, 0.95, 1.0, 0.62, 0.02];

    U.addSlider(controls, {
      label: 'Weight decay', min: 0, max: 5, step: 1, value: 3,
      onInput: (v) => { wdIdx = parseInt(v); draw(); },
      fmt: (v) => `WD=${labels[parseInt(v)]}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Weight Decay Ablation (paper §5)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const isGrok = stepsToGrok[wdIdx] !== Infinity;
      ctx.fillText(
        isGrok
          ? `WD=${labels[wdIdx]}: grok at ${(stepsToGrok[wdIdx]/1e6).toFixed(0)}M steps, final val=${(finalAcc[wdIdx]*100).toFixed(0)}%`
          : `WD=${labels[wdIdx]}: NO GROK (final val=${(finalAcc[wdIdx]*100).toFixed(0)}%)`,
        w/2, 40
      );

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Bar chart
      const barW = plotW / wds.length * 0.7;
      const gap = plotW / wds.length * 0.3;

      wds.forEach((wd, i) => {
        const x = padL + i * (barW + gap) + gap/2;
        const acc = finalAcc[i];
        const isSelected = (i === wdIdx);
        const isGoldilocks = (i === 3);

        let color;
        if (acc > 0.9) color = '#16a34a';
        else if (acc > 0.5) color = '#ca8a04';
        else color = '#dc2626';

        ctx.fillStyle = color;
        ctx.globalAlpha = isSelected ? 1.0 : 0.65;
        const barH_ = plotH * acc;
        ctx.fillRect(x, padT + plotH - barH_, barW, barH_);
        ctx.globalAlpha = 1;

        if (isSelected) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, padT + plotH - barH_, barW, barH_);
        }

        // Label
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(labels[i], x + barW/2, padT + plotH + 8);

        // Value
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${(acc*100).toFixed(0)}%`, x + barW/2, padT + plotH - barH_ - 4);
      });

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = 1.0 - i/5;
        ctx.fillText(`${Math.round(v*100)}%`, padL - 6, padT + plotH * i / 5);
      }

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Weight decay coefficient', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Final val accuracy', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
