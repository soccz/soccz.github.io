/* viz: gt-grok-trajectory
 * Grokking trajectory — 4 phases of training accuracy (paper Figure 3).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['gt-grok-trajectory'] = function (canvas, controls, params) {
    const N = 200;
    const steps = [];
    const train = [], val_id = [], val_ood = [];

    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const step = Math.pow(10, 3 + t * 4);  // 1K to 10M log scale
      steps.push(step);

      // Train: random→1.0 fast
      const train_acc = Math.min(1.0, 0.05 + 1.5 * Math.pow(t, 0.3));
      train.push(Math.min(1.0, train_acc));

      // Val ID: similar to train
      const val_id_acc = Math.min(0.99, 0.05 + 1.4 * Math.pow(t, 0.4));
      val_id.push(val_id_acc);

      // Val OOD: delayed grokking jump
      let val_ood_acc;
      if (t < 0.6) val_ood_acc = 0.05 + 0.05 * t;
      else if (t < 0.75) val_ood_acc = 0.08 + (t - 0.6) * 5.5;  // rapid jump
      else val_ood_acc = Math.min(0.97, 0.9 + (t - 0.75) * 0.3);
      val_ood.push(val_ood_acc);
    }

    let taskMode = 'composition';

    U.addSelect(controls, {
      label: 'Task',
      options: [
        { value: 'composition', label: 'Composition (slower grok)' },
        { value: 'comparison', label: 'Comparison (faster grok)' },
      ],
      value: 'composition',
      onChange: (v) => { taskMode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Grokking Trajectory — ${taskMode}`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const sub = taskMode === 'composition'
        ? 'Train 100% at step 50K → OOD generalization at step 5M (★ 100× delay)'
        : 'Train 100% at step 10K → OOD generalization at step 500K (★ 50× delay)';
      ctx.fillText(sub, w / 2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 90;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = Math.log10(1e3), xMax = Math.log10(1e7);
      const xToPix = (s) => padL + innerW * (Math.log10(s) - xMin) / (xMax - xMin);
      const yToPix = (acc) => padT + innerH * (1 - acc);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = 1.0 - i * 0.2;
        ctx.fillText(v.toFixed(1), padL - 8, padT + innerH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [1e3, 1e4, 1e5, 1e6, 1e7].forEach(s => {
        ctx.fillText(`${s.toExponential(0).replace('+', '')}`, xToPix(s), padT + innerH + 6);
      });

      // Plot 3 series
      const series = [
        { data: train, color: '#16a34a', label: 'Train accuracy' },
        { data: val_id, color: '#2563eb', label: 'Val ID' },
        { data: val_ood, color: '#dc2626', label: 'Val OOD ★ grokking metric' },
      ];

      const adjustedSteps = taskMode === 'comparison'
        ? steps.map(s => s / 10)  // 10× faster
        : steps;

      series.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const px = xToPix(adjustedSteps[i]);
          const py = yToPix(s.data[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Phase annotations
      const phases = [
        { x: 5e3, label: 'Phase 1\n(random)', color: U.textMuted() },
        { x: 2e5, label: 'Phase 2\n(memorization)', color: '#9333ea' },
        { x: 2e6, label: 'Phase 3\n(grokking!)', color: '#ea580c' },
        { x: 7e6, label: 'Phase 4\n(stable)', color: '#0891b2' },
      ];
      phases.forEach(p => {
        const xAdj = taskMode === 'comparison' ? p.x / 10 : p.x;
        const px = xToPix(xAdj);
        ctx.strokeStyle = p.color;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(px, padT); ctx.lineTo(px, padT + innerH);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = p.color;
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        p.label.split('\n').forEach((line, i) => {
          ctx.fillText(line, px, padT + 6 + i * 12);
        });
      });

      // Legend
      const legendY = h - 50;
      series.forEach((s, i) => {
        const lx = padL + i * 200;
        ctx.fillStyle = s.color;
        ctx.fillRect(lx, legendY - 3, 14, 6);
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(s.label, lx + 18, legendY);
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Training Step (log scale)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Accuracy', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
