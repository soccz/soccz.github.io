/* viz: qf-hyperparam-k
 * QuantileFormer Figure 3 — Hyperparameter k (Gaussian components).
 * paper exact values not published; this reconstructs the U-shape per paper text.
 * Sweet spots: Electricity [8 10], Wind [6 10], ETTm1 [8 11].
 */

(function () {
  const U = window.VIZ_UTIL;

  /* Reconstructed values matching paper text claim: U-shape with sweet spot range.
   * y axis = q-risk (lower = better).
   * Format: {dataset: {quantile: [(k, qrisk), ...]}}
   */
  const DATA = {
    Electricity: {
      0.5: [[2,0.95],[4,0.86],[6,0.78],[8,0.75],[10,0.76],[12,0.85],[14,0.95]],
      0.9: [[2,0.85],[4,0.74],[6,0.60],[8,0.51],[10,0.54],[12,0.68],[14,0.82]]
    },
    Wind: {
      0.5: [[2,1.05],[4,0.95],[6,0.88],[8,0.84],[10,0.87],[12,0.98],[14,1.12]],
      0.9: [[2,0.78],[4,0.62],[6,0.42],[8,0.36],[10,0.40],[12,0.55],[14,0.70]]
    },
    ETTm1: {
      0.5: [[2,0.40],[4,0.28],[6,0.22],[8,0.17],[10,0.16],[12,0.18],[14,0.25]],
      0.9: [[2,0.22],[4,0.14],[6,0.08],[8,0.06],[10,0.07],[12,0.12],[14,0.18]]
    }
  };

  const COLORS = { 0.5:'#60a5fa', 0.9:'#ef4444' };

  VIZ_REGISTRY['qf-hyperparam-k'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Electricity';

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
      const padL = 60, padR = 24, padT = 38, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const series = DATA[dataset];
      const allY = [];
      Object.values(series).forEach(pts => pts.forEach(p => allY.push(p[1])));
      const xMin = 2, xMax = 14;
      const yMin = 0, yMax = Math.max(...allY) * 1.15;
      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 6;
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }

      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let xv = 2; xv <= 14; xv += 2) {
        ctx.fillText(String(xv), xToPix(xv), h - padB + 8);
      }
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textBaseline = 'bottom';
      ctx.fillText('k (Gaussian components)', w/2, h - 8);

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('q-risk (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Figure 3 · ${dataset} · k tuning`, w/2, padT - 24);

      Object.entries(series).forEach(([qStr, pts]) => {
        const q = parseFloat(qStr);
        ctx.strokeStyle = COLORS[q];
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        pts.forEach((p, i) => {
          const xp = xToPix(p[0]), yp = yToPix(p[1]);
          if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        });
        ctx.stroke();
        pts.forEach(p => {
          ctx.beginPath();
          ctx.arc(xToPix(p[0]), yToPix(p[1]), 4, 0, 2*Math.PI);
          ctx.fillStyle = COLORS[q]; ctx.fill();
        });
      });

      const lgY = padT - 6;
      let lgX = padL;
      [0.5, 0.9].forEach(q => {
        ctx.fillStyle = COLORS[q];
        ctx.fillRect(lgX, lgY, 12, 10);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('q=' + q.toFixed(1), lgX + 16, lgY + 5);
        lgX += 80;
      });

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
