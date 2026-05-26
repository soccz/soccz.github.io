/* viz: tg-loss-trajectory
 * 4-Phase training loss trajectory.
 * Synthetic but qualitatively matches typical TimeGrad training curves.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-loss-trajectory'] = function (canvas, controls, params) {
    // 100 epochs, 4 distinct phases
    const epochs = 100;
    const loss = new Array(epochs);
    const phases = [
      { start: 0, end: 15, label: 'Phase 1: Mean fit', color: '#dc2626' },
      { start: 15, end: 40, label: 'Phase 2: Variance fit', color: '#ea580c' },
      { start: 40, end: 70, label: 'Phase 3: Multimodal', color: '#ca8a04' },
      { start: 70, end: 100, label: 'Phase 4: Refine', color: '#16a34a' },
    ];

    // Synthesize realistic loss trajectory
    for (let e = 0; e < epochs; e++) {
      let base;
      if (e < 15) base = 1.0 - 0.5 * (e / 15);  // fast drop from 1.0 → 0.5
      else if (e < 40) base = 0.5 - 0.25 * ((e - 15) / 25);  // 0.5 → 0.25
      else if (e < 70) base = 0.25 - 0.13 * ((e - 40) / 30);  // 0.25 → 0.12
      else base = 0.12 - 0.03 * ((e - 70) / 30);  // 0.12 → 0.09
      // Add small noise
      const noise = (Math.sin(e * 0.7) + Math.cos(e * 1.3)) * 0.015;
      loss[e] = base + noise;
    }

    let selectedPhase = -1;

    U.addSelect(controls, {
      label: 'Highlight phase',
      options: [{ value: '-1', label: 'All' }].concat(phases.map((p, i) => ({ value: String(i), label: p.label }))),
      value: '-1',
      onChange: (v) => { selectedPhase = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 30, padT = 56, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const maxL = 1.1, minL = 0.05;
      const xToPix = (e) => padL + innerW * (e / (epochs - 1));
      const yToPix = (l) => padT + innerH * (1 - (l - minL) / (maxL - minL));

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Training Loss Trajectory — 4 Phases (Solar, D=137)', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('L₁ noise prediction loss — annotated phase transitions', w / 2, 40);

      // Phase bands
      phases.forEach((p, pi) => {
        const x1 = xToPix(p.start);
        const x2 = xToPix(p.end);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = (selectedPhase === -1 || selectedPhase === pi) ? 0.12 : 0.04;
        ctx.fillRect(x1, padT, x2 - x1, innerH);
        ctx.globalAlpha = 1;

        // Phase label
        if (selectedPhase === -1 || selectedPhase === pi) {
          ctx.fillStyle = p.color;
          ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center';
          ctx.fillText(p.label, (x1 + x2) / 2, padT - 6);
        }
      });

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = maxL - (maxL - minL) * i / 5;
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 5);
      }

      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let e = 0; e <= 100; e += 20) {
        ctx.fillText(String(e), xToPix(e), padT + innerH + 6);
      }

      // Loss curve
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let e = 0; e < epochs; e++) {
        const px = xToPix(e), py = yToPix(loss[e]);
        if (e === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Phase markers (vertical lines at boundaries)
      phases.forEach((p, pi) => {
        if (pi === 0) return;
        const px = xToPix(p.start);
        ctx.strokeStyle = p.color;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, padT); ctx.lineTo(px, padT + innerH);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Epoch', padL + innerW / 2, h - 8);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Training Loss (L₁)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
