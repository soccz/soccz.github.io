/* viz: anie-adversarial-search
 * Adversarial attention optimization trajectory.
 * Shows JSD increasing as α̃ diverges, while TVD stays bounded.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-adversarial-search'] = function (canvas, controls, params) {
    const N_ITER = 500;
    const eps = 0.10;

    // Simulate trajectory
    const trajectory = [];
    for (let i = 0; i <= N_ITER; i++) {
      const t = i / N_ITER;
      // JSD grows then plateaus
      const jsd = 0.45 * (1 - Math.exp(-3 * t));
      // TVD grows but is bounded by penalty
      const tvd_raw = 0.15 * t * (1 + 0.3 * Math.sin(20 * t));
      const tvd = Math.min(tvd_raw, eps * 0.95 + 0.005 * Math.sin(10 * t));
      trajectory.push({ iter: i, jsd, tvd });
    }

    let curIter = N_ITER;

    U.addSlider(controls, {
      label: 'Iteration', min: 0, max: N_ITER, step: 10, value: N_ITER,
      onInput: (v) => { curIter = parseInt(v); draw(); },
      fmt: (v) => `iter ${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const cur = trajectory[curIter];
      ctx.fillText(`Adversarial Search — iter ${curIter}/${N_ITER}: JSD=${cur.jsd.toFixed(3)}, TVD=${cur.tvd.toFixed(3)}`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Goal: maximize JSD(α, α̃) subject to TVD(ŷ, ŷ̃) ≤ ε = ${eps.toFixed(2)}`, w / 2, 40);

      const yMax = 0.5;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xToPix = (it) => padL + innerW * (it / N_ITER);
      const yToPix = (v) => padT + innerH * (1 - v / yMax);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax * (1 - i / 5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 5);
      }
      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 5; i++) {
        const it = Math.round(N_ITER * i / 5);
        ctx.fillText(String(it), padL + innerW * i / 5, padT + innerH + 6);
      }

      // Constraint line for TVD
      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(eps)); ctx.lineTo(padL + innerW, yToPix(eps));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#dc2626';
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillText(`TVD constraint ε = ${eps}`, padL + 6, yToPix(eps) - 2);

      // JSD curve (full trajectory)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= N_ITER; i++) {
        const px = xToPix(i), py = yToPix(trajectory[i].jsd);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // TVD curve (full trajectory)
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= N_ITER; i++) {
        const px = xToPix(i), py = yToPix(trajectory[i].tvd);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current iter marker
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(xToPix(curIter), padT); ctx.lineTo(xToPix(curIter), padT + innerH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#2563eb';
      ctx.beginPath(); ctx.arc(xToPix(curIter), yToPix(cur.jsd), 5, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(xToPix(curIter), yToPix(cur.tvd), 5, 0, 2 * Math.PI); ctx.fill();

      // Legend
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(padL + 12, padT + 14 - 4, 14, 4);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('JSD(α, α̃) — diverge (max)', padL + 32, padT + 14);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 200, padT + 14 - 4, 14, 4);
      ctx.fillStyle = U.text();
      ctx.fillText('TVD(ŷ, ŷ̃) — bounded (min)', padL + 220, padT + 14);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Iteration', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('JSD / TVD', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
