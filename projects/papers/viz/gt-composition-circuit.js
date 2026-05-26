/* viz: gt-composition-circuit
 * Composition task 의 2-hop circuit visualization (paper §3.1).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['gt-composition-circuit'] = function (canvas, controls, params) {
    let step = 'input';

    U.addSelect(controls, {
      label: 'Stage',
      options: [
        { value: 'input', label: 'Input: (A, r1, r2)' },
        { value: 'hop1', label: 'Hop 1: A→B' },
        { value: 'hop2', label: 'Hop 2: B→C' },
        { value: 'output', label: 'Output: C' },
      ],
      value: 'input',
      onChange: (v) => { step = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Composition Task — 2-hop Reasoning Circuit', w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('Transitive: A → r1 → B → r2 → C 의 generalization circuit', w / 2, 40);

      const cx = w / 2;
      const cy = h / 2;
      const r = 50;
      const dx = 130;

      const nodes = [
        { label: 'A', x: cx - 2*dx, y: cy, color: '#dc2626', active: ['input', 'hop1', 'hop2', 'output'].includes(step) },
        { label: 'B', x: cx, y: cy, color: '#ea580c', active: ['hop1', 'hop2', 'output'].includes(step) },
        { label: 'C', x: cx + 2*dx, y: cy, color: '#16a34a', active: ['hop2', 'output'].includes(step) },
      ];

      // Edges
      const edges = [
        { from: 0, to: 1, label: 'r1', active: ['hop1', 'hop2', 'output'].includes(step) },
        { from: 1, to: 2, label: 'r2', active: ['hop2', 'output'].includes(step) },
      ];

      edges.forEach(e => {
        const n1 = nodes[e.from], n2 = nodes[e.to];
        ctx.strokeStyle = e.active ? '#fbbf24' : U.textMuted();
        ctx.lineWidth = e.active ? 3 : 1;
        ctx.beginPath();
        ctx.moveTo(n1.x + r, n1.y);
        ctx.lineTo(n2.x - r, n2.y);
        ctx.stroke();

        // Arrow head
        if (e.active) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(n2.x - r, n2.y);
          ctx.lineTo(n2.x - r - 10, n2.y - 6);
          ctx.lineTo(n2.x - r - 10, n2.y + 6);
          ctx.closePath();
          ctx.fill();
        }

        // Label
        ctx.fillStyle = e.active ? '#fbbf24' : U.textMuted();
        ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(e.label, (n1.x + n2.x) / 2, n2.y - 8);
      });

      // Nodes
      nodes.forEach((n, i) => {
        ctx.fillStyle = n.color;
        ctx.globalAlpha = n.active ? 1 : 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#fff';
        ctx.font = '600 24px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);
      });

      // Step description
      const descriptions = {
        input: '(1) Input token sequence: A, r1, r2 → Transformer processes 3 tokens',
        hop1: '(2) First-hop lookup: L5 attention head 3 fires → B = lookup(A, r1)',
        hop2: '(3) Second-hop chaining: L6 attention head 7 fires → C = lookup(B, r2)',
        output: '(4) Answer commitment: L7 MLP outputs C ← unembed(hidden state)'
      };
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(descriptions[step], w / 2, h - 60);

      // Circuit components annotation
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillText('Generalization circuit components (Chughtai 2024):', w / 2, h - 38);
      ctx.fillText('L5 head 3 = first-hop · L6 head 7 = chaining · L7 MLP = commitment', w / 2, h - 22);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
