/* viz: autoformer-attention-ablation
 * paper Table 4 — Auto-Correlation vs self-attention family (ETT, MSE).
 * "−" means out-of-memory.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 4 exact values; null = OOM */
  const DATA = {
    '96→336':  { AutoCorr:0.339, Full:0.375, LogSparse:0.362, LSH:0.366, ProbSparse:0.481 },
    '96→720':  { AutoCorr:0.422, Full:0.537, LogSparse:0.539, LSH:0.502, ProbSparse:0.822 },
    '96→1440': { AutoCorr:0.555, Full:0.667, LogSparse:0.582, LSH:0.663, ProbSparse:0.715 },
    '192→336': { AutoCorr:0.355, Full:0.450, LogSparse:0.420, LSH:0.407, ProbSparse:0.404 },
    '192→720': { AutoCorr:0.429, Full:0.554, LogSparse:0.552, LSH:0.636, ProbSparse:1.148 },
    '192→1440':{ AutoCorr:0.503, Full:null,  LogSparse:0.958, LSH:1.069, ProbSparse:0.732 },
    '336→336': { AutoCorr:0.361, Full:0.501, LogSparse:0.474, LSH:0.442, ProbSparse:0.417 },
    '336→720': { AutoCorr:0.425, Full:0.647, LogSparse:0.601, LSH:0.615, ProbSparse:0.631 },
    '336→1440':{ AutoCorr:0.574, Full:null,  LogSparse:null,  LSH:null,  ProbSparse:1.133 }
  };

  const MECHS = ['AutoCorr','Full','LogSparse','LSH','ProbSparse'];
  const LABELS = { AutoCorr:'Auto-Corr', Full:'Full', LogSparse:'LogSparse', LSH:'LSH', ProbSparse:'ProbSparse' };
  const COLORS = { AutoCorr:'#ef4444', Full:'#60a5fa', LogSparse:'#f59e0b', LSH:'#10b981', ProbSparse:'#a78bfa' };

  VIZ_REGISTRY['autoformer-attention-ablation'] = function (canvas, controls, params) {
    let setting = params.setting || '96→336';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'I → O';
    wb.appendChild(lb);
    Object.keys(DATA).forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = s;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.78rem;';
      if (s === setting) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        setting = s; draw();
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

      const row = DATA[setting];
      const validVals = MECHS.map(m => row[m]).filter(v => v != null);
      const yMin = 0; const yMax = Math.max(...validVals) * 1.2;
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
      ctx.fillText(`paper Table 4 · input-${setting.split('→')[0]}-predict-${setting.split('→')[1]}`, w/2, padT - 24);

      const groupW = innerW / MECHS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...validVals);
      MECHS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m];
        if (v == null) {
          ctx.fillStyle = U.textMuted();
          ctx.font = '600 28px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('OOM', cx, padT + innerH * 0.5);
        } else {
          const top = yToPix(v);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = (v === minVal) ? 1.0 : 0.78;
          ctx.fillRect(cx - barW/2, top, barW, barH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = U.text();
          ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(3), cx, top - 8);
        }
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(LABELS[m], cx, h - padB + 8);
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
