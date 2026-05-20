/* viz: voc-misspec-monotone
 * Kelly-Malamud-Zhou (JF 2024) Figure 6 — ★ Theorem 1 (Virtue of Complexity)
 * Misspecified case, true DGP c = 10, Sharpe ratio vs cq monotone increasing.
 */

(function () {
  const U = window.VIZ_UTIL;

  function mpStieltjes(z, c) {
    if (c <= 1e-9) return 1 / (1 + z);
    const disc = ((1 - c) + z) * ((1 - c) + z) + 4 * c * z;
    return (-((1 - c) + z) + Math.sqrt(disc)) / (2 * c * z);
  }

  function xiFn(z, c) {
    if (c <= 1e-9) return 0;
    const m = mpStieltjes(z, c);
    return (1 - z * m) / (1 / c - 1 + z * m);
  }

  // Misspecified Sharpe (Proposition 5/6) — assumed ξ_{2,1} = 0 (Proposition 6)
  // For Ψ = I (so ψ_*1(q) = 1 for all q, sufficiently mixed),
  // we use empirical complexity ce = cq and form via Section IV form.
  function srMisspec(z, c, q, bStar, psi1) {
    const ce = c * q;  // empirical complexity
    if (ce <= 0.001) return 0;
    const m = mpStieltjes(z, ce);
    const xi = xiFn(z, ce);
    const nu = psi1 - (1 / ce) * z * xi;
    const dz = Math.max(1e-6, z * 1e-3);
    const xi_p = (xiFn(z + dz, ce) - xiFn(Math.max(1e-12, z - dz), ce)) / (2 * dz);
    const nu_p = -(1 / ce) * (xi + z * xi_p);
    const nuHat = nu + z * nu_p;
    // Equation 19 form: E = b_* q · ν (with ξ_{2,1} = 0)
    const E = bStar * q * nu;
    // Equation L from Proposition 5 (simplified for Ψ=I, ξ_{2,1}=0)
    const L = q * (bStar * nuHat - c * (1 + bStar * (1 - q * 1)) * nu_p);
    const V = 2 * E * E + (1 + bStar * psi1) * L;
    if (V <= 0) return 0;
    return E / Math.sqrt(V);
  }

  VIZ_REGISTRY['voc-misspec-monotone'] = function (canvas, controls, params) {
    let logZ = parseFloat(params.logZ || '0');
    let bStar = parseFloat(params.bStar || '0.2');
    const c = parseFloat(params.c || '10');  // true DGP complexity
    const psi1 = 1.0;

    U.addSlider(controls, {
      label: 'log₁₀(z)', min: -3, max: 3, step: 0.25, value: logZ,
      onInput: (v) => { logZ = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });
    U.addSlider(controls, {
      label: 'b∗', min: 0.05, max: 1.0, step: 0.05, value: bStar,
      onInput: (v) => { bStar = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 32, padT = 26, padB = 44;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      const cqMin = 0.05, cqMax = c;  // empirical complexity from 0 to c
      const yMin = 0, yMax = 0.08;
      const xToP = (cq) => padL + (cq - cqMin) / (cqMax - cqMin) * iw;
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 4);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const y = yMin + (yMax - yMin) * i / 4;
        ctx.fillText(y.toFixed(2), padL - 8, yToP(y));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 5; i++) {
        const cq = cqMin + (cqMax - cqMin) * i / 5;
        ctx.fillText(cq.toFixed(1), xToP(cq), padT + ih + 6);
      }
      U.text(ctx, `cq = P₁/T  (empirical complexity, true c = ${c})`, w / 2, h - 8,
             { align: 'center', size: 12, color: U.text() });
      ctx.save();
      ctx.translate(16, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'Sharpe ratio (misspecified)', 0, 0, { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // cq = 1 marker
      if (1 >= cqMin && 1 <= cqMax) {
        ctx.strokeStyle = '#999';
        ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(xToP(1), padT); ctx.lineTo(xToP(1), padT + ih); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#666';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('cq = 1', xToP(1), padT - 2);
      }

      // SR curve
      const z = Math.pow(10, logZ);
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      const N = 400;
      for (let i = 0; i <= N; i++) {
        const cq = cqMin + (cqMax - cqMin) * i / N;
        const q = cq / c;
        let y = srMisspec(z, c, q, bStar, psi1);
        if (!isFinite(y)) y = 0;
        y = Math.max(yMin, Math.min(yMax, y));
        const px = xToP(cq), py = yToP(y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Annotation
      ctx.fillStyle = U.text();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Theorem 1: SR monotone ↑ in q', padL + 8, padT + 12);

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
