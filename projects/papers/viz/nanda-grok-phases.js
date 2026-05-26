/* viz: nanda-grok-phases
 * 4-phase grokking trajectory of modular arithmetic (Nanda 2023 Figure 1).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['nanda-grok-phases'] = function (canvas, controls, params) {
    const N = 200;
    const steps = [], train = [], val = [];

    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const step = Math.pow(10, 1 + t * 5);  // 10 to 1M
      steps.push(step);
      // Train: rapid increase to 100% by ~30K
      let ta = 1 - Math.exp(-(t / 0.3) ** 1.5);
      train.push(Math.min(1.0, ta));
      // Val: stays at chance until ~50K then sigmoid up
      let va;
      const grokStart = 0.55; // ~50K-80K on log scale
      const grokWidth = 0.1;
      if (t < grokStart) va = 0.01;
      else va = Math.min(0.99, 0.01 + 0.98 / (1 + Math.exp(-(t - grokStart - 0.05) / grokWidth * 8)));
      val.push(va);
    }

    let seed = 0;

    U.addSlider(controls, {
      label: 'Random seed', min: 0, max: 4, step: 1, value: 0,
      onInput: (v) => { seed = parseInt(v); draw(); },
      fmt: (v) => `seed ${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Nanda Modular Arithmetic — 4-Phase Trajectory (seed ${seed})`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Train acc 100% at step 30K → val acc 100% at step ~100K (grokking)', w / 2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = Math.log10(10), xMax = Math.log10(1e6);
      const xToPix = (s) => padL + innerW * (Math.log10(s) - xMin) / (xMax - xMin);
      const yToPix = (a) => padT + innerH * (1 - a);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = 1.0 - i * 0.2;
        ctx.fillText(v.toFixed(1), padL - 8, padT + innerH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [10, 100, 1e3, 1e4, 1e5, 1e6].forEach(s => {
        const lab = s >= 1e3 ? `${(s/1e3).toFixed(s>=1e6?0:0)}${s>=1e6?'M':'K'}` : String(s);
        ctx.fillText(lab, xToPix(s), padT + innerH + 6);
      });

      // Seed variation
      const offset = seed * 0.03 - 0.06;

      // Train line
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1) + offset * 0.3;
        const adjusted_step = Math.pow(10, 1 + Math.max(0, Math.min(1, t)) * 5);
        const px = xToPix(adjusted_step);
        const py = yToPix(train[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Val line
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1) + offset;
        const adjusted_step = Math.pow(10, 1 + Math.max(0, Math.min(1, t)) * 5);
        const px = xToPix(adjusted_step);
        const py = yToPix(val[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Phase boundaries
      const phases = [
        { start: 0.05, end: 0.20, color: '#9ca3af', label: 'Phase 1: Random' },
        { start: 0.20, end: 0.55, color: '#9333ea', label: 'Phase 2: Memorization' },
        { start: 0.55, end: 0.75, color: '#ea580c', label: 'Phase 3: ★ Grokking' },
        { start: 0.75, end: 0.95, color: '#0891b2', label: 'Phase 4: Cleanup' },
      ];
      phases.forEach(p => {
        const px1 = padL + innerW * p.start;
        const px2 = padL + innerW * p.end;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.08;
        ctx.fillRect(px1, padT, px2 - px1, innerH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = p.color;
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(p.label, (px1 + px2) / 2, padT + 4);
      });

      // Legend
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(padL + 10, h - 30, 14, 6);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('Train accuracy', padL + 28, h - 27);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 150, h - 30, 14, 6);
      ctx.fillStyle = U.text();
      ctx.fillText('Val accuracy ★ grokking metric', padL + 168, h - 27);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Training Step (log)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Accuracy', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
