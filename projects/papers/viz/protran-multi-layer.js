/* viz: protran-multi-layer - hierarchical multi-layer architecture */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-multi-layer'] = function (canvas, controls, params) {
    let numLayers = 4;
    U.addSlider(controls, {
      label: 'Layers L', min: 1, max: 6, step: 1, value: 4,
      onInput: (v) => { numLayers = parseInt(v); draw(); },
      fmt: (v) => `L=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Multi-Layer Hierarchical SSM (paper §3.2 Eq 12-20)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${numLayers} layers of SSM + Transformer encoders`, w/2, 40);

      const padL = 50, padR = 50, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const layerH = (plotH - 60) / numLayers;
      const xCenter = padL + plotW / 2;

      // Bottom: input observation
      const obsY = padT + plotH - 30;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(xCenter - 100, obsY, 200, 30);
      ctx.strokeStyle = U.text();
      ctx.strokeRect(xCenter - 100, obsY, 200, 30);
      ctx.fillStyle = '#fff';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Observation x_t', xCenter, obsY + 15);

      // Layers (from bottom to top)
      for (let l = 0; l < numLayers; l++) {
        const y = obsY - (l + 1) * layerH - 20;
        ctx.fillStyle = `hsl(${200 + l * 30}, 60%, 50%)`;
        ctx.fillRect(xCenter - 130, y, 260, layerH - 20);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1;
        ctx.strokeRect(xCenter - 130, y, 260, layerH - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`Layer ${l + 1}: z^(${l+1})_t`, xCenter, y + (layerH - 20)/2 - 6);
        ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText('SSM + Transformer encoder', xCenter, y + (layerH - 20)/2 + 8);

        // Arrow to next layer
        if (l > 0) {
          ctx.strokeStyle = U.text();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xCenter, y + (layerH - 20));
          ctx.lineTo(xCenter, y + (layerH));
          ctx.stroke();
        }
      }

      // Arrow from observation to layer 1
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xCenter, obsY);
      ctx.lineTo(xCenter, obsY - layerH + 20);
      ctx.stroke();

      // Top arrow: output
      ctx.fillStyle = '#dc2626';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ p(x_{t+1:T} | x_{1:t})', xCenter, padT + 16);
      const topY = obsY - numLayers * layerH - 20;
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xCenter, topY);
      ctx.lineTo(xCenter, padT + 25);
      ctx.stroke();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
