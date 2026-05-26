/* viz: it-architecture-flow
 * iTransformer architecture flow (paper Figure 4).
 * Step-by-step highlight of 4 panels (a) Embedding, (b) Attention, (c) FFN, (d) LayerNorm.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-architecture-flow'] = function (canvas, controls, params) {
    const steps = [
      { name: 'Step 0: Input', desc: 'X ∈ R^{T×N}: T time steps × N variates' },
      { name: 'Step 1: Embedding (a)', desc: 'For each variate n: Linear(T → D). Output H ∈ R^{N×D}.' },
      { name: 'Step 2: Multivariate Attention (b)', desc: 'Self-attention over N variate tokens. Q,K,V ∈ R^{N×d_k}.' },
      { name: 'Step 3: FFN (c)', desc: 'For each variate token: Linear(D→4D)→GELU→Linear(4D→D). Series representation.' },
      { name: 'Step 4: Variate-LayerNorm (d)', desc: 'Variate-wise normalize. Eq 2: (h_n - μ_n) / σ_n.' },
      { name: 'Step 5: Loop ×L', desc: 'Repeat TrmBlock (attention + FFN + LayerNorm) L times.' },
      { name: 'Step 6: Projection', desc: 'Linear(D → S). Output Y ∈ R^{S×N}.' },
    ];

    let currentStep = 1;

    U.addSlider(controls, {
      label: 'Step', min: 0, max: steps.length - 1, step: 1, value: 1,
      onInput: (v) => { currentStep = parseInt(v); draw(); },
      fmt: (v) => steps[parseInt(v)].name.split(':')[0]
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`iTransformer Architecture (paper Figure 4) — ${steps[currentStep].name}`, w / 2, 22);

      // Pipeline diagram - vertical
      const blocks = [
        { name: 'Input X', shape: 'T × N', y: 60, color: '#9ca3af', stepIdx: 0 },
        { name: 'Variate Embedding', shape: 'T → D per variate', y: 110, color: '#2563eb', stepIdx: 1 },
        { name: 'Multivariate Attention', shape: 'N × N attention map', y: 165, color: '#dc2626', stepIdx: 2 },
        { name: 'Variate LayerNorm', shape: 'Eq 2 (variate-wise)', y: 220, color: '#9333ea', stepIdx: 4 },
        { name: 'FFN on Series', shape: 'D → 4D → D per token', y: 270, color: '#16a34a', stepIdx: 3 },
        { name: 'Variate LayerNorm', shape: 'Eq 2', y: 320, color: '#9333ea', stepIdx: 4 },
        { name: 'TrmBlock × L', shape: 'L blocks total', y: 370, color: '#ea580c', stepIdx: 5 },
        { name: 'Projection', shape: 'D → S per variate', y: 420, color: '#0891b2', stepIdx: 6 },
        { name: 'Output Y', shape: 'S × N forecast', y: 470, color: '#9ca3af', stepIdx: 6 },
      ];

      blocks.forEach((b, bi) => {
        const isActive = b.stepIdx === currentStep;
        const padBox = 8;
        const boxW = 360;
        const boxX = (w - boxW) / 2;
        const boxH = 36;

        ctx.fillStyle = b.color;
        ctx.globalAlpha = isActive ? 0.9 : 0.25;
        ctx.fillRect(boxX, b.y, boxW, boxH);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = isActive ? U.text() : U.textMuted();
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.strokeRect(boxX, b.y, boxW, boxH);

        ctx.fillStyle = isActive ? '#fff' : U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(b.name, boxX + padBox, b.y + boxH / 2 - 6);
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = isActive ? '#fff' : U.textMuted();
        ctx.fillText(b.shape, boxX + padBox, b.y + boxH / 2 + 8);

        // Arrow to next block
        if (bi < blocks.length - 1) {
          const ax = w / 2;
          const ay1 = b.y + boxH;
          const ay2 = blocks[bi + 1].y;
          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ax, ay1);
          ctx.lineTo(ax, ay2);
          ctx.stroke();
          // Arrow head
          ctx.beginPath();
          ctx.moveTo(ax - 4, ay2 - 4);
          ctx.lineTo(ax, ay2);
          ctx.lineTo(ax + 4, ay2 - 4);
          ctx.stroke();
        }
      });

      // Description
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const descY = h - 30;
      ctx.fillText(steps[currentStep].desc, w / 2, descY);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
