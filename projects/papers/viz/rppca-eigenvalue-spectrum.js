/* viz: eigenvalue-spectrum
 * 논문 Figure 9 재현 — γ별 정규화된 고유값 곡선.
 * 시뮬: 6개 요인 신호 + 잡음. PCA 대비 RP-PCA가 4-6번째 고유값을 끌어올림.
 */

(function () {
  const U = window.VIZ_UTIL;

  // 실증값 (Table 2) — 분산 신호
  const SIGNALS = [8.05, 0.27, 0.21, 0.14, 0.05, 0.04];
  const SR = [0.12, 0.10, 0.30, 0.50, 0.60, 0.40]; // 가정 (실증 미공개 — 시뮬용)

  VIZ_REGISTRY['rppca-eigenvalue-spectrum'] = function (canvas, controls, params) {
    let sigma_e2 = parseFloat(params.sigma_e2 || '1');
    let c = parseFloat(params.c || '0.57');
    let gammaShown = [-1, 0, 5, 10, 20];

    // toggles per gamma
    gammaShown.forEach(g => {
      const wrap = document.createElement('label');
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = true;
      inp.dataset.gamma = g;
      const lab = document.createElement('span');
      lab.textContent = `γ=${g}`;
      inp.addEventListener('change', () => draw());
      wrap.appendChild(inp);
      wrap.appendChild(lab);
      controls.appendChild(wrap);
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 26, padT = 26, padB = 44;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const N = SIGNALS.length;
      // y range
      let yMax = 0;
      const activeGammas = Array.from(controls.querySelectorAll('input[type=checkbox]'))
        .filter(c => c.checked).map(c => parseFloat(c.dataset.gamma));

      const series = activeGammas.map(g => {
        const eigs = SIGNALS.map((s, i) => {
          const mu2 = SR[i] * SR[i] * s;
          return s + (1 + g) * mu2 + c * sigma_e2;
        });
        const peak = Math.max(...eigs);
        if (peak > yMax) yMax = peak;
        return { gamma: g, eigs };
      });
      yMax *= 1.15;

      const xToPix = (i) => padL + (i / (N - 1)) * innerW;
      const yToPix = (y) => padT + (1 - y / yMax) * innerH;

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i < N; i++) {
        ctx.fillText((i + 1).toString(), xToPix(i), h - padB + 6);
      }
      U.text(ctx, '요인 번호', w / 2, h - 6, { align: 'center', size: 12 });

      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = yMax - yMax * i / 5;
        ctx.fillText(U.fmt(v, 1), padL - 8, padT + innerH * i / 5);
      }
      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, '정규화된 고유값', 0, 0, { align: 'center', size: 12 });
      ctx.restore();

      // Lines
      const palette = [U.textMuted(), U.info(), U.warn(), U.accent(), U.good()];
      series.forEach((s, idx) => {
        const color = palette[activeGammas.indexOf(s.gamma) % palette.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const px = xToPix(i), py = yToPix(s.eigs[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        // dots
        ctx.fillStyle = color;
        for (let i = 0; i < N; i++) {
          ctx.beginPath();
          ctx.arc(xToPix(i), yToPix(s.eigs[i]), 3.5, 0, 2 * Math.PI);
          ctx.fill();
        }
        // legend
        const lx = padL + 14 + idx * 70, ly = padT + 8;
        ctx.fillStyle = color;
        ctx.fillRect(lx, ly, 14, 3);
        U.text(ctx, `γ=${s.gamma}`, lx + 18, ly + 4, { color: color, size: 11, bold: true });
      });

      // Note about signal-strengthening at factor 5
      const f5x = xToPix(4);
      ctx.strokeStyle = U.accent();
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(f5x, padT);
      ctx.lineTo(f5x, h - padB);
      ctx.stroke();
      ctx.setLineDash([]);
      U.text(ctx, '5번째 요인\n(weak + high-SR)',
             f5x + 6, padT + 22, { color: U.accent(), size: 10 });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
