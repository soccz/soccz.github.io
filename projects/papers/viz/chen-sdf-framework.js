/* viz: chen-sdf-framework - SDF + GAN architecture */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chen-sdf-framework'] = function (canvas, controls, params) {
    let highlight = 'all';
    U.addSelect(controls, {
      label: 'Component',
      options: [
        { value: 'all',  label: 'Full architecture' },
        { value: 'gen',  label: 'Generator (SDF) only' },
        { value: 'disc', label: 'Discriminator (Moment) only' }
      ],
      value: 'all',
      onChange: (v) => { highlight = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('SDF + GAN Architecture (paper §3)', w/2, 22);

      const padL = 50, padR = 40, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const colSep = plotW / 3;

      // Generator (SDF) - left
      const genX = padL + colSep * 0.5;
      const showGen = (highlight === 'all' || highlight === 'gen');
      const showDisc = (highlight === 'all' || highlight === 'disc');

      function box(x, y, w_, h_, color, label, sublabel) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(x - w_/2, y - h_/2, w_, h_);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1;
        ctx.strokeRect(x - w_/2, y - h_/2, w_, h_);
        ctx.fillStyle = '#fff';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y - 5);
        if (sublabel) {
          ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.fillText(sublabel, x, y + 8);
        }
      }

      function arrow(x1, y1, x2, y2, color = U.text()) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI/6), y2 - 8 * Math.sin(angle - Math.PI/6));
        ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI/6), y2 - 8 * Math.sin(angle + Math.PI/6));
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Generator path
      if (showGen) {
        const baseY = padT + 30;
        const stepY = (plotH - 60) / 4;
        box(genX, baseY, 130, 30, '#94a3b8', 'Macro state s_t');
        box(genX, baseY + stepY, 130, 30, '#9333ea', 'LSTM encoder');
        box(genX, baseY + stepY * 2, 130, 30, '#2563eb', 'FFN g_θ', 'Generator');
        box(genX, baseY + stepY * 3, 130, 30, '#16a34a', 'SDF M_{t+1}', '★ output');
        arrow(genX, baseY + 15, genX, baseY + stepY - 15);
        arrow(genX, baseY + stepY + 15, genX, baseY + stepY * 2 - 15);
        arrow(genX, baseY + stepY * 2 + 15, genX, baseY + stepY * 3 - 15);

        ctx.fillStyle = '#2563eb';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('Generator', genX, padT + plotH - 10);
      }

      // Discriminator path
      const discX = padL + colSep * 2.5;
      if (showDisc) {
        const baseY = padT + 30;
        const stepY = (plotH - 60) / 4;
        box(discX, baseY, 130, 30, '#94a3b8', 'Macro state s_t');
        box(discX, baseY + stepY, 130, 30, '#9333ea', 'LSTM encoder');
        box(discX, baseY + stepY * 2, 130, 30, '#dc2626', 'FFN h_ω', 'Discriminator');
        box(discX, baseY + stepY * 3, 130, 30, '#ca8a04', 'Moment g(s_t)', '★ test instrument');
        arrow(discX, baseY + 15, discX, baseY + stepY - 15);
        arrow(discX, baseY + stepY + 15, discX, baseY + stepY * 2 - 15);
        arrow(discX, baseY + stepY * 2 + 15, discX, baseY + stepY * 3 - 15);

        ctx.fillStyle = '#dc2626';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillText('Discriminator', discX, padT + plotH - 10);
      }

      // Center - adversarial loss
      if (highlight === 'all') {
        const cx = padL + colSep * 1.5;
        const cy = padT + plotH / 2;
        box(cx, cy, 160, 50, '#000', 'min_θ max_ω L(θ, ω)', 'Adversarial loss');

        // Arrows from gen/disc to loss
        arrow(genX + 65, padT + 30 + (plotH - 60) * 0.75, cx - 80, cy, '#2563eb');
        arrow(discX - 65, padT + 30 + (plotH - 60) * 0.75, cx + 80, cy, '#dc2626');
      }
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
