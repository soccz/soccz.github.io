/* viz: dlap-network-architecture - 4 network components flow */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['dlap-network-architecture'] = function (canvas, controls, params) {
    let component = 'all';
    U.addSelect(controls, {
      label: 'Component',
      options: [
        { value: 'all',    label: 'Full pipeline (FFN+LSTM+GAN+SDF)' },
        { value: 'ffn',    label: 'FFN (characteristic transform)' },
        { value: 'lstm',   label: 'LSTM (macro state RNN)' },
        { value: 'gan',    label: 'GAN (moment selection)' },
        { value: 'sdf',    label: 'SDF (M output)' }
      ],
      value: 'all',
      onChange: (v) => { component = v; draw(); }
    });

    function box(ctx, x, y, w_, h_, color, label, sub, faded) {
      ctx.fillStyle = color;
      ctx.globalAlpha = faded ? 0.2 : 0.8;
      ctx.fillRect(x - w_/2, y - h_/2, w_, h_);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w_/2, y - h_/2, w_, h_);
      ctx.fillStyle = faded ? '#666' : '#fff';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, sub ? y - 5 : y);
      if (sub) {
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(sub, x, y + 8);
      }
    }

    function arrow(ctx, x1, y1, x2, y2, color = '#000', faded) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = faded ? 0.3 : 1;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.stroke();
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI/6), y2 - 8 * Math.sin(angle - Math.PI/6));
      ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI/6), y2 - 8 * Math.sin(angle + Math.PI/6));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('DLAP Network Architecture (paper Fig 1)', w/2, 22);

      const fadeFFN = (component !== 'all' && component !== 'ffn');
      const fadeLSTM = (component !== 'all' && component !== 'lstm');
      const fadeGAN = (component !== 'all' && component !== 'gan');
      const fadeSDF = (component !== 'all' && component !== 'sdf');

      const padL = 60, padR = 60, padT = 60;
      const plotW = w - padL - padR;

      // Input layer
      const inputY = padT + 30;
      box(ctx, padL + plotW * 0.25, inputY, 140, 35, '#94a3b8', 'Char. Z_{i,t}', '(46 firm chars)', false);
      box(ctx, padL + plotW * 0.75, inputY, 140, 35, '#94a3b8', 'Macro state s_t', '(178 vars)', false);

      // FFN + LSTM
      const layer2Y = inputY + 75;
      arrow(ctx, padL + plotW * 0.25, inputY + 18, padL + plotW * 0.25, layer2Y - 18, '#000', fadeFFN);
      arrow(ctx, padL + plotW * 0.75, inputY + 18, padL + plotW * 0.75, layer2Y - 18, '#000', fadeLSTM);
      box(ctx, padL + plotW * 0.25, layer2Y, 160, 40, '#2563eb', 'FFN', '(hidden 32)', fadeFFN);
      box(ctx, padL + plotW * 0.75, layer2Y, 160, 40, '#9333ea', 'LSTM', '(hidden 4)', fadeLSTM);

      // Merge → SDF
      const sdfY = layer2Y + 100;
      arrow(ctx, padL + plotW * 0.25, layer2Y + 20, padL + plotW * 0.4, sdfY - 18, '#000', fadeSDF);
      arrow(ctx, padL + plotW * 0.75, layer2Y + 20, padL + plotW * 0.6, sdfY - 18, '#000', fadeSDF);
      box(ctx, padL + plotW * 0.5, sdfY, 200, 40, '#16a34a', 'SDF M_{t+1}', '= w_t · R^e_{t+1}', fadeSDF);

      // GAN (moment selection) — parallel branch
      box(ctx, padL + plotW * 0.9, sdfY, 120, 40, '#dc2626', 'GAN g(I_t)', 'adversarial', fadeGAN);
      arrow(ctx, padL + plotW * 0.75, layer2Y + 20, padL + plotW * 0.9, sdfY - 18, '#000', fadeGAN);
      arrow(ctx, padL + plotW * 0.85, sdfY, padL + plotW * 0.6, sdfY, '#dc2626', fadeGAN);

      // No-arb output
      const lossY = sdfY + 90;
      arrow(ctx, padL + plotW * 0.5, sdfY + 20, padL + plotW * 0.5, lossY - 18, '#000', false);
      box(ctx, padL + plotW * 0.5, lossY, 240, 40, '#000', 'min_M max_g E[M·R^e · g]²', '★ no-arbitrage loss', false);

      // Labels
      ctx.fillStyle = fadeFFN ? '#888' : '#2563eb';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FFN branch', padL + plotW * 0.25, layer2Y - 50);
      ctx.fillStyle = fadeLSTM ? '#888' : '#9333ea';
      ctx.fillText('LSTM branch', padL + plotW * 0.75, layer2Y - 50);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
