/* viz: liu-4-phases - 4 phase classification in train-val plane */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['liu-4-phases'] = function (canvas, controls, params) {
    let exampleIdx = 3;
    const examples = [
      { name: 'Confusion (random)', train: 0.05, val: 0.05, phase: 'Confusion' },
      { name: 'Memorize (overfit)', train: 0.98, val: 0.04, phase: 'Memorize' },
      { name: 'Comprehension (partial)', train: 0.96, val: 0.62, phase: 'Comprehension' },
      { name: 'Generalize (★ grokked)', train: 0.99, val: 0.98, phase: 'Generalize' }
    ];

    U.addSelect(controls, {
      label: 'Example',
      options: examples.map((e, i) => ({ value: i.toString(), label: e.name })),
      value: '3',
      onChange: (v) => { exampleIdx = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Train vs Val 4-Phase Classification (paper §4)', w/2, 22);
      const e = examples[exampleIdx];
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`Selected: ${e.name} (train=${e.train.toFixed(2)}, val=${e.val.toFixed(2)})`, w/2, 40);

      const padL = 70, padR = 40, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const plotSize = Math.min(plotW, plotH);
      const cx = padL + (plotW - plotSize) / 2;
      const cy = padT;

      const xToPix = (v) => cx + plotSize * v;
      const yToPix = (v) => cy + plotSize * (1 - v);

      // 4 quadrants
      const phaseAreas = [
        { name: 'Confusion', color: '#94a3b8', x0: 0, x1: 0.5, y0: 0, y1: 0.5 },
        { name: 'Memorize', color: '#dc2626', x0: 0.5, x1: 1.0, y0: 0, y1: 0.5 },
        { name: 'Comprehension', color: '#ca8a04', x0: 0.5, x1: 1.0, y0: 0.5, y1: 0.9 },
        { name: 'Generalize ★', color: '#16a34a', x0: 0.5, x1: 1.0, y0: 0.9, y1: 1.0 }
      ];

      phaseAreas.forEach(a => {
        ctx.fillStyle = a.color;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(xToPix(a.x0), yToPix(a.y1), plotSize * (a.x1 - a.x0), plotSize * (a.y1 - a.y0));
        ctx.globalAlpha = 1;
        ctx.fillStyle = a.color;
        ctx.font = '13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(a.name, xToPix((a.x0 + a.x1) / 2), yToPix((a.y0 + a.y1) / 2));
      });

      // Axes
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + plotSize); ctx.lineTo(cx + plotSize, cy + plotSize);
      ctx.stroke();

      // Ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = i / 4;
        ctx.fillText(`${Math.round(v * 100)}%`, cx - 6, yToPix(v));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 4; i++) {
        const v = i / 4;
        ctx.fillText(`${Math.round(v * 100)}%`, xToPix(v), cy + plotSize + 4);
      }

      // Selected point
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(xToPix(e.train), yToPix(e.val), 9, 0, 2*Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Train accuracy', cx + plotSize/2, h - 25);
      ctx.save();
      ctx.translate(cx - 35, cy + plotSize/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Val accuracy', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
