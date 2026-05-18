/* viz: dlap-sdf-surface
 * Chen-Pelger-Zhu (2021) paper Figs 14, 15 재현 — SDF weight ω 의 pairwise interaction.
 *
 * 2D contour: ω(char1, char2) where both chars in [-0.5, 0.5] (quantile).
 * Selectable pairs:
 *  - ST_REV × r12_2 (paper Fig 15a)
 *  - LME × BEME (paper Fig 15b)
 *
 * 함수형은 paper 본문 발견 ("low ST_REV + high momentum → high positive weight") 와 시각 reading 기반.
 */

(function () {
  const U = window.VIZ_UTIL;

  const PAIRS = {
    'ST_REV × r12_2 (momentum)': {
      // paper Fig 15a 패턴: low ST_REV + high mom → high pos weight; high ST_REV + low mom → neg
      f: (x, y) => -0.08 * x + 0.04 * y + 0.18 * (-x) * y - 0.02 * x * x,
      x_label: 'ST_REV',
      y_label: 'r12_2 (momentum)',
      caption: 'Saddle pattern — multiplicative interaction. Low ST_REV + High mom = highest weight.'
    },
    'LME × BEME (size × value)': {
      // paper Fig 15b: 작은 small + value 가중 다름
      f: (x, y) => -0.012 * x + 0.005 * y + 0.025 * (-x) * y + 0.004 * y * y,
      x_label: 'LME (size)',
      y_label: 'BEME (book-to-market)',
      caption: 'Size × value interaction — small stocks have different value exposure than large.'
    }
  };

  function colorScale(v, vMin, vMax) {
    // diverging blue-white-red
    const t = (v - vMin) / (vMax - vMin);
    const tc = Math.max(0, Math.min(1, t));
    if (tc < 0.5) {
      const k = tc / 0.5;
      const r = Math.round(59 + (255 - 59) * k);
      const g = Math.round(130 + (255 - 130) * k);
      const b = Math.round(246 + (255 - 246) * k);
      return `rgb(${r},${g},${b})`;
    } else {
      const k = (tc - 0.5) / 0.5;
      const r = Math.round(255 + (239 - 255) * k);
      const g = Math.round(255 + (68 - 255) * k);
      const b = Math.round(255 + (68 - 255) * k);
      return `rgb(${r},${g},${b})`;
    }
  }

  VIZ_REGISTRY['dlap-sdf-surface'] = function (canvas, controls, params) {
    let pair = params.pair || 'ST_REV × r12_2 (momentum)';

    /* pair selector */
    const w1 = document.createElement('label');
    const l1 = document.createElement('span'); l1.textContent = 'Pair';
    w1.appendChild(l1);
    Object.keys(PAIRS).forEach(name => {
      const b = document.createElement('button');
      b.textContent = name;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.78rem;';
      if (name === pair) {
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        w1.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)'; x.style.color = 'var(--text-secondary)'; x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent(); b.style.color = '#fff'; b.style.borderColor = U.accent();
        pair = name;
        draw();
      });
      w1.appendChild(b);
    });
    controls.appendChild(w1);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 64, padR = 130, padT = 60, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const spec = PAIRS[pair];
      const N = 80; // resolution

      // Compute z values
      let zMin = Infinity, zMax = -Infinity;
      const zs = [];
      for (let i = 0; i < N; i++) {
        zs[i] = [];
        for (let j = 0; j < N; j++) {
          const x = -0.5 + (i / (N - 1));
          const y = -0.5 + (j / (N - 1));
          const z = spec.f(x, y);
          zs[i][j] = z;
          zMin = Math.min(zMin, z);
          zMax = Math.max(zMax, z);
        }
      }
      // Symmetric range for diverging colormap
      const zAbs = Math.max(Math.abs(zMin), Math.abs(zMax));
      const range = zAbs;
      const vMin = -range, vMax = range;

      const cellW = innerW / N;
      const cellH = innerH / N;

      // Draw cells
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          ctx.fillStyle = colorScale(zs[i][j], vMin, vMax);
          ctx.fillRect(
            padL + i * cellW,
            padT + (N - 1 - j) * cellH,
            cellW + 0.5,
            cellH + 0.5
          );
        }
      }

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(spec.x_label + '  (quantile in [-0.5, 0.5])', padL + innerW / 2, h - padB + 18);
      ctx.save();
      ctx.translate(16, padT + innerH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(spec.y_label + '  (quantile)', 0, 0);
      ctx.restore();

      // Axis ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [-0.5, -0.25, 0, 0.25, 0.5].forEach(v => {
        const x = padL + ((v + 0.5)) * innerW;
        ctx.fillText(v.toFixed(2), x, h - padB + 4);
      });
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [-0.5, -0.25, 0, 0.25, 0.5].forEach(v => {
        const y = padT + (1 - (v + 0.5)) * innerH;
        ctx.fillText(v.toFixed(2), padL - 6, y);
      });

      // title
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('paper Fig 15 · SDF weight ω  contour · ' + pair, w / 2, padT - 46);
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillText(spec.caption, w / 2, padT - 28);

      // Color legend
      const lgX = padL + innerW + 20, lgY = padT, lgW = 18, lgH = innerH;
      for (let k = 0; k < 100; k++) {
        const v = vMin + (vMax - vMin) * (k / 99);
        ctx.fillStyle = colorScale(v, vMin, vMax);
        ctx.fillRect(lgX, lgY + (1 - k / 99) * lgH, lgW, lgH / 99 + 1);
      }
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.strokeRect(lgX, lgY, lgW, lgH);

      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(vMax.toFixed(3), lgX + lgW + 4, lgY);
      ctx.fillText('0', lgX + lgW + 4, lgY + lgH / 2);
      ctx.fillText(vMin.toFixed(3), lgX + lgW + 4, lgY + lgH);
      ctx.save();
      ctx.translate(lgX + lgW + 38, lgY + lgH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('ω (SDF weight)', 0, 0);
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
