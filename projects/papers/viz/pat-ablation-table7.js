/* viz: pat-ablation-table7
 * PatchTST Table 10 (full version of main-text Table 7) — Patching + Channel-independence ablation.
 * 4 cases: P+CI (full PatchTST/42), CI only, P only, Original (vanilla TST) + FEDformer baseline.
 * paper exact values. "-" = OOM (out of GPU memory).
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → horizon → case → [MSE, MAE] | null (OOM)
  const T7 = {
    Weather: {
      96:  { 'P+CI':[0.152,0.199], 'CI':[0.164,0.213], 'P':[0.168,0.223], 'Original':[0.177,0.236], 'FEDformer':[0.238,0.314] },
      192: { 'P+CI':[0.197,0.243], 'CI':[0.205,0.250], 'P':[0.213,0.262], 'Original':[0.221,0.270], 'FEDformer':[0.275,0.329] },
      336: { 'P+CI':[0.249,0.283], 'CI':[0.255,0.289], 'P':[0.266,0.300], 'Original':[0.271,0.306], 'FEDformer':[0.339,0.377] },
      720: { 'P+CI':[0.320,0.335], 'CI':[0.327,0.343], 'P':[0.351,0.359], 'Original':[0.340,0.353], 'FEDformer':[0.389,0.409] }
    },
    Traffic: {
      96:  { 'P+CI':[0.367,0.251], 'CI':[0.397,0.271], 'P':[0.595,0.376], 'Original':null,           'FEDformer':[0.576,0.359] },
      192: { 'P+CI':[0.385,0.259], 'CI':[0.411,0.276], 'P':[0.612,0.387], 'Original':null,           'FEDformer':[0.610,0.380] },
      336: { 'P+CI':[0.398,0.265], 'CI':[0.423,0.282], 'P':[0.651,0.391], 'Original':null,           'FEDformer':[0.608,0.375] },
      720: { 'P+CI':[0.434,0.287], 'CI':[0.457,0.309], 'P':null,           'Original':null,           'FEDformer':[0.621,0.375] }
    },
    Electricity: {
      96:  { 'P+CI':[0.130,0.222], 'CI':[0.136,0.231], 'P':[0.196,0.307], 'Original':[0.205,0.318], 'FEDformer':[0.186,0.302] },
      192: { 'P+CI':[0.148,0.240], 'CI':[0.164,0.263], 'P':[0.215,0.323], 'Original':null,           'FEDformer':[0.197,0.311] },
      336: { 'P+CI':[0.167,0.261], 'CI':[0.168,0.262], 'P':[0.228,0.338], 'Original':null,           'FEDformer':[0.213,0.328] },
      720: { 'P+CI':[0.202,0.291], 'CI':[0.219,0.312], 'P':[0.244,0.345], 'Original':null,           'FEDformer':[0.233,0.344] }
    },
    ETTh1: {
      96:  { 'P+CI':[0.375,0.399], 'CI':[0.365,0.395], 'P':[0.416,0.438], 'Original':[0.455,0.459], 'FEDformer':[0.376,0.415] },
      192: { 'P+CI':[0.414,0.421], 'CI':[0.403,0.415], 'P':[0.459,0.464], 'Original':[0.503,0.486], 'FEDformer':[0.423,0.446] },
      336: { 'P+CI':[0.431,0.436], 'CI':[0.430,0.433], 'P':[0.484,0.480], 'Original':[0.514,0.503], 'FEDformer':[0.444,0.462] },
      720: { 'P+CI':[0.449,0.466], 'CI':[0.449,0.454], 'P':[0.500,0.494], 'Original':[0.531,0.520], 'FEDformer':[0.469,0.492] }
    }
  };

  const CASES = ['P+CI', 'CI', 'P', 'Original', 'FEDformer'];
  const COLORS = {
    'P+CI':      '#ef4444',
    'CI':        '#fbbf24',
    'P':         '#60a5fa',
    'Original':  '#94a3b8',
    'FEDformer': '#a78bfa'
  };
  const HORIZONS = [96, 192, 336, 720];

  VIZ_REGISTRY['pat-ablation-table7'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Weather';
    let horizon = parseInt(params.horizon, 10) || 96;
    let metric  = params.metric || 'MSE';

    function makeToggle(label, items, current, onSelect) {
      const wb = document.createElement('label');
      const lb = document.createElement('span'); lb.textContent = label;
      wb.appendChild(lb);
      items.forEach(it => {
        const btn = document.createElement('button');
        btn.textContent = String(it);
        btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
        if (it === current) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
        btn.addEventListener('click', () => {
          wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
          btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
          onSelect(it);
        });
        wb.appendChild(btn);
      });
      controls.appendChild(wb);
      return wb;
    }

    makeToggle('Dataset', Object.keys(T7), dataset, d => { dataset = d; draw(); });
    makeToggle('Horizon T', HORIZONS, horizon, h => { horizon = h; draw(); });
    makeToggle('Metric', ['MSE', 'MAE'], metric, m => { metric = m; draw(); });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 90;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = T7[dataset][horizon];
      const idx = metric === 'MSE' ? 0 : 1;
      const vals = CASES.map(c => (row[c] === null || row[c] === undefined) ? null : row[c][idx]);
      const valid = vals.filter(v => v !== null);
      const yMin = 0;
      const yMax = Math.max(...valid) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 5;
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
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric + ' on ' + dataset, 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 10 (ablation) · ${dataset} · T=${horizon} · ${metric}`, w/2, padT - 24);

      const groupW = innerW / CASES.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...valid);
      CASES.forEach((c, ci) => {
        const cx = padL + groupW * (ci + 0.5);
        const v = vals[ci];
        if (v === null) {
          ctx.fillStyle = U.textMuted();
          ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('OOM', cx, yToPix(yMax * 0.5));
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.fillText('(out of GPU mem)', cx, yToPix(yMax * 0.5) + 16);
        } else {
          const top = yToPix(v);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[c];
          ctx.globalAlpha = (Math.abs(v - minVal) < 1e-9) ? 1.0 : 0.78;
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
        ctx.save();
        ctx.translate(cx, h - padB + 8);
        ctx.rotate(Math.PI / 8);
        ctx.fillText(c, 0, 0);
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
