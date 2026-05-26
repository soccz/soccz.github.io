/* viz: gt-causal-tracing
 * Causal Tracing heatmap (paper Figure 4 - Causal Tracing).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['gt-causal-tracing'] = function (canvas, controls, params) {
    const layers = 8;
    const positions = 8;

    // Synthetic causal effect: clustered at L4-L7 mid-positions
    const data = [];
    for (let l = 0; l < layers; l++) {
      const row = [];
      for (let p = 0; p < positions; p++) {
        let effect = 0;
        // L4-L7, pos 3-6 hot spot
        if (l >= 3 && l <= 6 && p >= 2 && p <= 5) {
          effect = 0.4 + 0.5 * Math.exp(-Math.pow(l - 5, 2) / 4 - Math.pow(p - 4, 2) / 3);
        } else {
          effect = 0.05 + 0.1 * Math.random();
        }
        row.push(Math.min(1, effect));
      }
      data.push(row);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Causal Tracing — Layer × Position Heatmap', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Clean activation patched into corrupt run → measure logit restoration', w / 2, 40);

      const padL = 80, padR = 80, padT = 60, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const cellW = innerW / positions;
      const cellH = innerH / layers;

      // Heatmap cells
      for (let l = 0; l < layers; l++) {
        for (let p = 0; p < positions; p++) {
          const v = data[l][p];
          const x = padL + p * cellW;
          const y = padT + l * cellH;
          // Red gradient
          const r = Math.round(255 - 50 * v);
          const g = Math.round(255 - 200 * v);
          const b = Math.round(255 - 200 * v);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, cellW, cellH);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cellW, cellH);
          // Value
          if (v > 0.3) {
            ctx.fillStyle = v > 0.6 ? '#fff' : U.text();
            ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(v.toFixed(2), x + cellW / 2, y + cellH / 2);
          }
        }
      }

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let p = 0; p < positions; p++) {
        ctx.fillText(`p${p+1}`, padL + p * cellW + cellW / 2, padT + innerH + 6);
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let l = 0; l < layers; l++) {
        ctx.fillText(`L${l+1}`, padL - 6, padT + l * cellH + cellH / 2);
      }

      // Hot region annotation
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.strokeRect(padL + 2 * cellW, padT + 3 * cellH, 4 * cellW, 4 * cellH);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('★ Generalization circuit', padL + innerW + 10, padT + 5 * cellH);

      // Colorbar (right)
      const cbX = padL + innerW + 10;
      const cbY = padT;
      const cbH = innerH * 0.6;
      const cbW = 14;
      for (let i = 0; i < cbH; i++) {
        const v = 1 - i / cbH;
        const r = Math.round(255 - 50 * v);
        const g = Math.round(255 - 200 * v);
        const b = Math.round(255 - 200 * v);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(cbX, cbY + i, cbW, 1);
      }
      ctx.strokeStyle = U.textMuted();
      ctx.strokeRect(cbX, cbY, cbW, cbH);
      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('1.0', cbX + cbW + 4, cbY);
      ctx.fillText('0.0', cbX + cbW + 4, cbY + cbH);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
