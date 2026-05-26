/* viz: gu-ipca-vs-ca - IPCA linear vs CA nonlinear comparison */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-ipca-vs-ca'] = function (canvas, controls, params) {
    let model = 'CA2';
    U.addSelect(controls, {
      label: 'Model',
      options: [
        { value: 'IPCA',  label: 'IPCA (linear baseline)' },
        { value: 'CA0',   label: 'CA0 (1-layer, no nonlin)' },
        { value: 'CA1',   label: 'CA1 (1 hidden layer)' },
        { value: 'CA2',   label: 'CA2 (2 hidden) ★ best' },
        { value: 'CA3',   label: 'CA3 (3 hidden)' }
      ],
      value: 'CA2',
      onChange: (v) => { model = v; draw(); }
    });

    let seedState;
    function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Conditional Beta Function Shape (paper Fig 3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const desc = {
        'IPCA': 'IPCA: β = linear(Z) — affine projection',
        'CA0':  'CA0: identical to IPCA (no hidden layer)',
        'CA1':  'CA1: β = ReLU(W₁·Z + b₁) → linear — mild nonlinearity',
        'CA2':  'CA2: 2-layer ReLU stack — moderate nonlinearity (★ paper best)',
        'CA3':  'CA3: 3-layer — high capacity, slight overfit risk'
      };
      ctx.fillText(desc[model], w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = -3, xMax = 3;
      const yMin = -1, yMax = 2;
      const xToPix = (z) => padL + plotW * (z - xMin) / (xMax - xMin);
      const yToPix = (b) => padT + plotH * (1 - (b - yMin) / (yMax - yMin));

      // β(Z) function shapes by model
      function betaFn(z) {
        switch(model) {
          case 'IPCA':
          case 'CA0':
            return 0.5 + 0.4 * z;  // linear
          case 'CA1':
            return 0.5 + 0.4 * Math.tanh(z);  // mild nonlinear
          case 'CA2':
            return 0.5 + 0.6 * Math.tanh(z * 0.8) - 0.1 * Math.sin(z * 1.5);  // richer
          case 'CA3':
            return 0.5 + 0.6 * Math.tanh(z * 0.8) - 0.1 * Math.sin(z * 1.5) + 0.05 * Math.cos(z * 3);  // noisier
        }
      }

      // Plot β(Z)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let z = xMin; z <= xMax; z += 0.05) {
        const b = betaFn(z);
        const px = xToPix(z), py = yToPix(b);
        if (z === xMin) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // True (oracle) β shape — same for comparison
      ctx.strokeStyle = '#16a34a';
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let z = xMin; z <= xMax; z += 0.05) {
        const b_true = 0.5 + 0.65 * Math.tanh(z * 0.9) - 0.05 * Math.sin(z * 1.4);
        const px = xToPix(z), py = yToPix(b_true);
        if (z === xMin) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(padL + 12, padT + 12); ctx.lineTo(padL + 28, padT + 12);
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText(model, padL + 32, padT + 16);

      ctx.strokeStyle = '#16a34a';
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL + 12, padT + 30); ctx.lineTo(padL + 28, padT + 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.text();
      ctx.fillText('Oracle β (true)', padL + 32, padT + 34);

      // Y/X ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/4);
        ctx.fillText(v.toFixed(1), padL - 6, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [-3, -2, -1, 0, 1, 2, 3].forEach(z => ctx.fillText(z.toString() + 'σ', xToPix(z), padT + plotH + 6));

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('characteristic Z (standardized)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('β loading', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
