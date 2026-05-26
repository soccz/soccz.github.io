/* viz: kmz-complexity-curve - OOS R² and Sharpe vs P (T=12, z=10³)
 * Approximates paper Figure 7 Panel A (R²) and Figure 8 Panel A (SR) at log₁₀(z)=3.
 */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['kmz-complexity-curve'] = function (canvas, controls, params) {
    let metric = 'sharpe';
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'sharpe', label: 'Sharpe ratio (Fig 8)' },
        { value: 'r2',     label: 'OOS R² (Fig 7)' }
      ],
      value: 'sharpe',
      onChange: (v) => { metric = v; draw(); }
    });

    // paper Figure 7/8 visual estimates at z=10³, T=12
    // c = P/T values: 0.17 (P=2), 1 (P=12), 5 (P=60), 10 (P=120), 50 (P=600), 1000 (P=12000)
    const Ps = [2, 12, 60, 120, 600, 12000];
    const Cs = Ps.map(p => p / 12);
    // Sharpe rises from ~0 to ~0.47 (Table I Panel A Nonlinear final ≈ 0.47)
    const sharpe = [0.02, 0.10, 0.25, 0.32, 0.42, 0.47];
    // R² at z=10³ from Figure 7 Panel A: near 0 with slight positive at high c
    const r2 = [-0.001, -0.005, -0.005, -0.003, 0.000, 0.006];

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Virtue of Complexity — empirical curve (T=12, z=10³)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`${metric === 'r2' ? 'OOS R² (Fig 7 Panel A)' : 'Sharpe (Fig 8 Panel A)'} vs P · RFF + Ridge`, w/2, 40);

      const padL = 70, padR = 30, padT = 60, padB = 70;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = 0, xMax = Math.log10(12000) + 0.3;
      const xToPix = (P) => padL + plotW * (Math.log10(P) - xMin) / (xMax - xMin);
      const values = metric === 'r2' ? r2 : sharpe;
      const yMin = metric === 'r2' ? Math.min(0, ...values) * 1.5 : 0;
      const yMax = metric === 'r2' ? 0.02 : 0.55;
      const yToPix = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

      const barW = plotW / Ps.length * 0.7;
      Ps.forEach((P, i) => {
        const cx = xToPix(P);
        const v = values[i];
        const py0 = yToPix(0);
        const py = yToPix(v);
        const isBest = (i === Ps.length - 1);
        ctx.fillStyle = isBest ? '#dc2626' : `hsl(${200 + i * 30}, 60%, 50%)`;
        ctx.fillRect(cx - barW/2, Math.min(py, py0), barW, Math.abs(py - py0));
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cx - barW/2, Math.min(py, py0), barW, Math.abs(py - py0));

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(`P=${P}`, cx, padT + plotH + 6);
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(`c=${Cs[i].toFixed(Cs[i]<1?2:0)}`, cx, padT + plotH + 22);

        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.textBaseline = v >= 0 ? 'bottom' : 'top';
        ctx.fillText(metric === 'r2' ? (v * 100).toFixed(2) + '%' : v.toFixed(2),
                     cx, v >= 0 ? py - 4 : py + 4);
      });

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * (1 - i/5);
        ctx.fillText(metric === 'r2' ? (yv * 100).toFixed(2) + '%' : yv.toFixed(2),
                     padL - 6, padT + plotH * i / 5);
      }

      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`★ ${metric === 'r2' ? 'OOS R² turns positive at high c' : 'Sharpe rises monotone — Virtue of Complexity'}`,
                   padL + plotW / 2, padT + 18);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Number of RFF features P (log scale)', padL + plotW/2, h - 18);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
