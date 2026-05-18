/* viz: autoformer-mse-table1
 * Wu-Xu-Wang-Long (NeurIPS 2021) paper Table 1 — 6 datasets × 4 horizons × 7 models (MSE/MAE).
 * Exact values from paper Table 1 (p.7).
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 1 exact MSE values */
  const MSE = {
    ETT: {
      96:  { Autoformer:0.255, Informer:0.365, LogTrans:0.768, Reformer:0.658, LSTNet:3.142, LSTM:2.041, TCN:3.041 },
      192: { Autoformer:0.281, Informer:0.533, LogTrans:0.989, Reformer:1.078, LSTNet:3.154, LSTM:2.249, TCN:3.072 },
      336: { Autoformer:0.339, Informer:1.363, LogTrans:1.334, Reformer:1.549, LSTNet:3.160, LSTM:2.568, TCN:3.105 },
      720: { Autoformer:0.422, Informer:3.379, LogTrans:3.048, Reformer:2.631, LSTNet:3.171, LSTM:2.720, TCN:3.135 }
    },
    Electricity: {
      96:  { Autoformer:0.201, Informer:0.274, LogTrans:0.258, Reformer:0.312, LSTNet:0.680, LSTM:0.375, TCN:0.985 },
      192: { Autoformer:0.222, Informer:0.296, LogTrans:0.266, Reformer:0.348, LSTNet:0.725, LSTM:0.442, TCN:0.996 },
      336: { Autoformer:0.231, Informer:0.300, LogTrans:0.280, Reformer:0.350, LSTNet:0.828, LSTM:0.439, TCN:1.000 },
      720: { Autoformer:0.254, Informer:0.373, LogTrans:0.283, Reformer:0.340, LSTNet:0.957, LSTM:0.980, TCN:1.438 }
    },
    Exchange: {
      96:  { Autoformer:0.197, Informer:0.847, LogTrans:0.968, Reformer:1.065, LSTNet:1.551, LSTM:1.453, TCN:3.004 },
      192: { Autoformer:0.300, Informer:1.204, LogTrans:1.040, Reformer:1.188, LSTNet:1.477, LSTM:1.846, TCN:3.048 },
      336: { Autoformer:0.509, Informer:1.672, LogTrans:1.659, Reformer:1.357, LSTNet:1.507, LSTM:2.136, TCN:3.113 },
      720: { Autoformer:1.447, Informer:2.478, LogTrans:1.941, Reformer:1.510, LSTNet:2.285, LSTM:2.984, TCN:3.150 }
    },
    Traffic: {
      96:  { Autoformer:0.613, Informer:0.719, LogTrans:0.684, Reformer:0.732, LSTNet:1.107, LSTM:0.843, TCN:1.438 },
      192: { Autoformer:0.616, Informer:0.696, LogTrans:0.685, Reformer:0.733, LSTNet:1.157, LSTM:0.847, TCN:1.463 },
      336: { Autoformer:0.622, Informer:0.777, LogTrans:0.733, Reformer:0.742, LSTNet:1.216, LSTM:0.853, TCN:1.479 },
      720: { Autoformer:0.660, Informer:0.864, LogTrans:0.717, Reformer:0.755, LSTNet:1.481, LSTM:1.500, TCN:1.499 }
    },
    Weather: {
      96:  { Autoformer:0.266, Informer:0.300, LogTrans:0.458, Reformer:0.689, LSTNet:0.594, LSTM:0.369, TCN:0.615 },
      192: { Autoformer:0.307, Informer:0.598, LogTrans:0.658, Reformer:0.752, LSTNet:0.560, LSTM:0.416, TCN:0.629 },
      336: { Autoformer:0.359, Informer:0.578, LogTrans:0.797, Reformer:0.639, LSTNet:0.597, LSTM:0.455, TCN:0.639 },
      720: { Autoformer:0.419, Informer:1.059, LogTrans:0.869, Reformer:1.130, LSTNet:0.618, LSTM:0.535, TCN:0.639 }
    },
    ILI: {
      24: { Autoformer:3.483, Informer:5.764, LogTrans:4.480, Reformer:4.400, LSTNet:6.026, LSTM:5.914, TCN:6.624 },
      36: { Autoformer:3.103, Informer:4.755, LogTrans:4.799, Reformer:4.783, LSTNet:5.340, LSTM:6.631, TCN:6.858 },
      48: { Autoformer:2.669, Informer:4.763, LogTrans:4.800, Reformer:4.832, LSTNet:6.080, LSTM:6.736, TCN:6.968 },
      60: { Autoformer:2.770, Informer:5.264, LogTrans:5.278, Reformer:4.882, LSTNet:5.548, LSTM:6.870, TCN:7.127 }
    }
  };

  const MODELS = ['Autoformer','Informer','LogTrans','Reformer','LSTNet','LSTM','TCN'];
  const COLORS = {
    Autoformer:'#ef4444', Informer:'#60a5fa', LogTrans:'#f59e0b',
    Reformer:'#10b981', LSTNet:'#9ca3af', LSTM:'#a78bfa', TCN:'#fb7185'
  };

  VIZ_REGISTRY['autoformer-mse-table1'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'ETT';
    let horizon = params.horizon || '336';

    /* dataset buttons */
    const w1 = document.createElement('label');
    const l1 = document.createElement('span'); l1.textContent = 'Dataset';
    w1.appendChild(l1);
    Object.keys(MSE).forEach(d => {
      const b = document.createElement('button');
      b.textContent = d;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (d === dataset) { b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent(); }
      b.addEventListener('click', () => {
        w1.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        dataset = d;
        // reset horizon if not present in this dataset
        const horizons = Object.keys(MSE[dataset]);
        if (!horizons.includes(horizon)) { horizon = horizons[0]; refreshHorizonBtns(); }
        draw();
      });
      w1.appendChild(b);
    });
    controls.appendChild(w1);

    /* horizon buttons */
    const w2 = document.createElement('label');
    const l2 = document.createElement('span'); l2.textContent = 'Horizon';
    w2.appendChild(l2);
    function refreshHorizonBtns() {
      while (w2.children.length > 1) w2.removeChild(w2.lastChild);
      Object.keys(MSE[dataset]).forEach(h => {
        const b = document.createElement('button');
        b.textContent = h;
        b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
        if (h === horizon) { b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent(); }
        b.addEventListener('click', () => {
          w2.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
          b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
          horizon = h; draw();
        });
        w2.appendChild(b);
      });
    }
    refreshHorizonBtns();
    controls.appendChild(w2);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = MSE[dataset][horizon];
      const vals = MODELS.map(m => row[m]);
      const yMin = 0;
      const yMax = Math.max(...vals) * 1.15;

      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* grid */
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

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE (lower = better)', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 1 · ${dataset} · predict-${horizon}`, w/2, padT - 24);

      /* bars */
      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.6;
      const minVal = Math.min(...vals);
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m];
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
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textBaseline = 'top';
        ctx.fillText(m, cx, h - padB + 8);
      });

      /* axis */
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
