/* viz: it-token-inversion
 * paper Figure 2 — Vanilla vs iTransformer token view comparison.
 * Visualizes how same input X is interpreted differently.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-token-inversion'] = function (canvas, controls, params) {
    let viewMode = 'compare'; // compare, vanilla, itransformer

    U.addSelect(controls, {
      label: 'View',
      options: [
        { value: 'compare', label: 'Side-by-side' },
        { value: 'vanilla', label: 'Vanilla only' },
        { value: 'itransformer', label: 'iTransformer only' },
      ],
      value: 'compare',
      onChange: (v) => { viewMode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Token Interpretation: Vanilla vs iTransformer (paper Figure 2)', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Same input X ∈ R^{T×N}, different axis treated as token unit', w / 2, 40);

      const T = 8;  // time steps
      const N = 6;  // variates

      // Generate synthetic data
      const data = [];
      for (let t = 0; t < T; t++) {
        const row = [];
        for (let n = 0; n < N; n++) {
          row.push(0.3 + 0.5 * Math.sin(t * 0.5 + n * 0.7) + 0.1 * Math.cos(t * 0.3));
        }
        data.push(row);
      }

      function drawMatrix(x0, y0, cellW, cellH, highlightMode) {
        // Draw heatmap-like grid
        for (let t = 0; t < T; t++) {
          for (let n = 0; n < N; n++) {
            const x = x0 + t * cellW;
            const y = y0 + n * cellH;
            const v = data[t][n];
            ctx.fillStyle = `rgba(37, 99, 235, ${v * 0.6 + 0.1})`;
            ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
            ctx.strokeStyle = U.textMuted();
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
          }
        }

        // Highlight tokens
        if (highlightMode === 'vanilla') {
          // Vanilla: each column is a token (time step)
          for (let t = 0; t < T; t++) {
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(x0 + t * cellW + 1, y0 + 1, cellW - 2, N * cellH - 2);
          }
        } else if (highlightMode === 'itransformer') {
          // iTransformer: each row is a token (variate)
          for (let n = 0; n < N; n++) {
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(x0 + 1, y0 + n * cellH + 1, T * cellW - 2, cellH - 2);
          }
        }

        // Axis labels
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('Time →', x0 + (T * cellW) / 2, y0 + N * cellH + 6);
        ctx.save();
        ctx.translate(x0 - 12, y0 + (N * cellH) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Variates ↑', 0, 0);
        ctx.restore();
      }

      if (viewMode === 'compare') {
        // Left panel: Vanilla
        const x0L = 80;
        const y0 = 80;
        const cellW = 24, cellH = 22;
        drawMatrix(x0L, y0, cellW, cellH, 'vanilla');

        ctx.fillStyle = '#dc2626';
        ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('Vanilla Transformer', x0L + (T * cellW) / 2, y0 - 18);
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.fillText('Token = column (T time tokens)', x0L + (T * cellW) / 2, y0 - 4);
        ctx.fillText('→ Attention over T temporal tokens', x0L + (T * cellW) / 2, y0 + N * cellH + 24);
        ctx.fillStyle = '#dc2626';
        ctx.fillText('Multiple variates mixed per token', x0L + (T * cellW) / 2, y0 + N * cellH + 40);

        // Right panel: iTransformer
        const x0R = w - 80 - T * cellW;
        drawMatrix(x0R, y0, cellW, cellH, 'itransformer');

        ctx.fillStyle = '#16a34a';
        ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('iTransformer', x0R + (T * cellW) / 2, y0 - 18);
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.fillText('Token = row (N variate tokens)', x0R + (T * cellW) / 2, y0 - 4);
        ctx.fillText('→ Attention over N variate tokens', x0R + (T * cellW) / 2, y0 + N * cellH + 24);
        ctx.fillStyle = '#16a34a';
        ctx.fillText('Each variate has its own token', x0R + (T * cellW) / 2, y0 + N * cellH + 40);

        // Center: arrow
        ctx.fillStyle = U.text();
        ctx.font = '600 16px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('↔', w / 2, y0 + (N * cellH) / 2);
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.fillText('Same X, different axis', w / 2, y0 + (N * cellH) / 2 + 18);

      } else {
        const cellW = 36, cellH = 32;
        const x0 = (w - T * cellW) / 2;
        const y0 = 80;
        drawMatrix(x0, y0, cellW, cellH, viewMode);

        ctx.fillStyle = viewMode === 'vanilla' ? '#dc2626' : '#16a34a';
        ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText(viewMode === 'vanilla' ? 'Vanilla Transformer — Token = column (time step)' : 'iTransformer — Token = row (variate series)',
                     w / 2, y0 - 14);

        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        const msg = viewMode === 'vanilla'
          ? 'Each column → embed → token_t. Multiple physical variates (temperature, pressure, ...) fuse into one D-dim vector.'
          : 'Each row → embed → token_n. Full T-length series of one variate becomes a D-dim token. Variate-centric.';
        ctx.fillText(msg, w / 2, y0 + N * cellH + 26);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
