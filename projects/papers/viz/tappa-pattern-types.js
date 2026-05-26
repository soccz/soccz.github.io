/* viz: tappa-pattern-types - 5 attention pattern types */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['tappa-pattern-types'] = function (canvas, controls, params) {
    let selected = 'diagonal';
    const patterns = {
      diagonal: { name: 'Diagonal', desc: '인접 토큰 attention — local context aggregation', color: '#dc2626' },
      stripe: { name: 'Stripe', desc: '주기적 attention — cyclic structure', color: '#ea580c' },
      block: { name: 'Block', desc: '클러스터 내 attention — segment grouping', color: '#9333ea' },
      spike: { name: 'Spike', desc: '단일 토큰 attention — object identification', color: '#16a34a' },
      edge: { name: 'Edge', desc: '시작/끝 강조 — boundary emphasis', color: '#0891b2' },
    };

    U.addSelect(controls, {
      label: 'Pattern',
      options: Object.entries(patterns).map(([k, v]) => ({ value: k, label: v.name })),
      value: 'diagonal',
      onChange: (v) => { selected = v; draw(); }
    });

    function genPattern(type, T=16) {
      const m = [];
      for (let i = 0; i < T; i++) {
        const row = [];
        for (let j = 0; j < T; j++) {
          let v = 0;
          if (type === 'diagonal') {
            v = Math.exp(-Math.pow(i-j, 2) / 3);
          } else if (type === 'stripe') {
            v = Math.max(0, Math.cos((i-j) * Math.PI / 4)) * 0.8;
          } else if (type === 'block') {
            const bi = Math.floor(i / 4), bj = Math.floor(j / 4);
            v = bi === bj ? 0.8 + 0.2 * Math.random() : 0.1;
          } else if (type === 'spike') {
            v = j === 7 ? 0.9 : 0.05;
          } else if (type === 'edge') {
            v = (j === 0 || j === T-1) ? 0.85 : 0.05;
          }
          row.push(v);
        }
        m.push(row);
      }
      return m;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Attention Pattern Types — ${patterns[selected].name}`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(patterns[selected].desc, w/2, 40);

      const T = 16, padL = 80, padR = 40, padT = 70, padB = 60;
      const size = Math.min(w - padL - padR, h - padT - padB);
      const cell = size / T;
      const m = genPattern(selected, T);

      for (let i = 0; i < T; i++) {
        for (let j = 0; j < T; j++) {
          const v = m[i][j];
          ctx.fillStyle = patterns[selected].color;
          ctx.globalAlpha = Math.max(0.05, v);
          ctx.fillRect(padL + j*cell, padT + i*cell, cell, cell);
        }
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 0.5;
      ctx.strokeRect(padL, padT, size, size);

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Key position', padL + size/2, padT + size + 24);
      ctx.save();
      ctx.translate(padL - 30, padT + size/2);
      ctx.rotate(-Math.PI/2);
      ctx.fillText('Query position', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
