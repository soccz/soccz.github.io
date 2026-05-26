/* viz: voc-comparison-table1
 * Kelly-Malamud-Zhou (JF 2024) Table I — Comparison with Goyal-Welch.
 * 3 models × 3 T_window. Hardcoded paper values.
 */

(function () {
  const U = window.VIZ_UTIL;

  // Paper Table I exact values
  const DATA = {
    12: {
      'Linear ridgeless': { R2: -100, SR: -0.11, IRm: -0.16, MaxLoss: 98.5, Skew: -0.9 },
      'Linear ridge':     { R2: -3.8, SR: 0.46,  IRm: 0.33,  MaxLoss: 2.4,  Skew: -0.1 },
      'Nonlinear ML':     { R2: 0.6,  SR: 0.47,  IRm: 0.31,  MaxLoss: 1.2,  Skew: 2.5  }
    },
    60: {
      'Linear ridgeless': { R2: -96.6, SR: 0.00, IRm: -0.07, MaxLoss: 35.8, Skew: -11.1 },
      'Linear ridge':     { R2: -0.5,  SR: 0.44, IRm: 0.10,  MaxLoss: 1.4,  Skew: -0.3  },
      'Nonlinear ML':     { R2: 0.5,   SR: 0.44, IRm: 0.25,  MaxLoss: 0.5,  Skew: 1.7   }
    },
    120: {
      'Linear ridgeless': { R2: -26.6, SR: 0.20, IRm: 0.14, MaxLoss: 15.4, Skew: -6.5 },
      'Linear ridge':     { R2: 0.1,   SR: 0.49, IRm: 0.13, MaxLoss: 0.8,  Skew: -0.9 },
      'Nonlinear ML':     { R2: 0.3,   SR: 0.41, IRm: 0.24, MaxLoss: 0.3,  Skew: 0.9  }
    }
  };

  const MODELS = ['Linear ridgeless', 'Linear ridge', 'Nonlinear ML'];
  const COLORS = { 'Linear ridgeless': '#9ca3af', 'Linear ridge': '#4e7ec4', 'Nonlinear ML': '#c4724e' };

  VIZ_REGISTRY['voc-comparison-table1'] = function (canvas, controls, params) {
    let T = parseInt(params.T || '12');
    let metric = params.metric || 'SR';   // SR | R2 | MaxLoss | Skew

    const tRow = document.createElement('div');
    tRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';
    const tLab = document.createElement('span');
    tLab.style.cssText = 'font-size:0.85em;color:var(--text-secondary);min-width:80px;';
    tLab.textContent = 'T (window)';
    tRow.appendChild(tLab);
    [12, 60, 120].forEach(tv => {
      const b = document.createElement('button');
      b.textContent = tv + 'mo';
      b.style.cssText = 'padding:3px 9px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (tv === T) { b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent(); }
      b.addEventListener('click', () => {
        tRow.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        T = tv; draw();
      });
      tRow.appendChild(b);
    });
    controls.appendChild(tRow);

    const mRow = document.createElement('div');
    mRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';
    const mLab = document.createElement('span');
    mLab.style.cssText = 'font-size:0.85em;color:var(--text-secondary);min-width:80px;';
    mLab.textContent = 'Metric';
    mRow.appendChild(mLab);
    [['SR', 'Sharpe'], ['R2', 'R²'], ['MaxLoss', 'Max Loss'], ['Skew', 'Skewness']].forEach(([m, label]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'padding:3px 9px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (m === metric) { b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent(); }
      b.addEventListener('click', () => {
        mRow.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        metric = m; draw();
      });
      mRow.appendChild(b);
    });
    controls.appendChild(mRow);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 92, padR = 24, padT = 26, padB = 60;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      const data = DATA[T];

      // Determine yMin/yMax based on metric
      let yMin, yMax, label, fmt;
      if (metric === 'SR') {
        yMin = -0.2; yMax = 0.6; label = 'Sharpe ratio (annualized)';
        fmt = (v) => v.toFixed(2);
      } else if (metric === 'R2') {
        yMin = -10; yMax = 5; label = 'OOS R² (%, clipped at -10%)';
        fmt = (v) => (v < -10 ? '<-100%' : v.toFixed(1) + '%');
      } else if (metric === 'MaxLoss') {
        // log scale-ish: use raw but cap
        yMin = 0; yMax = 12;
        label = 'Max Loss (SD units, cap 12)';
        fmt = (v) => v > 12 ? '>12' : v.toFixed(1);
      } else {
        yMin = -12; yMax = 5; label = 'Skewness';
        fmt = (v) => v.toFixed(1);
      }
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      // Y grid
      ctx.strokeStyle = '#e5ddd3';
      for (let i = 0; i <= 5; i++) {
        const py = padT + ih * i / 5;
        ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(padL + iw, py); ctx.stroke();
      }
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(metric === 'R2' ? yv.toFixed(0) + '%' : yv.toFixed(2), padL - 8, yToP(yv));
      }

      // Y label
      ctx.save();
      ctx.translate(22, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, label, 0, 0, { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // Zero line emphasis
      if (yMin < 0 && yMax > 0) {
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.moveTo(padL, yToP(0)); ctx.lineTo(padL + iw, yToP(0)); ctx.stroke();
      }

      // Bars (3 models)
      const barW = iw / MODELS.length * 0.55;
      MODELS.forEach((model, i) => {
        const cx = padL + (i + 0.5) / MODELS.length * iw;
        const val = data[model][metric];
        const valClipped = Math.max(yMin, Math.min(yMax, val));
        ctx.fillStyle = COLORS[model];
        const py0 = yToP(0);
        const py = yToP(valClipped);
        ctx.fillRect(cx - barW / 2, Math.min(py, py0), barW, Math.abs(py - py0));

        // Value label above bar
        ctx.fillStyle = U.text();
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(fmt(val), cx, py - 4);

        // X label
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const lines = model.split(' ');
        lines.forEach((line, li) => {
          ctx.fillText(line, cx, padT + ih + 6 + li * 12);
        });
      });

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
