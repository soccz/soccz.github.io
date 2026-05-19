/* viz: pt-graphical-models
 * Fig 1 idea — LDS vs ProTran (1-layer) vs ProTran (3-layer) graphical model viz.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['pt-graphical-models'] = function (canvas, controls, params) {
    let mode = params.mode || 'lds';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Model';
    wb.appendChild(lb);
    [['lds', 'LDS'], ['protran1', 'ProTran 1-layer'], ['protran3', 'ProTran 3-layer']].forEach(([k, label]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (k === mode) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        mode = k; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function arrow(ctx, x1, y1, x2, y2, color = '#6b7280', width = 1.5) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const ah = 7;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - ah * Math.cos(ang - 0.4), y2 - ah * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - ah * Math.cos(ang + 0.4), y2 - ah * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
    }

    function node(ctx, x, y, label, color = '#60a5fa', r = 22) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2*Math.PI); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2*Math.PI); ctx.stroke();
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const titleMap = { lds: 'Linear Dynamical System (Markovian, linear)', protran1: 'ProTran 1-layer (non-Markovian via attention)', protran3: 'ProTran 3-layer (hierarchical latents)' };
      ctx.fillText(titleMap[mode], w/2, 4);

      const ts = [0, 1, 2, 3, 4]; // 5 time steps
      const xPos = ts.map((_, i) => 80 + i * (w - 160) / (ts.length - 1));
      const yObs = h - 60;
      const yLatentTop = 40 + 20;

      if (mode === 'lds') {
        // 1 layer Markovian
        const yZ = h / 2;
        // Latents
        ts.forEach((t, i) => node(ctx, xPos[i], yZ, `z${t+1}`, '#60a5fa'));
        // Observations
        ts.forEach((t, i) => node(ctx, xPos[i], yObs, `x${t+1}`, '#fbbf24'));
        // Arrows: z_t → z_{t+1} (Markovian)
        for (let i = 0; i < ts.length - 1; i++) {
          arrow(ctx, xPos[i] + 22, yZ, xPos[i+1] - 22, yZ);
        }
        // Arrows: z_t → x_t (emission)
        ts.forEach((_, i) => arrow(ctx, xPos[i], yZ + 22, xPos[i], yObs - 22));
      } else if (mode === 'protran1') {
        // 1 layer non-Markovian (attention)
        const yZ = h / 2;
        ts.forEach((t, i) => node(ctx, xPos[i], yZ, `z${t+1}`, '#60a5fa'));
        ts.forEach((t, i) => node(ctx, xPos[i], yObs, `x${t+1}`, '#fbbf24'));
        // All pairs (i < j) connected (non-Markovian attention)
        for (let i = 0; i < ts.length; i++) {
          for (let j = i + 1; j < ts.length; j++) {
            const cx1 = xPos[i] + 22, cy1 = yZ - (j - i) * 5;
            const cx2 = xPos[j] - 22, cy2 = yZ - (j - i) * 5;
            ctx.strokeStyle = j - i === 1 ? '#6b7280' : '#a78bfa';
            ctx.lineWidth = j - i === 1 ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(xPos[i], yZ - 22);
            ctx.bezierCurveTo(xPos[i], yZ - 60 - (j-i) * 15, xPos[j], yZ - 60 - (j-i) * 15, xPos[j], yZ - 22);
            ctx.stroke();
          }
        }
        // emission
        ts.forEach((_, i) => arrow(ctx, xPos[i], yZ + 22, xPos[i], yObs - 22));
      } else if (mode === 'protran3') {
        // 3 stacked layers
        const layerYs = [h * 0.7, h * 0.5, h * 0.3];
        const layerColors = ['#60a5fa', '#a78bfa', '#ef4444'];
        for (let L = 0; L < 3; L++) {
          ts.forEach((t, i) => node(ctx, xPos[i], layerYs[L], `z${t+1}`, layerColors[L], 20));
          // Within layer non-Markovian
          for (let i = 0; i < ts.length - 1; i++) {
            arrow(ctx, xPos[i] + 20, layerYs[L], xPos[i+1] - 20, layerYs[L], '#a78bfa', 1);
          }
          // Cross-layer (down-up)
          if (L < 2) {
            ts.forEach((_, i) => arrow(ctx, xPos[i], layerYs[L] - 20, xPos[i], layerYs[L+1] + 20, '#6b7280', 1));
          }
        }
        // emission from top layer
        ts.forEach((t, i) => {
          node(ctx, xPos[i], yObs, `x${t+1}`, '#fbbf24', 18);
          arrow(ctx, xPos[i], layerYs[0] + 20, xPos[i], yObs - 20, '#6b7280');
        });
        // Labels for layers
        ctx.fillStyle = U.textMuted();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('Layer 3 (top)',    20, layerYs[2]);
        ctx.fillText('Layer 2',          20, layerYs[1]);
        ctx.fillText('Layer 1 (bot)',    20, layerYs[0]);
      }

      // Footer
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      const footMap = {
        lds: 'Markovian — z_t depends only on z_{t-1}',
        protran1: 'Non-Markovian — z_t depends on z_{1:t-1} via attention',
        protran3: 'Hierarchical — L=3 stochastic layers per time step'
      };
      ctx.fillText(footMap[mode], w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
