/* viz: patchtst-patching - TS to patches transformation */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['patchtst-patching'] = function (canvas, controls, params) {
    let patchLen = 16;
    U.addSlider(controls, {
      label: 'Patch length P', min: 4, max: 32, step: 4, value: 16,
      onInput: (v) => { patchLen = parseInt(v); draw(); },
      fmt: (v) => `P=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Patching Transformation (paper §3.1)', w/2, 22);

      const T = 96;
      const numPatches = Math.floor(T / patchLen);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`T=${T}, P=${patchLen} → ${numPatches} patches (each becomes 1 token)`, w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const halfH = plotH / 2 - 20;

      // Top: continuous TS
      const series = [];
      for (let i = 0; i < T; i++) {
        series.push(0.5 + 0.3 * Math.sin(i * 0.3) + 0.1 * Math.cos(i * 1.1));
      }

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('1. Raw TS (T = 96)', padL, padT + 10);

      const cellW = plotW / T;
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.5;
      ctx.strokeRect(padL, padT + 25, plotW, halfH);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      series.forEach((v, i) => {
        const px = padL + cellW * i;
        const py = padT + 25 + halfH * (1 - (v - 0.1) / 0.8);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Bottom: patches as tokens
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillText(`2. Patches (P = ${patchLen}) → tokens`, padL, padT + halfH + 60);

      // Draw patch boundaries on top
      for (let i = 0; i <= numPatches; i++) {
        const px = padL + cellW * i * patchLen;
        ctx.strokeStyle = '#dc2626';
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, padT + 25); ctx.lineTo(px, padT + 25 + halfH);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw token boxes at bottom
      const tokenY = padT + halfH + 80;
      const tokenH = 40;
      const tokenW = plotW / numPatches * 0.85;
      const gap = plotW / numPatches * 0.15;

      for (let i = 0; i < numPatches; i++) {
        const x = padL + i * (plotW / numPatches) + gap/2;
        ctx.fillStyle = `hsl(${i * 360 / numPatches}, 70%, 55%)`;
        ctx.fillRect(x, tokenY, tokenW, tokenH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1;
        ctx.strokeRect(x, tokenY, tokenW, tokenH);
        ctx.fillStyle = '#fff';
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`token ${i+1}`, x + tokenW/2, tokenY + tokenH/2);
      }

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`→ ${numPatches} tokens fed to Transformer (vs T=${T} for non-patching)`,
                   padL + plotW/2, tokenY + tokenH + 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
