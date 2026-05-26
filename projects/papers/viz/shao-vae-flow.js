/* viz: shao-vae-flow - VAE inference + fusion architecture */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['shao-vae-flow'] = function (canvas, controls, params) {
    let highlight = 'all';
    U.addSelect(controls, {
      label: 'Component',
      options: [
        { value: 'all',    label: 'Full architecture' },
        { value: 'vae',    label: 'VAE inference' },
        { value: 'fusion', label: 'Fusion Transformer' }
      ],
      value: 'all',
      onChange: (v) => { highlight = v; draw(); }
    });

    function box(ctx, x, y, w_, h_, color, label, sub) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(x - w_/2, y - h_/2, w_, h_);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w_/2, y - h_/2, w_, h_);
      ctx.fillStyle = '#fff';
      ctx.font = '11px ' + 'Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, sub ? y - 5 : y);
      if (sub) {
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(sub, x, y + 8);
      }
    }

    function arrow(ctx, x1, y1, x2, y2, color = '#000') {
      ctx.strokeStyle = color;
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
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QuantileFormer Architecture (paper §3)', w/2, 22);

      const padL = 50, padR = 50, padT = 50;
      const plotW = w - padL - padR;
      const colW = plotW / 3;

      const showVae = (highlight === 'all' || highlight === 'vae');
      const showFusion = (highlight === 'all' || highlight === 'fusion');

      // VAE column
      if (showVae) {
        const vaeX = padL + colW * 0.5;
        box(ctx, vaeX, padT + 50, 130, 35, '#94a3b8', 'Input TS x_t');
        arrow(ctx, vaeX, padT + 65, vaeX, padT + 110);
        box(ctx, vaeX, padT + 130, 130, 35, '#9333ea', 'VAE encoder', 'μ_φ, σ_φ');
        arrow(ctx, vaeX, padT + 145, vaeX, padT + 190);
        box(ctx, vaeX, padT + 210, 130, 35, '#2563eb', 'Latent z_t', 'pattern code');
        arrow(ctx, vaeX, padT + 225, vaeX, padT + 270);
        box(ctx, vaeX, padT + 290, 130, 35, '#9333ea', 'VAE decoder', 'reconstruction');
        ctx.fillStyle = '#9333ea';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VAE Inference', vaeX, padT + 340);
      }

      // Fusion column
      if (showFusion) {
        const fusX = padL + colW * 2.5;
        box(ctx, fusX, padT + 50, 150, 35, '#94a3b8', 'Pattern features', '(level/trend/seas)');
        arrow(ctx, fusX, padT + 65, fusX, padT + 110);
        box(ctx, fusX, padT + 130, 150, 35, '#16a34a', 'Fusion Transformer', 'attention');
        arrow(ctx, fusX, padT + 145, fusX, padT + 190);
        box(ctx, fusX, padT + 210, 150, 35, '#dc2626', 'Quantile heads', 'Q05/Q25/Q50/Q75/Q95');
        arrow(ctx, fusX, padT + 225, fusX, padT + 270);
        box(ctx, fusX, padT + 290, 150, 35, '#dc2626', 'Multi-quantile output', '★ forecast distribution');
        ctx.fillStyle = '#16a34a';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Fusion Transformer', fusX, padT + 340);
      }

      // Connecting arrow when both shown
      if (highlight === 'all') {
        const vaeX = padL + colW * 0.5;
        const fusX = padL + colW * 2.5;
        arrow(ctx, vaeX + 65, padT + 220, fusX - 75, padT + 130, '#9333ea');
        ctx.fillStyle = '#9333ea';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('z_t → patterns', (vaeX + fusX) / 2, padT + 165);
      }
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
