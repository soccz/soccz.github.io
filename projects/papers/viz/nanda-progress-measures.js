/* viz: nanda-progress-measures
 * Three progress measures parallel evolution (Nanda 2023 Figure 5).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['nanda-progress-measures'] = function (canvas, controls, params) {
    const N = 200;
    const steps = [];
    const restricted_loss = [], gradient_sym = [], trig_loss = [];

    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const step = Math.pow(10, 1 + t * 5);
      steps.push(step);
      // Restricted loss: stays high then sigmoid drop
      const rl = t < 0.5 ? 4.5 : 4.5 / (1 + Math.exp((t - 0.65) * 18));
      restricted_loss.push(Math.max(0.05, rl));
      // Gradient symmetry: gradually decreases
      const gs = t < 0.2 ? 0.30 : 0.30 * Math.exp(-(t - 0.2) * 3.5);
      gradient_sym.push(Math.max(0.005, gs));
      // Trig loss: similar to restricted but slightly delayed
      const tl = t < 0.55 ? 4.7 : 4.7 / (1 + Math.exp((t - 0.7) * 16));
      trig_loss.push(Math.max(0.04, tl));
    }

    let metric = 'all';

    U.addSelect(controls, {
      label: 'Measure',
      options: [
        { value: 'all', label: 'All 3 measures' },
        { value: 'restricted', label: 'Restricted Loss only' },
        { value: 'gradient', label: 'Gradient Symmetry only' },
        { value: 'trig', label: 'Trigonometric Loss only' },
      ],
      value: 'all',
      onChange: (v) => { metric = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Progress Measures Evolution (Nanda 2023 Figure 5)', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('3 measures 의 parallel evolution — circuit formation 의 multi-axis tracking', w / 2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = Math.log10(10), xMax = Math.log10(1e6);
      const xToPix = (s) => padL + innerW * (Math.log10(s) - xMin) / (xMax - xMin);
      // Use log scale for y
      const yMin = 0.005, yMax = 5.0;
      const yToPix = (v) => padT + innerH * (1 - (Math.log10(v) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin)));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [0.01, 0.1, 1.0, 5.0].forEach(v => {
        ctx.fillText(v.toFixed(v < 1 ? 2 : 1), padL - 8, yToPix(v));
      });

      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [10, 100, 1e3, 1e4, 1e5, 1e6].forEach(s => {
        const lab = s >= 1e3 ? `${(s/1e3).toFixed(0)}K` : String(s);
        ctx.fillText(lab, xToPix(s), padT + innerH + 6);
      });

      const series = [
        { data: restricted_loss, color: '#dc2626', label: 'Restricted Loss', key: 'restricted' },
        { data: gradient_sym, color: '#9333ea', label: 'Gradient Symmetry', key: 'gradient' },
        { data: trig_loss, color: '#0891b2', label: 'Trigonometric Loss', key: 'trig' },
      ];

      series.forEach(s => {
        const show = metric === 'all' || metric === s.key;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = show ? 1 : 0.2;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const px = xToPix(steps[i]), py = yToPix(s.data[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Phase 3 marker
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      const phase3_x = xToPix(50000);
      ctx.beginPath();
      ctx.moveTo(phase3_x, padT); ctx.lineTo(phase3_x, padT + innerH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('★ Grokking transition', phase3_x + 4, padT + 4);

      // Legend
      series.forEach((s, i) => {
        const lx = padL + 10 + i * 180;
        ctx.fillStyle = s.color;
        ctx.fillRect(lx, h - 30, 14, 6);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(s.label, lx + 18, h - 27);
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Training Step (log)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Progress Measure (log scale)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
