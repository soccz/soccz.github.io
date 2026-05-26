/* viz: timesnet-2d-reshape - 1D to 2D geometric reshape */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timesnet-2d-reshape'] = function (canvas, controls, params) {
    let period = 8;

    U.addSlider(controls, {
      label: 'Period P', min: 2, max: 16, step: 1, value: 8,
      onInput: (v) => { period = parseInt(v); draw(); },
      fmt: (v) => `P=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('1D → 2D Reshape (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const T = 64;
      const cycles = T / period;
      ctx.fillText(`T=${T}, P=${period}, ${cycles} cycles in 1D → ${period}×${cycles} 2D matrix`, w/2, 40);

      const padL = 30, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      // Top half: 1D representation
      const top1D_y = padT + 20;
      const top1D_h = 50;
      const cellW1D = plotW / T;
      // Highlight period-adjacent positions for one phase
      const highlightPhase = 1;  // value to highlight x_1, x_{1+P}, x_{1+2P}, ...

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('1D representation', padL, top1D_y - 6);

      for (let i = 0; i < T; i++) {
        const isPeriodAdjacent = (i % period === highlightPhase);
        const val = 0.5 + 0.4 * Math.sin(i * 2 * Math.PI / period);
        ctx.fillStyle = isPeriodAdjacent ? '#dc2626' : `hsl(220, 70%, ${50 + val * 30}%)`;
        ctx.fillRect(padL + i * cellW1D, top1D_y, cellW1D - 1, top1D_h);
      }
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1;
      ctx.strokeRect(padL, top1D_y, plotW, top1D_h);

      // Period adjacency annotation
      ctx.fillStyle = '#dc2626';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Period-P positions (far apart in 1D)', padL + plotW/2, top1D_y + top1D_h + 14);

      // Bottom: 2D representation
      const top2D_y = top1D_y + top1D_h + 35;
      const remaining_h = padT + plotH - top2D_y - padB + 60;
      const cellH2D = Math.min(remaining_h / period - 1, 16);
      const cellW2D = plotW / cycles;

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('2D reshape (period × cycles)', padL, top2D_y - 6);

      for (let row = 0; row < period; row++) {
        for (let col = 0; col < cycles; col++) {
          const i = col * period + row;
          if (i >= T) continue;
          const isPeriodAdjacent = (row === highlightPhase);
          const val = 0.5 + 0.4 * Math.sin(i * 2 * Math.PI / period);
          ctx.fillStyle = isPeriodAdjacent ? '#dc2626' : `hsl(220, 70%, ${50 + val * 30}%)`;
          ctx.fillRect(padL + col * cellW2D, top2D_y + row * cellH2D, cellW2D - 1, cellH2D - 1);
        }
      }
      ctx.strokeStyle = U.text();
      ctx.strokeRect(padL, top2D_y, plotW, period * cellH2D);

      // 2D annotation
      ctx.fillStyle = '#dc2626';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Period-P positions = adjacent rows (close in 2D)', padL + plotW/2, top2D_y + period * cellH2D + 14);

      // Row labels (phase)
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
      ctx.textAlign = 'right';
      for (let row = 0; row < period; row++) {
        ctx.fillText(`φ=${row}`, padL - 4, top2D_y + row * cellH2D + cellH2D/2 + 3);
      }
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
