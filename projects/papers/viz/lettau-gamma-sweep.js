/* viz: lettau-gamma-sweep - paper Figure 8 OOS SR vs γ (37 anomaly portfolios) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lettau-gamma-sweep'] = function (canvas, controls, params) {
    let selectedGamma = 10;
    // paper Figure 8: γ vs OOS Sharpe ratio (K=5 factors, N=370)
    // γ=-1 (PCA), 0, 1, 5, 10, 20 — values estimated from Figure 8 right panel
    const gammas = [-1, 0, 1, 5, 10, 20];
    const labels = ['PCA (γ=-1)', '0', '1', '5', '10 ★', '20'];
    const srOOS = [0.13, 0.17, 0.22, 0.38, 0.45, 0.50];
    const srIS  = [0.17, 0.24, 0.32, 0.48, 0.53, 0.60];

    U.addSlider(controls, {
      label: 'Selected γ', min: 0, max: gammas.length - 1, step: 1, value: 4,
      onInput: (v) => { selectedGamma = gammas[parseInt(v)]; draw(); },
      fmt: (v) => `γ=${labels[parseInt(v)]}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('paper Figure 8 — γ vs OOS Sharpe (K=5, 37 anomalies)', w/2, 22);
      const idx = gammas.indexOf(selectedGamma);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'center';
      ctx.fillText(`γ=${labels[idx]}: IS SR=${srIS[idx].toFixed(2)}, OOS SR=${srOOS[idx].toFixed(2)} (paper 's main spec = γ=10)`, w/2, 40);

      const padL = 70, padR = 40, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = -2, xMax = 21;
      const xToPix = (g) => padL + plotW * (g - xMin) / (xMax - xMin);
      const yMin = 0, yMax = 0.7;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Goldilocks band around γ=10 (paper의 main)
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.08;
      const gl_left = xToPix(5), gl_right = xToPix(15);
      ctx.fillRect(gl_left, padT, gl_right - gl_left, plotH);
      ctx.globalAlpha = 1;

      // IS curve
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      gammas.forEach((g, i) => {
        const px = xToPix(g), py = yToPix(srIS[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // OOS curve
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      gammas.forEach((g, i) => {
        const px = xToPix(g), py = yToPix(srOOS[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Points
      gammas.forEach((g, i) => {
        const pxIS = xToPix(g), pyIS = yToPix(srIS[i]);
        const pxOOS = xToPix(g), pyOOS = yToPix(srOOS[i]);
        ctx.fillStyle = g === selectedGamma ? '#000' : '#0891b2';
        ctx.beginPath();
        ctx.arc(pxIS, pyIS, g === selectedGamma ? 7 : 4, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = g === selectedGamma ? '#000' : '#dc2626';
        ctx.beginPath();
        ctx.arc(pxOOS, pyOOS, g === selectedGamma ? 7 : 4, 0, 2*Math.PI);
        ctx.fill();
      });

      // Goldilocks label
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ paper main γ=10', (gl_left + gl_right) / 2, padT + 14);

      // Legend
      ctx.strokeStyle = '#0891b2';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padL + 10, padT + 40); ctx.lineTo(padL + 26, padT + 40);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('In-sample SR', padL + 30, padT + 44);

      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(padL + 10, padT + 60); ctx.lineTo(padL + 26, padT + 60);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('OOS SR (paper Table 1)', padL + 30, padT + 64);

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 7; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/7);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 7);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [-1, 0, 5, 10, 15, 20].forEach(g => ctx.fillText(g.toString(), xToPix(g), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('RP-weight γ', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Sharpe ratio', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
