/* viz: autoformer-architecture - Autoformer encoder-decoder architecture */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['autoformer-architecture'] = function (canvas, controls, params) {
    let highlight = 'all';
    U.addSelect(controls, {
      label: 'Component',
      options: [
        { value: 'all',     label: 'Full architecture' },
        { value: 'encoder', label: 'Encoder (Auto-Correlation)' },
        { value: 'decoder', label: 'Decoder (with decomposition)' },
        { value: 'decomp',  label: 'Series Decomposition block' }
      ],
      value: 'all',
      onChange: (v) => { highlight = v; draw(); }
    });

    function box(ctx, x, y, w_, h_, color, label, sub, faded) {
      ctx.fillStyle = color;
      ctx.globalAlpha = faded ? 0.25 : 0.8;
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
      ctx.fillText('Autoformer Architecture (paper Fig 1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const labels = {
        all: 'Encoder (Auto-Correlation) + Decoder (decomposition) + Auto-Correlation attention',
        encoder: 'Encoder: stack of (Auto-Correlation + SeriesDecomp + FFN)',
        decoder: 'Decoder: stack of (Self Auto-Corr + Cross Auto-Corr + SeriesDecomp + FFN)',
        decomp: 'Series Decomposition: x = trend (AvgPool) + seasonal (x - trend)'
      };
      ctx.fillText(labels[highlight], w/2, 40);

      const padL = 40, padT = 70;
      const plotW = w - padL * 2;

      const encX = padL + plotW * 0.25;
      const decX = padL + plotW * 0.75;

      const fadedEnc = (highlight === 'decoder' || highlight === 'decomp');
      const fadedDec = (highlight === 'encoder' || highlight === 'decomp');

      // Encoder
      box(ctx, encX, padT + 30, 160, 35, '#94a3b8', 'Past x_1..L', 'input', fadedEnc);
      arrow(ctx, encX, padT + 47, encX, padT + 80, '#000', fadedEnc);
      box(ctx, encX, padT + 100, 180, 35, '#2563eb', 'Auto-Correlation', 'FFT-based attention', fadedEnc);
      arrow(ctx, encX, padT + 117, encX, padT + 150, '#000', fadedEnc);
      box(ctx, encX, padT + 170, 180, 35, '#9333ea', 'Series Decomp', '(AvgPool trend split)', fadedEnc || highlight !== 'decomp' && highlight !== 'all');
      arrow(ctx, encX, padT + 187, encX, padT + 220, '#000', fadedEnc);
      box(ctx, encX, padT + 240, 180, 35, '#16a34a', 'FFN + Residual', '', fadedEnc);
      arrow(ctx, encX, padT + 257, encX, padT + 290, '#000', fadedEnc);
      box(ctx, encX, padT + 310, 180, 35, '#000', 'Encoder output', '(N layers stacked)', fadedEnc);

      ctx.fillStyle = fadedEnc ? '#aaa' : '#2563eb';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Encoder', encX, padT + 360);

      // Decoder
      box(ctx, decX, padT + 30, 160, 35, '#94a3b8', 'Future placeholder', '(decomposed init)', fadedDec);
      arrow(ctx, decX, padT + 47, decX, padT + 80, '#000', fadedDec);
      box(ctx, decX, padT + 100, 180, 35, '#dc2626', 'Self Auto-Corr', 'masked', fadedDec);
      arrow(ctx, decX, padT + 117, decX, padT + 150, '#000', fadedDec);
      box(ctx, decX, padT + 170, 180, 35, '#dc2626', 'Cross Auto-Corr', 'encoder → decoder', fadedDec);
      arrow(ctx, decX, padT + 187, decX, padT + 220, '#000', fadedDec);
      box(ctx, decX, padT + 240, 180, 35, '#9333ea', 'Series Decomp', 'trend accumulation', fadedDec);
      arrow(ctx, decX, padT + 257, decX, padT + 290, '#000', fadedDec);
      box(ctx, decX, padT + 310, 180, 35, '#000', 'Future x_{L+1..L+H}', '★ forecast', fadedDec);

      ctx.fillStyle = fadedDec ? '#aaa' : '#dc2626';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Decoder', decX, padT + 360);

      // Cross-attention arrow encoder → decoder
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.globalAlpha = (fadedEnc || fadedDec) ? 0.3 : 1;
      ctx.beginPath();
      ctx.moveTo(encX + 90, padT + 310);
      ctx.lineTo(decX - 90, padT + 170);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#9333ea';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('K, V from encoder', (encX + decX) / 2, padT + 240);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
