/* viz: pat-fig4-patch-length
 * PatchTST Figure 4 — MSE vs patch length P ∈ {2, 4, 8, 12, 16, 24, 32, 40}
 * Look-back L=336, prediction T=96. Paper Figure 4 shows 3 datasets only.
 * Values are approximations from Figure 4 plots (paper does not provide exact numbers).
 */

(function () {
  const U = window.VIZ_UTIL;

  // Paper Figure 4 visual estimates — narrow y-axes prove robustness
  const DATA = {
    'Weather':     [0.156, 0.155, 0.151, 0.150, 0.150, 0.150, 0.151, 0.152],
    'Electricity': [0.135, 0.134, 0.130, 0.133, 0.131, 0.133, 0.131, 0.133],
    'Traffic':     [0.470, 0.405, 0.385, 0.380, 0.380, 0.400, 0.385, 0.385]
  };
  const P_VALUES = [2, 4, 8, 12, 16, 24, 32, 40];
  const COLORS = {
    'Weather':'#06b6d4', 'Traffic':'#ef4444', 'Electricity':'#a78bfa'
  };

  VIZ_REGISTRY['pat-fig4-patch-length'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Traffic';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(DATA).forEach(d => {
      const btn = document.createElement('button');
      btn.textContent = d;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (d === dataset) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        dataset = d; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 28, padT = 38, padB = 70;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const vals = DATA[dataset];
      const yMin = Math.min(...vals) * 0.97;
      const yMax = Math.max(...vals) * 1.03;
      const xToPix = (i) => padL + (i / (P_VALUES.length - 1)) * innerW;
      const yToPix = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(yv)); ctx.lineTo(w-padR, yToPix(yv));
        ctx.globalAlpha = 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(yv.toFixed(3), padL - 8, yToPix(yv));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      P_VALUES.forEach((p, i) => ctx.fillText('P=' + p, xToPix(i), h - padB + 6));

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Fig 4 — Patch length sensitivity · ${dataset} · L=336, T=96`, w/2, padT - 24);

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE', 0, 0);
      ctx.restore();

      ctx.strokeStyle = COLORS[dataset];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      vals.forEach((v, i) => {
        const x = xToPix(i), y = yToPix(v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      vals.forEach((v, i) => {
        ctx.fillStyle = COLORS[dataset];
        ctx.beginPath();
        ctx.arc(xToPix(i), yToPix(v), 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(v.toFixed(3), xToPix(i), yToPix(v) - 8);
      });

      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h-padB); ctx.lineTo(w-padR, h-padB);
      ctx.stroke();

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('Narrow y-axis range — MSE robust to patch length choice', w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
