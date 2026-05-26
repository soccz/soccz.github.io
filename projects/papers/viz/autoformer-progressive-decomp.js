/* viz: autoformer-progressive-decomp - progressive trend accumulation in decoder */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['autoformer-progressive-decomp'] = function (canvas, controls, params) {
    let layer = 2;
    const totalLayers = 4;
    U.addSlider(controls, {
      label: 'Decoder layer', min: 0, max: totalLayers, step: 1, value: 2,
      onInput: (v) => { layer = parseInt(v); draw(); },
      fmt: (v) => `layer ${v}/${totalLayers}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Progressive Trend Decomposition (paper §3.1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Decoder accumulates trend progressively across layers (layer ${layer}/${totalLayers})`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const T = 96;
      const Hpred = 48;
      const total = T + Hpred;
      const xToPix = (i) => padL + plotW * (i / total);
      const yMin = -1, yMax = 3;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      // Past observed signal
      const past = [];
      for (let i = 0; i < T; i++) {
        const trend = 0.5 + 0.012 * i;
        const seasonal = 0.4 * Math.sin(i * 0.4);
        past.push(trend + seasonal);
      }

      // True future
      const trueFuture = [];
      for (let i = 0; i < Hpred; i++) {
        const t = T + i;
        const trend = 0.5 + 0.012 * t;
        const seasonal = 0.4 * Math.sin(t * 0.4);
        trueFuture.push(trend + seasonal);
      }

      // Decoder's progressive trend forecast (improves with layer)
      const decoderTrend = [];
      for (let i = 0; i < Hpred; i++) {
        const t = T + i;
        const trueTrend = 0.5 + 0.012 * t;
        // Layer 0: only past mean (poor)
        // Layer totalLayers: nearly true trend
        const progress = layer / totalLayers;
        const pastMean = past.reduce((a,b)=>a+b, 0) / past.length;
        decoderTrend.push(pastMean + progress * (trueTrend - pastMean));
      }

      // Decoder's progressive seasonal forecast
      const decoderSeasonal = [];
      for (let i = 0; i < Hpred; i++) {
        const t = T + i;
        const trueSeasonal = 0.4 * Math.sin(t * 0.4);
        const progress = layer / totalLayers;
        decoderSeasonal.push(progress * trueSeasonal);
      }

      const decoderFull = decoderTrend.map((t, i) => t + decoderSeasonal[i]);

      // Plot past (gray)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      past.forEach((v, i) => {
        if (i === 0) ctx.moveTo(xToPix(i), yToPix(v));
        else ctx.lineTo(xToPix(i), yToPix(v));
      });
      ctx.stroke();

      // Plot true future (light blue, dashed)
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      trueFuture.forEach((v, i) => {
        const px = xToPix(T + i), py = yToPix(v);
        if (i === 0) {
          ctx.moveTo(xToPix(T - 1), yToPix(past[T - 1]));
          ctx.lineTo(px, py);
        } else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Plot decoder's trend prediction (green)
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      decoderTrend.forEach((v, i) => {
        const px = xToPix(T + i), py = yToPix(v);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Plot decoder's full prediction (red)
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      decoderFull.forEach((v, i) => {
        const px = xToPix(T + i), py = yToPix(v);
        if (i === 0) {
          ctx.moveTo(xToPix(T - 1), yToPix(past[T - 1]));
          ctx.lineTo(px, py);
        } else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Divider
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(T), padT); ctx.lineTo(xToPix(T), padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('past ←  | →  future', xToPix(T), padT - 6);

      // Legend
      const lgX = padL + 10, lgY = padT + 10;
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(lgX, lgY); ctx.lineTo(lgX + 16, lgY); ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('Past observation', lgX + 20, lgY);

      ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(lgX, lgY + 18); ctx.lineTo(lgX + 16, lgY + 18); ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('Decoder trend (accumulated)', lgX + 20, lgY + 18);

      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(lgX, lgY + 36); ctx.lineTo(lgX + 16, lgY + 36); ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.fillText('Full prediction (trend + seasonal)', lgX + 20, lgY + 36);

      ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(lgX, lgY + 54); ctx.lineTo(lgX + 16, lgY + 54); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.text();
      ctx.fillText('True future (oracle)', lgX + 20, lgY + 54);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right';
      ctx.fillText(layer === 0 ? 'Layer 0: untrained init' :
                   layer === totalLayers ? 'Final layer: trend nearly recovered' :
                   `Intermediate layer ${layer}`, padL + plotW - 8, padT + plotH - 8);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
