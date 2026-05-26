/* viz: gt-llm-comparison
 * Grokked vs LLM accuracy comparison (paper Figure 5 / Table 3).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['gt-llm-comparison'] = function (canvas, controls, params) {
    const models = [
      { name: 'Grokked Transformer (50M)', composition: 99.5, comparison: 99.7, params: '50M', color: '#16a34a' },
      { name: 'GPT-4-Turbo + RAG', composition: 71.0, comparison: 75.8, params: '~1.76T', color: '#2563eb' },
      { name: 'Claude-3-Opus + CoT', composition: 60.2, comparison: 69.8, params: '~2T', color: '#9333ea' },
      { name: 'GPT-4-Turbo + CoT', composition: 62.0, comparison: 71.2, params: '~1.76T', color: '#ea580c' },
      { name: 'Gemini-1.5-Pro + CoT', composition: 58.0, comparison: 67.0, params: '~1.5T', color: '#ca8a04' },
      { name: 'Random baseline', composition: 5.0, comparison: 50.0, params: '—', color: '#9ca3af' },
    ];

    let task = 'composition';

    U.addSelect(controls, {
      label: 'Task',
      options: [
        { value: 'composition', label: 'Composition (2-hop)' },
        { value: 'comparison', label: 'Comparison (ordering)' },
      ],
      value: 'composition',
      onChange: (v) => { task = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`LLM Comparison — ${task} task (paper Table 3)`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('★ Grokked Transformer 50M < GPT-4 1.76T size 의 0.003% but accuracy 99.5% > 62%', w / 2, 40);

      const padL = 200, padR = 60, padT = 60, padB = 30;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const barH = innerH / models.length * 0.7;
      const gap = innerH / models.length;

      models.forEach((m, mi) => {
        const acc = m[task];
        const y = padT + mi * gap + (gap - barH) / 2;
        const barW = innerW * acc / 100;

        // Bar
        ctx.fillStyle = m.color;
        ctx.fillRect(padL, y, barW, barH);

        // Model name
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name, padL - 10, y + barH / 2);

        // Accuracy
        ctx.fillStyle = '#fff';
        ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(`${acc.toFixed(1)}%`, padL + barW - 8, y + barH / 2);

        // Params (right side)
        ctx.fillStyle = U.textMuted();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(m.params, padL + barW + 6, y + barH / 2);

        if (mi === 0) {  // star for grokked
          ctx.fillStyle = '#fbbf24';
          ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText('★', padL + barW + 60, y + barH / 2);
        }
      });

      // X axis
      ctx.strokeStyle = U.text();
      ctx.beginPath();
      ctx.moveTo(padL, padT + innerH);
      ctx.lineTo(padL + innerW, padT + innerH);
      ctx.stroke();
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 25, 50, 75, 100].forEach(p => {
        const px = padL + innerW * p / 100;
        ctx.fillText(`${p}%`, px, padT + innerH + 4);
      });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
