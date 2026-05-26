/* viz: gu-conditional-beta - β_t = NN(Z_{i,t}) conditional beta */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-conditional-beta'] = function (canvas, controls, params) {
    let charVal = 0;  // standardized characteristic
    U.addSlider(controls, {
      label: 'Size (mvel1, std)', min: -2, max: 2, step: 0.1, value: 0,
      onInput: (v) => { charVal = parseFloat(v); draw(); },
      fmt: (v) => `Z=${parseFloat(v).toFixed(1)}σ`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Conditional Beta β_t = NN(Z_{i,t}) — Gu-Kelly-Xiu 의 핵심', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Stock i 의 size (Z) 가 5 factor 의 β 값을 결정 — *time-varying conditional*`, w/2, 40);

      const padL = 80, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const factors = ['Market', 'Size', 'Value', 'Momentum', 'Profitability'];
      const baseColors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];

      // β values depend on charVal (size) — nonlinear via NN
      const betas = [
        1.0 + 0.1 * Math.sin(charVal),                    // market: mostly stable
        1.5 - 0.6 * charVal,                              // size: large stocks → low size β
        0.2 + 0.4 * Math.tanh(-charVal * 0.8),            // value
        0.3 + 0.5 * Math.tanh(charVal * 0.6),             // momentum
        0.1 + 0.3 * charVal * charVal                     // profitability: nonlinear
      ];

      const xMin = -2, xMax = 2;
      const yMin = -1, yMax = 2.5;
      const xToPix = (z) => padL + plotW * (z - xMin) / (xMax - xMin);
      const yToPix = (b) => padT + plotH * (1 - (b - yMin) / (yMax - yMin));

      // Plot β(Z) curves for each factor
      factors.forEach((name, k) => {
        ctx.strokeStyle = baseColors[k];
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let z = xMin; z <= xMax; z += 0.05) {
          let b;
          if (k === 0) b = 1.0 + 0.1 * Math.sin(z);
          else if (k === 1) b = 1.5 - 0.6 * z;
          else if (k === 2) b = 0.2 + 0.4 * Math.tanh(-z * 0.8);
          else if (k === 3) b = 0.3 + 0.5 * Math.tanh(z * 0.6);
          else b = 0.1 + 0.3 * z * z;
          const px = xToPix(z), py = yToPix(b);
          if (z === xMin) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Mark current point
        ctx.fillStyle = baseColors[k];
        ctx.beginPath();
        ctx.arc(xToPix(charVal), yToPix(betas[k]), 5, 0, 2*Math.PI);
        ctx.fill();
      });

      // Legend
      factors.forEach((name, k) => {
        const yLg = padT + 10 + k * 18;
        ctx.strokeStyle = baseColors[k];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padL + 8, yLg); ctx.lineTo(padL + 24, yLg);
        ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillText(`${name}: β = ${betas[k].toFixed(2)}`, padL + 28, yLg + 3);
      });

      // Zero line
      ctx.strokeStyle = '#000';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(0)); ctx.lineTo(padL + plotW, yToPix(0));
      ctx.stroke();
      ctx.setLineDash([]);

      // Selected slider line
      ctx.strokeStyle = '#000';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(charVal), padT); ctx.lineTo(xToPix(charVal), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [-2, -1, 0, 1, 2].forEach(z => ctx.fillText(z.toString() + 'σ', xToPix(z), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('size characteristic (Z, standardized)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('factor β loading', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
