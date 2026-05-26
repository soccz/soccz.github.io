/* viz: chen-sharpe-comparison - paper Table I monthly SR + annualized */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chen-sharpe-comparison'] = function (canvas, controls, params) {
    let view = 'monthly';
    U.addSelect(controls, {
      label: 'Sharpe scale',
      options: [
        { value: 'monthly', label: 'Monthly (paper Table I)' },
        { value: 'annual',  label: 'Annualized (×√12)' }
      ],
      value: 'monthly',
      onChange: (v) => { view = v; draw(); }
    });

    // paper Table I — monthly SR, EV, XS-R² for SDF models (test sample)
    const monthly = [
      { name: 'LS (least squares)', sr: 0.42, color: '#94a3b8' },
      { name: 'FFN (no no-arbitrage)', sr: 0.44, color: '#9333ea' },
      { name: 'EN (elastic net)', sr: 0.50, color: '#0891b2' },
      { name: 'GAN (Chen-Pelger-Zhu) ★', sr: 0.75, color: '#dc2626' }
    ];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('paper Table I — SDF Sharpe Ratio (test sample)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const annNote = view === 'annual' ? 'Annualized via ×√12 (≈3.46) — GAN ≈ 2.60' : 'Monthly Sharpe ratio (paper convention)';
      ctx.fillText(annNote, w/2, 40);

      const mult = view === 'annual' ? Math.sqrt(12) : 1;
      const models = monthly.map(m => ({ ...m, sharpe: m.sr * mult }));

      const padL = 200, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const maxV = Math.max(...models.map(m => m.sharpe)) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * (m.sharpe / maxV);
        ctx.fillStyle = m.color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m.name, padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(m.sharpe.toFixed(2), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('★ GAN ≈ 1.7× best baseline (EN)', padL + plotW * 0.4, padT + plotH - 15);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(view === 'annual' ? 'Annualized Sharpe ratio' : 'Monthly Sharpe ratio', padL + plotW/2, h - 20);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
