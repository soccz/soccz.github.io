/* viz: autoencoder-table5-robustness
 * paper Table 5 재현 — Odd/Even permno robustness check (CA2, K=5).
 * Gu, Kelly, Xiu (2021), Section 3.7.
 *
 * 핵심 메시지: 학습/평가 sample 완전 분리해도 성능 거의 동일 → cross-section generalizability.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Table 5 정확한 수치 */
  const DATA = {
    'Total R² (%)':  { 'Odd→Odd': 13.7, 'Odd→Even': 13.6, 'Even→Odd': 13.6, 'Even→Even': 13.5 },
    'Pred R² (%)':   { 'Odd→Odd': 0.48, 'Odd→Even': 0.49, 'Even→Odd': 0.52, 'Even→Even': 0.54 },
    'EW SR':         { 'Odd→Odd': 2.42, 'Odd→Even': 2.38, 'Even→Odd': 2.52, 'Even→Even': 2.53 },
    'VW SR':         { 'Odd→Odd': 1.28, 'Odd→Even': 1.26, 'Even→Odd': 1.29, 'Even→Even': 1.19 }
  };

  const METRICS = Object.keys(DATA);
  const SCENARIOS = ['Odd→Odd', 'Odd→Even', 'Even→Odd', 'Even→Even'];

  /* metric별 색 */
  const METRIC_COLOR = {
    'Total R² (%)': '#4e7ec4',
    'Pred R² (%)':  '#c4724e',
    'EW SR':        '#10b981',
    'VW SR':        '#ef4444'
  };

  VIZ_REGISTRY['autoencoder-table5-robustness'] = function (canvas, controls, params) {
    let metric = params.metric || 'Total R² (%)';

    /* metric 버튼 */
    const wrap = document.createElement('label');
    const lab = document.createElement('span');
    lab.textContent = '지표';
    wrap.appendChild(lab);
    METRICS.forEach(m => {
      const b = document.createElement('button');
      b.textContent = m;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.78rem;';
      if (m === metric) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        wrap.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        metric = m; draw();
      });
      wrap.appendChild(b);
    });
    controls.appendChild(wrap);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 96, padR = 36, padT = 48, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const data = DATA[metric];
      const values = SCENARIOS.map(s => data[s]);
      const minV = Math.min(...values);
      const maxV = Math.max(...values);
      const range = maxV - minV;
      const yMin = minV - range * 0.5 - 0.01;
      const yMax = maxV + range * 0.5 + 0.01;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`CA2 (K=5) Cross-Section Robustness · ${metric}`, w / 2, padT - 34);

      /* subtitle */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('학습 → 평가  permno 분할 (4 cases)', w / 2, padT - 18);

      /* gridlines */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const yp = padT + (innerH * i) / 4;
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = 0.25;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* y labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const yv = yMin + ((yMax - yMin) * (4 - i)) / 4;
        const yp = padT + (innerH * i) / 4;
        ctx.fillText(yv.toFixed(2), padL - 8, yp);
      }

      /* bars */
      const color = METRIC_COLOR[metric];
      const barW = innerW / SCENARIOS.length * 0.55;
      SCENARIOS.forEach((s, i) => {
        const cx = padL + (innerW / SCENARIOS.length) * (i + 0.5);
        const v = data[s];
        const top = yToPix(v);
        const bot = yToPix(yMin);

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(cx - barW / 2, top, barW, bot - top);
        ctx.globalAlpha = 1;

        /* 값 */
        ctx.fillStyle = U.text();
        ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(2), cx, top - 10);

        /* x label */
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(s, cx, h - padB + 8);
      });

      /* sub label: 학습/평가 */
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('(학습 → 평가)', padL + 4, h - padB + 24);

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();

      /* variation annotation */
      const variation = maxV - minV;
      const variationPct = (variation / ((maxV + minV) / 2)) * 100;
      ctx.fillStyle = U.accent();
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(`Variation: ${variation.toFixed(2)} (${variationPct.toFixed(1)}%) → 거의 동일`, w - padR, padT - 12);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
