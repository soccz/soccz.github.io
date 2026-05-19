/* viz: qf-ablation-table4
 * QuantileFormer Table 4 — Ablation of 3 components.
 */

(function () {
  const U = window.VIZ_UTIL;

  const ABL = {
    Electricity: {
      0.5: { 'w/o D-D':0.7629, 'w/o GMM':0.9890, 'w/o Fusion':0.9389, Full:0.7546 },
      0.7: { 'w/o D-D':0.8890, 'w/o GMM':0.9125, 'w/o Fusion':0.9104, Full:0.3330 },
      0.9: { 'w/o D-D':0.6738, 'w/o GMM':0.5570, 'w/o Fusion':0.9885, Full:0.5121 }
    },
    Wind: {
      0.5: { 'w/o D-D':1.0746, 'w/o GMM':0.9782, 'w/o Fusion':0.8954, Full:0.8403 },
      0.7: { 'w/o D-D':1.2476, 'w/o GMM':0.9575, 'w/o Fusion':0.8861, Full:0.7346 },
      0.9: { 'w/o D-D':1.7182, 'w/o GMM':0.4451, 'w/o Fusion':1.0460, Full:0.3369 }
    },
    Solar: {
      0.5: { 'w/o D-D':1.3440, 'w/o GMM':1.0831, 'w/o Fusion':1.0708, Full:1.0641 },
      0.7: { 'w/o D-D':1.2463, 'w/o GMM':1.1991, 'w/o Fusion':1.1930, Full:1.1832 },
      0.9: { 'w/o D-D':0.6142, 'w/o GMM':0.7914, 'w/o Fusion':0.7289, Full:0.5883 }
    },
    Traffic: {
      0.5: { 'w/o D-D':0.9626, 'w/o GMM':1.3995, 'w/o Fusion':1.5161, Full:0.8489 },
      0.7: { 'w/o D-D':1.3814, 'w/o GMM':0.8849, 'w/o Fusion':1.1245, Full:0.8489 },
      0.9: { 'w/o D-D':0.5497, 'w/o GMM':0.5837, 'w/o Fusion':0.8275, Full:0.4688 }
    }
  };

  const SETTINGS = ['w/o D-D','w/o GMM','w/o Fusion','Full'];
  const COLORS = { 'w/o D-D':'#9ca3af', 'w/o GMM':'#f59e0b', 'w/o Fusion':'#60a5fa', Full:'#ef4444' };

  VIZ_REGISTRY['qf-ablation-table4'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Electricity';
    let quantile = parseFloat(params.quantile || 0.5);

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(ABL).forEach(d => {
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

    const wq = document.createElement('label');
    const lq = document.createElement('span'); lq.textContent = 'Quantile';
    wq.appendChild(lq);
    [0.5, 0.7, 0.9].forEach(q => {
      const btn = document.createElement('button');
      btn.textContent = q.toFixed(1);
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (Math.abs(q - quantile) < 1e-6) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wq.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        quantile = q; draw();
      });
      wq.appendChild(btn);
    });
    controls.appendChild(wq);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = ABL[dataset][quantile];
      const vals = SETTINGS.map(s => row[s]);
      const yMin = 0;
      const yMax = Math.max(...vals) * 1.15;
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
      ctx.fillText('q-risk (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 4 · ${dataset} · q=${quantile.toFixed(1)}`, w/2, padT - 24);

      const groupW = innerW / SETTINGS.length;
      const barW = groupW * 0.6;
      const minVal = Math.min(...vals);
      SETTINGS.forEach((s, si) => {
        const cx = padL + groupW * (si + 0.5);
        const v = row[s];
        const top = yToPix(v);
        const barH = (h - padB) - top;
        ctx.fillStyle = COLORS[s];
        ctx.globalAlpha = (Math.abs(v - minVal) < 1e-6) ? 1.0 : 0.78;
        ctx.fillRect(cx - barW/2, top, barW, barH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(3), cx, top - 8);
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textBaseline = 'top';
        ctx.fillText(s, cx, h - padB + 8);
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
