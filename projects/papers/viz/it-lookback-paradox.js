/* viz: it-lookback-paradox
 * Lookback length paradox resolution (paper Figure 6).
 * MSE vs T for vanilla Transformer (paradox) vs iTransformer (monotone improvement).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['it-lookback-paradox'] = function (canvas, controls, params) {
    const lookbacks = [48, 96, 192, 336, 720];
    const dataLines = {
      'iTransformer': { values: [0.198, 0.178, 0.169, 0.163, 0.158], color: '#16a34a' },
      'iInformer': { values: [0.230, 0.216, 0.208, 0.201, 0.195], color: '#2563eb' },
      'iFlowformer': { values: [0.226, 0.210, 0.203, 0.197, 0.192], color: '#9333ea' },
      'Transformer (vanilla)': { values: [0.265, 0.277, 0.286, 0.298, 0.312], color: '#dc2626' },
      'Informer (vanilla)': { values: [0.298, 0.311, 0.320, 0.328, 0.341], color: '#ea580c' },
      'Flowformer (vanilla)': { values: [0.255, 0.267, 0.275, 0.284, 0.295], color: '#ca8a04' },
    };

    let showModels = ['iTransformer', 'iInformer', 'iFlowformer', 'Transformer (vanilla)', 'Informer (vanilla)', 'Flowformer (vanilla)'];
    let highlight = 'all';

    U.addSelect(controls, {
      label: 'Highlight',
      options: [
        { value: 'all', label: 'All models' },
        { value: 'inverted', label: 'iTransformer family' },
        { value: 'vanilla', label: 'Vanilla family' },
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
      ctx.fillText('Lookback Paradox Resolution (paper Figure 6) — ECL MSE', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Vanilla: lookback ↑ → MSE ↑ (paradox). iTransformer: lookback ↑ → MSE ↓ (monotone improvement).', w / 2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 100;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // y range
      let allVals = [];
      Object.values(dataLines).forEach(d => allVals = allVals.concat(d.values));
      const yMin = Math.min(...allVals) * 0.95;
      const yMax = Math.max(...allVals) * 1.05;

      const xMin = lookbacks[0];
      const xMax = lookbacks[lookbacks.length - 1];

      const xToPix = (x) => padL + innerW * (Math.log(x / xMin) / Math.log(xMax / xMin));
      const yToPix = (y) => padT + innerH * (1 - (y - yMin) / (yMax - yMin));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax - (yMax - yMin) * i / 5;
        ctx.fillText(v.toFixed(3), padL - 8, padT + innerH * i / 5);
      }
      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      lookbacks.forEach(x => {
        ctx.fillText(String(x), xToPix(x), padT + innerH + 6);
      });

      // Plot each line
      Object.entries(dataLines).forEach(([name, line]) => {
        const isInverted = name.startsWith('i');
        const isVisible = highlight === 'all' ||
                          (highlight === 'inverted' && isInverted) ||
                          (highlight === 'vanilla' && !isInverted);
        const alpha = isVisible ? 1 : 0.15;

        ctx.strokeStyle = line.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        lookbacks.forEach((x, i) => {
          const px = xToPix(x), py = yToPix(line.values[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // points
        lookbacks.forEach((x, i) => {
          const px = xToPix(x), py = yToPix(line.values[i]);
          ctx.fillStyle = line.color;
          ctx.beginPath(); ctx.arc(px, py, 3, 0, 2 * Math.PI); ctx.fill();
        });
        ctx.globalAlpha = 1;
      });

      // Legend (multi-line)
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const legendY = h - 60;
      Object.entries(dataLines).forEach(([name, line], i) => {
        const lx = padL + (i % 3) * 180;
        const ly = legendY + Math.floor(i / 3) * 18;
        ctx.fillStyle = line.color;
        ctx.fillRect(lx, ly - 3, 14, 6);
        ctx.fillStyle = U.text();
        ctx.fillText(name, lx + 18, ly);
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Lookback Length T (log scale)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('MSE', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
