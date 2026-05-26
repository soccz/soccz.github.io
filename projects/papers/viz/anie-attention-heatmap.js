/* viz: anie-attention-heatmap
 * paper Figure 1 — original vs adversarial attention heatmap.
 * Shows the same prediction emerging from very different attention distributions.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-attention-heatmap'] = function (canvas, controls, params) {
    // Pre-defined examples from paper / typical movie reviews
    const examples = [
      {
        name: 'Movie review (paper Fig 1)',
        tokens: ['after', '15', 'min', 'watching', 'the', 'movie', 'i', 'was', 'asking', 'myself', 'what', 'to', 'do', 'leave', 'theater', 'sleep', 'or', 'try', 'finally', 'watched', 'what', 'a', 'waste', 'of', 'time', 'maybe', 'not', 'a', 'kid', 'anymore'],
        original: [0.01, 0.01, 0.02, 0.02, 0.01, 0.02, 0.01, 0.02, 0.01, 0.01, 0.02, 0.01, 0.01, 0.02, 0.02, 0.02, 0.01, 0.01, 0.02, 0.02, 0.01, 0.01, 0.45, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01],
        adversarial: [0.02, 0.01, 0.02, 0.02, 0.01, 0.02, 0.01, 0.45, 0.01, 0.01, 0.02, 0.01, 0.02, 0.02, 0.02, 0.02, 0.01, 0.02, 0.02, 0.02, 0.01, 0.01, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01],
        ypred: 0.01,
        ypred_adv: 0.012,
        label: 'negative',
      },
      {
        name: 'Diabetes note (medical)',
        tokens: ['patient', 'admitted', 'with', 'elevated', 'glucose', '250', 'mg/dl', 'and', 'HbA1c', '7.5', 'history', 'of', 'hyperglycemia', 'started', 'on', 'metformin', '500mg', 'BID', 'monitoring', 'recommended'],
        original: [0.02, 0.02, 0.01, 0.05, 0.18, 0.10, 0.05, 0.01, 0.20, 0.08, 0.03, 0.01, 0.10, 0.02, 0.01, 0.06, 0.02, 0.01, 0.02, 0.01],
        adversarial: [0.10, 0.10, 0.05, 0.08, 0.06, 0.05, 0.04, 0.05, 0.07, 0.04, 0.06, 0.03, 0.06, 0.04, 0.03, 0.05, 0.03, 0.02, 0.03, 0.02],
        ypred: 0.95,
        ypred_adv: 0.78,
        label: 'diabetes positive',
      },
      {
        name: 'AG News (business)',
        tokens: ['general', 'motors', 'and', 'daimlerchrysler', 'announced', 'today', 'they', 'are', 'teaming', 'up', 'to', 'develop', 'hybrid', 'engines', 'cooperation'],
        original: [0.05, 0.10, 0.02, 0.15, 0.08, 0.02, 0.01, 0.01, 0.12, 0.02, 0.01, 0.08, 0.20, 0.10, 0.03],
        adversarial: [0.15, 0.05, 0.08, 0.05, 0.10, 0.08, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.10, 0.04],
        ypred: 0.92,
        ypred_adv: 0.90,
        label: 'business',
      },
    ];

    let exIdx = 0;
    let viewMode = 'compare'; // compare, original, adversarial

    U.addSelect(controls, {
      label: 'Example',
      options: examples.map((e, i) => ({ value: String(i), label: e.name })),
      value: '0',
      onChange: (v) => { exIdx = parseInt(v); draw(); }
    });
    U.addSelect(controls, {
      label: 'View',
      options: [
        { value: 'compare', label: 'Compare (both)' },
        { value: 'original', label: 'Original only' },
        { value: 'adversarial', label: 'Adversarial only' },
      ],
      value: 'compare',
      onChange: (v) => { viewMode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const ex = examples[exIdx];
      const padL = 16, padR = 16, padT = 60, padB = 30;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Attention Heatmap — ${ex.name}`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Label: ${ex.label}; both predictions ≈ ${ex.ypred.toFixed(3)} / ${ex.ypred_adv.toFixed(3)} (essentially equivalent)`, w / 2, 40);

      function drawHeatmap(weights, label, yOffset, color) {
        const N = ex.tokens.length;
        const maxW = w - padL - padR;
        const tokensPerRow = Math.min(N, Math.floor(maxW / 60));
        const rows = Math.ceil(N / tokensPerRow);
        const cellW = maxW / tokensPerRow;
        const cellH = 28;

        ctx.fillStyle = U.text();
        ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(label, padL, yOffset);
        yOffset += 18;

        const maxA = Math.max(...weights);

        for (let i = 0; i < N; i++) {
          const r = Math.floor(i / tokensPerRow);
          const c = i % tokensPerRow;
          const x = padL + c * cellW;
          const y = yOffset + r * cellH;

          const intensity = weights[i] / maxA;
          ctx.fillStyle = color;
          ctx.globalAlpha = Math.max(0.05, intensity);
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          ctx.globalAlpha = 1;

          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

          ctx.fillStyle = intensity > 0.5 ? '#fff' : U.text();
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center';
          ctx.fillText(ex.tokens[i], x + cellW / 2, y + 8);
          ctx.fillStyle = intensity > 0.5 ? '#fff' : U.textMuted();
          ctx.font = '9px ' + U.cssVar('--font-mono', 'monospace');
          ctx.fillText(weights[i].toFixed(2), x + cellW / 2, y + 18);
        }

        return yOffset + rows * cellH + 8;
      }

      let curY = padT;

      if (viewMode === 'compare' || viewMode === 'original') {
        curY = drawHeatmap(ex.original, `Original attention  (ŷ = ${ex.ypred.toFixed(3)})`, curY, '#dc2626');
      }
      if (viewMode === 'compare' || viewMode === 'adversarial') {
        curY = drawHeatmap(ex.adversarial, `Adversarial attention  (ŷ = ${ex.ypred_adv.toFixed(3)})`, curY, '#2563eb');
      }

      if (viewMode === 'compare') {
        // JSD/TVD info at bottom
        let totalJSD = 0;
        for (let i = 0; i < ex.original.length; i++) {
          const a = ex.original[i], b = ex.adversarial[i], m = (a + b) / 2;
          if (a > 0 && m > 0) totalJSD += 0.5 * a * Math.log(a / m);
          if (b > 0 && m > 0) totalJSD += 0.5 * b * Math.log(b / m);
        }
        const tvd = 0.5 * Math.abs(ex.ypred - ex.ypred_adv);

        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText(`JSD(α, α̃) ≈ ${totalJSD.toFixed(2)} (very different)  ·  TVD(ŷ, ŷ̃) ≈ ${tvd.toFixed(4)} (essentially same)`, w / 2, curY + 16);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
