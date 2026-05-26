/* viz: master-gating - market gating visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['master-gating'] = function (canvas, controls, params) {
    let regime = 'bull';

    U.addSelect(controls, {
      label: 'Market regime',
      options: [
        { value: 'bull',   label: 'Bull market (low VIX, high return)' },
        { value: 'bear',   label: 'Bear market (high VIX, low return)' },
        { value: 'neutral',label: 'Neutral / transition' }
      ],
      value: 'bull',
      onChange: (v) => { regime = v; draw(); }
    });

    const features = [
      'momentum_5d', 'momentum_20d', 'volatility', 'volume_ratio',
      'rsi', 'macd', 'pe_ratio', 'pb_ratio',
      'beta', 'size', 'value_factor', 'quality_factor',
      'low_vol', 'dividend_yield', 'turnover', 'sector_relative'
    ];

    const gateProfiles = {
      bull:    [0.92, 0.95, 0.30, 0.85, 0.78, 0.88, 0.45, 0.40, 0.82, 0.65, 0.35, 0.50, 0.25, 0.45, 0.90, 0.72],
      bear:    [0.25, 0.30, 0.92, 0.75, 0.45, 0.40, 0.82, 0.85, 0.55, 0.75, 0.90, 0.85, 0.95, 0.88, 0.50, 0.65],
      neutral: [0.55, 0.58, 0.62, 0.65, 0.50, 0.55, 0.65, 0.62, 0.60, 0.65, 0.62, 0.65, 0.62, 0.65, 0.60, 0.65],
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Market-Guided Gating (paper §3.2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const regimeLabels = { bull: 'Bull market', bear: 'Bear market', neutral: 'Neutral' };
      ctx.fillText(`${regimeLabels[regime]} — gate values for 16 features (0-1)`, w/2, 40);

      const padL = 130, padR = 50, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const gates = gateProfiles[regime];
      const barH = plotH / gates.length * 0.7;
      const gap = plotH / gates.length * 0.3;

      // Center separator at 0.5
      const half = padL + plotW * 0.5;
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(half, padT); ctx.lineTo(half, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('0.5 (neutral gate)', half, padT - 8);

      gates.forEach((g, i) => {
        const y = padT + i * (barH + gap);
        const barLen = plotW * g;
        // Color by emphasis level
        let color;
        if (g >= 0.75) color = '#16a34a';
        else if (g >= 0.5) color = '#0891b2';
        else if (g >= 0.25) color = '#ca8a04';
        else color = '#dc2626';

        ctx.fillStyle = color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, plotW, barH);

        // Feature label
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(features[i], padL - 8, y + barH/2);

        // Gate value
        ctx.fillStyle = '#fff';
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 30) ctx.fillText(g.toFixed(2), padL + barLen - 4, y + barH/2 + 3);
      });

      // Legend
      const lgY = padT + plotH + 8;
      const colors = [
        { c: '#16a34a', label: '≥0.75 (high emphasis)' },
        { c: '#0891b2', label: '0.5-0.75' },
        { c: '#ca8a04', label: '0.25-0.5' },
        { c: '#dc2626', label: '<0.25 (suppressed)' }
      ];
      let lx = padL;
      colors.forEach(({ c, label }) => {
        ctx.fillStyle = c;
        ctx.fillRect(lx, lgY, 10, 10);
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + 14, lgY + 5);
        lx += 130;
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
