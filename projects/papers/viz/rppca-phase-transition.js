/* viz: phase-transition
 * 신호 θ vs 검출 ρ² 곡선 + γ 슬라이더.
 * i.i.d. 잔차 케이스 (Example 3) 의 명시적 식 사용:
 *   G(z), B(z) Marchenko-Pastur, θ_crit = σ²_e(c + √c)
 *   ρ²(θ) = 1/(1 + θ B(θ̂(θ)))   if θ > θ_crit, else 0
 *
 * 우리는 γ가 어떻게 효과적 신호를 키우는지 보여주기 위해,
 * "유효 신호 θ_eff(γ) = σ²_F + (1+γ)·μ²_F" 로 모델링.
 */

(function () {
  const U = window.VIZ_UTIL;

  function G(z, sigma_e2, c) {
    // Marchenko-Pastur Cauchy transform (c > 0)
    const a = (z - sigma_e2 * (1 + c));
    const D = a * a - 4 * c * sigma_e2 * sigma_e2;
    if (D < 0) return NaN;
    return (a - Math.sqrt(D)) / (2 * c * z * sigma_e2);
  }

  function thetaCrit(sigma_e2, c) {
    return sigma_e2 * (c + Math.sqrt(c));
  }

  function thetaHat(theta, sigma_e2, c) {
    // θ̂ = θ + σ²_e/θ · (c + 1 + σ²_e) for spiked covariance (approx, see Corollary 3)
    // 더 정확한 식: G⁻¹(1/θ) = z·(1 + σ²_e(1-c)/z) / (1 - cσ²_e/z), 수치 역함수 필요.
    // 여기서는 closed form (Corollary 3):
    return theta + (sigma_e2 / theta) * (c + 1 + sigma_e2);
  }

  function rho2(theta, sigma_e2, c) {
    const crit = thetaCrit(sigma_e2, c);
    if (theta <= crit) return 0;
    // Corollary 3 explicit form:
    //   ρ² = (1 - cσ²_e/σ²_F) / (1 + cσ²_e/σ²_F + σ²_e/σ²_F · (c²-c))
    // 여기서 σ²_F = θ - cσ²_e (signal 정의로부터). 즉 σ²_F = theta - c*sigma_e2 가 아니라
    // 신호 행렬 정의: θ_PCA = σ²_F + cσ²_e, 따라서 σ²_F = θ - cσ²_e
    const sigmaF2 = theta - c * sigma_e2;
    if (sigmaF2 <= 0) return 0;
    const r = c * sigma_e2 / sigmaF2;
    const num = 1 - r;
    const den = 1 + r + (sigma_e2 / sigmaF2) * (c * c - c);
    if (den <= 0) return 0;
    return Math.max(0, Math.min(1, num / den));
  }

  VIZ_REGISTRY['rppca-phase-transition'] = function (canvas, controls, params) {
    let sigma_e2 = parseFloat(params.sigma_e2 || '1');
    let c = parseFloat(params.c || '0.5');
    let gamma = parseFloat(params.gamma || '0');
    let sigmaF2_true = parseFloat(params.sigma_f2 || '0.1');  // true factor variance
    let muF = parseFloat(params.mu_f || '0.2');                // true factor mean

    const sliderGamma = U.addSlider(controls, {
      label: 'γ', min: -1, max: 50, step: 0.5, value: gamma,
      onInput: (v) => { gamma = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 1)
    });
    const sliderSR = U.addSlider(controls, {
      label: 'σ²_F (true)', min: 0.01, max: 1.0, step: 0.01, value: sigmaF2_true,
      onInput: (v) => { sigmaF2_true = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    const sliderMu = U.addSlider(controls, {
      label: 'μ_F (true)', min: 0, max: 0.6, step: 0.01, value: muF,
      onInput: (v) => { muF = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    const sliderC = U.addSlider(controls, {
      label: 'c = N/T', min: 0.1, max: 1.0, step: 0.05, value: c,
      onInput: (v) => { c = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 26, padT = 22, padB = 40;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // x axis: θ from 0 to a bit beyond crit*4
      const crit = thetaCrit(sigma_e2, c);
      const xMax = Math.max(crit * 4, 4);
      const xMin = 0;
      const yMin = 0, yMax = 1;

      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      // Grid
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      // ticks (y)
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const y = padT + innerH * i / 5;
        ctx.fillText((1 - i / 5).toFixed(1), padL - 8, y);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const xTicks = 5;
      for (let i = 0; i <= xTicks; i++) {
        const x = padL + innerW * i / xTicks;
        const v = xMin + (xMax - xMin) * i / xTicks;
        ctx.fillText(v.toFixed(1), x, h - padB + 6);
      }

      // Axis labels
      U.text(ctx, '신호 θ', w / 2, h - 6, { align: 'center', color: U.text(), size: 12 });
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'ρ² (참 요인과의 상관계수²)', 0, 0, { align: 'center', color: U.text(), size: 12 });
      ctx.restore();

      // Axes lines
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Theoretical rho^2 curve (PCA baseline, no gamma effect on theta_eff)
      ctx.strokeStyle = U.border();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 200; i++) {
        const x = xMin + (xMax - xMin) * i / 200;
        const y = rho2(x, sigma_e2, c);
        const px = xToPix(x), py = yToPix(y);
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      U.text(ctx, 'PCA 곡선 (γ=−1)', xToPix(crit * 3.5), yToPix(0.92),
             { color: U.textMuted(), size: 11, align: 'right' });

      // Critical line
      ctx.strokeStyle = U.bad();
      ctx.setLineDash([2, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xToPix(crit), padT);
      ctx.lineTo(xToPix(crit), h - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      U.text(ctx, `θ_crit = ${crit.toFixed(2)}`, xToPix(crit) + 6, padT + 14,
             { color: U.bad(), size: 11, bold: true });

      // Current (theta_eff for given γ, σ²_F, μ_F)
      // PCA: theta = σ²_F + cσ²_e
      // RP-PCA: theta_eff ≈ σ²_F·(1 + (1+γ)·SR²) + cσ²_e
      // For visualization we plot effective theta of RP-PCA point.
      const SR2 = (muF * muF) / Math.max(1e-9, sigmaF2_true);
      const theta_PCA = sigmaF2_true + c * sigma_e2;
      const theta_RP  = sigmaF2_true * (1 + (1 + gamma) * SR2) + c * sigma_e2;

      // PCA dot
      {
        const x = theta_PCA, y = rho2(theta_PCA, sigma_e2, c);
        ctx.fillStyle = U.textMuted();
        ctx.beginPath();
        ctx.arc(xToPix(x), yToPix(y), 5, 0, 2 * Math.PI);
        ctx.fill();
        U.text(ctx, `PCA: ρ²=${y.toFixed(2)}`, xToPix(x) + 8, yToPix(y) - 8,
               { color: U.textMuted(), size: 11 });
      }
      // RP-PCA dot
      {
        const x = theta_RP, y = rho2(theta_RP, sigma_e2, c);
        ctx.fillStyle = U.accent();
        ctx.beginPath();
        ctx.arc(xToPix(x), yToPix(y), 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = U.bg();
        ctx.lineWidth = 2;
        ctx.stroke();
        U.text(ctx, `RP-PCA (γ=${gamma.toFixed(1)}): ρ²=${y.toFixed(2)}`,
               xToPix(x) + 10, yToPix(y) + 4,
               { color: U.accent(), size: 11, bold: true });
        // arrow from PCA to RP
        ctx.strokeStyle = U.accent();
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(xToPix(theta_PCA), yToPix(rho2(theta_PCA, sigma_e2, c)));
        ctx.lineTo(xToPix(theta_RP), yToPix(rho2(theta_RP, sigma_e2, c)));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
