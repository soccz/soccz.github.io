/* viz: autoformer-decomp-ablation
 * paper Table 3 — Decomposition architecture ablation (ETT, MSE).
 * Origin vs Sep vs Ours, 4 backbones × 4 horizons.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 3 exact values */
  const DATA = {
    Transformer: {
      96:  { Origin:0.604, Sep:0.311, Ours:0.204 },
      192: { Origin:1.060, Sep:0.760, Ours:0.266 },
      336: { Origin:1.413, Sep:0.665, Ours:0.375 },
      720: { Origin:2.672, Sep:3.200, Ours:0.537 }
    },
    Informer: {
      96:  { Origin:0.365, Sep:0.490, Ours:0.354 },
      192: { Origin:0.533, Sep:0.658, Ours:0.432 },
      336: { Origin:1.363, Sep:1.469, Ours:0.481 },
      720: { Origin:3.379, Sep:2.766, Ours:0.822 }
    },
    LogTrans: {
      96:  { Origin:0.768, Sep:0.862, Ours:0.231 },
      192: { Origin:0.989, Sep:0.533, Ours:0.378 },
      336: { Origin:1.334, Sep:0.762, Ours:0.362 },
      720: { Origin:3.048, Sep:2.601, Ours:0.539 }
    },
    Reformer: {
      96:  { Origin:0.658, Sep:0.510, Ours:0.218 },
      192: { Origin:1.078, Sep:0.510, Ours:0.336 },
      336: { Origin:1.549, Sep:1.188, Ours:0.366 },
      720: { Origin:2.631, Sep:2.845, Ours:0.502 }
    }
  };

  const VARIANTS = ['Origin','Sep','Ours'];
  const HORIZONS = ['96','192','336','720'];
  const COLORS = { Origin:'#9ca3af', Sep:'#f59e0b', Ours:'#ef4444' };

  VIZ_REGISTRY['autoformer-decomp-ablation'] = function (canvas, controls, params) {
    let backbone = params.backbone || 'Transformer';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Backbone';
    wb.appendChild(lb);
    Object.keys(DATA).forEach(b => {
      const btn = document.createElement('button');
      btn.textContent = b;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (b === backbone) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        backbone = b; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const allVals = [];
      HORIZONS.forEach(hz => VARIANTS.forEach(v => allVals.push(DATA[backbone][hz][v])));
      const yMin = 0; const yMax = Math.max(...allVals) * 1.15;
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

      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE (ETT, lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 3 · ${backbone} backbone`, w/2, padT - 24);

      const groupW = innerW / HORIZONS.length;
      const subW = groupW * 0.25;
      const gap = groupW * 0.06;
      HORIZONS.forEach((hz, hi) => {
        const groupCx = padL + groupW * (hi + 0.5);
        VARIANTS.forEach((v, vi) => {
          const cx = groupCx + (vi - 1) * (subW + gap);
          const val = DATA[backbone][hz][v];
          const top = yToPix(val);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[v];
          ctx.globalAlpha = 0.9;
          ctx.fillRect(cx - subW/2, top, subW, barH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = U.text();
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(val.toFixed(2), cx, top - 6);
        });
        ctx.fillStyle = U.text();
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(`O=${hz}`, groupCx, h - padB + 8);
      });

      /* legend */
      const lgY = padT - 6;
      let lgX = padL;
      VARIANTS.forEach(v => {
        ctx.fillStyle = COLORS[v];
        ctx.fillRect(lgX, lgY, 12, 10);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(v, lgX + 16, lgY + 5);
        lgX += 70;
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
