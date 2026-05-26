/* viz: liu-circular-embed - embedding circular structure */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['liu-circular-embed'] = function (canvas, controls, params) {
    let step = 50;
    const maxStep = 100;

    U.addSlider(controls, {
      label: 'Training step (×50K)', min: 0, max: maxStep, step: 1, value: 50,
      onInput: (v) => { step = parseInt(v); draw(); },
      fmt: (v) => `${v * 50}K`
    });

    const p = 23;
    let seedState;
    function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }

    function getEmbeddings(step) {
      // Interpolate between random (early) and circular (late)
      const t = Math.min(1, step / 70);  // grok starts ~70 step
      seedState = 42;
      const embeds = [];
      for (let i = 0; i < p; i++) {
        // Circular: angle = 2π i / p
        const angle = 2 * Math.PI * i / p;
        const circleX = Math.cos(angle);
        const circleY = Math.sin(angle);
        // Random
        const randX = (rand() - 0.5) * 2;
        const randY = (rand() - 0.5) * 2;
        // Linear interpolation
        embeds.push({
          x: t * circleX + (1 - t) * randX,
          y: t * circleY + (1 - t) * randY,
          label: i
        });
      }
      return embeds;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Embedding Circular Structure (paper §5)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const phase = step < 30 ? 'random (no structure)' :
                    step < 70 ? 'forming structure' : 'circular structure ✓ (grokked)';
      ctx.fillText(`Step ${step * 50}K: ${phase}`, w/2, 40);

      const padL = 60, padR = 60, padT = 60, padB = 60;
      const cx = padL + (w - padL - padR) / 2;
      const cy = padT + (h - padT - padB) / 2;
      const r = Math.min((w - padL - padR) / 2, (h - padT - padB) / 2) * 0.85;

      // Reference circle (target)
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2*Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Embeddings
      const embeds = getEmbeddings(step);
      // Connect lines (showing arithmetic structure)
      if (step >= 70) {
        ctx.strokeStyle = '#16a34a';
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        embeds.forEach((e, i) => {
          if (i === 0) ctx.moveTo(cx + r * e.x, cy + r * e.y);
          else ctx.lineTo(cx + r * e.x, cy + r * e.y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Points
      embeds.forEach(e => {
        const px = cx + r * e.x;
        const py = cy + r * e.y;
        ctx.fillStyle = `hsl(${e.label * 360 / p}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(e.label.toString(), px, py + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`p=${p} embeddings in 2D (PCA)`, cx, h - 25);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
