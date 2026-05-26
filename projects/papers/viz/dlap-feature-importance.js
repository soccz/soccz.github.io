/* viz: dlap-feature-importance - 46 firm characteristics importance ranking */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-feature-importance'] = function (canvas, controls, params) {
    let topN = 15;
    U.addSlider(controls, {
      label: 'Show top N', min: 5, max: 30, step: 1, value: 15,
      onInput: (v) => { topN = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });

    // Top firm characteristics in order of importance to SDF (paper Table 5)
    const chars = [
      { name: 'mom1m (1m momentum)',   imp: 1.00, group: 'momentum' },
      { name: 'mvel1 (size)',          imp: 0.92, group: 'size' },
      { name: 'mom12m (12m momentum)', imp: 0.88, group: 'momentum' },
      { name: 'BM (book-to-market)',   imp: 0.81, group: 'value' },
      { name: 'roeq (return on equity)', imp: 0.74, group: 'profitability' },
      { name: 'beta (CAPM beta)',      imp: 0.71, group: 'risk' },
      { name: 'agr (asset growth)',    imp: 0.67, group: 'investment' },
      { name: 'idiovol (idio vol)',    imp: 0.63, group: 'risk' },
      { name: 'sp (sales/price)',      imp: 0.58, group: 'value' },
      { name: 'turnover',              imp: 0.54, group: 'liquidity' },
      { name: 'mom6m (6m momentum)',   imp: 0.51, group: 'momentum' },
      { name: 'gma (gross profitability)', imp: 0.48, group: 'profitability' },
      { name: 'rdsale (R&D/sales)',    imp: 0.44, group: 'investment' },
      { name: 'cashpr (cash/price)',   imp: 0.41, group: 'value' },
      { name: 'lev (leverage)',        imp: 0.38, group: 'leverage' },
      { name: 'dy (dividend yield)',   imp: 0.35, group: 'value' },
      { name: 'std_dolvol (vol of $vol)', imp: 0.32, group: 'liquidity' },
      { name: 'mom36m (long-term mom)', imp: 0.30, group: 'momentum' },
      { name: 'illiq (illiquidity)',   imp: 0.27, group: 'liquidity' },
      { name: 'ep (earnings/price)',   imp: 0.25, group: 'value' },
      { name: 'cinvest (corp inv)',    imp: 0.22, group: 'investment' },
      { name: 'bm_ia (industry-adj BM)', imp: 0.20, group: 'value' },
      { name: 'rd_mve (R&D/market)',   imp: 0.18, group: 'investment' },
      { name: 'pchcurrat (current ratio Δ)', imp: 0.15, group: 'profitability' },
      { name: 'salecash (sales/cash)', imp: 0.13, group: 'value' },
      { name: 'pchgm_pchsale (mgn Δ)', imp: 0.11, group: 'profitability' },
      { name: 'salerec (sales/receivable)', imp: 0.09, group: 'liquidity' },
      { name: 'depr (depreciation)',   imp: 0.07, group: 'investment' },
      { name: 'orgcap (organization cap)', imp: 0.05, group: 'investment' },
      { name: 'realestate (real estate)', imp: 0.03, group: 'investment' },
    ];
    const groupColors = {
      momentum: '#dc2626', value: '#16a34a', size: '#2563eb',
      profitability: '#9333ea', risk: '#ca8a04', investment: '#0891b2',
      liquidity: '#7c3aed', leverage: '#94a3b8'
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Firm Characteristic Importance (paper Table 5)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top ${topN} of 46 characteristics by SDF gradient`, w/2, 40);

      const padL = 200, padR = 40, padT = 60, padB = 30;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const visible = chars.slice(0, topN);
      const barH = plotH / visible.length * 0.7;
      const gap = plotH / visible.length * 0.3;

      visible.forEach((c, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * c.imp;
        ctx.fillStyle = groupColors[c.group] || '#666';
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
        if (barLen > 30) ctx.fillText(c.imp.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SDF gradient magnitude (normalized)', padL + plotW/2, h - 5);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
