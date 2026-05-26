/* viz: lettau-gamma-sweep - gamma penalty sweep curve */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lettau-gamma-sweep'] = function (canvas, controls, params) {
    let selectedGamma = 10;
    const gammas = [0, 0.1, 1, 5, 10, 30, 100, 300, 1000];
    const r2Values = [0.041, 0.045, 0.058, 0.071, 0.078, 0.076, 0.071, 0.063, 0.054];

    U.addSlider(controls, {
      label: 'Selected γ', min: 0, max: gammas.length - 1, step: 1, value: 4,
      onInput: (v) => { selectedGamma = gammas[parseInt(v)]; draw(); },
      fmt: (v) => `γ=${gammas[parseInt(v)]}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('γ Penalty Sweep (paper Figure 3)', w/2, 22);

      const padL = 70, padR = 30, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const idx = gammas.indexOf(selectedGamma);
      const r2 = r2Values[idx];
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'center';
      ctx.fillText(`γ=${selectedGamma}: OOS R² = ${r2.toFixed(3)} | Goldilocks zone: γ=10 (R²=0.078) ★`, w/2, 40);

      const xMin = Math.log10(0.1), xMax = Math.log10(1000);
      const xToPix = (g) => padL + plotW * (Math.log10(Math.max(g, 0.1)) - xMin) / (xMax - xMin);
      const yMin = 0.03, yMax = 0.085;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Goldilocks band
      ctx.fillStyle = '#16a34a';
      ctx.globalAlpha = 0.08;
      const gl_left = xToPix(5), gl_right = xToPix(30);
      ctx.fillRect(gl_left, padT, gl_right - gl_left, plotH);
      ctx.globalAlpha = 1;

      // Curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < gammas.length; i++) {
        if (gammas[i] === 0) continue;
        const px = xToPix(gammas[i]), py = yToPix(r2Values[i]);
        if (i === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points
      for (let i = 0; i < gammas.length; i++) {
        if (gammas[i] === 0) continue;
        const px = xToPix(gammas[i]), py = yToPix(r2Values[i]);
        ctx.fillStyle = gammas[i] === selectedGamma ? '#dc2626' : '#2563eb';
        ctx.beginPath();
        ctx.arc(px, py, gammas[i] === selectedGamma ? 8 : 4, 0, 2*Math.PI);
        ctx.fill();
      }

      // PCA baseline (γ=0) horizontal line
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      const pcaY = yToPix(r2Values[0]);
      ctx.beginPath();
      ctx.moveTo(padL, pcaY); ctx.lineTo(padL + plotW, pcaY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('PCA baseline (γ=0)', padL + 10, pcaY + 14);

      // Goldilocks label
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('★ Sweet zone', (gl_left + gl_right) / 2, padT + 14);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(2), padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0.1, 1, 10, 100, 1000].forEach(g => ctx.fillText(g.toString(), xToPix(g), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Penalty γ (log scale)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('OOS R²', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
