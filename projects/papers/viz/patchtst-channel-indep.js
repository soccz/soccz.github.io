/* viz: patchtst-channel-indep - channel-independent vs channel-mixing */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['patchtst-channel-indep'] = function (canvas, controls, params) {
    let mode = 'ci';
    U.addSelect(controls, {
      label: 'Strategy',
      options: [
        { value: 'ci',  label: 'Channel-Independent (★ PatchTST)' },
        { value: 'cm',  label: 'Channel-Mixing (cross-attention)' }
      ],
      value: 'ci',
      onChange: (v) => { mode = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Channel-Independent vs Channel-Mixing (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(mode === 'ci' ? 'PatchTST: each variate processed independently' : 'Alternative: cross-variate attention', w/2, 40);

      const padL = 50, padR = 40, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      const numVariates = 4;
      const variateNames = ['Stock A', 'Stock B', 'Stock C', 'Stock D'];
      const variateColors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04'];

      const subH = plotH / numVariates * 0.85;
      const gap = plotH / numVariates * 0.15;

      const transformerX = padL + plotW * 0.7;
      const transformerW = plotW * 0.2;

      for (let v = 0; v < numVariates; v++) {
        const y = padT + v * (subH + gap);
        // Variate input box (small TS)
        ctx.fillStyle = variateColors[v];
        ctx.globalAlpha = 0.7;
        ctx.fillRect(padL, y, plotW * 0.3, subH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1;
        ctx.strokeRect(padL, y, plotW * 0.3, subH);
        ctx.fillStyle = '#fff';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(variateNames[v] + ' patches', padL + plotW * 0.15, y + subH/2);

        // Transformer
        if (mode === 'ci') {
          // Independent transformer per variate
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(transformerX, y, transformerW, subH);
          ctx.strokeStyle = U.text();
          ctx.strokeRect(transformerX, y, transformerW, subH);
          ctx.fillStyle = U.text();
          ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.fillText('Transformer', transformerX + transformerW/2, y + subH/2);
          // Arrow
          ctx.strokeStyle = variateColors[v];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(padL + plotW * 0.3, y + subH/2);
          ctx.lineTo(transformerX, y + subH/2);
          ctx.stroke();
        }
      }

      // For channel-mixing: single shared transformer with cross-attention
      if (mode === 'cm') {
        const cmTopY = padT + 20;
        const cmBotY = padT + plotH - 30;
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(transformerX, cmTopY, transformerW, cmBotY - cmTopY);
        ctx.strokeStyle = U.text();
        ctx.strokeRect(transformerX, cmTopY, transformerW, cmBotY - cmTopY);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('Shared Transformer', transformerX + transformerW/2, padT + plotH/2 - 8);
        ctx.fillText('+ cross-attention', transformerX + transformerW/2, padT + plotH/2 + 8);

        for (let v = 0; v < numVariates; v++) {
          const y = padT + v * (subH + gap) + subH/2;
          ctx.strokeStyle = variateColors[v];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(padL + plotW * 0.3, y);
          ctx.lineTo(transformerX, y);
          ctx.stroke();
        }
      }

      // Caption
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(mode === 'ci'
        ? 'Pros: simpler, less overfit. Cons: no cross-variate info.'
        : 'Pros: cross-variate info. Cons: more parameters, harder training.',
        padL + plotW/2, padT + plotH + 18);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
