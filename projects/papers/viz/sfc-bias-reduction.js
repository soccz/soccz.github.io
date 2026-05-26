/* viz: sfc-bias-reduction - pre/post-ablation bias bar chart */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['sfc-bias-reduction'] = function (canvas, controls, params) {
    let mode = 'before'; // 'before' or 'after'

    U.addSelect(controls, {
      label: 'Ablation state',
      options: [
        { value: 'before', label: 'Before ablation' },
        { value: 'after',  label: 'After gender-feature ablation' }
      ],
      value: 'before',
      onChange: (v) => { mode = v; draw(); }
    });

    const prompts = [
      { p: '"The doctor is"',    he_b: 78, he_a: 51 },
      { p: '"The nurse is"',     he_b: 18, he_a: 49 },
      { p: '"The engineer is"',  he_b: 88, he_a: 52 },
      { p: '"The teacher is"',   he_b: 28, he_a: 49 },
      { p: '"The lawyer is"',    he_b: 82, he_a: 51 },
      { p: '"The cook is"',      he_b: 45, he_a: 50 }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SFC Bias Removal — Gender-feature Ablation (paper §5)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const avgB = prompts.reduce((s,p)=>s+Math.abs(p.he_b - 50),0) / prompts.length;
      const avgA = prompts.reduce((s,p)=>s+Math.abs(p.he_a - 50),0) / prompts.length;
      const reduction = (1 - avgA/avgB) * 100;
      ctx.fillText(
        mode === 'before'
          ? `Before: avg deviation from neutral = ${avgB.toFixed(1)}%`
          : `After:  avg deviation = ${avgA.toFixed(1)}% — ${reduction.toFixed(0)}% reduction ★`,
        w/2, 42
      );

      const padL = 100, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const barH = plotH / prompts.length * 0.7;
      const gap = plotH / prompts.length * 0.3;

      // Center line (50%)
      const cx = padL + plotW / 2;
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, padT); ctx.lineTo(cx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('50% (neutral)', cx, padT - 8);

      prompts.forEach((p, i) => {
        const y = padT + i * (barH + gap) + gap/2;
        const he = mode === 'before' ? p.he_b : p.he_a;
        const she = 100 - he;
        // he bar (left of 50? right of 50?)  — actually plot 0..100 horizontally
        const heW = plotW * (he / 100);
        const sheW = plotW - heW;
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(padL, y, heW, barH);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(padL + heW, y, sheW, barH);

        // Prompt label
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(p.p, padL - 8, y + barH/2);

        // % labels
        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        if (heW > 30) ctx.fillText(`he ${he}%`, padL + 5, y + barH/2);
        ctx.textAlign = 'right';
        if (sheW > 30) ctx.fillText(`she ${she}%`, padL + plotW - 5, y + barH/2);
      });

      // Legend
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(padL, padT + plotH + 15, 14, 10);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('P(he)', padL + 20, padT + plotH + 20);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 70, padT + plotH + 15, 14, 10);
      ctx.fillStyle = U.text();
      ctx.fillText('P(she)', padL + 90, padT + plotH + 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
