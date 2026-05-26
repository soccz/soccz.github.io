/* viz: chronos-scaling - model size scaling law */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['chronos-scaling'] = function (canvas, controls, params) {
    const sizes = [
      { name: 'T5-tiny',  params: 8,   wape: 0.281, latency: 10 },
      { name: 'T5-mini',  params: 20,  wape: 0.252, latency: 15 },
      { name: 'T5-small', params: 60,  wape: 0.231, latency: 25 },
      { name: 'T5-base',  params: 220, wape: 0.218, latency: 60 },
      { name: 'T5-large', params: 770, wape: 0.211, latency: 150 },
    ];
    let selected = 2;

    U.addSelect(controls, {
      label: 'Model size',
      options: sizes.map((s, i) => ({ value: i.toString(), label: `${s.name} (${s.params}M)` })),
      value: '2',
      onChange: (v) => { selected = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Chronos Scaling Law (paper Table 2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const s = sizes[selected];
      ctx.fillText(`${s.name}: ${s.params}M params, WAPE=${s.wape}, latency=${s.latency}ms`, w/2, 40);

      const padL = 70, padR = 50, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = Math.log10(5), xMax = Math.log10(1000);
      const xToPix = (p) => padL + plotW * (Math.log10(p) - xMin) / (xMax - xMin);
      const yMin = 0.20, yMax = 0.30;
      const yToPix = (wape) => padT + plotH * (1 - (wape - yMin) / (yMax - yMin));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + plotH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [10, 100, 1000].forEach(p => {
        ctx.fillText(`${p}M`, xToPix(p), padT + plotH + 6);
      });

      // Power law fit line
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const C = 0.281 * Math.pow(8, 0.18);  // baseline
      for (let p = 5; p <= 1000; p += 5) {
        const wape = C * Math.pow(p, -0.18);
        const px = xToPix(p), py = yToPix(wape);
        if (p === 5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Data points
      sizes.forEach((sz, i) => {
        const px = xToPix(sz.params), py = yToPix(sz.wape);
        ctx.fillStyle = i === selected ? '#dc2626' : '#2563eb';
        ctx.beginPath();
        ctx.arc(px, py, i === selected ? 9 : 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(sz.name.replace('T5-', ''), px, py - 8);
      });

      // Power law annotation
      ctx.fillStyle = '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('★ WAPE ∝ params^(-0.18)', padL + 10, padT + 14);

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Model parameters (M, log scale)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('WAPE (lower better)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
