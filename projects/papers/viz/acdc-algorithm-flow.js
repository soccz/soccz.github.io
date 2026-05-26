/* viz: acdc-algorithm-flow - ACDC step-by-step visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['acdc-algorithm-flow'] = function (canvas, controls, params) {
    let step = 0;
    const totalSteps = 6;
    const stepDescs = [
      'Step 0: Build full computational graph G (all edges)',
      'Step 1: Start from output, reverse topological order',
      'Step 2: For each edge e — compute KL(clean || ablate(e))',
      'Step 3: If KL < τ — edge unnecessary, remove',
      'Step 4: If KL ≥ τ — edge necessary, keep',
      'Step 5: Final circuit C* = kept edges only',
    ];

    U.addSlider(controls, {
      label: 'Step', min: 0, max: totalSteps-1, step: 1, value: 0,
      onInput: (v) => { step = parseInt(v); draw(); },
      fmt: (v) => `Step ${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('ACDC Algorithm Flow', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(stepDescs[step], w/2, 40);

      // Simple graph layout
      const nodes = [
        { x: 100, y: 100, label: 'Input' },
        { x: 200, y: 80,  label: 'H1' },
        { x: 200, y: 120, label: 'H2' },
        { x: 200, y: 160, label: 'MLP1' },
        { x: 300, y: 80,  label: 'H3' },
        { x: 300, y: 120, label: 'H4' },
        { x: 300, y: 160, label: 'MLP2' },
        { x: 400, y: 100, label: 'H5' },
        { x: 400, y: 140, label: 'MLP3' },
        { x: 500, y: 120, label: 'Output' },
      ];

      // Edges (with importance based on step)
      const edges = [
        { from: 0, to: 1, kept: true },
        { from: 0, to: 2, kept: true },
        { from: 0, to: 3, kept: false },
        { from: 1, to: 4, kept: true },
        { from: 1, to: 5, kept: false },
        { from: 2, to: 4, kept: false },
        { from: 2, to: 5, kept: true },
        { from: 3, to: 6, kept: false },
        { from: 4, to: 7, kept: true },
        { from: 5, to: 7, kept: true },
        { from: 5, to: 8, kept: false },
        { from: 6, to: 8, kept: false },
        { from: 7, to: 9, kept: true },
        { from: 8, to: 9, kept: false },
      ];

      // Adjust position based on step
      const padTop = 80;
      const padH = h - padTop - 60;
      nodes.forEach((n, i) => {
        n.x = 80 + (n.x - 100) * (w - 160) / 400;
        n.y = padTop + (n.y - 80) * padH / 100;
      });

      // Draw edges
      edges.forEach((e, i) => {
        const from = nodes[e.from];
        const to = nodes[e.to];
        let show = true;
        let color = U.textMuted();
        let width = 1;

        if (step >= 5) {
          // Final circuit
          if (!e.kept) show = false;
          color = '#16a34a';
          width = 2;
        } else if (step >= 3) {
          if (!e.kept) { color = '#dc2626'; width = 0.5; }
          else { color = '#16a34a'; width = 1.5; }
        }

        if (!show) return;

        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(from.x + 18, from.y);
        ctx.lineTo(to.x - 18, to.y);
        ctx.stroke();

        // Arrow
        if (width > 1) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(to.x - 18, to.y);
          ctx.lineTo(to.x - 24, to.y - 4);
          ctx.lineTo(to.x - 24, to.y + 4);
          ctx.closePath();
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        ctx.fillStyle = (i === 0 || i === 9) ? '#0891b2' : '#9333ea';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 18, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '600 9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);
      });

      // Stats
      const keptCount = edges.filter(e => e.kept).length;
      const totalCount = edges.length;
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const stats = step >= 5
        ? `Final circuit: ${keptCount}/${totalCount} edges (${(100*keptCount/totalCount).toFixed(0)}% pruned to ${(100*keptCount/totalCount).toFixed(0)}%)`
        : step >= 3
        ? `Pruning in progress — ${keptCount} keep, ${totalCount-keptCount} remove`
        : `Full graph: ${totalCount} edges to test`;
      ctx.fillText(stats, w/2, h - 25);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
