/* viz: timegrad-architecture - RNN + diffusion architecture */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timegrad-architecture'] = function (canvas, controls, params) {
    let phase = 'training';
    U.addSelect(controls, {
      label: 'Phase',
      options: [
        { value: 'training', label: 'Training (forward diffusion)' },
        { value: 'sampling', label: 'Sampling (reverse denoising)' }
      ],
      value: 'training',
      onChange: (v) => { phase = v; draw(); }
    });

    function box(ctx, x, y, w_, h_, color, label, sub) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x - w_/2, y - h_/2, w_, h_);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w_/2, y - h_/2, w_, h_);
      ctx.fillStyle = '#fff';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, sub ? y - 5 : y);
      if (sub) {
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(sub, x, y + 8);
      }
    }

    function arrow(ctx, x1, y1, x2, y2, color = '#000', dashed = false) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (dashed) ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI/6), y2 - 8 * Math.sin(angle - Math.PI/6));
      ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI/6), y2 - 8 * Math.sin(angle + Math.PI/6));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('TimeGrad Architecture (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(phase === 'training' ? 'Training: predict ε from noisy x_t + condition h_t' :
                                            'Sampling: T-step iterative denoising', w/2, 40);

      const padL = 60, padR = 60, padT = 70;
      const plotW = w - padL - padR;
      const cx = padL + plotW / 2;

      // RNN encoder (left)
      box(ctx, padL + 80, padT + 40, 140, 40, '#2563eb', 'RNN encoder', 'past x_{1:t-1}');

      // Hidden state
      box(ctx, padL + 80, padT + 100, 140, 30, '#9333ea', 'Hidden h_t');

      // Diffusion model (center)
      box(ctx, cx, padT + 100, 180, 30, '#dc2626', 'Diffusion model ε_θ', 'condition: h_t');

      // Inputs to diffusion
      if (phase === 'training') {
        box(ctx, cx - 100, padT + 180, 130, 35, '#16a34a', 'Noisy x_t', 'noise added');
        box(ctx, cx + 100, padT + 180, 130, 35, '#ca8a04', 'Noise level t', 'embedding');
      } else {
        box(ctx, cx - 100, padT + 180, 130, 35, '#16a34a', 'Current x^{(k)}', 'denoised so far');
        box(ctx, cx + 100, padT + 180, 130, 35, '#ca8a04', 'Step k', '(reverse)');
      }

      // Output
      box(ctx, cx, padT + 270, 200, 35, '#dc2626',
          phase === 'training' ? 'Predicted noise ε̂' : 'x^{(k-1)} (less noisy)',
          phase === 'training' ? 'training target' : '★ output');

      // Loss / final
      if (phase === 'training') {
        box(ctx, cx + 200, padT + 270, 130, 35, '#000', 'L = ||ε - ε̂||²', 'MSE loss');
        arrow(ctx, cx + 100, padT + 287, cx + 130, padT + 287);
      }

      // Arrows
      arrow(ctx, padL + 80, padT + 60, padL + 80, padT + 85);
      arrow(ctx, padL + 80, padT + 115, cx - 90, padT + 100);
      arrow(ctx, cx - 100, padT + 195, cx - 50, padT + 130, '#16a34a');
      arrow(ctx, cx + 100, padT + 195, cx + 50, padT + 130, '#ca8a04');
      arrow(ctx, cx, padT + 115, cx, padT + 250);

      // Sampling loop annotation
      if (phase === 'sampling') {
        ctx.strokeStyle = '#dc2626';
        ctx.setLineDash([5, 3]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 100, padT + 287);
        ctx.lineTo(cx + 200, padT + 287);
        ctx.lineTo(cx + 200, padT + 180);
        ctx.lineTo(cx - 35, padT + 180);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#dc2626';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Loop k=T→1', cx + 130, padT + 220);
      }
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
