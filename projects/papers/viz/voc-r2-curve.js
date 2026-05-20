/* viz: voc-r2-curve
 * Kelly-Malamud-Zhou (JF 2024) Figure 1 — 이론 OOS R² vs c, correctly specified.
 * Marchenko-Pastur closed form for Ψ = I.
 */

(function () {
  const U = window.VIZ_UTIL;

  // Marchenko-Pastur Stieltjes m(-z; c) for Ψ = I
  function mpStieltjes(z, c) {
    const disc = ((1 - c) + z) * ((1 - c) + z) + 4 * c * z;
    return (-((1 - c) + z) + Math.sqrt(disc)) / (2 * c * z);
  }

  // ξ(z; c) = (1 - z·m(-z;c)) / (c^(-1) - 1 + z·m(-z;c))
  function xiFn(z, c) {
    const m = mpStieltjes(z, c);
    return (1 - z * m) / (1 / c - 1 + z * m);
  }

  // R²(z; c) closed form (Proposition 3)
  function r2VoC(z, c, bStar, psi1) {
    if (c <= 0) return bStar * psi1 / (1 + bStar * psi1);
    const m = mpStieltjes(z, c);
    const xi = xiFn(z, c);
    const nu = psi1 - (1 / c) * z * xi;
    // numerical derivative of xi w.r.t. z
    const dz = Math.max(1e-6, z * 1e-3);
    const xi_p = (xiFn(z + dz, c) - xiFn(Math.max(1e-12, z - dz), c)) / (2 * dz);
    const nu_p = -(1 / c) * (xi + z * xi_p);
    const nuHat = nu + z * nu_p;
    const E = bStar * nu;
    const L = bStar * nuHat - c * nu_p;
    return (2 * E - L) / (1 + bStar * psi1);
  }

  VIZ_REGISTRY['voc-r2-curve'] = function (canvas, controls, params) {
    let logZ = parseFloat(params.logZ || '0');  // log10(z)
    let bStar = parseFloat(params.bStar || '0.2');
    const psi1 = 1.0;

    U.addSlider(controls, {
      label: 'log₁₀(z)', min: -3, max: 3, step: 0.25, value: logZ,
      onInput: (v) => { logZ = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });
    U.addSlider(controls, {
      label: 'b∗ (signal scale)', min: 0.05, max: 1.0, step: 0.05, value: bStar,
      onInput: (v) => { bStar = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 32, padT = 26, padB = 44;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      const cMin = 0.05, cMax = 10;
      const yMin = -0.3, yMax = 0.25;
      const xToP = (c) => padL + (c - cMin) / (cMax - cMin) * iw;
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // y-axis ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const y = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(y.toFixed(2), padL - 8, yToP(y));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 5; i++) {
        const c = cMin + (cMax - cMin) * i / 5;
        ctx.fillText(c.toFixed(1), xToP(c), padT + ih + 6);
      }
      U.text(ctx, 'Model complexity c = P/T', w / 2, h - 8, { align: 'center', size: 12, color: U.text() });
      ctx.save();
      ctx.translate(16, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'OOS R²(z; c)', 0, 0, { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // zero line
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(padL, yToP(0)); ctx.lineTo(padL + iw, yToP(0)); ctx.stroke();
      ctx.setLineDash([]);

      // infeasible R²(0;0)
      const r2_inf = bStar * psi1 / (1 + bStar * psi1);
      ctx.strokeStyle = '#c45a4e';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(padL, yToP(r2_inf)); ctx.lineTo(padL + iw, yToP(r2_inf)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#c45a4e';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`infeasible R²(0;0) = ${r2_inf.toFixed(3)}`, padL + iw - 180, yToP(r2_inf) - 4);

      // c = 1 marker
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(xToP(1), padT); ctx.lineTo(xToP(1), padT + ih); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#666';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('c = 1', xToP(1), padT - 2);

      // R²(z; c) curve
      const z = Math.pow(10, logZ);
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      const N = 400;
      let first = true;
      for (let i = 0; i <= N; i++) {
        const c = cMin + (cMax - cMin) * i / N;
        let y = r2VoC(z, c, bStar, psi1);
        // clamp
        if (!isFinite(y)) continue;
        y = Math.max(yMin, Math.min(yMax, y));
        const px = xToP(c), py = yToP(y);
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Title
      if (params.title) {
        ctx.fillStyle = U.text();
        ctx.font = '600 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(params.title, w / 2, padT - 12);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
