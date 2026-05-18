/* viz: dlap-lstm-states
 * Chen-Pelger-Zhu (2021) paper Fig 13 재현 — 4 LSTM hidden states + NBER recession bands.
 *
 * Time period: 1967–2016 (50 years, 600 months).
 * NBER recessions (US): 1969/12-1970/11, 1973/11-1975/3, 1980/1-1980/7, 1981/7-1982/11,
 * 1990/7-1991/3, 2001/3-2001/11, 2007/12-2009/6.
 *
 * State paths are synthetic but exhibit the cyclical + recession-peaking pattern paper describes.
 */

(function () {
  const U = window.VIZ_UTIL;

  const T = 600; // 50 years × 12 months, starts 1967/1
  const START_YEAR = 1967;

  // NBER recessions in (start_month_index, end_month_index)
  const NBER = [
    [35, 46],   // 1969/12-1970/11
    [82, 98],   // 1973/11-1975/3
    [156, 162], // 1980/1-1980/7
    [174, 190], // 1981/7-1982/11
    [282, 290], // 1990/7-1991/3
    [410, 418], // 2001/3-2001/11
    [491, 509]  // 2007/12-2009/6
  ];

  function isRecession(t) {
    return NBER.some(([s, e]) => t >= s && t <= e);
  }

  function genState(amp, freq, phase, recAmp, seed) {
    let s = seed;
    function rand() { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 0) / 4294967296; }
    function nrand() {
      return Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-9))) * Math.cos(2 * Math.PI * rand());
    }
    const path = new Array(T);
    let smooth = 0;
    for (let t = 0; t < T; t++) {
      const cyc = amp * Math.sin(freq * t + phase);
      const rec = isRecession(t) ? recAmp : 0;
      const noise = 0.2 * nrand();
      const target = cyc + rec + noise;
      smooth = 0.7 * smooth + 0.3 * target;
      path[t] = smooth;
    }
    return path;
  }

  // 4 states: paper Fig 13 shows state 3, 4 peak during recessions
  const STATES = {
    'State 1': { color: '#3b82f6', path: genState(0.6, 0.04, 0.0, 0.3, 11) },
    'State 2': { color: '#10b981', path: genState(0.5, 0.05, 1.5, 0.2, 22) },
    'State 3': { color: '#f59e0b', path: genState(0.4, 0.03, 0.5, 0.9, 33) },  // strong recession peak
    'State 4': { color: '#ef4444', path: genState(0.3, 0.025, 2.0, 1.1, 44) }   // strongest recession peak
  };

  VIZ_REGISTRY['dlap-lstm-states'] = function (canvas, controls, params) {
    const visible = new Set(Object.keys(STATES));

    /* state toggles */
    const wrap = document.createElement('label');
    const lab = document.createElement('span'); lab.textContent = 'States';
    wrap.appendChild(lab);
    Object.entries(STATES).forEach(([name, s]) => {
      const b = document.createElement('button');
      b.textContent = name;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      const update = () => {
        if (visible.has(name)) {
          b.style.background = s.color; b.style.color = '#fff'; b.style.borderColor = s.color;
        } else {
          b.style.background = 'var(--surface)'; b.style.color = 'var(--text-secondary)'; b.style.borderColor = 'var(--border)';
        }
      };
      update();
      b.addEventListener('click', () => {
        if (visible.has(name)) visible.delete(name); else visible.add(name);
        update();
        draw();
      });
      wrap.appendChild(b);
    });
    controls.appendChild(wrap);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 50, padR = 90, padT = 40, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = -1.6, yMax = 2.2;
      const xToPix = (t) => padL + (t / (T - 1)) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* NBER recession shading */
      ctx.fillStyle = 'rgba(156, 163, 175, 0.25)';
      NBER.forEach(([s, e]) => {
        const x1 = xToPix(s), x2 = xToPix(e);
        ctx.fillRect(x1, padT, x2 - x1, innerH);
      });

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let yv = -1; yv <= 2; yv += 0.5) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp); ctx.lineTo(padL + innerW, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.25;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* x year labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 120, 240, 360, 480, 599].forEach(t => {
        const year = START_YEAR + Math.floor(t / 12);
        ctx.fillText(year, xToPix(t), h - padB + 6);
      });

      /* y labels */
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = -1; yv <= 2; yv += 1) {
        ctx.fillText(yv.toFixed(0), padL - 6, yToPix(yv));
      }

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('paper Fig 13 · 4 LSTM hidden states + NBER recessions (gray)', w / 2, padT - 26);

      /* lines */
      Object.entries(STATES).forEach(([name, s]) => {
        if (!visible.has(name)) return;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const x = xToPix(t), y = yToPix(s.path[t]);
          if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h - padB); ctx.lineTo(padL + innerW, h - padB);
      ctx.stroke();

      /* legend */
      let ly = padT + 4;
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      Object.entries(STATES).forEach(([name, s]) => {
        if (!visible.has(name)) return;
        ctx.fillStyle = s.color;
        ctx.fillRect(padL + innerW + 8, ly - 4, 10, 10);
        ctx.fillStyle = U.text();
        ctx.fillText(name, padL + innerW + 22, ly + 1);
        ly += 16;
      });
      ctx.fillStyle = 'rgba(156, 163, 175, 0.6)';
      ctx.fillRect(padL + innerW + 8, ly + 6 - 4, 10, 10);
      ctx.fillStyle = U.text();
      ctx.fillText('NBER recession', padL + innerW + 22, ly + 7);

      /* note */
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText('States 3, 4 peak during recessions', w - padR, padT - 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
