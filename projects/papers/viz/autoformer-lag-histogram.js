/* viz: autoformer-lag-histogram
 * paper Figure 6 — learned lag distributions for 4 datasets.
 * Values approximate Fig 6 — paper does NOT publish exact histograms;
 * we encode the labeled peaks (Daily/Weekly/Monthly/Quarterly/Yearly) per dataset.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Figure 6 caption labels:
   * (a) Electricity (Hourly Recorded) — Daily, Weekly Period
   * (b) Exchange (Daily Recorded) — Monthly, Quarterly, Yearly Period
   * (c) Traffic (Hourly Recorded) — Daily (24h), Weekly (168h) Period
   * (d) Weather (10min Recorded) — Daily Period
   */
  const DATA = {
    Electricity: {
      title: 'Electricity (hourly)',
      peaks: [
        { lag: 24, label: 'Daily', height: 0.40 },
        { lag: 168, label: 'Weekly', height: 0.55 }
      ],
      range: [0, 350]
    },
    Exchange: {
      title: 'Exchange (daily)',
      peaks: [
        { lag: 22, label: 'Monthly', height: 0.45 },
        { lag: 66, label: 'Quarterly', height: 0.35 },
        { lag: 252, label: 'Yearly', height: 0.30 }
      ],
      range: [0, 350]
    },
    Traffic: {
      title: 'Traffic (hourly)',
      peaks: [
        { lag: 24, label: 'Daily', height: 0.55 },
        { lag: 168, label: 'Weekly', height: 0.40 }
      ],
      range: [0, 350]
    },
    Weather: {
      title: 'Weather (10min)',
      peaks: [
        { lag: 144, label: 'Daily', height: 0.50 }
      ],
      range: [0, 350]
    }
  };

  VIZ_REGISTRY['autoformer-lag-histogram'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Electricity';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(DATA).forEach(d => {
      const btn = document.createElement('button');
      btn.textContent = d;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (d === dataset) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        dataset = d; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 56, padR = 24, padT = 38, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const cfg = DATA[dataset];
      const [xMin, xMax] = cfg.range;
      const yMin = 0, yMax = 0.7;
      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* grid */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
      yTicks.forEach(yv => {
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = (yv === 0) ? 0.8 : 0.3; ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      yTicks.forEach(yv => ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv)));

      /* x ticks every 50 */
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let xv = 0; xv <= xMax; xv += 50) {
        ctx.fillText(String(xv), xToPix(xv), h - padB + 8);
      }
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.text();
      ctx.textBaseline = 'bottom';
      ctx.fillText('Lag τ', w/2, h - 8);

      /* y label */
      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Density (×10⁻³)', 0, 0);
      ctx.restore();

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Figure 6 · ${cfg.title} — learned lag distribution`, w/2, padT - 24);

      /* Draw gaussian-like peaks */
      const numPts = 350;
      const yVals = new Array(numPts).fill(0);
      cfg.peaks.forEach(p => {
        const sigma = Math.max(4, p.lag * 0.06);
        for (let i = 0; i < numPts; i++) {
          const x = xMin + (xMax - xMin) * i / (numPts - 1);
          const g = Math.exp(-Math.pow(x - p.lag, 2) / (2 * sigma * sigma));
          yVals[i] += p.height * g;
        }
      });
      /* baseline noise */
      for (let i = 0; i < numPts; i++) yVals[i] += 0.02 + 0.01 * Math.sin(i * 0.4);

      ctx.fillStyle = '#60a5fa';
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(xToPix(xMin), yToPix(0));
      for (let i = 0; i < numPts; i++) {
        const x = xMin + (xMax - xMin) * i / (numPts - 1);
        ctx.lineTo(xToPix(x), yToPix(yVals[i]));
      }
      ctx.lineTo(xToPix(xMax), yToPix(0));
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < numPts; i++) {
        const x = xMin + (xMax - xMin) * i / (numPts - 1);
        const xp = xToPix(x), yp = yToPix(yVals[i]);
        if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
      }
      ctx.stroke();

      /* peak labels */
      cfg.peaks.forEach(p => {
        const xp = xToPix(p.lag), yp = yToPix(p.height + 0.04);
        ctx.fillStyle = '#ef4444';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(p.label + ' (τ=' + p.lag + ')', xp, yp);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xp, yToPix(p.height));
        ctx.lineTo(xp, yToPix(p.height + 0.03));
        ctx.stroke();
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
