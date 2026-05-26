/* viz: sfc-attribution-flow - attribution patching 3-step animation */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['sfc-attribution-flow'] = function (canvas, controls, params) {
    let step = 0; // 0..3
    const stepLabels = [
      'Step 0: clean forward — compute z, L',
      'Step 1: backward — ∇_z L',
      'Step 2: attribution — A_f = ∇L · z',
      'Step 3: threshold — circuit features'
    ];

    U.addSlider(controls, {
      label: 'Pipeline step', min: 0, max: 3, step: 1, value: 0,
      onInput: (v) => { step = parseInt(v); draw(); },
      fmt: (v) => `step ${v}/3`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SFC Attribution Patching Pipeline (paper §3)', w/2, 22);
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(stepLabels[step], w/2, 42);

      const padL = 60, padR = 40, padT = 70, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      // Boxes for pipeline
      const stages = [
        { x: 0.05, label: 'inputs', sub: 'tokens' },
        { x: 0.22, label: 'transformer', sub: 'hidden state' },
        { x: 0.42, label: 'SAE encode', sub: 'z (sparse)' },
        { x: 0.62, label: 'SAE decode', sub: 'x_hat' },
        { x: 0.82, label: 'L (loss)', sub: 'task loss' }
      ];

      // Forward arrows (always)
      ctx.strokeStyle = step >= 0 ? '#2563eb' : U.textMuted();
      ctx.lineWidth = 2;
      for (let i = 0; i < stages.length - 1; i++) {
        const x1 = padL + plotW * stages[i].x + 50;
        const x2 = padL + plotW * stages[i+1].x;
        const y = padT + plotH * 0.3;
        ctx.beginPath();
        ctx.moveTo(x1, y); ctx.lineTo(x2 - 5, y);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x2 - 5, y); ctx.lineTo(x2 - 10, y - 4); ctx.lineTo(x2 - 10, y + 4); ctx.closePath();
        ctx.fillStyle = '#2563eb';
        ctx.fill();
      }

      // Backward arrows (step >= 1)
      if (step >= 1) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        for (let i = stages.length - 1; i > 0; i--) {
          const x1 = padL + plotW * stages[i].x;
          const x2 = padL + plotW * stages[i-1].x + 50;
          const y = padT + plotH * 0.55;
          ctx.beginPath();
          ctx.moveTo(x1, y); ctx.lineTo(x2 + 5, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x2 + 5, y); ctx.lineTo(x2 + 10, y - 4); ctx.lineTo(x2 + 10, y + 4); ctx.closePath();
          ctx.fillStyle = '#dc2626';
          ctx.fill();
        }
        ctx.setLineDash([]);
      }

      // Stage boxes
      stages.forEach((s, i) => {
        const cx = padL + plotW * s.x;
        const cy = padT + plotH * 0.3;
        ctx.fillStyle = U.bg ? U.bg() : '#f9fafb';
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1.5;
        ctx.fillRect(cx - 5, cy - 22, 60, 44);
        ctx.strokeRect(cx - 5, cy - 22, 60, 44);
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText(s.label, cx + 25, cy - 4);
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.fillText(s.sub, cx + 25, cy + 11);
      });

      // Forward / backward labels
      ctx.fillStyle = '#2563eb';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('▶ forward (z, L)', padL + 5, padT + plotH * 0.3 - 35);
      if (step >= 1) {
        ctx.fillStyle = '#dc2626';
        ctx.fillText('◀ backward (∇_z L)', padL + 5, padT + plotH * 0.55 - 8);
      }

      // Attribution bar chart (step >= 2)
      if (step >= 2) {
        const barY = padT + plotH * 0.78;
        const barH = 50;
        const features = ['f_12', 'f_847', 'f_3K', 'f_5K', 'f_8K', 'f_12K', 'f_15K', 'f_29K'];
        const scores = [0.85, 0.62, 0.41, 0.28, 0.12, 0.08, 0.04, 0.02];
        const threshold = 0.1;
        const barW = (plotW - 40) / features.length;
        features.forEach((f, i) => {
          const x = padL + 20 + i * barW;
          const above = scores[i] > threshold;
          const inCircuit = (step >= 3) && above;
          ctx.fillStyle = inCircuit ? '#dc2626' : (above ? '#9333ea' : '#94a3b8');
          const hh = scores[i] * barH;
          ctx.fillRect(x + barW * 0.15, barY + barH - hh, barW * 0.7, hh);
          ctx.fillStyle = U.textMuted();
          ctx.font = '9px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'center';
          ctx.fillText(f, x + barW/2, barY + barH + 12);
          ctx.font = '9px ' + U.cssVar('--font-mono', 'monospace');
          ctx.fillText(scores[i].toFixed(2), x + barW/2, barY + barH - hh - 4);
        });
        // Threshold line
        if (step >= 3) {
          ctx.strokeStyle = '#dc2626';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          const ty = barY + barH - threshold * barH;
          ctx.beginPath();
          ctx.moveTo(padL + 20, ty); ctx.lineTo(padL + plotW - 20, ty);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#dc2626';
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'left';
          ctx.fillText(`τ=${threshold}`, padL + plotW - 15, ty + 4);
        }
      }
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
