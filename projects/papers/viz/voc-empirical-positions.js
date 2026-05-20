/* viz: voc-empirical-positions
 * Kelly-Malamud-Zhou (JF 2024) Figure 10 — Market timing positions + NBER recessions.
 * Hardcoded NBER recession dates (15 in test sample 1930-2020).
 * Position time series approximated from paper Figure 10 visual pattern.
 */

(function () {
  const U = window.VIZ_UTIL;

  // NBER recession dates (start year + duration in months)
  // Reference: NBER Business Cycle Dating Committee
  const NBER_RECESSIONS = [
    [1929, 8, 43],   // Great Depression (Aug 1929 - Mar 1933)
    [1937, 5, 13],   // 1937 recession
    [1945, 2, 8],    // 1945 (exception in paper)
    [1948, 11, 11],  // 1948-49
    [1953, 7, 10],   // 1953-54
    [1957, 8, 8],    // 1957-58
    [1960, 4, 10],   // 1960-61
    [1969, 12, 11],  // 1969-70
    [1973, 11, 16],  // 1973-75 oil shock
    [1980, 1, 6],    // 1980
    [1981, 7, 16],   // 1981-82
    [1990, 7, 8],    // 1990-91
    [2001, 3, 8],    // dot-com bust
    [2007, 12, 18],  // GFC
    [2020, 2, 2]     // COVID
  ];

  // Generate synthetic positions matching paper Figure 10
  // Method: large positive bias + dips around recessions
  function generatePositions(T, seed) {
    const start = 1930;
    const n = 91 * 12;  // 1930-2020 (~91 years)
    const pos = new Array(n);
    // Use simple LCG for deterministic randomness
    let rng = seed;
    function rand() { rng = (rng * 1664525 + 1013904223) % 4294967296; return rng / 4294967296; }
    const Tscale = T === 12 ? 1.0 : (T === 60 ? 0.3 : 0.15);

    for (let i = 0; i < n; i++) {
      const yr = start + i / 12;
      // Base position with noise
      let p = 0.05 + 0.04 * (rand() - 0.5) * Tscale;
      // Recession dip
      for (const [ry, rm, rd] of NBER_RECESSIONS) {
        const rStart = (ry - start) * 12 + rm - 1;
        const rEnd = rStart + rd;
        // Drop position 6-12 months before recession
        if (i >= rStart - 12 && i <= rEnd + 3) {
          // 1945 exception — do NOT divest
          if (ry === 1945) continue;
          const dist = Math.min(Math.abs(i - rStart), Math.abs(i - rEnd));
          const drop = 0.4 * Math.exp(-dist / 8) * Tscale;
          p -= drop;
        }
      }
      // Add some pre-1970 higher volatility (paper subsample finding)
      if (yr < 1968) p += 0.05 * (rand() - 0.3) * Tscale;
      pos[i] = p;
    }
    // 6-month moving average for readability
    const smoothed = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0, cnt = 0;
      for (let j = Math.max(0, i - 5); j <= Math.min(n - 1, i); j++) {
        sum += pos[j]; cnt++;
      }
      smoothed[i] = sum / cnt;
    }
    return smoothed;
  }

  VIZ_REGISTRY['voc-empirical-positions'] = function (canvas, controls, params) {
    let T = parseInt(params.T || '12');

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

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 48, padR = 24, padT = 26, padB = 44;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      const startYr = 1930, endYr = 2020;
      const yMin = -0.2, yMax = 0.6;
      const xToP = (yr) => padL + (yr - startYr) / (endYr - startYr) * iw;
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      // Draw NBER recession bars (gray)
      ctx.fillStyle = 'rgba(180, 180, 180, 0.35)';
      for (const [ry, rm, rd] of NBER_RECESSIONS) {
        const x1 = xToP(ry + (rm - 1) / 12);
        const x2 = xToP(ry + (rm - 1 + rd) / 12);
        ctx.fillRect(x1, padT, Math.max(2, x2 - x1), ih);
      }

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 4);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (const y of [-0.2, 0, 0.2, 0.4, 0.6]) {
        ctx.fillText(y.toFixed(1), padL - 8, yToP(y));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (const yr of [1930, 1950, 1970, 1990, 2010]) {
        ctx.fillText(yr.toString(), xToP(yr), padT + ih + 6);
      }
      U.text(ctx, 'Year', w / 2, h - 8, { align: 'center', size: 12, color: U.text() });
      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, `Timing position π̂ (T=${T})`, 0, 0, { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // Zero line
      ctx.strokeStyle = '#999';
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(padL, yToP(0)); ctx.lineTo(padL + iw, yToP(0)); ctx.stroke();
      ctx.setLineDash([]);

      // Position curve
      const positions = generatePositions(T, T * 12345);
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < positions.length; i++) {
        const yr = startYr + i / 12;
        let p = Math.max(yMin, Math.min(yMax, positions[i]));
        const px = xToP(yr), py = yToP(p);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Annotation
      ctx.fillStyle = U.text();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Gray = NBER recessions (15 total)', padL + 8, padT + 14);
      ctx.fillText('14/15 → divest before recession', padL + 8, padT + 28);

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
