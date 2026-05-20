/* viz: voc-variable-importance
 * Kelly-Malamud-Zhou (JF 2024) Figure 11 — 15 predictor 의 Variable Importance.
 * T=12, P=12000, z=10^3, averaged across 1000 RFF draws.
 * Hardcoded approximation from paper Figure 11 visual.
 */

(function () {
  const U = window.VIZ_UTIL;

  // From Figure 11: VI (R²) and VI (Sharpe) for 15 predictors
  // Order from paper: lag mkt > ltr > dfr > ... > rest
  const PREDICTORS = [
    { name: 'lag mkt', vi_r2: 1.9, vi_sr: 0.12 },
    { name: 'ltr',     vi_r2: 1.3, vi_sr: 0.09 },
    { name: 'dfr',     vi_r2: 0.8, vi_sr: 0.06 },
    { name: 'svar',    vi_r2: 0.6, vi_sr: 0.05 },
    { name: 'infl',    vi_r2: 0.45, vi_sr: 0.04 },
    { name: 'dfy',     vi_r2: 0.35, vi_sr: 0.03 },
    { name: 'lty',     vi_r2: 0.25, vi_sr: 0.025 },
    { name: 'tms',     vi_r2: 0.18, vi_sr: 0.02 },
    { name: 'tbl',     vi_r2: 0.12, vi_sr: 0.018 },
    { name: 'de',      vi_r2: 0.08, vi_sr: 0.015 },
    { name: 'ep',      vi_r2: 0.04, vi_sr: 0.012 },
    { name: 'dp',      vi_r2: 0.02, vi_sr: 0.010 },
    { name: 'dy',      vi_r2: 0.01, vi_sr: 0.008 },
    { name: 'b/m',     vi_r2: 0.005, vi_sr: 0.005 },
    { name: 'ntis',    vi_r2: -0.005, vi_sr: 0.002 }
  ];

  VIZ_REGISTRY['voc-variable-importance'] = function (canvas, controls, params) {
    let metric = params.metric || 'R2';   // R2 | SR

    // metric toggle
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';
    const lab = document.createElement('span');
    lab.style.cssText = 'font-size:0.85em;color:var(--text-secondary);min-width:60px;';
    lab.textContent = 'Metric';
    row.appendChild(lab);
    [['R2', 'R²'], ['SR', 'Sharpe']].forEach(([m, label]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'padding:3px 9px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (m === metric) { b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent(); }
      b.addEventListener('click', () => {
        row.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        metric = m; draw();
      });
      row.appendChild(b);
    });
    controls.appendChild(row);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 76, padR = 28, padT = 26, padB = 30;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      const yMax = metric === 'R2' ? 2.0 : 0.15;
      const yMin = metric === 'R2' ? -0.05 : 0;
      const xToP = (i) => padL + (i + 0.5) / PREDICTORS.length * iw;
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      // Y grid
      ctx.strokeStyle = '#e5ddd3';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        const py = yToP(yv);
        ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(padL + iw, py); ctx.stroke();
      }

      // Y axis
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        const label = metric === 'R2' ? yv.toFixed(2) + '%' : yv.toFixed(3);
        ctx.fillText(label, padL - 8, yToP(yv));
      }

      // Y label
      ctx.save();
      ctx.translate(20, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, metric === 'R2' ? 'VI (Δ R² %)' : 'VI (Δ Sharpe)', 0, 0,
             { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // Bars
      const barW = iw / PREDICTORS.length * 0.7;
      PREDICTORS.forEach((p, i) => {
        const val = metric === 'R2' ? p.vi_r2 : p.vi_sr;
        const px = xToP(i);
        const py0 = yToP(0);
        const py = yToP(val);
        ctx.fillStyle = val > 0 ? U.accent() : U.bad();
        ctx.fillRect(px - barW / 2, Math.min(py, py0), barW, Math.abs(py - py0));
      });

      // X labels (predictor names) — rotated
      ctx.fillStyle = U.text();
      ctx.font = '10px Inter, sans-serif';
      PREDICTORS.forEach((p, i) => {
        ctx.save();
        ctx.translate(xToP(i), padT + ih + 6);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(p.name, 0, 0);
        ctx.restore();
      });

      // Zero line emphasis
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.2;
      const zeroPx = yToP(0);
      ctx.beginPath(); ctx.moveTo(padL, zeroPx); ctx.lineTo(padL + iw, zeroPx); ctx.stroke();

      if (params.title) {
        ctx.fillStyle = U.text();
        ctx.font = '600 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(params.title, w / 2, padT - 12);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
