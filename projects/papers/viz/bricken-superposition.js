/* viz: bricken-superposition - feature superposition geometry */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['bricken-superposition'] = function (canvas, controls, params) {
    let n_features = 16;
    let d_neurons = 4;

    U.addSlider(controls, {
      label: 'Feature count N', min: 4, max: 32, step: 1, value: 16,
      onInput: (v) => { n_features = parseInt(v); draw(); },
      fmt: (v) => `N=${v}`
    });
    U.addSlider(controls, {
      label: 'Neuron count d', min: 2, max: 8, step: 1, value: 4,
      onInput: (v) => { d_neurons = parseInt(v); draw(); },
      fmt: (v) => `d=${v}`
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Superposition Geometry (paper §1)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const ratio = n_features / d_neurons;
      const interference = ratio > 1 ? Math.min(95, (ratio - 1) * 30) : 0;
      ctx.fillText(`N/d = ${ratio.toFixed(1)} (interference ≈ ${interference.toFixed(0)}%)`, w/2, 40);

      const padL = 60, padR = 40, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      // Left side: N features on simplex
      const cx_l = padL + plotW * 0.25;
      const cy_l = padT + plotH * 0.5;
      const r_l = Math.min(plotW * 0.18, plotH * 0.4);

      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx_l, cy_l, r_l, 0, 2*Math.PI);
      ctx.stroke();

      for (let i = 0; i < n_features; i++) {
        const angle = (i / n_features) * 2 * Math.PI - Math.PI/2;
        const fx = cx_l + r_l * Math.cos(angle);
        const fy = cy_l + r_l * Math.sin(angle);
        // Color by hue
        const hue = (i * 360 / n_features) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
        ctx.beginPath();
        ctx.arc(fx, fy, 5, 0, 2*Math.PI);
        ctx.fill();
      }
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`${n_features} features (high-dim)`, cx_l, cy_l + r_l + 30);

      // Arrow
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx_l + r_l + 20, cy_l);
      ctx.lineTo(padL + plotW * 0.55, cy_l);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padL + plotW * 0.55, cy_l);
      ctx.lineTo(padL + plotW * 0.55 - 8, cy_l - 5);
      ctx.lineTo(padL + plotW * 0.55 - 8, cy_l + 5);
      ctx.closePath();
      ctx.fillStyle = U.text();
      ctx.fill();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('W_compress', (cx_l + r_l + 20 + padL + plotW * 0.55) / 2, cy_l - 10);

      // Right side: d neurons (project N features → d positions)
      const cx_r = padL + plotW * 0.75;
      const cy_r = padT + plotH * 0.5;
      const r_r = Math.min(plotW * 0.18, plotH * 0.4);

      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx_r, cy_r, r_r, 0, 2*Math.PI);
      ctx.stroke();

      // d "ideal" neuron positions (vertices of polytope)
      const neuronPositions = [];
      for (let j = 0; j < d_neurons; j++) {
        const angle = (j / d_neurons) * 2 * Math.PI - Math.PI/2;
        neuronPositions.push({
          x: cx_r + r_r * 0.9 * Math.cos(angle),
          y: cy_r + r_r * 0.9 * Math.sin(angle),
          j
        });
      }
      neuronPositions.forEach(n => {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 10, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'center';
        ctx.fillText(`n${n.j}`, n.x, n.y + 3);
      });

      // Each feature projects to a *random combination* of neurons (superposition)
      // Plot each feature as a colored point near a random neuron, with overlap
      // 위에서 사용한 hue 와 매칭
      for (let i = 0; i < n_features; i++) {
        // pseudo-random assignment based on i
        const j = i % d_neurons;
        const phase = (i / n_features) * 2 * Math.PI;
        const jitterR = 18 + 4 * Math.sin(i * 1.7);
        const jitterA = phase + (j % 2 === 0 ? 0.5 : -0.5);
        const px = neuronPositions[j].x + jitterR * Math.cos(jitterA);
        const py = neuronPositions[j].y + jitterR * Math.sin(jitterA);
        const hue = (i * 360 / n_features) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, 2*Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`${d_neurons} neurons (low-dim)`, cx_r, cy_r + r_r + 30);

      // Interpretation banner
      ctx.fillStyle = ratio > 1 ? '#dc2626' : '#16a34a';
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(
        ratio > 1
          ? 'Superposition: features overlap (polysemantic)'
          : 'No superposition: features cleanly separated',
        w/2, padT + plotH - 8
      );
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
