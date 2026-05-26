/* viz: autoformer-decomposition - series decomposition (trend + seasonal) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['autoformer-decomposition'] = function (canvas, controls, params) {
    let kernelSize = 25;
    U.addSlider(controls, {
      label: 'Moving avg kernel', min: 5, max: 49, step: 2, value: 25,
      onInput: (v) => { kernelSize = parseInt(v); draw(); },
      fmt: (v) => `k=${v}`
    });

    function generateSeries(T) {
      const s = [];
      for (let t = 0; t < T; t++) {
        const trend = 0.5 + 0.005 * t;
        const seasonal = 0.3 * Math.sin(2 * Math.PI * t / 24) + 0.15 * Math.sin(2 * Math.PI * t / 96);
        const noise = (Math.random() - 0.5) * 0.05;
        s.push(trend + seasonal + noise);
      }
      return s;
    }

    function movingAverage(s, k) {
      const half = Math.floor(k / 2);
      const t = [];
      for (let i = 0; i < s.length; i++) {
        let sum = 0, count = 0;
        for (let j = Math.max(0, i - half); j <= Math.min(s.length - 1, i + half); j++) {
          sum += s[j]; count++;
        }
        t.push(sum / count);
      }
      return t;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Series Decomposition (paper §3.1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`x_t = trend + seasonal (kernel size = ${kernelSize})`, w/2, 40);

      const T = 200;
      const series = generateSeries(T);
      const trend = movingAverage(series, kernelSize);
      const seasonal = series.map((s, i) => s - trend[i]);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const totalH = h - padT - padB;
      const subH = totalH / 3 - 10;
      const plotW = w - padL - padR;

      function drawSubplot(yStart, data, label, color, yMin, yMax) {
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(label, padL, yStart);

        ctx.strokeStyle = U.text();
        ctx.lineWidth = 1;
        ctx.strokeRect(padL, yStart + 15, plotW, subH - 15);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        data.forEach((v, i) => {
          const px = padL + plotW * (i / T);
          const py = yStart + 15 + (subH - 15) * (1 - (v - yMin) / (yMax - yMin));
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }

      const minS = Math.min(...series), maxS = Math.max(...series);
      const minT = Math.min(...trend), maxT = Math.max(...trend);
      const minSe = Math.min(...seasonal), maxSe = Math.max(...seasonal);

      drawSubplot(padT, series, 'Original x_t', '#2563eb', minS - 0.05, maxS + 0.05);
      drawSubplot(padT + subH + 10, trend, 'Trend (moving avg)', '#16a34a', minT - 0.05, maxT + 0.05);
      drawSubplot(padT + 2 * (subH + 10), seasonal, 'Seasonal (x_t - trend)', '#dc2626', minSe - 0.05, maxSe + 0.05);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
