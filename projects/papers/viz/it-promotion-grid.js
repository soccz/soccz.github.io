/* viz: it-promotion-grid
 * Promotion grid across 5 Transformer variants × 3 datasets (paper Table 2).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-promotion-grid'] = function (canvas, controls, params) {
    const variants = ['Transformer', 'Reformer', 'Informer', 'Flowformer', 'Flashformer'];
    const datasets = ['ECL', 'Traffic', 'Weather'];
    // MSE data: [variant][dataset]: {orig, inv, promo%}
    const data = {
      'Transformer': { ECL: [0.277, 0.178, 35.6], Traffic: [0.665, 0.428, 35.6], Weather: [0.657, 0.258, 60.2] },
      'Reformer':    { ECL: [0.338, 0.208, 38.4], Traffic: [0.741, 0.647, 12.7], Weather: [0.803, 0.248, 69.2] },
      'Informer':    { ECL: [0.311, 0.216, 30.5], Traffic: [0.764, 0.662, 13.3], Weather: [0.634, 0.271, 57.3] },
      'Flowformer':  { ECL: [0.267, 0.210, 21.3], Traffic: [0.750, 0.524, 30.1], Weather: [0.286, 0.266, 7.2] },
      'Flashformer': { ECL: [0.285, 0.206, 27.8], Traffic: [0.658, 0.492, 25.2], Weather: [0.659, 0.262, 60.2] },
    };

    let viewMode = 'promotion'; // promotion, original, inverted

    U.addSelect(controls, {
      label: 'View',
      options: [
        { value: 'promotion', label: 'Promotion % (MSE reduction)' },
        { value: 'original', label: 'Original MSE' },
        { value: 'inverted', label: 'Inverted MSE' },
      ],
      value: 'promotion',
      onChange: (v) => { viewMode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Promotion Grid (paper Table 2) — 5 Variants × 3 Datasets', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const subtitle = viewMode === 'promotion'
        ? '★ All 15 (variant × dataset) cells show promotion. Largest: Reformer + Weather = -69.2%'
        : `MSE values (lower = better)`;
      ctx.fillText(subtitle, w / 2, 40);

      const padL = 130, padR = 30, padT = 70, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const cellW = innerW / datasets.length;
      const cellH = innerH / variants.length;

      // Dataset headers (top)
      ctx.fillStyle = U.text();
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      datasets.forEach((d, di) => {
        ctx.fillText(d, padL + cellW * di + cellW / 2, padT - 10);
      });

      // Variant rows (left)
      variants.forEach((v, vi) => {
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillStyle = U.text();
        ctx.fillText(v, padL - 6, padT + cellH * vi + cellH / 2);
      });

      // Cells
      variants.forEach((v, vi) => {
        datasets.forEach((d, di) => {
          const cell = data[v][d];
          const x = padL + di * cellW;
          const y = padT + vi * cellH;

          let val, label, colorVal;
          if (viewMode === 'promotion') {
            val = cell[2];
            label = `-${val.toFixed(1)}%`;
            colorVal = val / 70; // normalize to 0-1
          } else if (viewMode === 'original') {
            val = cell[0];
            label = val.toFixed(3);
            colorVal = (val - 0.1) / 0.9;
          } else {
            val = cell[1];
            label = val.toFixed(3);
            colorVal = (val - 0.1) / 0.9;
          }

          colorVal = Math.max(0, Math.min(1, colorVal));

          if (viewMode === 'promotion') {
            // Green gradient (more promotion = darker green)
            const g = Math.round(80 + 130 * (1 - colorVal));
            ctx.fillStyle = `rgb(${g}, ${Math.round(180 + 50 * colorVal)}, ${g})`;
          } else {
            // Red gradient (higher MSE = darker red)
            const r = Math.round(255 - 50 * colorVal);
            const g = Math.round(200 - 150 * colorVal);
            const b = Math.round(200 - 150 * colorVal);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          }
          ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);

          ctx.fillStyle = '#fff';
          ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(label, x + cellW / 2, y + cellH / 2 - 6);

          // Sub-info: original → inverted
          if (viewMode === 'promotion') {
            ctx.fillStyle = U.textMuted();
            ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.fillText(`${cell[0].toFixed(3)} → ${cell[1].toFixed(3)}`, x + cellW / 2, y + cellH / 2 + 10);
          }
        });
      });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
