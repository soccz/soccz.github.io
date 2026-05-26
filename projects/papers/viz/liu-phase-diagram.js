/* viz: liu-phase-diagram - WD x LR phase diagram */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['liu-phase-diagram'] = function (canvas, controls, params) {
    let taskIdx = 0;
    const tasks = [
      { name: 'Modular Addition', p: 23 },
      { name: 'Modular Multiplication', p: 23 },
      { name: 'Parity (binary)', p: 16 }
    ];
    U.addSelect(controls, {
      label: 'Task',
      options: tasks.map((t, i) => ({ value: i.toString(), label: t.name })),
      value: '0',
      onChange: (v) => { taskIdx = parseInt(v); draw(); }
    });

    const wds = ['0', '1e-4', '1e-3', '1e-2', '1e-1', '1.0'];
    const lrs = ['1e-4', '3e-4', '1e-3', '3e-3', '1e-2', '3e-2'];
    const phaseGrids = [
      // Addition
      [['Conf','Conf','Mem','Mem','Mem','Mem'],
       ['Conf','Mem','Mem','Mem','Mem','Comp'],
       ['Mem','Mem','Mem','Comp','Gen','Gen'],
       ['Mem','Mem','Comp','Gen','Gen','Gen'],
       ['Conf','Comp','Comp','Comp','Comp','Conf'],
       ['Conf','Conf','Conf','Conf','Conf','Conf']],
      // Multiplication (slightly different)
      [['Conf','Conf','Mem','Mem','Mem','Mem'],
       ['Conf','Mem','Mem','Mem','Mem','Mem'],
       ['Mem','Mem','Mem','Comp','Comp','Gen'],
       ['Mem','Mem','Comp','Comp','Gen','Gen'],
       ['Conf','Comp','Comp','Comp','Comp','Conf'],
       ['Conf','Conf','Conf','Conf','Conf','Conf']],
      // Parity
      [['Conf','Conf','Mem','Mem','Mem','Mem'],
       ['Conf','Mem','Mem','Mem','Comp','Comp'],
       ['Mem','Mem','Comp','Gen','Gen','Gen'],
       ['Mem','Comp','Gen','Gen','Gen','Comp'],
       ['Conf','Comp','Comp','Comp','Conf','Conf'],
       ['Conf','Conf','Conf','Conf','Conf','Conf']],
    ];

    const phaseColors = {
      'Conf': '#94a3b8',
      'Mem': '#dc2626',
      'Comp': '#ca8a04',
      'Gen': '#16a34a'
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Phase Diagram — ${tasks[taskIdx].name} (paper Fig 3)`, w/2, 22);

      const padL = 90, padR = 40, padT = 50, padB = 100;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const grid = phaseGrids[taskIdx];
      const cellW = plotW / lrs.length;
      const cellH = plotH / wds.length;

      // Draw cells
      grid.forEach((row, i) => {
        row.forEach((phase, j) => {
          const x = padL + j * cellW;
          const y = padT + (wds.length - 1 - i) * cellH;  // flip y so WD increases upward
          ctx.fillStyle = phaseColors[phase];
          ctx.globalAlpha = 0.7;
          ctx.fillRect(x, y, cellW, cellH);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = U.text();
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cellW, cellH);
          // Phase label
          ctx.fillStyle = '#fff';
          ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(phase, x + cellW/2, y + cellH/2);
        });
      });

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      lrs.forEach((lr, j) => {
        ctx.fillText(lr, padL + j * cellW + cellW/2, padT + plotH + 4);
      });
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      wds.forEach((wd, i) => {
        ctx.fillText(wd, padL - 4, padT + (wds.length - 1 - i) * cellH + cellH/2);
      });

      // Axis titles
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Learning Rate', padL + plotW/2, h - 50);
      ctx.save();
      ctx.translate(20, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Weight Decay', 0, 0);
      ctx.restore();

      // Legend
      const lgY = padT + plotH + 30;
      const phases = [
        { c: '#94a3b8', name: 'Confusion' },
        { c: '#dc2626', name: 'Memorize' },
        { c: '#ca8a04', name: 'Comprehension' },
        { c: '#16a34a', name: 'Generalize ★' }
      ];
      let lx = padL;
      phases.forEach((p, i) => {
        ctx.fillStyle = p.c;
        ctx.fillRect(lx, lgY, 14, 14);
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(p.name, lx + 18, lgY + 7);
        lx += 110;
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
