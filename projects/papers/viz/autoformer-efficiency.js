/* viz: autoformer-efficiency
 * paper Figure 7 — Memory & Time vs predict length.
 * Trend curves reconstructed from paper Fig 7 (values approximate paper bands, exact wall-clock missing).
 */

(function () {
  const U = window.VIZ_UTIL;

  /* Approximated from paper Fig 7 (a) Memory (GB) — input fixed 96, output 192..3072 */
  const MEMORY = {
    AutoCorr:   [[192,0.6],[384,1.0],[768,1.6],[1536,2.7],[3072,4.8]],
    Full:       [[192,1.0],[384,2.4],[768,7.5],[1536,15.5],[3072,null]],
    LSH:        [[192,0.9],[384,1.6],[768,3.2],[1536,5.8],[3072,10.5]],
    ProbSparse: [[192,0.7],[384,1.2],[768,2.0],[1536,3.4],[3072,6.5]]
  };

  /* (b) Time (ms) — input fixed 96, output 512..8192, 10^3 runs avg per step */
  const TIME = {
    AutoCorr:   [[512,2],[1024,4],[2048,8],[4096,16],[8192,32]],
    Full:       [[512,5],[1024,18],[2048,38],[4096,null],[8192,null]],
    LSH:        [[512,4],[1024,10],[2048,22],[4096,46],[8192,null]],
    ProbSparse: [[512,3],[1024,7],[2048,15],[4096,32],[8192,68]]
  };

  const MECHS = ['AutoCorr','Full','LSH','ProbSparse'];
  const LABELS = { AutoCorr:'Auto-Corr (Autoformer)', Full:'Full (Transformer)', LSH:'LSH (Reformer)', ProbSparse:'ProbSparse (Informer)' };
  const COLORS = { AutoCorr:'#ef4444', Full:'#60a5fa', LSH:'#10b981', ProbSparse:'#a78bfa' };

  VIZ_REGISTRY['autoformer-efficiency'] = function (canvas, controls, params) {
    let mode = params.mode || 'memory';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Metric';
    wb.appendChild(lb);
    [['memory','Memory (GB)'],['time','Time per step (ms)']].forEach(([k, ttl]) => {
      const btn = document.createElement('button');
      btn.textContent = ttl;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (k === mode) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        mode = k; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const DATA = mode === 'memory' ? MEMORY : TIME;
      const allX = [], allY = [];
      MECHS.forEach(m => DATA[m].forEach(p => { allX.push(p[0]); if (p[1] != null) allY.push(p[1]); }));
      const xMin = Math.min(...allX), xMax = Math.max(...allX);
      const yMin = 0, yMax = Math.max(...allY) * 1.15;
      const xToPix = (x) => padL + (Math.log2(x) - Math.log2(xMin)) / (Math.log2(xMax) - Math.log2(xMin)) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 6;
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        ctx.fillText(yv.toFixed(1), padL - 8, yToPix(yv));
      }

      /* x-axis log ticks */
      const xTicks = mode === 'memory' ? [192,384,768,1536,3072] : [512,1024,2048,4096,8192];
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      xTicks.forEach(xv => ctx.fillText(String(xv), xToPix(xv), h - padB + 8));

      /* axis labels */
      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(mode === 'memory' ? 'Memory (GB)' : 'Time per step (ms)', 0, 0);
      ctx.restore();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('Output Length (log scale)', w/2, h - 8);

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Figure 7 · ${mode === 'memory' ? 'Memory' : 'Time'} efficiency (input=96)`, w/2, padT - 24);

      /* curves */
      MECHS.forEach(m => {
        ctx.strokeStyle = COLORS[m];
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        let first = true;
        DATA[m].forEach(p => {
          if (p[1] == null) return;
          const xp = xToPix(p[0]);
          const yp = yToPix(p[1]);
          if (first) { ctx.moveTo(xp, yp); first = false; }
          else ctx.lineTo(xp, yp);
        });
        ctx.stroke();
        DATA[m].forEach(p => {
          if (p[1] == null) return;
          ctx.beginPath();
          ctx.arc(xToPix(p[0]), yToPix(p[1]), 3.5, 0, 2*Math.PI);
          ctx.fillStyle = COLORS[m]; ctx.fill();
        });
      });

      /* legend */
      const lgY = padT - 6;
      let lgX = padL;
      MECHS.forEach(m => {
        ctx.fillStyle = COLORS[m];
        ctx.fillRect(lgX, lgY, 12, 10);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(LABELS[m], lgX + 16, lgY + 5);
        lgX += 140;
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
