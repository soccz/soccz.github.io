/* viz: tappa-qsim-rope-plane - Q-sim × RoPE 2D plane */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['tappa-qsim-rope-plane'] = function (canvas, controls, params) {
    let model = 'LLaMA-2-7B';
    const models = {
      'LLaMA-2-7B': { heads: 1024, distribution: { diagonal: 0.31, stripe: 0.24, block: 0.22, spike: 0.16, edge: 0.07 } },
      'LLaMA-3-8B': { heads: 1024, distribution: { diagonal: 0.35, stripe: 0.22, block: 0.20, spike: 0.15, edge: 0.08 } },
      'Mistral-7B': { heads: 1024, distribution: { diagonal: 0.30, stripe: 0.25, block: 0.21, spike: 0.17, edge: 0.07 } },
      'PatchTST': { heads: 12, distribution: { diagonal: 0.25, stripe: 0.35, block: 0.20, spike: 0.15, edge: 0.05 } },
      'iTransformer': { heads: 16, distribution: { diagonal: 0.20, stripe: 0.30, block: 0.35, spike: 0.10, edge: 0.05 } },
    };

    U.addSelect(controls, {
      label: 'Model',
      options: Object.keys(models).map(m => ({ value: m, label: m })),
      value: 'LLaMA-2-7B',
      onChange: (v) => { model = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Q-sim × RoPE Plane — ${model}`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Total heads: ${models[model].heads} — scatter points represent each (layer, head)`, w/2, 40);

      const padL = 80, padR = 40, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const dist = models[model].distribution;
      const total = models[model].heads;
      const regions = [
        { pattern: 'diagonal', qLo: 0.6, qHi: 1.0, fLo: 0.5, fHi: 1.0, color: '#dc2626' },
        { pattern: 'block',    qLo: 0.4, qHi: 0.8, fLo: 0.1, fHi: 0.5, color: '#9333ea' },
        { pattern: 'stripe',   qLo: 0.0, qHi: 0.4, fLo: 0.0, fHi: 0.3, color: '#ea580c' },
        { pattern: 'spike',    qLo: 0.0, qHi: 0.3, fLo: 0.6, fHi: 1.0, color: '#16a34a' },
        { pattern: 'edge',     qLo: 0.2, qHi: 0.5, fLo: 0.3, fHi: 0.7, color: '#0891b2' },
      ];

      let seed = 7;
      function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

      regions.forEach(r => {
        const count = Math.round(total * dist[r.pattern]);
        for (let i = 0; i < count; i++) {
          const q = r.qLo + (r.qHi - r.qLo) * rand();
          const f = r.fLo + (r.fHi - r.fLo) * rand();
          const px = padL + plotW * f;
          const py = padT + plotH * (1 - q);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, 2*Math.PI);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('RoPE frequency (low → high)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(20, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Q-similarity', 0, 0);
      ctx.restore();

      // Legend
      let lx = padL + 10, ly = h - 12;
      regions.forEach((r, i) => {
        ctx.fillStyle = r.color;
        ctx.fillRect(lx, ly - 4, 10, 8);
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(`${r.pattern} ${(dist[r.pattern]*100).toFixed(0)}%`, lx + 14, ly);
        lx += 130;
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
