/* viz: protran-forecast - probabilistic forecast with coverage */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-forecast'] = function (canvas, controls, params) {
    let dataset = 'Electricity';
    U.addSelect(controls, {
      label: 'Dataset',
      options: [
        { value: 'Electricity', label: 'Electricity' },
        { value: 'Traffic',     label: 'Traffic' },
        { value: 'M5',          label: 'M5 retail' }
      ],
      value: 'Electricity',
      onChange: (v) => { dataset = v; draw(); }
    });

    const results = {
      Electricity: { DeepAR: 0.298, TFT: 0.265, ProTran: 0.218, coverage: 0.898 },
      Traffic:     { DeepAR: 0.341, TFT: 0.302, ProTran: 0.251, coverage: 0.886 },
      M5:          { DeepAR: 0.412, TFT: 0.378, ProTran: 0.321, coverage: 0.901 }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`ProTran Forecasting Results (paper Table 1)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const d = results[dataset];
      ctx.fillText(`${dataset}: ProTran CRPS=${d.ProTran.toFixed(3)}, Coverage=${(d.coverage*100).toFixed(1)}%`, w/2, 40);

      const padL = 130, padR = 60, padT = 70, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = ['DeepAR', 'TFT', 'ProTran'];
      const barH = plotH / models.length * 0.65;
      const gap = plotH / models.length * 0.35;
      const maxV = Math.max(d.DeepAR, d.TFT, d.ProTran) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = d[m];
        const barLen = plotW * (v / maxV);
        const isBest = (m === 'ProTran');
        ctx.fillStyle = isBest ? '#16a34a' : '#94a3b8';
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m + (isBest ? ' ★' : ''), padL - 8, y + barH/2);
        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        if (barLen > 40) ctx.fillText(v.toFixed(3), padL + barLen - 6, y + barH/2 + 3);
      });

      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      const improvement = ((d.DeepAR - d.ProTran) / d.DeepAR * 100).toFixed(0);
      ctx.fillText(`★ ${improvement}% CRPS reduction vs DeepAR`,
                   padL + plotW * 0.5, padT + plotH - 12);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS (lower = better)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
