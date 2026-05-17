/* viz: factor-path
 * 논문 Figure 1 재현 (4번째 weak factor의 추정 path).
 * γ가 작으면 추정 path가 거의 0 (검출 실패), γ가 크면 진짜 path 추적.
 *
 * 시뮬레이션: T=240, σ²_F=0.03, SR=0.8, σ²_e=1, c=N/T=370/650.
 * 통계적 모델 기반 — 진짜 factor random walk + (1-ρ²)에 비례한 noise.
 */

(function () {
  const U = window.VIZ_UTIL;

  function thetaCrit(sigma_e2, c) { return sigma_e2 * (c + Math.sqrt(c)); }

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

  // simple seeded PRNG for reproducibility
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randn(rng) {
    // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  VIZ_REGISTRY['rppca-factor-path'] = function (canvas, controls, params) {
    let sigmaF2 = parseFloat(params.sigma_f2 || '0.03');
    let SR = parseFloat(params.sr || '0.8');
    let sigma_e2 = parseFloat(params.sigma_e2 || '1');
    let c = parseFloat(params.c || '0.57');
    let T = parseInt(params.T || '240', 10);
    let seed = parseInt(params.seed || '7', 10);

    U.addSlider(controls, {
      label: 'σ²_F (factor 분산)', min: 0.01, max: 0.5, step: 0.01, value: sigmaF2,
      onInput: (v) => { sigmaF2 = v; draw(); }, fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    U.addSlider(controls, {
      label: 'SR', min: 0.0, max: 1.2, step: 0.05, value: SR,
      onInput: (v) => { SR = v; draw(); }, fmt: (v) => U.fmt(parseFloat(v), 2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 26, padT = 30, padB = 40;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Generate true factor cumulative path (Brownian-like).
      const rng = mulberry32(seed);
      const muF = SR * Math.sqrt(sigmaF2);
      const Fs = new Float64Array(T);
      Fs[0] = 0;
      for (let t = 1; t < T; t++) {
        Fs[t] = Fs[t - 1] + muF + Math.sqrt(sigmaF2) * randn(rng);
      }

      // for each γ ∈ {γ_PCA=-1, 0, 10, 20}, compute effective theta and ρ², draw path
      const gammas = [-1, 0, 10, 20];
      const colors = [U.textMuted(), U.info(), U.accent(), U.good()];

      // y range
      let yMin = 0, yMax = 0;
      for (let t = 0; t < T; t++) { if (Fs[t] > yMax) yMax = Fs[t]; if (Fs[t] < yMin) yMin = Fs[t]; }
      // also include estimated paths range — approx similar scale
      const pad = (yMax - yMin) * 0.2 || 1;
      yMin -= pad; yMax += pad;

      const xToPix = (i) => padL + (i / (T - 1)) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // x ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const xTicks = 6;
      for (let i = 0; i <= xTicks; i++) {
        const tt = Math.round(T * i / xTicks);
        ctx.fillText(tt.toString(), xToPix(tt), h - padB + 6);
      }
      U.text(ctx, '시간 t', w / 2, h - 6, { align: 'center', size: 12 });

      // True path
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let t = 0; t < T; t++) {
        const px = xToPix(t), py = yToPix(Fs[t]);
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Estimated paths per γ
      gammas.forEach((g, gi) => {
        const theta_eff = sigmaF2 * (1 + (1 + g) * SR * SR) + c * sigma_e2;
        const r2 = rho2(theta_eff, sigma_e2, c);
        const r = Math.sqrt(r2);
        // estimated path: r * F + (1-r) * noise (cumulative)
        const rng2 = mulberry32(seed + 1000 + gi);
        const noiseSd = Math.sqrt(Math.max(0, 1 - r2)) * Math.sqrt(sigmaF2);
        const Fhat = new Float64Array(T);
        Fhat[0] = 0;
        for (let t = 1; t < T; t++) {
          // simulate F̂_t as scaled F + independent noise increments
          const dF = (Fs[t] - Fs[t - 1]);
          Fhat[t] = Fhat[t - 1] + r * dF + noiseSd * randn(rng2);
        }
        ctx.strokeStyle = colors[gi];
        ctx.lineWidth = 1.5;
        ctx.setLineDash(gi === 0 ? [3, 3] : []);
        ctx.beginPath();
        for (let t = 0; t < T; t++) {
          const px = xToPix(t), py = yToPix(Fhat[t]);
          if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // legend right
        const lx = w - padR - 130, ly = padT + 12 + gi * 18;
        ctx.fillStyle = colors[gi];
        ctx.fillRect(lx, ly - 8, 12, 3);
        const label = g === -1 ? 'PCA (γ=−1)' : `RP-PCA γ=${g}`;
        U.text(ctx, `${label}: ρ²=${r2.toFixed(2)}`, lx + 18, ly - 4,
               { color: colors[gi], size: 11, bold: gi >= 2 });
      });

      // True path legend
      U.text(ctx, '— 진짜 path', w - padR - 130, padT - 6,
             { color: U.text(), size: 11, bold: true });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
