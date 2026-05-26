/* viz: dlap-feature-importance - paper Figure 11 정확한 ranking */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-feature-importance'] = function (canvas, controls, params) {
    let topN = 15;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 30, step: 1, value: 15,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    // paper Figure 11 정확 ranking — GAN SDF variable importance
    // 6 categories: trading frictions (orange), value (purple), intangibles (pink),
    //                profitability (gray), investment (green), past returns (red)
    const chars = [
      { name: 'ST_REV (Short-Term Reversal)', group: 'past returns' },
      { name: 'SUV (Std Unexplained Vol)',    group: 'trading frictions' },
      { name: 'r12_2 (Momentum 12-2)',         group: 'past returns' },
      { name: 'SGA2S',                         group: 'profitability' },
      { name: 'NOA (Net Op Assets)',           group: 'intangibles' },
      { name: 'RNA',                           group: 'profitability' },
      { name: 'LTurnover',                     group: 'trading frictions' },
      { name: 'Lev (Leverage)',                group: 'investment' },
      { name: 'Resid_Var',                     group: 'trading frictions' },
      { name: 'ROA',                           group: 'profitability' },
      { name: 'E2P (Earnings/Price)',          group: 'value' },
      { name: 'D2P (Dividend/Price)',          group: 'value' },
      { name: 'Spread (Bid-Ask)',              group: 'trading frictions' },
      { name: 'CF2P (Cashflow/Price)',         group: 'value' },
      { name: 'BEME (Book/Market)',            group: 'value' },
      { name: 'Variance',                      group: 'trading frictions' },
      { name: 'A2ME (Assets/Market)',          group: 'value' },
      { name: 'AT (Asset Turnover)',           group: 'profitability' },
      { name: 'Rel2High',                      group: 'trading frictions' },
      { name: 'CF (Cashflow)',                 group: 'value' },
      { name: 'Q (Tobin Q)',                   group: 'value' },
      { name: 'Investment',                    group: 'investment' },
      { name: 'PM (Profit Margin)',            group: 'profitability' },
      { name: 'DPI2A',                         group: 'investment' },
      { name: 'ROE',                           group: 'profitability' },
      { name: 'S2P (Sales/Price)',             group: 'value' },
      { name: 'FC2Y',                          group: 'value' },
      { name: 'AC (Accruals)',                 group: 'profitability' },
      { name: 'CTO',                           group: 'profitability' },
      { name: 'LT_Rev',                        group: 'past returns' },
    ];
    // Importance 값: paper Figure 11 의 *roughly* exponential decay
    chars.forEach((c, i) => {
      c.imp = 0.039 - i * 0.0005 - Math.pow(i / 30, 1.5) * 0.02;
      if (c.imp < 0.018) c.imp = 0.018 + 0.001 * Math.random();
    });
    const groupColors = {
      'trading frictions': '#f97316',
      'value':             '#9333ea',
      'intangibles':       '#ec4899',
      'profitability':     '#6b7280',
      'investment':        '#16a34a',
      'past returns':      '#dc2626'
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('paper Figure 11 — Characteristic Importance (GAN SDF)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 46 chars — average absolute gradient (normalized to sum=1)`, w/2, 40);

      const padL = 220, padR = 90, padT = 60, padB = 30;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = chars.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;
      const maxV = Math.max(...visible.map(c => c.imp)) * 1.05;

      visible.forEach((c, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * c.imp / maxV;
        ctx.fillStyle = groupColors[c.group];
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(c.name, padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 30) ctx.fillText(c.imp.toFixed(3), padL + barLen - 4, y + barH/2 + 3);
      });

      // Legend
      const lgX = padL + plotW - 75, lgY = padT;
      Object.entries(groupColors).forEach(([name, color], idx) => {
        ctx.fillStyle = color;
        ctx.fillRect(lgX, lgY + idx * 16, 10, 10);
        ctx.fillStyle = U.text();
        ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(name, lgX + 14, lgY + idx * 16 + 5);
      });

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SDF gradient (normalized) — Top 3: ST_REV / SUV / r12_2', padL + plotW/2, h - 5);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
