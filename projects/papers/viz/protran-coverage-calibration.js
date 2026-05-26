/* viz: protran-coverage-calibration - calibration plot (predicted vs empirical coverage) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['protran-coverage-calibration'] = function (canvas, controls, params) {
    let model = 'ProTran';
    U.addSelect(controls, {
      label: 'Model',
      options: [
        { value: 'DeepAR',  label: 'DeepAR' },
        { value: 'TFT',     label: 'TFT' },
        { value: 'ProTran', label: 'ProTran (★ paper)' }
      ],
      value: 'ProTran',
      onChange: (v) => { model = v; draw(); }
    });

    const config = {
      DeepAR:  { color: '#94a3b8', shift: 0.08 },
      TFT:     { color: '#0891b2', shift: 0.04 },
      ProTran: { color: '#16a34a', shift: 0.005 },
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Calibration Plot (paper Fig 2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const c = config[model];
      ctx.fillText(`${model} — perfect calibration = diagonal. Average miscalibration: ${(c.shift*100).toFixed(1)}%`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const size = Math.min(plotW, plotH);
      const px0 = padL + (plotW - size) / 2;
      const py0 = padT + (plotH - size) / 2;

      // Diagonal (perfect calibration)
      ctx.strokeStyle = '#000';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px0, py0 + size); ctx.lineTo(px0 + size, py0);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px0, py0, size, size);

      // Calibration curve
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let p = 0; p <= 1; p += 0.02) {
        const emp = p - c.shift * Math.sin(p * Math.PI) - c.shift * 0.5;
        const pxLoc = px0 + size * p;
        const pyLoc = py0 + size * (1 - emp);
        if (p === 0) ctx.moveTo(pxLoc, pyLoc); else ctx.lineTo(pxLoc, pyLoc);
      }
      ctx.stroke();

      // Anchor points (quantile thresholds)
      [0.1, 0.25, 0.5, 0.75, 0.9].forEach(p => {
        const emp = p - c.shift * Math.sin(p * Math.PI) - c.shift * 0.5;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(px0 + size * p, py0 + size * (1 - emp), 5, 0, 2*Math.PI);
        ctx.fill();
      });

      // Ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = i / 4;
        ctx.fillText(v.toFixed(2), px0 - 4, py0 + size * (1 - v));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 4; i++) {
        const v = i / 4;
        ctx.fillText(v.toFixed(2), px0 + size * v, py0 + size + 4);
      }

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('predicted quantile', px0 + size/2, py0 + size + 25);
      ctx.save();
      ctx.translate(px0 - 35, py0 + size/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('empirical coverage', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
