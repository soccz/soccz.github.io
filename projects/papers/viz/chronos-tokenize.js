/* viz: chronos-tokenize - value to token mapping */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chronos-tokenize'] = function (canvas, controls, params) {
    let vocabSize = 4096;

    U.addSelect(controls, {
      label: 'Vocab size',
      options: [
        { value: '256',  label: '256 (coarse)' },
        { value: '1024', label: '1024' },
        { value: '4096', label: '4096 (★ default)' },
        { value: '16384',label: '16384 (fine)' }
      ],
      value: '4096',
      onChange: (v) => { vocabSize = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Chronos Tokenization (paper §3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const resolutionPct = (100 / vocabSize).toFixed(3);
      ctx.fillText(`Vocab=${vocabSize}, resolution = ${resolutionPct}% of data range`, w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      // Generate sample TS
      const T = 80;
      const samples = [];
      for (let i = 0; i < T; i++) {
        samples.push(0.5 + 0.3 * Math.sin(i * 0.4) + 0.1 * Math.cos(i * 1.3));
      }

      // Plot raw TS (top half)
      const halfH = plotH / 2;
      const xToPix = (i) => padL + plotW * (i / T);
      const yMin = 0, yMax = 1.0;
      const yToPixRaw = (v) => padT + halfH * (1 - (v - yMin) / (yMax - yMin));

      // Top: raw values
      U.drawAxes(ctx, w, padT + halfH + 20, padL, padR, padT, padT + halfH + 20 - h + padB);
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + halfH); ctx.lineTo(padL + plotW, padT + halfH);
      ctx.stroke();

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('Raw values', padL + 5, padT + 14);

      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      samples.forEach((v, i) => {
        const px = xToPix(i), py = yToPixRaw(v);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Bottom: token bins
      const yToPixTok = (v) => padT + halfH + 40 + halfH * (1 - (v - yMin) / (yMax - yMin));

      ctx.beginPath();
      ctx.moveTo(padL, padT + halfH + 40); ctx.lineTo(padL, padT + 2 * halfH + 40); ctx.lineTo(padL + plotW, padT + 2 * halfH + 40);
      ctx.strokeStyle = U.text();
      ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('Tokens (binned)', padL + 5, padT + halfH + 54);

      // Quantize values
      const n_bins = Math.min(vocabSize, 64);  // visual limit
      const tokens = samples.map(v => Math.floor(v * n_bins));

      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      tokens.forEach((t, i) => {
        const px = xToPix(i);
        const py = yToPixTok(t / n_bins);
        if (i === 0) ctx.moveTo(px, py);
        else {
          ctx.lineTo(xToPix(i-0.5), yToPixTok(tokens[i-1] / n_bins));
          ctx.lineTo(xToPix(i-0.5), py);
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();

      // Draw bin boundaries as horizontal lines
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 0.5;
      const visibleBins = Math.min(n_bins, 20);
      for (let b = 0; b <= visibleBins; b++) {
        const y = padT + halfH + 40 + halfH * (1 - b / visibleBins);
        ctx.beginPath();
        ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
      ctx.textAlign = 'right';
      ctx.fillText(`${vocabSize} bins`, padL + plotW - 5, padT + halfH + 54);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time step', padL + plotW/2, h - 30);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
