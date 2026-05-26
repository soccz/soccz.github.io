/* viz: protran-attention-pattern - attention heatmap on latent z */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-attention-pattern'] = function (canvas, controls, params) {
    let head = 0;
    U.addSlider(controls, {
      label: 'Head', min: 0, max: 3, step: 1, value: 0,
      onInput: (v) => { head = parseInt(v); draw(); },
      fmt: (v) => `head ${v+1}/4`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Attention Pattern on Latent z_t (paper Fig 2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Head ${head+1}: T×T attention matrix on z_t (SSM latent)'.replace('${head+1}', head+1), w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const T = 24;
      const size = Math.min(plotW, plotH);
      const cellSize = size / T;
      const startX = padL + (plotW - size) / 2;
      const startY = padT + (plotH - size) / 2;

      // Attention pattern depends on head
      function attn(i, j) {
        if (head === 0) {
          // Local diagonal (recent past)
          return Math.exp(-Math.abs(i - j) / 3);
        } else if (head === 1) {
          // Periodic (period 6)
          return Math.exp(-Math.pow(((i - j) % 6) - 0, 2) / 2);
        } else if (head === 2) {
          // Beginning (BOS) bias
          return Math.exp(-j / 4);
        } else {
          // Long-range smooth
          return 0.4 + 0.4 * Math.cos((i - j) * 0.3);
        }
      }

      // Normalize per row
      for (let i = 0; i < T; i++) {
        let row_sum = 0;
        for (let j = 0; j <= i; j++) row_sum += attn(i, j);
        for (let j = 0; j < T; j++) {
          let val = (j <= i) ? attn(i, j) / row_sum : 0;
          const intensity = Math.min(1, val * T / 2);
          ctx.fillStyle = `hsl(220, 70%, ${100 - intensity * 50}%)`;
          ctx.fillRect(startX + j * cellSize, startY + i * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }

      // Border
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.5;
      ctx.strokeRect(startX, startY, size, size);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('key time j', startX + size/2, startY + size + 18);
      ctx.save();
      ctx.translate(startX - 18, startY + size/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('query time i', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
