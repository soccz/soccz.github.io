/* viz: sharpe-comparison
 * 논문 Table 1 재현 — PCA vs RP-PCA bar chart.
 * In-sample / Out-of-sample × K=3 / K=5 표시.
 */

(function () {
  const U = window.VIZ_UTIL;

  const DATA = {
    'K=3': {
      'PCA':    { IS: 0.17, OOS: 0.14 },
      'RP-PCA': { IS: 0.23, OOS: 0.18 }
    },
    'K=5': {
      'PCA':    { IS: 0.24, OOS: 0.17 },
      'RP-PCA': { IS: 0.53, OOS: 0.45 }
    }
  };

  VIZ_REGISTRY['rppca-sharpe-comparison'] = function (canvas, controls, params) {
    let group = params.group || 'K=5'; // K=3 or K=5
    let metric = params.metric || 'both'; // IS / OOS / both

    const groupBtns = makeBtnRow(controls, '요인 수', ['K=3', 'K=5'], group, (v) => { group = v; draw(); });
    const metBtns = makeBtnRow(controls, '평가', ['IS', 'OOS', 'both'], metric, (v) => { metric = v; draw(); });

    function makeBtnRow(controls, label, opts, value, onChange) {
      const wrap = document.createElement('label');
      const lab = document.createElement('span');
      lab.textContent = label;
      wrap.appendChild(lab);
      opts.forEach(opt => {
        const b = document.createElement('button');
        b.textContent = opt;
        b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
        if (opt === value) {
          b.style.background = U.accent();
          b.style.color = '#fff';
          b.style.borderColor = U.accent();
        }
        b.addEventListener('click', () => {
          wrap.querySelectorAll('button').forEach(x => {
            x.style.background = 'var(--surface)';
            x.style.color = 'var(--text-secondary)';
            x.style.borderColor = 'var(--border)';
          });
          b.style.background = U.accent();
          b.style.color = '#fff';
          b.style.borderColor = U.accent();
          onChange(opt);
        });
        wrap.appendChild(b);
      });
      controls.appendChild(wrap);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 30, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const cur = DATA[group];
      const methods = ['PCA', 'RP-PCA'];
      const metrics = (metric === 'both') ? ['IS', 'OOS'] : [metric];

      const yMax = 0.7;
      const yToPix = (y) => padT + (1 - y / yMax) * innerH;

      // grid
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 7);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 7; i++) {
        const y = padT + innerH * i / 7;
        const v = yMax - (yMax) * i / 7;
        ctx.fillText(v.toFixed(2), padL - 8, y);
      }
      // y label
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'Maximum Sharpe-ratio', 0, 0, { align: 'center', size: 12 });
      ctx.restore();
      U.text(ctx, group + ' factors', w / 2, padT - 6,
             { align: 'center', size: 12, bold: true, color: U.text() });

      // group bars: per method, sub-bars per metric
      const groupW = innerW / methods.length;
      const barW = (groupW * 0.5) / metrics.length;

      methods.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        // label under
        ctx.fillStyle = U.text();
        ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(m, cx, h - padB + 8);

        metrics.forEach((met, mei) => {
          const totalW = barW * metrics.length + 8 * (metrics.length - 1);
          const x = cx - totalW / 2 + mei * (barW + 8);
          const v = cur[m][met];
          const top = yToPix(v);
          ctx.fillStyle = m === 'PCA' ? U.textMuted() : U.accent();
          if (met === 'OOS') ctx.fillStyle = m === 'PCA' ? U.border() : U.accentSoft();
          ctx.fillRect(x, top, barW, h - padB - top);
          // value
          U.text(ctx, v.toFixed(2), x + barW / 2, top - 6,
                 { color: U.text(), size: 11, align: 'center', bold: true });
          // sub label
          U.text(ctx, met, x + barW / 2, h - padB + 26,
                 { color: U.textMuted(), size: 10, align: 'center' });
        });
      });

      // ratio annotation
      const pcaV = (metric === 'OOS') ? cur['PCA'].OOS : cur['PCA'].IS;
      const rpV  = (metric === 'OOS') ? cur['RP-PCA'].OOS : cur['RP-PCA'].IS;
      const ratio = rpV / Math.max(0.001, pcaV);
      U.text(ctx, `RP-PCA / PCA = ${ratio.toFixed(2)}×`,
             w - padR - 6, padT + 12,
             { color: U.accent(), size: 13, align: 'right', bold: true });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
