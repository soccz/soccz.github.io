/* viz: tg-elbo-derivation
 * Step-by-step ELBO derivation (Eq 4 → Eq 7).
 * Visualizes Eq 4 (full ELBO) → Eq 5 (KL decomposition) → Eq 6 (Gaussian closed-form)
 * → Eq 7 (epsilon-prediction with reparameterization).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-elbo-derivation'] = function (canvas, controls, params) {
    const steps = [
      {
        name: 'Step 0 — Goal',
        formula: '  minimize  -log p_θ(x⁰)',
        explain: 'Maximum likelihood: 데이터 x⁰ 의 negative log-likelihood 최소화. 그러나 p_θ(x⁰) = ∫ p_θ(x⁰:N) dx¹:N 적분 불가능.',
        eq: 'Direct MLE'
      },
      {
        name: 'Step 1 — ELBO (Eq 4)',
        formula: '  E_q[ -log p_θ(x⁰|x¹) + Σ_{n≥1} KL(q(x^{n-1}|x^n,x⁰) || p_θ(x^{n-1}|x^n)) ]',
        explain: 'Variational lower bound. q = forward process (closed-form). p_θ = reverse process (learn).',
        eq: 'Eq 4: ELBO'
      },
      {
        name: 'Step 2 — Closed-form q (Eq 5)',
        formula: '  q(x^{n-1}|x^n, x⁰) = N(x^{n-1}; μ̃_n(x^n, x⁰), β̃_n I)',
        explain: 'Forward posterior 는 Gaussian 으로 closed-form. μ̃ 와 β̃ 가 α 와 β 의 함수.',
        eq: 'Eq 5: Posterior'
      },
      {
        name: 'Step 3 — Reparametrize (Eq 6)',
        formula: '  μ_θ(x^n, n) = (1/√α_n)(x^n - β_n/√(1-ᾱ_n) · ε_θ)',
        explain: 'μ_θ 를 ε_θ (noise prediction) 로 재매개화. p_θ 의 mean 학습 = ε 학습과 동치.',
        eq: 'Eq 6: Mean reparametrization'
      },
      {
        name: 'Step 4 — Simplified Loss (Eq 7)',
        formula: '  L_simple = E_{n, x⁰, ε} [ ||ε - ε_θ(x^n, n)||² ]',
        explain: '★ 최종 학습 목표. KL term 의 weighting 무시 → simple MSE between true ε and predicted ε.',
        eq: 'Eq 7: Simplified objective'
      }
    ];

    let currentStep = 4; // start at final step

    U.addSlider(controls, {
      label: 'Derivation step', min: 0, max: steps.length - 1, step: 1, value: 4,
      onInput: (v) => { currentStep = parseInt(v); draw(); },
      fmt: (v) => `Step ${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('ELBO Derivation Chain — Eq 4 → Eq 7', w / 2, 26);

      // Step boxes
      const boxW = (w - 60) / steps.length;
      const boxH = 60;
      const boxY = 50;
      steps.forEach((s, si) => {
        const x = 30 + boxW * si;
        const active = si === currentStep;
        const past = si < currentStep;
        ctx.fillStyle = active ? U.accent() : (past ? U.good() : U.cssVar('--surface', '#f8fafc'));
        ctx.globalAlpha = active ? 1 : (past ? 0.5 : 0.3);
        ctx.fillRect(x + 4, boxY, boxW - 8, boxH);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = active ? U.text() : U.textMuted();
        ctx.lineWidth = active ? 2 : 1;
        ctx.strokeRect(x + 4, boxY, boxW - 8, boxH);

        ctx.fillStyle = active ? '#fff' : U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(s.eq, x + boxW / 2, boxY + 8);

        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(s.name.replace(/Step \d+ — /, ''), x + boxW / 2, boxY + 28);

        // Arrow
        if (si < steps.length - 1) {
          const ax = x + boxW - 4;
          const ay = boxY + boxH / 2;
          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + 8, ay);
          ctx.stroke();
        }
      });

      // Detail panel
      const detailY = boxY + boxH + 30;
      const detailH = h - detailY - 20;

      ctx.fillStyle = U.cssVar('--surface', '#f8fafc');
      ctx.globalAlpha = 0.5;
      ctx.fillRect(30, detailY, w - 60, detailH);
      ctx.globalAlpha = 1;

      const s = steps[currentStep];
      ctx.fillStyle = U.text();
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillText(s.name, 50, detailY + 16);

      // Formula box
      ctx.fillStyle = U.cssVar('--accent', '#2563eb');
      ctx.globalAlpha = 0.1;
      ctx.fillRect(50, detailY + 44, w - 100, 50);
      ctx.globalAlpha = 1;

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-mono', 'monospace');
      ctx.fillText(s.formula, 60, detailY + 64);

      // Explanation
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      // word wrap
      const maxW = w - 100;
      const words = s.explain.split(' ');
      let line = '';
      let y = detailY + 110;
      for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxW) {
          ctx.fillText(line, 50, y); y += 18;
          line = word + ' ';
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, 50, y);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
