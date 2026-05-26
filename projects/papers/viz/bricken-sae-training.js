/* viz: bricken-sae-training - SAE training dynamics with/without resample */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['bricken-sae-training'] = function (canvas, controls, params) {
    let resample = true;

    U.addSelect(controls, {
      label: 'Resampling',
      options: [
        { value: 'on',  label: 'Periodic resample (★ paper §3.2)' },
        { value: 'off', label: 'No resample' }
      ],
      value: 'on',
      onChange: (v) => { resample = (v === 'on'); draw(); }
    });

    // Synthetic curves matching paper Table 3
    const steps = [];
    for (let s = 0; s <= 200; s += 5) steps.push(s * 1000);

    function alive_with_resample(s) {
      // Drops slightly between resamples, sharp recovery at 25K, 50K, ...
      const k = Math.floor(s / 25000);
      const phase = (s - k * 25000) / 25000;
      let base = 4096 * (0.97 - 0.04 * phase);
      if (s < 5000) base = 4096 * (0.9 + 0.07 * s / 5000);
      return Math.min(4096, Math.max(0, base));
    }
    function alive_no_resample(s) {
      // Linear decay
      return 4096 * Math.max(0.60, 1 - 0.0000022 * s);
    }
    function recon_with(s) { return 0.4 * Math.exp(-s / 30000) + 0.038; }
    function recon_no(s) { return 0.4 * Math.exp(-s / 40000) + 0.082; }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SAE Training Dynamics (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const final_alive = resample ? alive_with_resample(200000) : alive_no_resample(200000);
      const final_recon = resample ? recon_with(200000) : recon_no(200000);
      ctx.fillText(
        `Final: ${(final_alive/4096*100).toFixed(0)}% alive, recon loss=${final_recon.toFixed(3)}`,
        w/2, 40
      );

      const padL = 70, padR = 50, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMax = 200000;
      const xToPix = (s) => padL + plotW * (s / xMax);
      const yToPixAlive = (a) => padT + plotH * (1 - a / 4096);
      const yToPixRecon = (r) => padT + plotH * (1 - r / 0.5);  // share y-axis (scaled differently)

      // Y ticks (alive %)
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = (5 - i) * 20;
        ctx.fillText(`${v}%`, padL - 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'left';
      for (let i = 0; i <= 5; i++) {
        const v = (5 - i) * 0.1;
        ctx.fillText(v.toFixed(2), padL + plotW + 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 50000, 100000, 150000, 200000].forEach(s => {
        ctx.fillText(`${s/1000}K`, xToPix(s), padT + plotH + 6);
      });

      // Alive features curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      steps.forEach(s => {
        const v = resample ? alive_with_resample(s) : alive_no_resample(s);
        const px = xToPix(s), py = yToPixAlive(v);
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Recon loss curve
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      first = true;
      steps.forEach(s => {
        const v = resample ? recon_with(s) : recon_no(s);
        const px = xToPix(s), py = yToPixRecon(v);
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Resample markers
      if (resample) {
        [25000, 50000, 75000, 100000, 125000, 150000, 175000].forEach(s => {
          const px = xToPix(s);
          ctx.strokeStyle = '#16a34a';
          ctx.setLineDash([2, 3]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, padT); ctx.lineTo(px, padT + plotH);
          ctx.stroke();
          ctx.setLineDash([]);
        });
        ctx.fillStyle = '#16a34a';
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('↑ resample', xToPix(25000), padT - 8);
      }

      // Legend
      const legX = padL + 8, legY = padT + plotH - 80;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(legX, legY - 6, 14, 3);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('Alive features (%)', legX + 20, legY);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(legX, legY + 18 - 6, 14, 3);
      ctx.fillStyle = U.text();
      ctx.fillText('Recon loss', legX + 20, legY + 18);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Training step', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
