/* viz: one-factor-correlation
 * Example 2 / Corollary 2 — 1-요인 모델에서 추정-진짜 상관계수 곡선.
 * γ를 가로축 또는 σ²_F를 가로축으로 한 곡선.
 * 옵션: x-axis = "gamma" 또는 "sigma_f2"
 */

(function () {
  const U = window.VIZ_UTIL;

  function thetaCrit(sigma_e2, c) { return sigma_e2 * (c + Math.sqrt(c)); }

  function thetaRP(sigmaF2, mu, gamma, sigma_e2, c) {
    return sigmaF2 + (1 + gamma) * mu * mu + c * sigma_e2;
  }
  function rho2(theta, sigma_e2, c) {
    const crit = thetaCrit(sigma_e2, c);
    if (theta <= crit) return 0;
    const sigmaF2 = theta - c * sigma_e2;
    if (sigmaF2 <= 0) return 0;
    const r = c * sigma_e2 / sigmaF2;
    const num = 1 - r;
    const den = 1 + r + (sigma_e2 / sigmaF2) * (c * c - c);
    return Math.max(0, Math.min(1, num / den));
  }

  VIZ_REGISTRY['rppca-one-factor-correlation'] = function (canvas, controls, params) {
    let sigma_e2 = parseFloat(params.sigma_e2 || '1');
    let c = parseFloat(params.c || '0.5');
    let SR = parseFloat(params.sr || '0.5');
    let sigmaF2 = parseFloat(params.sigma_f2 || '0.05');
    let xAxis = params.x || 'gamma'; // 'gamma' or 'sigma_f2'

    // axis toggle
    const wrap = document.createElement('label');
    const lab = document.createElement('span'); lab.textContent = 'x축';
    wrap.appendChild(lab);
    ['gamma', 'sigma_f2'].forEach(opt => {
      const b = document.createElement('button');
      b.textContent = opt === 'gamma' ? 'γ' : 'σ²_F';
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (opt === xAxis) { b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent(); }
      b.addEventListener('click', () => {
        wrap.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        xAxis = opt; draw();
      });
      wrap.appendChild(b);
    });
    controls.appendChild(wrap);

    U.addSlider(controls, {
      label: 'SR', min: 0.0, max: 1.2, step: 0.05, value: SR,
      onInput: (v) => { SR = v; draw(); }, fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    U.addSlider(controls, {
      label: 'c = N/T', min: 0.1, max: 1.0, step: 0.05, value: c,
      onInput: (v) => { c = v; draw(); }, fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    U.addSlider(controls, {
      label: xAxis === 'gamma' ? 'σ²_F' : 'γ', min: 0.01, max: 1.0, step: 0.01,
      value: xAxis === 'gamma' ? sigmaF2 : 5,
      onInput: (v) => {
        if (xAxis === 'gamma') sigmaF2 = v; else sigmaF2 = v;  // shared slider for now
        draw();
      }, fmt: (v) => U.fmt(parseFloat(v), 2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 56, padR = 26, padT = 30, padB = 44;
      const innerW = w - padL - padR, innerH = h - padT - padB;

      const N = 200;
      const xMin = xAxis === 'gamma' ? -1 : 0.005;
      const xMax = xAxis === 'gamma' ? 30 : 0.5;
      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - y) * innerH;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const y = padT + innerH * i / 5;
        ctx.fillText((1 - i / 5).toFixed(1), padL - 8, y);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const xTicks = 6;
      for (let i = 0; i <= xTicks; i++) {
        const x = xMin + (xMax - xMin) * i / xTicks;
        ctx.fillText(U.fmt(x, 2), xToPix(x), h - padB + 6);
      }

      U.text(ctx, xAxis === 'gamma' ? 'γ' : 'σ²_F (factor 분산)', w / 2, h - 6,
             { align: 'center', size: 12 });
      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'ρ² (추정-진짜 상관²)', 0, 0, { align: 'center', size: 12 });
      ctx.restore();

      // Multiple SR curves
      const SRs = [SR];
      const labels = [`SR=${SR}`];
      const colors = [U.accent()];

      if (xAxis === 'gamma') {
        // Plot single curve for fixed (sigmaF2, SR) vs γ
        ctx.strokeStyle = U.accent();
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const g = xMin + (xMax - xMin) * i / N;
          const mu = SR * Math.sqrt(sigmaF2);
          const th = thetaRP(sigmaF2, mu, g, sigma_e2, c);
          const r = rho2(th, sigma_e2, c);
          const px = xToPix(g), py = yToPix(r);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        U.text(ctx, `SR=${SR}, σ²_F=${sigmaF2.toFixed(2)}`,
               w - padR - 6, padT + 12, { align: 'right', color: U.accent(), bold: true, size: 11 });
      } else {
        // Plot multiple γ curves vs σ²_F
        const gammas = [-1, 0, 10, 30];
        const palette = [U.textMuted(), U.info(), U.accent(), U.good()];
        gammas.forEach((g, gi) => {
          ctx.strokeStyle = palette[gi];
          ctx.lineWidth = 2;
          ctx.setLineDash(g === -1 ? [3, 3] : []);
          ctx.beginPath();
          for (let i = 0; i <= N; i++) {
            const sf2 = Math.max(0.005, xMin + (xMax - xMin) * i / N);
            const mu = SR * Math.sqrt(sf2);
            const th = thetaRP(sf2, mu, g, sigma_e2, c);
            const r = rho2(th, sigma_e2, c);
            const px = xToPix(sf2), py = yToPix(r);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          U.text(ctx, `γ=${g}`, w - padR - 6, padT + 12 + gi * 16,
                 { align: 'right', color: palette[gi], bold: gi >= 2, size: 11 });
        });
      }

      // critical line for context
      const crit = thetaCrit(sigma_e2, c);
      U.text(ctx, `θ_crit=${crit.toFixed(2)} | c=${c.toFixed(2)} | σ²_e=${sigma_e2.toFixed(2)}`,
             padL + 8, padT + 12, { color: U.textMuted(), size: 10 });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
