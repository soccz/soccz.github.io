/* viz: gu-ca-architecture - Conditional autoencoder architecture */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['gu-ca-architecture'] = function (canvas, controls, params) {
    let model = 'CA2';
    U.addSelect(controls, {
      label: 'Model',
      options: [
        { value: 'CA0', label: 'CA0 (no char layer)' },
        { value: 'CA1', label: 'CA1 (1 char layer)' },
        { value: 'CA2', label: 'CA2 (2 char layers) ★' },
        { value: 'CA3', label: 'CA3 (3 char layers)' }
      ],
      value: 'CA2',
      onChange: (v) => { model = v; draw(); }
    });

    // paper Table 3 VW K=5 annualized Sharpe ratios
    const sharpeValues = { 'CA0': 0.83, 'CA1': 1.48, 'CA2': 1.53, 'CA3': 1.51 };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`${model} Architecture (paper §3)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`VW Sharpe (K=5) = ${sharpeValues[model].toFixed(2)} — paper Table 3`, w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      // Architecture diagram
      const boxH = 50, gap = 50;
      const xCenter = padL + plotW / 2;
      const layers = ['Returns r_t', 'Encoder', 'Factor f_t', 'Decoder', 'r̂_t (reconstructed)'];
      const layerColors = ['#2563eb', '#16a34a', '#dc2626', '#16a34a', '#2563eb'];
      const totalH = layers.length * boxH + (layers.length - 1) * gap;
      const startY = padT + 80;

      layers.forEach((label, i) => {
        const y = startY + i * (boxH + gap);
        const boxW = 200;
        const x = xCenter - boxW / 2;
        ctx.fillStyle = layerColors[i];
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x, y, boxW, boxH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, boxW, boxH);
        ctx.fillStyle = '#fff';
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, x + boxW / 2, y + boxH / 2);

        // Arrow
        if (i < layers.length - 1) {
          ctx.strokeStyle = U.text();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xCenter, y + boxH);
          ctx.lineTo(xCenter, y + boxH + gap);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(xCenter, y + boxH + gap);
          ctx.lineTo(xCenter - 5, y + boxH + gap - 8);
          ctx.lineTo(xCenter + 5, y + boxH + gap - 8);
          ctx.closePath();
          ctx.fillStyle = U.text();
          ctx.fill();
        }
      });

      // Characteristics side input (for CA1+)
      if (model !== 'AE') {
        const charBoxX = xCenter + 130;
        const charBoxY = startY + (boxH + gap) * 1;
        const charW = 100, charH = 50;
        ctx.fillStyle = '#9333ea';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(charBoxX, charBoxY, charW, charH);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = U.text();
        ctx.strokeRect(charBoxX, charBoxY, charW, charH);
        ctx.fillStyle = '#fff';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('Chars Z_i,t', charBoxX + charW/2, charBoxY + charH/2 - 8);
        ctx.fillText('(94 features)', charBoxX + charW/2, charBoxY + charH/2 + 8);

        // Arrow to factor
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(charBoxX, charBoxY + charH/2);
        ctx.lineTo(xCenter + 100, charBoxY + charH/2);
        ctx.stroke();

        ctx.fillStyle = '#9333ea';
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        const layerCount = model === 'CA1' ? 1 : model === 'CA2' ? 2 : 3;
        ctx.fillText(`${layerCount} char layer(s)`, charBoxX, charBoxY + charH + 14);
      }
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
