/* viz: voc-empirical-sharpe
 * Kelly-Malamud-Zhou (JF 2024) Figure 8 — 실증 OOS Sharpe / Alpha / IR / t-stat (T=12).
 * Hardcoded values approximating paper's plot.
 */

(function () {
  const U = window.VIZ_UTIL;

  // Approximate empirical SR curves (read from paper Figure 8 Panel A)
  // x-axis: c = P/T, c in [0, 1000]. We use cBreak = 50 then 990, 1000.
  // For each z, SR(c) — monotone increasing with mild c=1 dip for ridgeless.
  function srEmpirical(c, logZ, T) {
    // Calibrated to paper Figure 8/9
    // Tbase parameter: T=12 has higher Sharpe, T=120 lower (Figure 9)
    const Tscale = T === 12 ? 1.0 : (T === 60 ? 0.9 : 0.85);
    // Rough functional form: SR ≈ SRmax · (1 - exp(-c/scale))
    // Heavy shrinkage (z=10^3) reaches Sharpe ~0.4-0.5 quickly.
    // Light shrinkage (z=10^{-3}) has dip at c=1.
    const z = Math.pow(10, logZ);
    const baseSR = 0.43 * Tscale;
    const scale = 5 + Math.log10(z + 1);
    let sr;
    if (logZ <= -1.5 && Math.abs(c - 1) < 1.5) {
      // Ridgeless dip
      const dip = 0.15 * Math.exp(-Math.pow(c - 1, 2) * 4);
      sr = baseSR * (1 - Math.exp(-c / scale)) - dip;
    } else {
      sr = baseSR * (1 - Math.exp(-c / scale));
    }
    return Math.max(0, sr);
  }

  function alphaEmpirical(c, logZ, T) {
    // Roughly Sharpe × 0.05 (paper)
    return srEmpirical(c, logZ, T) * 0.055;
  }

  function irEmpirical(c, logZ, T) {
    // Roughly Sharpe × 0.7
    return srEmpirical(c, logZ, T) * 0.7;
  }

  function tStatEmpirical(c, logZ, T) {
    // t-stat = IR × √(years) where years ≈ 90.  t ≈ IR × 9.5
    return irEmpirical(c, logZ, T) * 9.5;
  }

  VIZ_REGISTRY['voc-empirical-sharpe'] = function (canvas, controls, params) {
    let metric = params.metric || 'SR';   // SR | Alpha | IR | t
    let logZ = parseFloat(params.logZ || '0');
    let T = parseInt(params.T || '12');

    // metric toggle
    const metricRow = document.createElement('div');
    metricRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';
    const lab = document.createElement('span');
    lab.style.cssText = 'font-size:0.85em;color:var(--text-secondary);min-width:70px;';
    lab.textContent = 'Metric';
    metricRow.appendChild(lab);
    ['SR', 'Alpha', 'IR', 't-stat'].forEach(m => {
      const b = document.createElement('button');
      b.textContent = m;
      b.style.cssText = 'padding:3px 9px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if ((m === 'SR' && metric === 'SR') || (m === 'Alpha' && metric === 'Alpha') || (m === 'IR' && metric === 'IR') || (m === 't-stat' && metric === 't')) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        metricRow.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        metric = m === 't-stat' ? 't' : m;
        draw();
      });
      metricRow.appendChild(b);
    });
    controls.appendChild(metricRow);

    // T toggle
    const tRow = document.createElement('div');
    tRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';
    const tLab = document.createElement('span');
    tLab.style.cssText = 'font-size:0.85em;color:var(--text-secondary);min-width:70px;';
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

    U.addSlider(controls, {
      label: 'log₁₀(z)', min: -3, max: 3, step: 0.25, value: logZ,
      onInput: (v) => { logZ = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 32, padT = 26, padB = 44;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      const cMin = 0.1, cMax = T === 12 ? 50 : (T === 60 ? 12 : 8);
      let yMin = 0, yMax = 0.5;
      let valueFn;
      let yLabel;
      if (metric === 'SR') {
        valueFn = (c) => srEmpirical(c, logZ, T);
        yMax = 0.5; yLabel = 'Sharpe ratio (annualized)';
      } else if (metric === 'Alpha') {
        valueFn = (c) => alphaEmpirical(c, logZ, T);
        yMax = 0.04; yLabel = 'Alpha (monthly)';
      } else if (metric === 'IR') {
        valueFn = (c) => irEmpirical(c, logZ, T);
        yMax = 0.35; yLabel = 'IR vs market';
      } else {
        valueFn = (c) => tStatEmpirical(c, logZ, T);
        yMax = 3.5; yLabel = 'Alpha t-statistic';
      }
      const xToP = (c) => padL + (c - cMin) / (cMax - cMin) * iw;
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const y = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(y.toFixed(2), padL - 8, yToP(y));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 5; i++) {
        const c = cMin + (cMax - cMin) * i / 5;
        ctx.fillText(c.toFixed(1), xToP(c), padT + ih + 6);
      }
      U.text(ctx, `c = P/T  (T = ${T})`, w / 2, h - 8, { align: 'center', size: 12, color: U.text() });
      ctx.save();
      ctx.translate(16, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, yLabel, 0, 0, { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // c=1 marker
      if (1 >= cMin && 1 <= cMax) {
        ctx.strokeStyle = '#999';
        ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(xToP(1), padT); ctx.lineTo(xToP(1), padT + ih); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#666';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('c = 1', xToP(1), padT - 2);
      }

      // SR curve
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      const N = 400;
      for (let i = 0; i <= N; i++) {
        const c = cMin + (cMax - cMin) * i / N;
        let y = valueFn(c);
        y = Math.max(yMin, Math.min(yMax, y));
        const px = xToP(c), py = yToP(y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

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
