/* viz: lettau-rppca-spectrum - PCA vs RP-PCA eigenvalue spectrum */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lettau-rppca-spectrum'] = function (canvas, controls, params) {
    let gamma = 10;
    U.addSlider(controls, {
      label: 'Penalty γ', min: 0, max: 100, step: 5, value: 10,
      onInput: (v) => { gamma = parseInt(v); draw(); },
      fmt: (v) => `γ=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('RP-PCA Eigenvalue Spectrum (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Standard PCA (γ=0) vs RP-PCA (γ=${gamma})`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const N = 20; // number of factors
      // PCA eigenvalues (variance only)
      const pca_eig = [];
      const rppca_eig = [];
      for (let i = 0; i < N; i++) {
        // Top 5 spike eigenvalues, rest bulk
        let v;
        if (i < 5) v = 8 - i * 1.2;
        else v = 1.0 + 0.3 * Math.exp(-(i - 5) * 0.15);
        pca_eig.push(v);
        // RP-PCA: boost first 5 by risk premium term
        const rp_boost = (i < 5) ? (gamma / 100) * (5 - i) * 1.5 : 0;
        rppca_eig.push(v + rp_boost);
      }

      const xToPix = (i) => padL + plotW * (i / N);
      const maxY = Math.max(...rppca_eig, 12);
      const yToPix = (v) => padT + plotH * (1 - v / maxY);

      // PCA bars
      const barW = plotW / N * 0.4;
      pca_eig.forEach((v, i) => {
        const x = padL + (plotW / N) * i + (plotW / N - 2 * barW) / 2;
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, yToPix(v), barW, padT + plotH - yToPix(v));
      });

      // RP-PCA bars
      rppca_eig.forEach((v, i) => {
        const x = padL + (plotW / N) * i + (plotW / N - 2 * barW) / 2 + barW + 2;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x, yToPix(v), barW, padT + plotH - yToPix(v));
      });

      // Threshold line
      ctx.strokeStyle = '#16a34a';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(2.5));
      ctx.lineTo(padL + plotW, yToPix(2.5));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#16a34a';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('spike threshold', padL + plotW - 110, yToPix(2.5) - 6);

      // Legend
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(padL + 12, padT + 14, 14, 10);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('PCA (variance only)', padL + 32, padT + 22);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(padL + 12, padT + 30, 14, 10);
      ctx.fillStyle = U.text();
      ctx.fillText('RP-PCA (+ risk premium)', padL + 32, padT + 38);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = maxY * (1 - i/5);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 5, 10, 15, 20].forEach(i => ctx.fillText(i.toString(), xToPix(i), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Factor index', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Eigenvalue', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
