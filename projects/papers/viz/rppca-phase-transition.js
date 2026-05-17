/* viz: rppca-phase-transition  (clean rewrite)
 *
 * 보여주는 것: 신호 θ ↔ 검출 ρ² 의 관계.
 *  - i.i.d. 잔차 (Example 3) 명시 공식
 *  - PCA dot:    (θ_PCA, ρ²(θ_PCA))
 *  - RP-PCA dot: (θ_RP(γ), ρ²(θ_RP(γ)))   ← γ slider 로 이동
 *  - PCA curve   (전체 ρ²-vs-θ 점선)
 *  - 임계 영역 음영 (θ_crit 좌측 = "검출 불가" 회색)
 *
 * 단순 3개 슬라이더만: γ, σ²_F, μ_F.  (c, σ²_e 는 고정)
 */

(function () {
  const U = window.VIZ_UTIL;

  const SIGMA_E2 = 1;
  const C = 0.5;

  function thetaCrit() { return SIGMA_E2 * (C + Math.sqrt(C)); }

  function rho2(theta) {
    const crit = thetaCrit();
    if (theta <= crit) return 0;
    const sigmaF2 = theta - C * SIGMA_E2;
    if (sigmaF2 <= 0) return 0;
    const r = C * SIGMA_E2 / sigmaF2;
    const num = 1 - r;
    const den = 1 + r + (SIGMA_E2 / sigmaF2) * (C * C - C);
    if (den <= 0) return 0;
    return Math.max(0, Math.min(1, num / den));
  }

  VIZ_REGISTRY['rppca-phase-transition'] = function (canvas, controls, params) {
    let gamma   = parseFloat(params.gamma   || '5');
    let sigmaF2 = parseFloat(params.sigma_f2 || '0.05');
    let muF     = parseFloat(params.mu_f    || '0.4');

    U.addSlider(controls, {
      label: 'γ', min: -1, max: 30, step: 0.5, value: gamma,
      onInput: (v) => { gamma = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 1)
    });
    U.addSlider(controls, {
      label: 'σ²_F', min: 0.01, max: 0.5, step: 0.01, value: sigmaF2,
      onInput: (v) => { sigmaF2 = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });
    U.addSlider(controls, {
      label: 'μ_F',  min: 0.0, max: 0.6, step: 0.02, value: muF,
      onInput: (v) => { muF = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 56, padR = 28, padT = 26, padB = 44;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      if (innerW <= 0 || innerH <= 0) return;

      const crit = thetaCrit();

      // x range: 0 ~ ~3*crit  (이 범위 안에 PCA + RP-PCA 점이 들어오게)
      const SR2 = (muF * muF) / Math.max(1e-9, sigmaF2);
      const theta_PCA = sigmaF2 + C * SIGMA_E2;
      const theta_RP  = sigmaF2 * (1 + (1 + gamma) * SR2) + C * SIGMA_E2;
      const xMax = Math.max(crit * 2.5, theta_RP * 1.15, 3);
      const xMin = 0;

      const xToPix = (x) => padL + (x - xMin) / (xMax - xMin) * innerW;
      const yToPix = (y) => padT + (1 - y) * innerH;

      // 1. Shaded "no detection" region — 좌측 (0 ~ θ_crit)
      ctx.fillStyle = 'rgba(196,114,78,0.04)';
      ctx.fillRect(padL, padT, xToPix(crit) - padL, innerH);

      // 2. Grid
      ctx.strokeStyle = U.cssVar('--border-light', '#eee7de');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padT + innerH * i / 5;
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      }

      // 3. Axis
      ctx.strokeStyle = U.cssVar('--border', '#e5ddd3');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, padT + innerH);
      ctx.lineTo(padL + innerW, padT + innerH);
      ctx.stroke();

      // 4. Axis ticks/labels
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const y = padT + innerH * i / 5;
        ctx.fillText((1 - i / 5).toFixed(1), padL - 8, y);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const xTicks = 5;
      for (let i = 0; i <= xTicks; i++) {
        const x = xMin + (xMax - xMin) * i / xTicks;
        ctx.fillText(x.toFixed(1), xToPix(x), padT + innerH + 6);
      }
      U.text(ctx, '신호 θ', w / 2, h - 6, { align: 'center', size: 11, color: U.text() });
      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'ρ² (참 요인과의 상관²)', 0, 0, { align: 'center', size: 11, color: U.text() });
      ctx.restore();

      // 5. PCA curve (ρ² vs θ)
      ctx.strokeStyle = U.cssVar('--text-light', '#b5a898');
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      let started = false;
      const N = 240;
      for (let i = 0; i <= N; i++) {
        const x = xMin + (xMax - xMin) * i / N;
        const y = rho2(x);
        const px = xToPix(x), py = yToPix(y);
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. Critical line
      ctx.strokeStyle = U.bad();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xToPix(crit), padT);
      ctx.lineTo(xToPix(crit), padT + innerH);
      ctx.stroke();
      ctx.setLineDash([]);

      U.text(ctx, '검출 불가', xToPix(crit) - 8, padT + 14,
             { color: U.bad(), size: 11, bold: true, align: 'right' });
      U.text(ctx, '검출 가능', xToPix(crit) + 8, padT + 14,
             { color: U.good(), size: 11, bold: true });
      U.text(ctx, `θ_crit = ${crit.toFixed(2)}`, xToPix(crit), padT - 8,
             { color: U.bad(), size: 11, align: 'center' });

      // 7. Connecting line: PCA → RP-PCA (faint arrow)
      const pcaY = rho2(theta_PCA);
      const rpY  = rho2(theta_RP);
      ctx.strokeStyle = U.cssVar('--accent-soft', '#e8a98a');
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(xToPix(theta_PCA), yToPix(pcaY));
      ctx.lineTo(xToPix(theta_RP),  yToPix(rpY));
      ctx.stroke();
      ctx.setLineDash([]);

      // 8. PCA dot (gray)
      drawDot(ctx, xToPix(theta_PCA), yToPix(pcaY), 7, U.textMuted());
      const pcaLabel = pcaY < 0.001
        ? `PCA: ρ²=0 ✗ (검출 실패)`
        : `PCA: ρ²=${pcaY.toFixed(2)}`;
      drawLabel(ctx, pcaLabel, xToPix(theta_PCA), yToPix(pcaY), 'above',
                pcaY < 0.001 ? U.bad() : U.text());

      // 9. RP-PCA dot (orange, big)
      drawDot(ctx, xToPix(theta_RP), yToPix(rpY), 9, U.accent(), true);
      const rpLabel = rpY < 0.001
        ? `RP-PCA (γ=${gamma.toFixed(1)}): ρ²=0 ✗`
        : `RP-PCA (γ=${gamma.toFixed(1)}): ρ²=${rpY.toFixed(2)} ✓`;
      drawLabel(ctx, rpLabel, xToPix(theta_RP), yToPix(rpY), 'below',
                rpY < 0.001 ? U.bad() : U.accent(), true);

      // 10. Compact info footer (top right inside plot area)
      const info = `σ²_F=${sigmaF2.toFixed(2)} · μ_F=${muF.toFixed(2)} · SR=${Math.sqrt(SR2).toFixed(2)}`;
      U.text(ctx, info, w - padR - 6, padT + 28,
             { color: U.textMuted(), size: 10.5, align: 'right' });
    }

    function drawDot(ctx, x, y, r, color, withRing) {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
      if (withRing) {
        ctx.strokeStyle = U.bg();
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    function drawLabel(ctx, text, x, y, side, color, bold) {
      ctx.font = (bold ? '600 ' : '') + '11.5px ' +
                  U.cssVar('--font-display', 'Inter, sans-serif');
      const metrics = ctx.measureText(text);
      const tw = metrics.width + 14;
      const th = 22;
      let bx = x + 12;
      let by = side === 'above' ? y - 26 : y + 8;
      // clamp inside canvas
      const w = ctx.canvas.width / (window.devicePixelRatio || 1);
      if (bx + tw > w - 8) bx = x - 12 - tw;
      if (by < 4) by = y + 8;
      ctx.fillStyle = U.cssVar('--surface', '#fff');
      ctx.strokeStyle = U.cssVar('--border', '#e5ddd3');
      ctx.lineWidth = 1;
      roundRect(ctx, bx, by, tw, th, 5);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = color;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + 7, by + th / 2);
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
