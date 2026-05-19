/* viz: pat-table11-instance-norm
 * PatchTST Table 11 — Instance Normalization with (+in) vs without (-in).
 * paper exact values for PatchTST/64 and PatchTST/42.
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → horizon → variant → [MSE, MAE]
  const T11 = {
    Weather: {
      96:  { '/64+in':[0.149,0.198], '/64-in':[0.161,0.219], '/42+in':[0.152,0.199] },
      192: { '/64+in':[0.194,0.241], '/64-in':[0.201,0.254], '/42+in':[0.197,0.243] },
      336: { '/64+in':[0.245,0.282], '/64-in':[0.253,0.298], '/42+in':[0.249,0.283] },
      720: { '/64+in':[0.314,0.334], '/64-in':[0.323,0.357], '/42+in':[0.320,0.335] },
    },
    Traffic: {
      96:  { '/64+in':[0.360,0.249], '/64-in':[0.413,0.295], '/42+in':[0.367,0.251] },
      192: { '/64+in':[0.379,0.256], '/64-in':[0.425,0.302], '/42+in':[0.385,0.259] },
      336: { '/64+in':[0.392,0.264], '/64-in':[0.435,0.307], '/42+in':[0.398,0.265] },
      720: { '/64+in':[0.432,0.286], '/64-in':[0.473,0.321], '/42+in':[0.434,0.287] },
    },
    Electricity: {
      96:  { '/64+in':[0.129,0.222], '/64-in':[0.133,0.230], '/42+in':[0.130,0.222] },
      192: { '/64+in':[0.147,0.240], '/64-in':[0.148,0.244], '/42+in':[0.148,0.240] },
      336: { '/64+in':[0.163,0.259], '/64-in':[0.164,0.262], '/42+in':[0.167,0.261] },
      720: { '/64+in':[0.197,0.290], '/64-in':[0.196,0.291], '/42+in':[0.202,0.291] },
    },
    ILI: {
      24: { '/64+in':[1.319,0.754], '/64-in':[3.563,1.317], '/42+in':[1.522,0.814] },
      36: { '/64+in':[1.579,0.870], '/64-in':[3.426,1.205], '/42+in':[1.430,0.834] },
      48: { '/64+in':[1.553,0.815], '/64-in':[4.309,1.449], '/42+in':[1.673,0.854] },
      60: { '/64+in':[1.470,0.788], '/64-in':[4.065,1.402], '/42+in':[1.529,0.862] },
    },
    ETTh1: {
      96:  { '/64+in':[0.370,0.400], '/64-in':[0.385,0.410], '/42+in':[0.375,0.399] },
      192: { '/64+in':[0.413,0.429], '/64-in':[0.417,0.432], '/42+in':[0.414,0.421] },
      336: { '/64+in':[0.422,0.440], '/64-in':[0.439,0.449], '/42+in':[0.431,0.436] },
    }
  };

  const VARIANTS = ['/64+in', '/64-in', '/42+in'];
  const VARIANT_LABEL = { '/64+in': 'PatchTST/64 +IN', '/64-in': 'PatchTST/64 −IN', '/42+in': 'PatchTST/42 +IN' };
  const COLORS = { '/64+in': '#ef4444', '/64-in': '#fbbf24', '/42+in': '#60a5fa' };

  VIZ_REGISTRY['pat-table11-instance-norm'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'ILI';
    let horizon = params.horizon || (dataset === 'ILI' ? 24 : 96);
    let metric = params.metric || 'MSE';

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
    }

    function rebuildToggles() {
      controls.innerHTML = '';
      const horizons = Object.keys(T11[dataset]).map(h => parseInt(h, 10));
      if (!horizons.includes(parseInt(horizon, 10))) horizon = horizons[0];
      makeToggle('Dataset', Object.keys(T11), dataset, d => { dataset = d; rebuildToggles(); draw(); });
      makeToggle('Horizon T', horizons, horizon, h => { horizon = h; draw(); });
      makeToggle('Metric', ['MSE', 'MAE'], metric, m => { metric = m; draw(); });
    }
    rebuildToggles();

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 30, padT = 36, padB = 100;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = T11[dataset][horizon];
      const idx = metric === 'MSE' ? 0 : 1;
      const vals = VARIANTS.map(v => row[v] ? row[v][idx] : null);
      const valid = vals.filter(v => v !== null);
      const yMin = 0;
      const yMax = Math.max(...valid) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

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
      ctx.fillText(`paper Table 11 · ${dataset} · T=${horizon} · ${metric} (IN ablation)`, w/2, padT - 24);

      const groupW = innerW / VARIANTS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...valid);
      VARIANTS.forEach((v, vi) => {
        const cx = padL + groupW * (vi + 0.5);
        const val = vals[vi];
        if (val === null) return;
        const top = yToPix(val);
        const barH = (h - padB) - top;
        ctx.fillStyle = COLORS[v];
        ctx.globalAlpha = (Math.abs(val - minVal) < 1e-9) ? 1.0 : 0.78;
        ctx.fillRect(cx - barW/2, top, barW, barH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(val.toFixed(3), cx, top - 8);
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx + 8, h - padB + 8);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(VARIANT_LABEL[v], 0, 0);
        ctx.restore();
      });

      // Footer note about ILI
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(
        dataset === 'ILI'
          ? 'ILI: −IN MSE blows up to 3.5–4.3 — Instance Norm CRITICAL for small dataset'
          : 'Marginal +IN improvement on large datasets — IN robustness check passed',
        w/2, h - 8
      );

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
