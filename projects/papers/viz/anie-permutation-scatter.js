/* viz: anie-permutation-scatter
 * Max attention vs median ∆ŷ (after 100 permutations).
 * Reproduces paper Figure 6 pattern.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['anie-permutation-scatter'] = function (canvas, controls, params) {
    // Synthetic data resembling paper Figure 6
    function generatePoints(scenario) {
      const points = [];
      const N = 300;
      // PRNG
      let seed = scenario === 'SST' ? 7 : scenario === 'IMDB' ? 13 : scenario === 'Diabetes' ? 23 : 31;
      function rand() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }

      for (let i = 0; i < N; i++) {
        const maxAlpha = rand() * 0.95 + 0.03;
        let dy;
        if (scenario === 'Diabetes') {
          // Diabetes: ∆ŷ correlates with maxAlpha (attention matters)
          dy = 0.05 + maxAlpha * 0.6 + (rand() - 0.5) * 0.2;
        } else if (scenario === 'bAbI 1') {
          // bAbI 1: bimodal — some clean (low dy), some noisy
          if (rand() < 0.6) {
            dy = rand() * 0.05;
          } else {
            dy = 0.1 + rand() * 0.3;
          }
        } else {
          // SST, IMDB, etc.: ∆ŷ stays low regardless of maxAlpha
          dy = rand() * 0.08 * Math.pow(1 - maxAlpha, 1.5);
        }
        dy = Math.max(0, Math.min(0.7, dy));
        const cls = rand() > 0.5 ? 1 : 0;
        points.push({ x: maxAlpha, y: dy, cls });
      }
      return points;
    }

    const datasets = ['SST', 'IMDB', 'Diabetes', 'bAbI 1'];
    let ds = 'SST';

    U.addSelect(controls, {
      label: 'Dataset',
      options: datasets.map(d => ({ value: d, label: d })),
      value: 'SST',
      onChange: (v) => { ds = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Permutation Test — ${ds} (BiLSTM)`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const note = ds === 'Diabetes'
        ? 'Diabetes: ∆ŷ correlates with max α — attention is partly meaningful (high-precision tokens)'
        : 'Most: large max α with tiny ∆ŷ — attention position is not the prediction driver';
      ctx.fillText(note, w / 2, 40);

      const points = generatePoints(ds);

      // Axes
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMax = 1.0, yMax = 0.7;
      const xToPix = (x) => padL + innerW * (x / xMax);
      const yToPix = (y) => padT + innerH * (1 - y / yMax);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax * (1 - i / 5);
        ctx.fillText(v.toFixed(2), padL - 8, padT + innerH * i / 5);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= 5; i++) {
        const v = i / 5;
        ctx.fillText(v.toFixed(1), padL + innerW * i / 5, padT + innerH + 6);
      }

      // "Faithful" reference line: ∆ŷ = max α
      ctx.strokeStyle = U.textMuted();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xToPix(0), yToPix(0));
      ctx.lineTo(xToPix(yMax / 1.0), yToPix(yMax)); // diagonal segment
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText('"faithful" line: ∆ŷ = max α', xToPix(0.55), yToPix(0.55) - 6);

      // Points
      for (const p of points) {
        ctx.fillStyle = p.cls === 0 ? '#ea580c' : '#7c3aed';
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(xToPix(p.x), yToPix(p.y), 3, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Legend
      ctx.fillStyle = '#ea580c';
      ctx.beginPath(); ctx.arc(padL + 14, padT + 14, 4, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('class 0', padL + 22, padT + 14);
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath(); ctx.arc(padL + 82, padT + 14, 4, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = U.text();
      ctx.fillText('class 1', padL + 90, padT + 14);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('max α (largest attention weight)', padL + innerW / 2, h - 6);
      ctx.save();
      ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('Median ∆ŷ (over 100 permutations)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
