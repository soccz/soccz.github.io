/* viz: gu-r2-comparison - paper Table 3 OOS annualized Sharpe (long-short decile portfolios) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-r2-comparison'] = function (canvas, controls, params) {
    let weight = 'VW';
    let K = 5;
    U.addSelect(controls, {
      label: 'Weighting',
      options: [
        { value: 'VW', label: 'Value-weight (paper headline)' },
        { value: 'EW', label: 'Equal-weight' }
      ],
      value: 'VW',
      onChange: (v) => { weight = v; draw(); }
    });
    U.addSelect(controls, {
      label: 'Factors K',
      options: [
        { value: '1', label: 'K=1' },
        { value: '3', label: 'K=3' },
        { value: '5', label: 'K=5 (paper main)' },
        { value: '6', label: 'K=6' }
      ],
      value: '5',
      onChange: (v) => { K = parseInt(v); draw(); }
    });

    // paper Table 3 — exact values from JoE 2021 Table 3
    const T3 = {
      EW: {
        FF:   { 1: -0.66, 2: -0.85, 3: -0.40, 4: -0.30, 5:  0.36, 6: -0.21 },
        PCA:  { 1:  0.28, 2:  0.09, 3:  0.13, 4: -0.08, 5: -0.12, 6:  0.15 },
        IPCA: { 1:  0.20, 2:  0.19, 3:  1.26, 4:  2.16, 5:  2.31, 6:  2.25 },
        CA0:  { 1:  0.23, 2:  0.32, 3:  1.34, 4:  1.87, 5:  2.10, 6:  2.18 },
        CA1:  { 1:  0.30, 2:  0.39, 3:  2.12, 4:  2.63, 5:  2.67, 6:  2.60 },
        CA2:  { 1:  0.30, 2:  0.38, 3:  2.16, 4:  2.64, 5:  2.68, 6:  2.63 },
        CA3:  { 1:  0.31, 2:  0.38, 3:  2.19, 4:  2.57, 5:  2.57, 6:  2.59 }
      },
      VW: {
        FF:   { 1: -0.82, 2: -1.13, 3: -0.69, 4: -0.60, 5:  0.18, 6: -0.53 },
        PCA:  { 1:  0.12, 2: -0.18, 3:  0.05, 4: -0.10, 5: -0.30, 6: -0.08 },
        IPCA: { 1: -0.15, 2: -0.07, 3:  0.59, 4:  0.81, 5:  1.05, 6:  0.96 },
        CA0:  { 1: -0.11, 2: -0.03, 3:  0.41, 4:  0.81, 5:  0.83, 6:  0.88 },
        CA1:  { 1: -0.03, 2:  0.11, 3:  0.91, 4:  1.30, 5:  1.48, 6:  1.40 },
        CA2:  { 1: -0.03, 2:  0.08, 3:  0.92, 4:  1.39, 5:  1.45, 6:  1.53 },
        CA3:  { 1: -0.02, 2:  0.08, 3:  1.09, 4:  1.41, 5:  1.34, 6:  1.51 }
      }
    };

    const models = [
      { key: 'FF',   name: 'FF (linear)',    color: '#94a3b8' },
      { key: 'PCA',  name: 'PCA',            color: '#9ca3af' },
      { key: 'IPCA', name: 'IPCA',           color: '#0891b2' },
      { key: 'CA0',  name: 'CA0',            color: '#f59e0b' },
      { key: 'CA1',  name: 'CA1',            color: '#84cc16' },
      { key: 'CA2',  name: 'CA2',            color: '#22c55e' },
      { key: 'CA3',  name: 'CA3',            color: '#16a34a' }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`paper Table 3 — OOS Sharpe (${weight === 'VW' ? 'value-weight' : 'equal-weight'}, K=${K})`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const tab = T3[weight];
      const valsAll = models.map(m => tab[m.key][K]);
      const best = valsAll.reduce((acc, v, i) => v > acc.v ? { v, i } : acc, { v: -Infinity, i: -1 });
      ctx.fillText(`Best: ${models[best.i].name} (SR=${best.v.toFixed(2)}) — annualized long-short decile spread`, w/2, 40);

      const padL = 130, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const maxAbs = Math.max(...valsAll.map(Math.abs)) * 1.15;
      const zeroX = padL + plotW / 2;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = tab[m.key][K];
        const barLen = plotW / 2 * (Math.abs(v) / maxAbs);
        const x = v >= 0 ? zeroX : zeroX - barLen;
        const isBest = i === best.i;
        ctx.fillStyle = isBest ? '#dc2626' : m.color;
        ctx.fillRect(x, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name + (isBest ? ' ★' : ''), padL - 8, y + barH/2);

        ctx.fillStyle = v >= 0 ? '#fff' : U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = v >= 0 ? 'right' : 'left';
        if (barLen > 25) ctx.fillText(v.toFixed(2), v >= 0 ? x + barLen - 6 : x + 6, y + barH/2 + 3);
      });

      // Zero line
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(zeroX, padT - 4);
      ctx.lineTo(zeroX, padT + plotH + 4);
      ctx.stroke();

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Annualized OOS Sharpe ratio (negative ← 0 → positive)', padL + plotW/2, h - 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
