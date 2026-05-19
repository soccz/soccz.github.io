/* viz: pat-table15-ci-universal
 * PatchTST Table 15 — Channel-independence applied to other models.
 * Shows that CI is a universal technique improving Informer/Autoformer/FEDformer too.
 * paper exact values.
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → horizon → model → { original: [MSE, MAE], CI: [MSE, MAE] }
  const T15 = {
    Weather: {
      96:  { Informer:{orig:[0.300,0.384], CI:[0.174,0.232]}, Autoformer:{orig:[0.266,0.336], CI:[0.227,0.289]}, FEDformer:{orig:[0.217,0.296], CI:[0.214,0.278]}, 'PatchTST/42':{orig:null, CI:[0.152,0.199]} },
      192: { Informer:{orig:[0.598,0.544], CI:[0.214,0.270]}, Autoformer:{orig:[0.307,0.367], CI:[0.269,0.318]}, FEDformer:{orig:[0.276,0.336], CI:[0.258,0.322]}, 'PatchTST/42':{orig:null, CI:[0.197,0.243]} },
      336: { Informer:{orig:[0.578,0.523], CI:[0.266,0.310]}, Autoformer:{orig:[0.359,0.395], CI:[0.315,0.344]}, FEDformer:{orig:[0.339,0.380], CI:[0.302,0.336]}, 'PatchTST/42':{orig:null, CI:[0.249,0.283]} },
      720: { Informer:{orig:[1.059,0.741], CI:[0.327,0.356]}, Autoformer:{orig:[0.419,0.428], CI:[0.384,0.389]}, FEDformer:{orig:[0.403,0.428], CI:[0.374,0.369]}, 'PatchTST/42':{orig:null, CI:[0.320,0.335]} },
    },
    Traffic: {
      96:  { Informer:{orig:[0.719,0.391], CI:[0.705,0.402]}, Autoformer:{orig:[0.613,0.388], CI:[0.616,0.382]}, FEDformer:{orig:[0.587,0.366], CI:[0.604,0.373]}, 'PatchTST/42':{orig:null, CI:[0.367,0.251]} },
      192: { Informer:{orig:[0.696,0.379], CI:[0.720,0.407]}, Autoformer:{orig:[0.616,0.382], CI:[0.622,0.337]}, FEDformer:{orig:[0.604,0.373], CI:[0.621,0.383]}, 'PatchTST/42':{orig:null, CI:[0.385,0.259]} },
    },
    Electricity: {
      96:  { Informer:{orig:[0.274,0.368], CI:[0.203,0.299]}, Autoformer:{orig:[0.201,0.317], CI:null}, FEDformer:{orig:[0.193,0.308], CI:null}, 'PatchTST/42':{orig:null, CI:[0.130,0.222]} },
      192: { Informer:{orig:[0.296,0.386], CI:[0.221,0.316]}, Autoformer:{orig:[0.222,0.334], CI:null}, FEDformer:{orig:[0.201,0.315], CI:null}, 'PatchTST/42':{orig:null, CI:[0.148,0.240]} },
    }
  };

  const MODELS = ['PatchTST/42', 'Informer', 'Autoformer', 'FEDformer'];
  const COLORS = {
    'PatchTST/42': '#ef4444',
    'Informer':    '#22d3ee',
    'Autoformer':  '#60a5fa',
    'FEDformer':   '#a78bfa'
  };

  VIZ_REGISTRY['pat-table15-ci-universal'] = function (canvas, controls, params) {
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

    function rebuildToggles() {
      controls.innerHTML = '';
      const horizons = Object.keys(T15[dataset]).map(h => parseInt(h, 10));
      if (!horizons.includes(horizon)) horizon = horizons[0];
      makeToggle('Dataset', Object.keys(T15), dataset, d => { dataset = d; rebuildToggles(); draw(); });
      makeToggle('Horizon T', horizons, horizon, h => { horizon = h; draw(); });
      makeToggle('Metric', ['MSE', 'MAE'], metric, m => { metric = m; draw(); });
    }
    rebuildToggles();

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 30, padT = 38, padB = 80;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = T15[dataset][horizon];
      const idx = metric === 'MSE' ? 0 : 1;
      // Gather all valid values for y-axis
      const allVals = [];
      MODELS.forEach(m => {
        const r = row[m];
        if (r && r.orig) allVals.push(r.orig[idx]);
        if (r && r.CI) allVals.push(r.CI[idx]);
      });
      const yMin = 0;
      const yMax = Math.max(...allVals) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      // Grid
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(yv)); ctx.lineTo(w-padR, yToPix(yv));
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric + ' (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 15 — Channel-indep universality · ${dataset} · T=${horizon} · ${metric}`, w/2, padT - 24);

      // Grouped bars: Original vs CI
      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.32;
      MODELS.forEach((m, mi) => {
        const r = row[m];
        const cx = padL + groupW * (mi + 0.5);
        // Original (left bar, faded)
        if (r && r.orig) {
          const top = yToPix(r.orig[idx]);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = 0.4;
          ctx.fillRect(cx - barW - 2, top, barW, barH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = U.text();
          ctx.font = '600 9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(r.orig[idx].toFixed(3), cx - barW/2 - 2, top - 6);
        } else if (m === 'PatchTST/42') {
          ctx.fillStyle = U.textMuted();
          ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('n/a', cx - barW/2 - 2, yToPix(yMax * 0.5));
        }
        // CI version (right bar, full)
        if (r && r.CI) {
          const top = yToPix(r.CI[idx]);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = 1.0;
          ctx.fillRect(cx + 2, top, barW, barH);
          ctx.fillStyle = U.text();
          ctx.font = '600 9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(r.CI[idx].toFixed(3), cx + barW/2 + 2, top - 6);
        } else {
          ctx.fillStyle = U.textMuted();
          ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('—', cx + barW/2 + 2, yToPix(yMax * 0.5));
        }

        // Model name label
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(m, cx, h - padB + 8);
        ctx.fillStyle = U.textMuted();
        ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText('orig | +CI', cx, h - padB + 22);
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
