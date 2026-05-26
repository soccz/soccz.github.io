/* viz: protran-layer-hierarchy - L-layer hierarchical SSM */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-layer-hierarchy'] = function (canvas, controls, params) {
    let L = 3;
    U.addSlider(controls, {
      label: 'Layers L', min: 1, max: 6, step: 1, value: 3,
      onInput: (v) => { L = parseInt(v); draw(); },
      fmt: (v) => `L=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Multi-Layer Hierarchical SSM (paper §3.3)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`L=${L} layers · 각 layer 마다 SSM transition + Transformer attention`, w/2, 40);

      const padL = 50, padT = 70;
      const T_steps = 5;
      const layerH = (h - padT - 80) / L;
      const colW = (w - padL * 2) / T_steps;

      // Layers (bottom = layer 1, top = layer L)
      for (let l = 0; l < L; l++) {
        const yLayer = padT + (L - 1 - l) * layerH;
        const hue = 200 + l * 30;
        // SSM nodes per time
        for (let t = 0; t < T_steps; t++) {
          const x = padL + t * colW + colW/2;
          // Node
          ctx.fillStyle = `hsl(${hue}, 60%, 55%)`;
          ctx.beginPath();
          ctx.arc(x, yLayer + layerH/2, 18, 0, 2*Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(`z^${l+1}_${t+1}`, x, yLayer + layerH/2);
          // Horizontal arrow (SSM transition)
          if (t < T_steps - 1) {
            ctx.strokeStyle = `hsl(${hue}, 70%, 35%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 18, yLayer + layerH/2);
            ctx.lineTo(x + colW - 18, yLayer + layerH/2);
            ctx.stroke();
            // Arrowhead
            const tipX = x + colW - 18;
            ctx.beginPath();
            ctx.moveTo(tipX, yLayer + layerH/2);
            ctx.lineTo(tipX - 6, yLayer + layerH/2 - 3);
            ctx.lineTo(tipX - 6, yLayer + layerH/2 + 3);
            ctx.closePath();
            ctx.fillStyle = `hsl(${hue}, 70%, 35%)`;
            ctx.fill();
          }
          // Vertical arrow (upward to next layer)
          if (l < L - 1) {
            const yNext = padT + (L - 1 - (l + 1)) * layerH + layerH/2;
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 2]);
            ctx.beginPath();
            ctx.moveTo(x, yLayer + layerH/2 - 18);
            ctx.lineTo(x, yNext + 18);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // Layer label
        ctx.fillStyle = `hsl(${hue}, 70%, 35%)`;
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText(`Layer ${l+1}`, padL - 40, yLayer + layerH/2);
      }

      // Observation at the bottom
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time →', padL + (T_steps * colW) / 2, h - 20);

      // Vertical "upward abstraction" arrow on the right
      ctx.fillStyle = U.textMuted();
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.save();
      ctx.translate(w - 18, padT + (h - padT - 80)/2);
      ctx.rotate(-Math.PI/2);
      ctx.textAlign = 'center';
      ctx.fillText('↑ abstraction (concrete → abstract)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
