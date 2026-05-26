/* viz: tg-ablation-N
 * Fig 3 — Electricity CRPS_sum vs N ∈ {2, 4, 8, ..., 256}.
 * Synthesized from paper Fig 3 trend description (paper does not publish exact values).
 * N≈10 plateau start, N≈100 optimal, N>100 marginal.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-ablation-N'] = function (canvas, controls, params) {
    // Approximate values from paper Fig 3 trend (log-scale)
    const Ns = [2, 4, 8, 16, 32, 64, 100, 128, 192, 256];
    const crps = [0.45, 0.20, 0.06, 0.025, 0.0215, 0.0208, 0.0206, 0.0207, 0.0210, 0.0212];
    const stdErr = [0.06, 0.025, 0.008, 0.002, 0.0015, 0.0010, 0.0008, 0.0009, 0.0011, 0.0013];

    let highlightIdx = 6; // N=100 default

    U.addSlider(controls, {
      label: 'N index', min: 0, max: Ns.length - 1, step: 1, value: highlightIdx,
      onInput: (v) => { highlightIdx = parseInt(v); draw(); },
      fmt: (v) => String(Ns[parseInt(v)])
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 30, padT = 40, padB = 52;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // log10 scale for y
      const logCrps = crps.map(v => Math.log10(v));
      const logCrpsUpper = crps.map((v, i) => Math.log10(v + stdErr[i]));
      const logCrpsLower = crps.map((v, i) => Math.log10(Math.max(v - stdErr[i], 0.001)));
      const yMin = Math.min(...logCrpsLower) - 0.1;
      const yMax = Math.max(...logCrpsUpper) + 0.1;
      const yRange = yMax - yMin;

      // log10 scale for x (Ns)
      const logNs = Ns.map(v => Math.log10(v));
      const xMin = Math.log10(2) - 0.1;
      const xMax = Math.log10(256) + 0.1;
      const xRange = xMax - xMin;

      const xToPix = (logN) => padL + innerW * (logN - xMin) / xRange;
      const yToPix = (logV) => padT + innerH * (1 - (logV - yMin) / yRange);

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Fig 3 — Electricity CRPS_sum vs N  (current: N=${Ns[highlightIdx]}, CRPS_sum=${crps[highlightIdx].toFixed(4)})`, w / 2, padT - 16);

      // Grid + axes
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';

      // Y axis ticks (log10 scale)
      for (let i = 0; i <= 4; i++) {
        const logV = yMax - yRange * i / 4;
        const v = Math.pow(10, logV);
        ctx.fillText(v.toFixed(3), padL - 8, padT + innerH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      // X axis ticks (log10 scale)
      Ns.forEach((n, i) => {
        const px = xToPix(logNs[i]);
        ctx.fillText(String(n), px, padT + innerH + 6);
      });

      // Std error band (shaded)
      ctx.fillStyle = U.accent();
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.moveTo(xToPix(logNs[0]), yToPix(logCrpsLower[0]));
      for (let i = 1; i < Ns.length; i++) {
        ctx.lineTo(xToPix(logNs[i]), yToPix(logCrpsLower[i]));
      }
      for (let i = Ns.length - 1; i >= 0; i--) {
        ctx.lineTo(xToPix(logNs[i]), yToPix(logCrpsUpper[i]));
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // Main curve
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i < Ns.length; i++) {
        const px = xToPix(logNs[i]); const py = yToPix(logCrps[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Data points
      for (let i = 0; i < Ns.length; i++) {
        const px = xToPix(logNs[i]); const py = yToPix(logCrps[i]);
        const isHighlight = i === highlightIdx;
        ctx.fillStyle = isHighlight ? U.bad() : U.accent();
        ctx.beginPath(); ctx.arc(px, py, isHighlight ? 7 : 4, 0, 2 * Math.PI); ctx.fill();
      }

      // Annotations
      ctx.fillStyle = U.text();
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';

      // Plateau annotation (around N=10)
      const plateauX = xToPix(Math.log10(10));
      const plateauY = yToPix(Math.log10(0.045));
      ctx.fillStyle = U.textMuted();
      ctx.fillText('← plateau start (N≈10)', plateauX + 6, plateauY - 12);

      // Optimal annotation (around N=100)
      const optX = xToPix(Math.log10(100));
      const optY = yToPix(Math.log10(0.0206));
      ctx.fillStyle = U.good();
      ctx.fillText('★ optimal (N≈100)', optX + 6, optY - 10);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('N (diffusion steps, log scale)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('CRPS_sum (log scale)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
