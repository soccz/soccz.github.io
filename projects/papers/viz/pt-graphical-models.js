/* viz: pt-graphical-models
 * Fig 1 panels (a)(b)(c)(d) — LDS / ProTran 1-layer / 3-layer Gen / 3-layer Inf.
 * Gen = black arrows (generative), Inf = red arrows (inference) per paper Fig 1 caption.
 */

(function () {
  const U = window.VIZ_UTIL;
  const GEN_COLOR = '#374151';  // near-black for generative
  const INF_COLOR = '#dc2626';  // red for inference

  VIZ_REGISTRY['pt-graphical-models'] = function (canvas, controls, params) {
    let mode = params.mode || 'lds';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Model';
    wb.appendChild(lb);
    [['lds', '(a) LDS'], ['protran1', '(b) ProTran 1-layer'], ['protran3gen', '(c) 3-layer Gen'], ['protran3inf', '(d) 3-layer Inf']].forEach(([k, label]) => {
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
      const titleMap = {
        lds:          '(a) Linear Dynamical System (Markovian, linear)',
        protran1:     '(b) ProTran 1-layer (non-Markovian via attention)',
        protran3gen:  '(c) ProTran 3-layer Generation (black arrows)',
        protran3inf:  '(d) ProTran 3-layer Inference (red arrows)'
      };
      ctx.fillText(titleMap[mode], w/2, 4);

      const ts = [0, 1, 2, 3, 4]; // 5 time steps
      const xPos = ts.map((_, i) => 80 + i * (w - 160) / (ts.length - 1));
      const yObs = h - 60;
      const isInf = (mode === 'protran3inf');
      const armColor = isInf ? INF_COLOR : GEN_COLOR;

      if (mode === 'lds') {
        const yZ = h / 2;
        ts.forEach((t, i) => node(ctx, xPos[i], yZ, `z${t+1}`, '#60a5fa'));
        ts.forEach((t, i) => node(ctx, xPos[i], yObs, `x${t+1}`, '#fbbf24'));
        // Generative arrows only (black) — LDS gen direction
        for (let i = 0; i < ts.length - 1; i++) {
          arrow(ctx, xPos[i] + 22, yZ, xPos[i+1] - 22, yZ, GEN_COLOR);
        }
        ts.forEach((_, i) => arrow(ctx, xPos[i], yZ + 22, xPos[i], yObs - 22, GEN_COLOR));
      } else if (mode === 'protran1') {
        const yZ = h / 2;
        ts.forEach((t, i) => node(ctx, xPos[i], yZ, `z${t+1}`, '#60a5fa'));
        ts.forEach((t, i) => node(ctx, xPos[i], yObs, `x${t+1}`, '#fbbf24'));
        for (let i = 0; i < ts.length; i++) {
          for (let j = i + 1; j < ts.length; j++) {
            ctx.strokeStyle = j - i === 1 ? GEN_COLOR : '#a78bfa';
            ctx.lineWidth = j - i === 1 ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(xPos[i], yZ - 22);
            ctx.bezierCurveTo(xPos[i], yZ - 60 - (j-i) * 15, xPos[j], yZ - 60 - (j-i) * 15, xPos[j], yZ - 22);
            ctx.stroke();
          }
        }
        ts.forEach((_, i) => arrow(ctx, xPos[i], yZ + 22, xPos[i], yObs - 22, GEN_COLOR));
      } else {
        // protran3gen or protran3inf — 3 stacked layers
        const layerYs = [h * 0.7, h * 0.5, h * 0.3];
        const layerColors = ['#60a5fa', '#a78bfa', '#ef4444'];
        for (let L = 0; L < 3; L++) {
          ts.forEach((t, i) => node(ctx, xPos[i], layerYs[L], `z${t+1}`, layerColors[L], 20));
          // Within layer attention — arrow direction depends on gen vs inf
          for (let i = 0; i < ts.length - 1; i++) {
            if (isInf) {
              arrow(ctx, xPos[i+1] - 20, layerYs[L], xPos[i] + 20, layerYs[L], armColor, 1.2);
            } else {
              arrow(ctx, xPos[i] + 20, layerYs[L], xPos[i+1] - 20, layerYs[L], armColor, 1.2);
            }
          }
          // Cross-layer arrows
          if (L < 2) {
            ts.forEach((_, i) => {
              if (isInf) {
                arrow(ctx, xPos[i], layerYs[L+1] + 20, xPos[i], layerYs[L] - 20, armColor, 1);
              } else {
                arrow(ctx, xPos[i], layerYs[L] - 20, xPos[i], layerYs[L+1] + 20, armColor, 1);
              }
            });
          }
        }
        // Emission / posterior between top latent and observation
        ts.forEach((t, i) => {
          node(ctx, xPos[i], yObs, `x${t+1}`, '#fbbf24', 18);
          if (isInf) {
            // Inference: x_t → top latent (posterior reads observations)
            arrow(ctx, xPos[i], yObs - 20, xPos[i], layerYs[0] + 20, armColor);
          } else {
            // Generation: top latent → x_t
            arrow(ctx, xPos[i], layerYs[0] + 20, xPos[i], yObs - 20, armColor);
          }
        });
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
        lds:          'Markovian — z_t depends only on z_{t-1}',
        protran1:     'Non-Markovian — z_t depends on z_{1:t-1} via attention',
        protran3gen:  'Generation: bottom-up across layers, latents → observations (Eq 12, 16-20)',
        protran3inf:  'Inference: observations → latents, smoothing-like (Eq 13)'
      };
      ctx.fillText(footMap[mode], w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
