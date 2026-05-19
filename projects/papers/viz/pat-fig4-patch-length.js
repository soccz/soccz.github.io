/* viz: pat-fig4-patch-length
 * PatchTST Figure 4 — MSE vs patch length P ∈ {2, 4, 8, 12, 16, 24, 32, 40}
 * Look-back L=336, prediction T=96. Values are read approximately from Figure 4 plots.
 */

(function () {
  const U = window.VIZ_UTIL;

  // Figure 4 shows roughly flat curves across 8 datasets — small variation
  // Values approximate from paper plot (P=4..40 mostly stable, P=2 slightly higher for some)
  const DATA = {
    'ETTh1': [0.385, 0.382, 0.378, 0.375, 0.375, 0.377, 0.380, 0.382],
    'ETTh2': [0.290, 0.282, 0.276, 0.274, 0.274, 0.276, 0.280, 0.283],
    'ETTm1': [0.305, 0.298, 0.293, 0.291, 0.290, 0.291, 0.293, 0.295],
    'ETTm2': [0.175, 0.170, 0.167, 0.166, 0.165, 0.166, 0.168, 0.170],
    'Weather': [0.140, 0.135, 0.132, 0.130, 0.130, 0.131, 0.133, 0.135],
    'Traffic': [0.385, 0.378, 0.372, 0.368, 0.367, 0.370, 0.373, 0.376],
    'Electricity': [0.138, 0.134, 0.131, 0.130, 0.130, 0.131, 0.133, 0.135],
    'ILI': [1.65, 1.58, 1.55, 1.52, 1.522, 1.55, 1.60, 1.65]
  };
  const P_VALUES = [2, 4, 8, 12, 16, 24, 32, 40];
  const COLORS = {
    'Weather':'#06b6d4', 'Traffic':'#ef4444', 'Electricity':'#a78bfa',
    'ILI':'#fbbf24', 'ETTh1':'#10b981', 'ETTh2':'#84cc16',
    'ETTm1':'#60a5fa', 'ETTm2':'#fb7185'
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
      const yMin = Math.min(...vals) * 0.95;
      const yMax = Math.max(...vals) * 1.05;
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

      // Line + points
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

      // Footer note
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('MSE flat across P ∈ {4..40} — patch length is robust hyperparameter', w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
