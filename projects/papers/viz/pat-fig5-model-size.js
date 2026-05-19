/* viz: pat-fig5-model-size
 * PatchTST Figure 5 — MSE across 6 hyperparameter combinations × 8 datasets.
 * Combinations 1..6 = (L, D) ∈ {(3,128),(3,256),(4,128),(4,256),(5,128),(5,256)}
 * Values are approximate from paper Fig 5 plots (paper does not provide exact table).
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → 6-array of MSE values across (L,D) combinations
  // Approximate from paper Fig 5 — emphasize narrow variance (robustness)
  const FIG5 = {
    'ETTh1':       [0.378, 0.380, 0.376, 0.375, 0.378, 0.378],
    'ETTh2':       [0.286, 0.282, 0.280, 0.278, 0.280, 0.280],
    'Weather':     [0.144, 0.143, 0.141, 0.140, 0.142, 0.143],
    'ILI':         [2.15, 2.05, 2.18, 2.22, 2.10, 2.08],  // ILI has high variance per paper
    'ETTm1':       [0.288, 0.285, 0.290, 0.288, 0.286, 0.290],
    'ETTm2':       [0.165, 0.164, 0.163, 0.165, 0.164, 0.166],
    'Traffic':     [0.373, 0.370, 0.372, 0.368, 0.370, 0.371],
    'Electricity': [0.130, 0.128, 0.127, 0.128, 0.129, 0.130]
  };

  // (L, D) combinations
  const COMBOS = [
    '(L=3, D=128)', '(L=3, D=256)', '(L=4, D=128)', '(L=4, D=256)', '(L=5, D=128)', '(L=5, D=256)'
  ];
  const COLORS = ['#ef4444','#f97316','#fbbf24','#10b981','#60a5fa','#a78bfa'];

  VIZ_REGISTRY['pat-fig5-model-size'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Weather';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(FIG5).forEach(d => {
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
      const padL = 70, padR = 30, padT = 38, padB = 90;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const vals = FIG5[dataset];
      const yMin = Math.min(...vals) * 0.92;
      const yMax = Math.max(...vals) * 1.08;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

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

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Fig 5 — Model size sensitivity · ${dataset} (T=96)`, w/2, padT - 24);

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE', 0, 0);
      ctx.restore();

      const groupW = innerW / COMBOS.length;
      const barW = groupW * 0.6;
      const minVal = Math.min(...vals);
      COMBOS.forEach((label, i) => {
        const cx = padL + groupW * (i + 0.5);
        const v = vals[i];
        const top = yToPix(v);
        const barH = (h - padB) - top;
        ctx.fillStyle = COLORS[i];
        ctx.globalAlpha = (Math.abs(v - minVal) < 1e-9) ? 1.0 : 0.78;
        ctx.fillRect(cx - barW/2, top, barW, barH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(3), cx, top - 8);

        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx + 8, h - padB + 8);
        ctx.rotate(-Math.PI / 5);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      });

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(dataset === 'ILI' ? 'ILI shows higher variance — small dataset effect (paper noted)' : 'MSE narrow range across 6 (L, D) combos — model is robust to hyperparameters', w/2, h - 8);

      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h-padB); ctx.lineTo(w-padR, h-padB);
      ctx.stroke();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
