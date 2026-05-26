/* viz: acdc-ioi-circuit - IOI 26-edge circuit visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['acdc-ioi-circuit'] = function (canvas, controls, params) {
    let highlight = 'all';
    const groups = {
      all: 'All 26 edges',
      subject: 'Subject heads (4)',
      object: 'Object heads (6)',
      sInhibition: 'S-Inhibition heads (4)',
      nameMover: 'Name Mover heads (5)',
      io: 'IO detection heads (3)',
      mlp: 'MLP edges (4)',
    };

    U.addSelect(controls, {
      label: 'Highlight',
      options: Object.entries(groups).map(([k, v]) => ({ value: k, label: v })),
      value: 'all',
      onChange: (v) => { highlight = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('IOI 26-edge Circuit (paper §4 Figure 2)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('"When Mary and John went to the store, John gave a drink to ___" → "Mary"', w/2, 40);

      // Heads in 12-layer GPT-2 small grid
      const L = 12, H = 12;
      const padL = 80, padR = 40, padT = 70, padB = 50;
      const gridW = (w - padL - padR) / H;
      const gridH = (h - padT - padB) / L;

      // Circuit heads (paper §4 Figure 2)
      const circuit_heads = {
        subject:     [[9,9], [10,0], [9,6], [10,7]],
        object:      [[7,3], [7,9], [8,6], [8,10], [10,1], [10,2]],
        sInhibition: [[4,5], [4,11], [5,5], [5,8]],
        nameMover:   [[9,9], [10,7], [11,2], [11,3], [11,10]],
        io:          [[10,1], [10,2], [11,10]],
      };
      const colors = {
        subject: '#dc2626',
        object: '#ea580c',
        sInhibition: '#9333ea',
        nameMover: '#16a34a',
        io: '#0891b2',
        mlp: '#fbbf24',
      };

      // Background grid
      for (let l = 0; l < L; l++) {
        for (let head = 0; head < H; head++) {
          const x = padL + head * gridW;
          const y = padT + l * gridH;
          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 0.3;
          ctx.strokeRect(x, y, gridW, gridH);
        }
      }

      // Mark circuit heads
      Object.entries(circuit_heads).forEach(([group, heads]) => {
        const show = highlight === 'all' || highlight === group;
        if (!show) return;
        heads.forEach(([l, h_idx]) => {
          const x = padL + h_idx * gridW;
          const y = padT + l * gridH;
          ctx.fillStyle = colors[group];
          ctx.globalAlpha = 0.7;
          ctx.fillRect(x + 1, y + 1, gridW - 2, gridH - 2);
          ctx.globalAlpha = 1;
        });
      });

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let h_idx = 0; h_idx < H; h_idx++) {
        ctx.fillText(`H${h_idx}`, padL + h_idx * gridW + gridW/2, padT + L * gridH + 4);
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let l = 0; l < L; l++) {
        ctx.fillText(`L${l}`, padL - 4, padT + l * gridH + gridH/2);
      }

      // Legend
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      let ly = h - 28;
      Object.entries(groups).forEach(([key, label], i) => {
        if (key === 'all' || key === 'mlp') return;
        const lx = padL + (i-1) * 130;
        ctx.fillStyle = colors[key];
        ctx.fillRect(lx, ly - 4, 10, 8);
        ctx.fillStyle = U.text();
        ctx.fillText(label, lx + 14, ly);
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
