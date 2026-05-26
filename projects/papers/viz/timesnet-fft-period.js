/* viz: timesnet-fft-period - FFT spectrum + top-k periods */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timesnet-fft-period'] = function (canvas, controls, params) {
    let topK = 5;

    U.addSlider(controls, {
      label: 'Top-k periods', min: 1, max: 10, step: 1, value: 5,
      onInput: (v) => { topK = parseInt(v); draw(); },
      fmt: (v) => `k=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('FFT Period Detection (paper §3.1)', w/2, 22);

      // Simulate multi-period TS spectrum
      const T = 96;
      const N_freq = T / 2 + 1;
      // Spectrum with peaks at known frequencies
      const peaks = [4, 8, 16, 32, 2, 24, 12, 6, 48, 20];
      const spectrum = new Array(N_freq).fill(0).map((_,i) => {
        let amp = 0.1 + 0.2 * Math.random();
        peaks.forEach((p, idx) => {
          if (Math.abs(i - p) < 1) amp += 1.0 - idx * 0.08;
        });
        return amp;
      });
      spectrum[0] = 0;  // DC

      // Top-k
      const sortedIdx = [...Array(N_freq).keys()].sort((a, b) => spectrum[b] - spectrum[a]);
      const topFreqs = sortedIdx.slice(0, topK);
      const periods = topFreqs.map(f => T / Math.max(f, 1));

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Top-${topK} periods: ${periods.map(p => p.toFixed(0)).join(', ')}`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xToPix = (f) => padL + plotW * (f / N_freq);
      const yMax = Math.max(...spectrum) * 1.1;
      const yToPix = (a) => padT + plotH * (1 - a / yMax);

      // Bars
      spectrum.forEach((a, f) => {
        if (f === 0) return;
        const isTop = topFreqs.includes(f);
        const px = xToPix(f);
        const py = yToPix(a);
        ctx.fillStyle = isTop ? '#dc2626' : '#2563eb';
        ctx.globalAlpha = isTop ? 1.0 : 0.6;
        ctx.fillRect(px, py, plotW / N_freq * 0.85, padT + plotH - py);
      });
      ctx.globalAlpha = 1;

      // Top-k annotation
      topFreqs.forEach((f, i) => {
        const px = xToPix(f);
        const py = yToPix(spectrum[f]);
        ctx.fillStyle = '#dc2626';
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center';
        ctx.fillText(`P=${(T/Math.max(f,1)).toFixed(0)}`, px, py - 6);
      });

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = yMax * (1 - i/4);
        ctx.fillText(v.toFixed(2), padL - 8, padT + plotH * i / 4);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 10, 20, 30, 40].forEach(f => {
        ctx.fillText(f.toString(), xToPix(f), padT + plotH + 6);
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('frequency index', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('amplitude', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
