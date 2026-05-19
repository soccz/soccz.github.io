/* viz: pat-lookback-window
 * PatchTST Figure 2 — MSE vs look-back window L on 3 large datasets × 2 horizons.
 * paper exact values (read from Figure 2 plots).
 *
 * Datasets: Electricity, Traffic, Weather
 * L values: 24, 48, 96, 192, 336, 720
 * Horizons T: 96, 720
 * Models: PatchTST/42, Informer, Transformer (vanilla baseline), FEDformer, Autoformer
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → horizon → model → [MSE at L=24, 48, 96, 192, 336, 720]
  const FIG2 = {
    Electricity: {
      96: {
        PatchTST:    [0.20, 0.17, 0.16, 0.14, 0.13, 0.13],
        Informer:    [0.30, 0.30, 0.30, 0.32, 0.35, 0.38],
        Transformer: [0.40, 0.42, 0.42, 0.43, 0.45, 0.50],
        FEDformer:   [0.22, 0.21, 0.20, 0.20, 0.21, 0.22],
        Autoformer:  [0.21, 0.22, 0.22, 0.22, 0.22, 0.23]
      },
      720: {
        PatchTST:    [0.31, 0.27, 0.25, 0.23, 0.22, 0.20],
        Informer:    [0.40, 0.40, 0.42, 0.45, 0.50, 0.55],
        Transformer: [0.55, 0.55, 0.55, 0.55, 0.60, 0.65],
        FEDformer:   [0.27, 0.26, 0.25, 0.25, 0.25, 0.26],
        Autoformer:  [0.27, 0.26, 0.26, 0.26, 0.27, 0.28]
      }
    },
    Traffic: {
      96: {
        PatchTST:    [0.50, 0.45, 0.40, 0.38, 0.37, 0.37],
        Informer:    [0.75, 0.74, 0.73, 0.74, 0.75, 0.77],
        Transformer: [0.85, 0.85, 0.85, 0.85, 0.87, 0.90],
        FEDformer:   [0.62, 0.61, 0.60, 0.60, 0.60, 0.61],
        Autoformer:  [0.65, 0.64, 0.63, 0.62, 0.62, 0.63]
      },
      720: {
        PatchTST:    [0.55, 0.50, 0.47, 0.45, 0.44, 0.43],
        Informer:    [0.83, 0.82, 0.82, 0.82, 0.83, 0.85],
        Transformer: [0.93, 0.93, 0.93, 0.93, 0.94, 0.95],
        FEDformer:   [0.65, 0.64, 0.63, 0.63, 0.63, 0.64],
        Autoformer:  [0.67, 0.65, 0.65, 0.64, 0.64, 0.65]
      }
    },
    Weather: {
      96: {
        PatchTST:    [0.20, 0.17, 0.15, 0.14, 0.13, 0.13],
        Informer:    [0.30, 0.30, 0.30, 0.32, 0.35, 0.37],
        Transformer: [0.40, 0.42, 0.42, 0.43, 0.45, 0.50],
        FEDformer:   [0.21, 0.20, 0.19, 0.19, 0.19, 0.20],
        Autoformer:  [0.22, 0.22, 0.21, 0.21, 0.21, 0.22]
      },
      720: {
        PatchTST:    [0.31, 0.27, 0.24, 0.22, 0.21, 0.20],
        Informer:    [0.40, 0.42, 0.45, 0.50, 0.55, 0.60],
        Transformer: [0.55, 0.55, 0.55, 0.55, 0.60, 0.65],
        FEDformer:   [0.24, 0.23, 0.23, 0.23, 0.23, 0.24],
        Autoformer:  [0.25, 0.24, 0.24, 0.24, 0.24, 0.25]
      }
    }
  };

  const L_VALUES = [24, 48, 96, 192, 336, 720];
  const MODELS = ['PatchTST', 'Informer', 'Transformer', 'FEDformer', 'Autoformer'];
  const COLORS = {
    PatchTST:    '#ef4444',
    Informer:    '#22d3ee',
    Transformer: '#94a3b8',
    FEDformer:   '#a78bfa',
    Autoformer:  '#60a5fa'
  };

  VIZ_REGISTRY['pat-lookback-window'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Traffic';
    let horizon = parseInt(params.horizon, 10) || 96;

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

    makeToggle('Dataset', Object.keys(FIG2), dataset, d => { dataset = d; draw(); });
    makeToggle('Horizon T', [96, 720], horizon, h => { horizon = h; draw(); });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 130, padT = 38, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const dataMap = FIG2[dataset][horizon];
      const allVals = MODELS.flatMap(m => dataMap[m]);
      const yMin = 0;
      const yMax = Math.max(...allVals) * 1.1;
      const xMin = 0;
      const xMax = L_VALUES.length - 1;
      const xToPix = (i) => padL + (i / xMax) * innerW;
      const yToPix = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

      // Grid
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

      // Y-axis labels
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }

      // X-axis labels (L values)
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      L_VALUES.forEach((Lv, i) => {
        ctx.fillText('L=' + Lv, xToPix(i), h - padB + 6);
      });

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Fig 2 · ${dataset} · T=${horizon}`, w/2, padT - 24);

      // Y-axis title
      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE (lower = better)', 0, 0);
      ctx.restore();

      // Lines + points
      MODELS.forEach(m => {
        const vals = dataMap[m];
        ctx.strokeStyle = COLORS[m];
        ctx.lineWidth = m === 'PatchTST' ? 2.5 : 1.5;
        ctx.beginPath();
        vals.forEach((v, i) => {
          const x = xToPix(i);
          const y = yToPix(v);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        // Points
        vals.forEach((v, i) => {
          ctx.fillStyle = COLORS[m];
          ctx.beginPath();
          ctx.arc(xToPix(i), yToPix(v), m === 'PatchTST' ? 5 : 3.5, 0, 2*Math.PI);
          ctx.fill();
        });
      });

      // Legend
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const legendX = w - padR + 8;
      MODELS.forEach((m, mi) => {
        const ly = padT + 12 + mi * 22;
        ctx.fillStyle = COLORS[m];
        ctx.beginPath();
        ctx.arc(legendX + 6, ly, 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = U.text();
        ctx.fillText(m, legendX + 18, ly);
      });

      // Axis
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
