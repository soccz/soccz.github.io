/* viz: dlap-cumulative-returns
 * Chen-Pelger-Zhu (2021) paper Fig 7 재현 — decile portfolio cumulative excess return.
 * 10 deciles sorted on GAN β.
 *
 * Synthetic monthly returns calibrated to paper Table II avg returns + Fig 7 shape.
 * Time period: OOS Test 1992-2016 (300 months).
 */

(function () {
  const U = window.VIZ_UTIL;

  // paper Table II Test avg returns (%/month, 10 deciles)
  const AVG_TEST = [-0.02, 0.05, 0.08, 0.09, 0.12, 0.12, 0.15, 0.18, 0.21, 0.37];

  const COLORS = [
    '#9ca3af', '#6b7280', '#475569', '#3b82f6', '#60a5fa',
    '#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#10b981'
  ];

  // Deterministic monthly return path (mean = avg, with realistic vol + neg market shocks)
  function synthPath(mean, T, seed) {
    // simple LCG
    let s = seed;
    function rand() { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 0) / 4294967296; }
    // normal via Box-Muller (deterministic)
    function nrand() {
      const u1 = Math.max(rand(), 1e-9), u2 = rand();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }
    const vol = 5.5; // monthly std ~5.5% (typical equity)
    const path = [];
    let cum = 0;
    for (let t = 0; t < T; t++) {
      // Add bear-market shocks (2000-2002, 2008-2009 approximate)
      let shock = 0;
      if (t >= 96 && t <= 132) shock = -1.5;   // 2000-2002 dotcom (months 96-132 ≈ 2000-2003)
      if (t >= 192 && t <= 210) shock = -3.5;  // 2008-2009 GFC
      const r = mean + shock + vol * nrand();
      cum += r;
      path.push(cum);
    }
    return path;
  }

  VIZ_REGISTRY['dlap-cumulative-returns'] = function (canvas, controls, params) {
    let showAll = true;
    const visible = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    /* decile toggles */
    const wrap = document.createElement('label');
    const lab = document.createElement('span');
    lab.textContent = 'Decile';
    wrap.appendChild(lab);
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('button');
      b.textContent = (i + 1);
      const update = () => {
        if (visible.has(i)) {
          b.style.background = COLORS[i]; b.style.color = '#fff'; b.style.borderColor = COLORS[i];
        } else {
          b.style.background = 'var(--surface)'; b.style.color = 'var(--text-secondary)'; b.style.borderColor = 'var(--border)';
        }
      };
      b.style.cssText = 'margin-left:3px;padding:2px 7px;border-radius:5px;border:1px solid var(--border);cursor:pointer;font-family:inherit;font-size:0.74rem;';
      update();
      b.addEventListener('click', () => {
        if (visible.has(i)) visible.delete(i); else visible.add(i);
        update();
        draw();
      });
      wrap.appendChild(b);
    }
    controls.appendChild(wrap);

    /* preset toggle */
    const wrap2 = document.createElement('label');
    const lab2 = document.createElement('span'); lab2.textContent = 'Preset';
    wrap2.appendChild(lab2);
    ['All', 'Extremes (1,10)', 'Long-Short'].forEach(p => {
      const b = document.createElement('button');
      b.textContent = p;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      b.addEventListener('click', () => {
        visible.clear();
        if (p === 'All') { for (let i = 0; i < 10; i++) visible.add(i); }
        else if (p === 'Extremes (1,10)') { visible.add(0); visible.add(9); }
        else if (p === 'Long-Short') { /* special: only show LS line */ visible.add(-1); }
        // refresh decile buttons
        wrap.querySelectorAll('button').forEach((btn, idx) => {
          if (visible.has(idx)) {
            btn.style.background = COLORS[idx]; btn.style.color = '#fff'; btn.style.borderColor = COLORS[idx];
          } else {
            btn.style.background = 'var(--surface)'; btn.style.color = 'var(--text-secondary)'; btn.style.borderColor = 'var(--border)';
          }
        });
        draw();
      });
      wrap2.appendChild(b);
    });
    controls.appendChild(wrap2);

    const T = 300; // 25 years × 12

    // Compute paths once
    const paths = AVG_TEST.map((m, i) => synthPath(m, T, 42 + i * 7));
    // Long-short = decile 10 - decile 1
    const ls = paths[9].map((v, t) => v - paths[0][t]);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 70, padT = 40, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // y range based on visible deciles
      let yMin = Infinity, yMax = -Infinity;
      for (let i = 0; i < 10; i++) {
        if (visible.has(i)) {
          for (let t = 0; t < T; t++) {
            yMin = Math.min(yMin, paths[i][t]);
            yMax = Math.max(yMax, paths[i][t]);
          }
        }
      }
      if (visible.has(-1)) {
        for (let t = 0; t < T; t++) {
          yMin = Math.min(yMin, ls[t]);
          yMax = Math.max(yMax, ls[t]);
        }
      }
      if (!isFinite(yMin)) { yMin = -50; yMax = 150; }
      yMin = Math.floor(yMin / 50) * 50 - 20;
      yMax = Math.ceil(yMax / 50) * 50 + 20;

      const xToPix = (t) => padL + (t / (T - 1)) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const yStep = Math.max(50, Math.round((yMax - yMin) / 6 / 50) * 50);
      for (let yv = Math.ceil(yMin / yStep) * yStep; yv <= yMax; yv += yStep) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp); ctx.lineTo(padL + innerW, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* year labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 60, 120, 180, 240, 299].forEach(t => {
        const year = 1992 + Math.floor(t / 12);
        ctx.fillText(year, xToPix(t), h - padB + 6);
      });

      /* y labels */
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = Math.ceil(yMin / yStep) * yStep; yv <= yMax; yv += yStep) {
        ctx.fillText(yv.toFixed(0) + '%', padL - 8, yToPix(yv));
      }

      /* y label */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Cumulative Excess Return (sum of monthly %)', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('paper Fig 7 · GAN β-sorted decile portfolios · OOS 1992–2016', w / 2, padT - 26);

      /* paths */
      const drawPath = (path, color, lw, label) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const x = xToPix(t), y = yToPix(path[t]);
          if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      for (let i = 0; i < 10; i++) {
        if (visible.has(i)) drawPath(paths[i], COLORS[i], i === 0 || i === 9 ? 2.0 : 1.2);
      }
      if (visible.has(-1)) drawPath(ls, '#ef4444', 2.4);

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(padL + innerW, h - padB);
      ctx.stroke();

      /* legend (right side, last visible) */
      let ly = padT + 4;
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      for (let i = 9; i >= 0; i--) {
        if (!visible.has(i)) continue;
        ctx.fillStyle = COLORS[i];
        ctx.fillRect(padL + innerW + 8, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText('D' + (i + 1), padL + innerW + 22, ly + 1);
        ly += 16;
        if (ly > h - padB) break;
      }
      if (visible.has(-1)) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(padL + innerW + 8, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText('L-S (D10-D1)', padL + innerW + 22, ly + 1);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
