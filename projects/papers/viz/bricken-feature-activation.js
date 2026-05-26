/* viz: bricken-feature-activation - feature activation histogram */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['bricken-feature-activation'] = function (canvas, controls, params) {
    let featureType = 'mono_pronoun'; // mono_pronoun, mono_month, poly

    U.addSelect(controls, {
      label: 'Feature',
      options: [
        { value: 'mono_pronoun', label: 'feature 12 — male pronouns (monosemantic)' },
        { value: 'mono_month',   label: 'feature 847 — months (monosemantic)' },
        { value: 'poly',         label: 'feature 1289 — polysemantic (review)' }
      ],
      value: 'mono_pronoun',
      onChange: (v) => { featureType = v; draw(); }
    });

    const profiles = {
      mono_pronoun: {
        bins: [
          { x: 0.0, count: 1e5 },
          { x: 0.05, count: 3e3 },
          { x: 0.1, count: 1.5e3 },
          { x: 0.2, count: 700 },
          { x: 0.3, count: 400 },
          { x: 0.5, count: 300 },
          { x: 0.8, count: 250 },
          { x: 1.0, count: 200 },
          { x: 1.2, count: 150 },
          { x: 1.5, count: 60 }
        ],
        contexts: [
          { v: 1.47, c: '"...where he went to college..."' },
          { v: 1.42, c: '"He decided to start his own..."' },
          { v: 1.38, c: '"...visited him at his apartment..."' },
          { v: 1.33, c: '"...gave his daughter the keys..."' },
          { v: 1.31, c: '"...the king and his men marched..."' }
        ],
        label: 'CONCEPT: ★ Male pronoun ★ (monosemantic ✓)'
      },
      mono_month: {
        bins: [
          { x: 0.0, count: 9.8e4 },
          { x: 0.05, count: 2e3 },
          { x: 0.1, count: 1e3 },
          { x: 0.2, count: 500 },
          { x: 0.4, count: 350 },
          { x: 0.6, count: 280 },
          { x: 0.9, count: 200 },
          { x: 1.1, count: 150 },
          { x: 1.3, count: 80 }
        ],
        contexts: [
          { v: 1.31, c: '"...in January, the snow..."' },
          { v: 1.27, c: '"February is the shortest..."' },
          { v: 1.24, c: '"By December the lake..."' },
          { v: 1.21, c: '"...starting in September..."' },
          { v: 1.18, c: '"...around mid-March..."' }
        ],
        label: 'CONCEPT: ★ Months ★ (monosemantic ✓)'
      },
      poly: {
        bins: [
          { x: 0.0, count: 7e4 },
          { x: 0.05, count: 8e3 },
          { x: 0.15, count: 4e3 },
          { x: 0.3, count: 2e3 },
          { x: 0.5, count: 1e3 },
          { x: 0.7, count: 600 },
          { x: 1.0, count: 400 },
          { x: 1.3, count: 200 },
          { x: 1.5, count: 80 }
        ],
        contexts: [
          { v: 1.51, c: '"...the cat sat on the mat..."  ← "the"' },
          { v: 1.42, c: '"...the answer is forty-two..." ← "the"' },
          { v: 1.39, c: '"January is the first month..." ← "month"?' },
          { v: 1.35, c: '"the engine roared to life..."  ← "the"' },
          { v: 1.32, c: '"September is the ninth..."      ← "month"?' }
        ],
        label: 'CONCEPT: ☒ MIXED ["the", "month"] (polysemantic ✗)'
      }
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const p = profiles[featureType];

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Feature Activation Distribution (paper §4)', w/2, 22);
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = featureType === 'poly' ? '#dc2626' : '#16a34a';
      ctx.fillText(p.label, w/2, 42);

      // Two panels: histogram (left), top contexts (right)
      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = (w - padL - padR) * 0.55;
      const plotH = h - padT - padB;

      // Histogram
      U.drawHGrid(ctx, w, h, padL, padR + (w - padL - padR) * 0.45, padT, padB, 5);
      U.drawAxes(ctx, padL + plotW + 30, h, padL, padR + (w - padL - padR) * 0.45, padT, padB);
      ctx.strokeStyle = U.text();
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH);
      ctx.stroke();

      const xMax = 1.6;
      const yMax = Math.log10(2e5);  // log scale
      const xToPix = (x) => padL + plotW * (x / xMax);
      const yToPix = (cnt) => padT + plotH * (1 - Math.log10(Math.max(1, cnt)) / yMax);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const py = padT + plotH * i / 5;
        const v = Math.pow(10, yMax * (1 - i/5));
        ctx.fillText(v >= 1000 ? `${(v/1000).toFixed(0)}K` : v.toFixed(0), padL - 6, py);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 0.4, 0.8, 1.2, 1.6].forEach(x => {
        ctx.fillText(x.toFixed(1), xToPix(x), padT + plotH + 6);
      });

      // Bars
      const barW = plotW / 25;
      p.bins.forEach(b => {
        const px = xToPix(b.x);
        const py = yToPix(b.count);
        const hh = padT + plotH - py;
        ctx.fillStyle = b.x === 0 ? '#94a3b8' : (featureType === 'poly' ? '#dc2626' : '#2563eb');
        ctx.globalAlpha = b.x === 0 ? 1.0 : 0.85;
        ctx.fillRect(px, py, barW, hh);
      });
      ctx.globalAlpha = 1;

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Activation value', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Count (log scale)', 0, 0);
      ctx.restore();

      // Right panel: top contexts
      const ctxL = padL + plotW + 60;
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('Top-5 activating contexts:', ctxL, padT);
      ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
      p.contexts.forEach((c, i) => {
        const y = padT + 24 + i * 22;
        ctx.fillStyle = featureType === 'poly' ? '#dc2626' : '#2563eb';
        ctx.fillText(c.v.toFixed(2), ctxL, y);
        ctx.fillStyle = U.text();
        ctx.fillText(c.c, ctxL + 40, y);
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
