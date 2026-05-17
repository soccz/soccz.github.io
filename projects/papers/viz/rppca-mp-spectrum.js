/* viz: mp-spectrum
 * Marchenko-Pastur 분포 (bulk) + spike (signal) 시각화.
 * c = N/T 슬라이더로 분포 모양 변화.
 * spike 위치는 θ에 따라 결정 (Corollary 3 closed form).
 */

(function () {
  const U = window.VIZ_UTIL;

  function mpDensity(x, c, sigma_e2) {
    const a = sigma_e2 * Math.pow(1 - Math.sqrt(c), 2);
    const b = sigma_e2 * Math.pow(1 + Math.sqrt(c), 2);
    if (x < a || x > b || x <= 0) return 0;
    return Math.sqrt((b - x) * (x - a)) / (2 * Math.PI * c * sigma_e2 * x);
  }

  function spikePos(theta, sigma_e2, c) {
    // Corollary 3 explicit: σ²_F = θ - cσ²_e
    const sigmaF2 = theta - c * sigma_e2;
    if (sigmaF2 <= 0) return null;
    return theta + (sigma_e2 / sigmaF2) * (c + 1 + sigma_e2);
  }

  function thetaCrit(sigma_e2, c) {
    return sigma_e2 * (c + Math.sqrt(c));
  }

  VIZ_REGISTRY['rppca-mp-spectrum'] = function (canvas, controls, params) {
    let sigma_e2 = parseFloat(params.sigma_e2 || '1');
    let c = parseFloat(params.c || '0.5');
    let theta1 = parseFloat(params.theta1 || '6');   // strong factor signal
    let theta2 = parseFloat(params.theta2 || '0.15'); // weak factor (below crit?)

    U.addSlider(controls, {
      label: 'c = N/T', min: 0.1, max: 1.5, step: 0.05, value: c,
      onInput: (v) => { c = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    U.addSlider(controls, {
      label: 'θ₁ (강신호)', min: 0.5, max: 12, step: 0.1, value: theta1,
      onInput: (v) => { theta1 = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 1)
    });
    U.addSlider(controls, {
      label: 'θ₂ (약신호)', min: 0.0, max: 3, step: 0.05, value: theta2,
      onInput: (v) => { theta2 = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 26, padT = 28, padB = 42;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const a = sigma_e2 * Math.pow(1 - Math.sqrt(c), 2);
      const b = sigma_e2 * Math.pow(1 + Math.sqrt(c), 2);
      const crit = thetaCrit(sigma_e2, c);

      // x range: from 0 to max(b, spike1, spike2) * 1.1
      const sp1 = spikePos(theta1, sigma_e2, c);
      const sp2 = spikePos(theta2, sigma_e2, c);
      const xMax = Math.max(b, sp1 || 0, sp2 || 0, theta1, theta2) * 1.1;
      const xMin = 0;
      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;

      // y range: peak of MP density
      let yMax = 0;
      const N = 400;
      const xs = [];
      for (let i = 0; i <= N; i++) {
        const x = Math.max(0.001, xMin + (xMax - xMin) * i / N);
        const d = mpDensity(x, c, sigma_e2);
        xs.push({ x, d });
        if (d > yMax) yMax = d;
      }
      yMax = Math.max(yMax, 0.1) * 1.2;
      const yToPix = (y) => padT + (1 - y / yMax) * innerH;

      // grid + axis
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 4);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // x ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const xTicks = 6;
      for (let i = 0; i <= xTicks; i++) {
        const x = xMin + (xMax - xMin) * i / xTicks;
        ctx.fillText(x.toFixed(1), xToPix(x), h - padB + 6);
      }

      // labels
      U.text(ctx, '고유값 λ', w / 2, h - 6, { align: 'center', size: 12 });

      // Bulk fill (MP density)
      ctx.fillStyle = U.cssVar('--accent-glow', 'rgba(196,114,78,0.08)');
      ctx.beginPath();
      ctx.moveTo(xToPix(xs[0].x), yToPix(0));
      for (let i = 0; i < xs.length; i++) {
        ctx.lineTo(xToPix(xs[i].x), yToPix(xs[i].d));
      }
      ctx.lineTo(xToPix(xs[xs.length - 1].x), yToPix(0));
      ctx.closePath();
      ctx.fill();

      // Bulk outline
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < xs.length; i++) {
        const px = xToPix(xs[i].x), py = yToPix(xs[i].d);
        if (xs[i].d <= 0) { started = false; continue; }
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Critical line
      ctx.strokeStyle = U.bad();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(xToPix(crit), padT);
      ctx.lineTo(xToPix(crit), h - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      U.text(ctx, `θ_crit=${crit.toFixed(2)}`, xToPix(crit) + 5, padT + 14,
             { color: U.bad(), size: 11, bold: true });

      // bulk range markers
      U.text(ctx, `bulk [${a.toFixed(2)}, ${b.toFixed(2)}]`,
             xToPix((a + b) / 2), yToPix(yMax * 0.55),
             { color: U.accent(), size: 11, align: 'center' });

      // Spikes
      function drawSpike(theta, spike, label, color) {
        if (spike == null) return;
        const detected = theta > crit;
        // vertical bar at spike position
        ctx.strokeStyle = detected ? color : U.textMuted();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(xToPix(spike), h - padB);
        ctx.lineTo(xToPix(spike), padT + innerH * 0.2);
        ctx.stroke();
        // dot at top
        ctx.fillStyle = detected ? color : U.textMuted();
        ctx.beginPath();
        ctx.arc(xToPix(spike), padT + innerH * 0.2, 6, 0, 2 * Math.PI);
        ctx.fill();
        U.text(ctx, `${label}: λ̂=${spike.toFixed(2)}`,
               xToPix(spike), padT + innerH * 0.2 - 12,
               { color: detected ? color : U.textMuted(), size: 11, align: 'center', bold: true });
        // also show original theta
        U.text(ctx, `θ=${theta.toFixed(2)} ${detected ? '✓ 검출' : '✗ 미검출'}`,
               xToPix(spike), padT + innerH * 0.2 - 26,
               { color: detected ? color : U.bad(), size: 10, align: 'center' });
      }

      drawSpike(theta1, sp1, 'spike 1', U.good());
      drawSpike(theta2, sp2, 'spike 2', U.warn());
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
