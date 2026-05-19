/* viz: pt-crps-table1
 * ProTran (NeurIPS 2021) Table 1 — CRPS_sum across 5 datasets × 12 models.
 * paper exact values. null = not reported by paper.
 */

(function () {
  const U = window.VIZ_UTIL;

  const CRPS = {
    Solar:        { VES:0.900, VAR:0.830, 'VAR-Lasso':0.510, GARCH:0.880, DeepAR:0.336, 'LSTM-Copula':0.319, 'GP-Copula':0.337, KVAE:0.340, NKF:0.320, 'Transformer-MAF':0.301, TimeGrad:0.287, ProTran:0.194 },
    Electricity:  { VES:0.880, VAR:0.039, 'VAR-Lasso':0.025, GARCH:0.190, DeepAR:0.023, 'LSTM-Copula':0.064, 'GP-Copula':0.024, KVAE:0.051, NKF:0.016, 'Transformer-MAF':0.021, TimeGrad:0.021, ProTran:0.016 },
    Traffic:      { VES:0.350, VAR:0.290, 'VAR-Lasso':0.150, GARCH:0.370, DeepAR:0.055, 'LSTM-Copula':0.103, 'GP-Copula':0.078, KVAE:0.100, NKF:0.100, 'Transformer-MAF':0.056, TimeGrad:0.044, ProTran:0.028 },
    Taxi:         { VES:null, VAR:null, 'VAR-Lasso':null, GARCH:null, DeepAR:null, 'LSTM-Copula':0.326, 'GP-Copula':0.208, KVAE:null, NKF:null, 'Transformer-MAF':0.179, TimeGrad:0.114, ProTran:0.084 },
    Wikipedia:    { VES:null, VAR:null, 'VAR-Lasso':3.100, GARCH:null, DeepAR:0.127, 'LSTM-Copula':0.241, 'GP-Copula':0.086, KVAE:0.095, NKF:0.071, 'Transformer-MAF':0.063, TimeGrad:0.049, ProTran:0.047 }
  };

  const MODELS = ['VES','VAR','VAR-Lasso','GARCH','DeepAR','LSTM-Copula','GP-Copula','KVAE','NKF','Transformer-MAF','TimeGrad','ProTran'];
  const COLORS = {
    VES:'#9ca3af', VAR:'#fb7185', 'VAR-Lasso':'#a78bfa', GARCH:'#22d3ee',
    DeepAR:'#60a5fa', 'LSTM-Copula':'#84cc16', 'GP-Copula':'#fbbf24',
    KVAE:'#10b981', NKF:'#f59e0b', 'Transformer-MAF':'#06b6d4',
    TimeGrad:'#a78bfa', ProTran:'#ef4444'
  };

  VIZ_REGISTRY['pt-crps-table1'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Solar';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(CRPS).forEach(d => {
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
      const padL = 64, padR = 28, padT = 38, padB = 90;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = CRPS[dataset];
      const valid = MODELS.map(m => row[m]).filter(v => v != null);
      const yMin = 0;
      const yMax = Math.max(...valid) * 1.15;
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
        ctx.fillText(yv.toFixed(3), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS_sum (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 1 · CRPS_sum · ${dataset}`, w/2, padT - 24);

      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...valid);
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m];
        if (v == null) {
          ctx.fillStyle = U.textMuted();
          ctx.font = '600 18px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('—', cx, padT + innerH * 0.5);
        } else {
          const top = yToPix(v);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = (Math.abs(v - minVal) < 1e-9) ? 1.0 : 0.78;
          ctx.fillRect(cx - barW/2, top, barW, barH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = U.text();
          ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(3), cx, top - 8);
        }
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx, h - padB + 8);
        ctx.rotate(Math.PI / 4);
        ctx.fillText(m, 0, 0);
        ctx.restore();
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
