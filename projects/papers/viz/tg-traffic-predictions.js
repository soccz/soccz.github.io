/* viz: tg-traffic-predictions
 * Fig 4 — Traffic prediction intervals (50% + 90%) for first 6 of 963 dimensions.
 * Paper does not publish exact values — synthesized from Fig 4 shape + Table 2 CRPS_sum (0.044) calibration.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-traffic-predictions'] = function (canvas, controls, params) {
    let dimIdx = parseInt(params.dim || '0');  // 0..5
    const dimCount = 6;
    const horizon = 24;  // 24 hours

    // Approximated per-dimension scale (paper: "order of magnitude difference")
    const dimScales = [0.05, 0.45, 0.08, 0.35, 0.12, 0.25];
    const dimBaselines = [0.02, 0.05, 0.03, 0.07, 0.04, 0.06];

    U.addSlider(controls, {
      label: 'Dimension (of 963)', min: 0, max: dimCount - 1, step: 1, value: dimIdx,
      onInput: (v) => { dimIdx = parseInt(v); draw(); },
      fmt: (v) => String(parseInt(v) + 1) + ' / 963'
    });

    function rand(s) { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

    function generateSeries() {
      const scale = dimScales[dimIdx];
      const baseline = dimBaselines[dimIdx];
      const obs = new Array(horizon);
      const median = new Array(horizon);
      const q05 = new Array(horizon);
      const q25 = new Array(horizon);
      const q75 = new Array(horizon);
      const q95 = new Array(horizon);

      for (let t = 0; t < horizon; t++) {
        // Daily peak around hour 8 + 18
        const tp = t + (dimIdx * 3);
        const dailyPeak = scale * (
          Math.exp(-Math.pow((t - 8) / 3, 2)) * 0.7 +
          Math.exp(-Math.pow((t - 18) / 3.5, 2)) * 0.9
        );
        median[t] = baseline + dailyPeak;
        // Observation: median + small noise
        obs[t] = median[t] + (rand(dimIdx * 13 + t * 7) - 0.5) * 0.02 * scale;
        // Prediction intervals: wider during peaks
        const uncertainty = (0.06 + dailyPeak * 0.6) * scale;
        q05[t] = median[t] - uncertainty * 1.6;
        q25[t] = median[t] - uncertainty * 0.5;
        q75[t] = median[t] + uncertainty * 0.5;
        q95[t] = median[t] + uncertainty * 1.6;
      }
      return { obs, median, q05, q25, q75, q95 };
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 38, padB = 52;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const series = generateSeries();

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Fig 4 — Traffic dim ${dimIdx + 1}/963  (scale=${dimScales[dimIdx]}, baseline=${dimBaselines[dimIdx]})`, w / 2, padT - 18);

      const yMax = Math.max(...series.q95) * 1.1;
      const yMin = Math.min(...series.q05) * 0.9;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const val = yMax - (yMax - yMin) * i / 4;
        ctx.fillText(val.toFixed(3), padL - 8, padT + innerH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 6; i++) {
        const hr = Math.floor(horizon * i / 6);
        ctx.fillText(`${hr}h`, padL + innerW * i / 6, padT + innerH + 6);
      }

      const xToPix = (t) => padL + innerW * t / (horizon - 1);
      const yToPix = (v) => padT + innerH * (1 - (v - yMin) / (yMax - yMin));

      // 90% interval (light)
      ctx.fillStyle = U.accent();
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      for (let t = 0; t < horizon; t++) {
        const px = xToPix(t); const py = yToPix(series.q05[t]);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      for (let t = horizon - 1; t >= 0; t--) {
        ctx.lineTo(xToPix(t), yToPix(series.q95[t]));
      }
      ctx.closePath(); ctx.fill();

      // 50% interval (darker)
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      for (let t = 0; t < horizon; t++) {
        const px = xToPix(t); const py = yToPix(series.q25[t]);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      for (let t = horizon - 1; t >= 0; t--) {
        ctx.lineTo(xToPix(t), yToPix(series.q75[t]));
      }
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;

      // Median (solid line)
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let t = 0; t < horizon; t++) {
        const px = xToPix(t); const py = yToPix(series.median[t]);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Observation (dashed)
      ctx.strokeStyle = U.good();
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let t = 0; t < horizon; t++) {
        const px = xToPix(t); const py = yToPix(series.obs[t]);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time horizon (24h)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('road occupancy [0,1]', 0, 0);
      ctx.restore();

      // Legend
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillStyle = U.good();
      ctx.fillText('— — observation', padL + 8, padT + 12);
      ctx.fillStyle = U.accent();
      ctx.fillText('──  median prediction', padL + 8, padT + 28);
      ctx.globalAlpha = 0.3; ctx.fillRect(padL + 8, padT + 38, 12, 8); ctx.globalAlpha = 1;
      ctx.fillText('  50% interval', padL + 8 + 18, padT + 44);
      ctx.globalAlpha = 0.15; ctx.fillRect(padL + 8, padT + 54, 12, 8); ctx.globalAlpha = 1;
      ctx.fillText('  90% interval', padL + 8 + 18, padT + 60);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
