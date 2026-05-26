/* viz: power-modular-task - modular arithmetic visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['power-modular-task'] = function (canvas, controls, params) {
    let p = 7;
    U.addSelect(controls, {
      label: 'Prime p',
      options: [
        { value: '5',  label: 'p = 5 (toy)' },
        { value: '7',  label: 'p = 7' },
        { value: '11', label: 'p = 11' },
        { value: '17', label: 'p = 17 (medium)' }
      ],
      value: '7',
      onChange: (v) => { p = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Modular Addition Table mod ${p} (paper §3)`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${p*p} pairs total. Train 30% → ${Math.round(p*p*0.3)} visible.`, w/2, 40);

      const padL = 80, padR = 40, padT = 60, padB = 40;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const cellSize = Math.min(plotW / (p + 2), plotH / (p + 2));

      const tableLeft = padL + (plotW - cellSize * (p + 1)) / 2;
      const tableTop = padT + (plotH - cellSize * (p + 1)) / 2;

      // Header: b values
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let b = 0; b < p; b++) {
        ctx.fillText(b.toString(), tableLeft + (b + 1) * cellSize + cellSize/2, tableTop + cellSize/2);
      }
      // Header: a values
      for (let a = 0; a < p; a++) {
        ctx.fillText(a.toString(), tableLeft + cellSize/2, tableTop + (a + 1) * cellSize + cellSize/2);
      }

      // Corner label
      ctx.fillStyle = U.textMuted();
      ctx.fillText('a\\b', tableLeft + cellSize/2, tableTop + cellSize/2);

      // Determine which cells are "train" (random sample of 30%)
      let seedState = 42;
      function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }
      const trainSet = new Set();
      const pairs = [];
      for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) pairs.push([a, b]);
      // Shuffle
      for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
      }
      const nTrain = Math.round(p * p * 0.3);
      for (let i = 0; i < nTrain; i++) trainSet.add(`${pairs[i][0]},${pairs[i][1]}`);

      // Draw cells
      for (let a = 0; a < p; a++) {
        for (let b = 0; b < p; b++) {
          const result = (a + b) % p;
          const x = tableLeft + (b + 1) * cellSize;
          const y = tableTop + (a + 1) * cellSize;
          const isTrain = trainSet.has(`${a},${b}`);
          // Background
          ctx.fillStyle = isTrain ? 'rgba(22, 163, 74, 0.3)' : 'rgba(220, 38, 38, 0.15)';
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          // Result
          ctx.fillStyle = U.text();
          ctx.font = '12px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(result.toString(), x + cellSize/2, y + cellSize/2);
        }
      }

      // Border
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tableLeft, tableTop, cellSize * (p + 1), cellSize * (p + 1));

      // Legend
      ctx.fillStyle = 'rgba(22, 163, 74, 0.5)';
      ctx.fillRect(padL, padT + plotH + 5, 12, 10);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('Train (30%)', padL + 18, padT + plotH + 11);
      ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
      ctx.fillRect(padL + 110, padT + plotH + 5, 12, 10);
      ctx.fillStyle = U.text();
      ctx.fillText('Val (70%) — must generalize!', padL + 128, padT + plotH + 11);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
