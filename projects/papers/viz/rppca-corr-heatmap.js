/* viz: corr-heatmap
 * 4x4 추정-진짜 요인 |상관| 행렬 — PCA vs RP-PCA 두 패널.
 * PCA는 대각성분에서 4번째 요인 매칭이 약함 (~0.18). RP-PCA(γ=10)는 강함 (~0.78).
 */

(function () {
  const U = window.VIZ_UTIL;

  // 시뮬 결과 기반 typical correlation matrices (|corr|)
  // (Section 6 시뮬 N=370, T=650, 4th factor σ²_F=0.03, SR=0.8 case)
  const PCA = [
    [0.95, 0.04, 0.05, 0.03],
    [0.05, 0.81, 0.10, 0.04],
    [0.03, 0.08, 0.62, 0.05],
    [0.02, 0.03, 0.07, 0.18]
  ];
  const RP = [
    [0.94, 0.05, 0.04, 0.02],
    [0.06, 0.83, 0.08, 0.03],
    [0.04, 0.07, 0.69, 0.04],
    [0.02, 0.03, 0.05, 0.78]
  ];

  VIZ_REGISTRY['rppca-corr-heatmap'] = function (canvas, controls, params) {

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padT = 36, padB = 50, padL = 50;
      const gap = 40;
      const cellRows = 4;
      const cellsAvail = Math.min((w - padL - 30 - gap) / 2, h - padT - padB);
      const cellSize = cellsAvail / cellRows;
      const total = cellSize * cellRows;

      const leftX = padL;
      const rightX = padL + total + gap;
      const topY = padT;

      drawMatrix(ctx, leftX, topY, cellSize, PCA, 'PCA (γ=−1)');
      drawMatrix(ctx, rightX, topY, cellSize, RP,  'RP-PCA (γ=10)');

      // shared colorbar at right
      drawColorbar(ctx, w, h, total);

      // y axis label (estimated)
      ctx.save();
      ctx.translate(14, padT + total / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, '추정 요인', 0, 0, { align: 'center', size: 12 });
      ctx.restore();
    }

    function color(v) {
      // diverging warm scale 0→bg, 1→accent
      const t = Math.max(0, Math.min(1, v));
      // interpolate between bg-warm and accent
      const a = hexToRgb(U.cssVar('--bg-warm', '#f5f0e8'));
      const b = hexToRgb(U.accent());
      const r = Math.round(a.r + (b.r - a.r) * t);
      const g = Math.round(a.g + (b.g - a.g) * t);
      const bl = Math.round(a.b + (b.b - a.b) * t);
      return `rgb(${r},${g},${bl})`;
    }

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }

    function drawMatrix(ctx, x0, y0, size, M, title) {
      const n = M.length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const v = M[i][j];
          ctx.fillStyle = color(v);
          ctx.fillRect(x0 + j * size, y0 + i * size, size, size);
          ctx.strokeStyle = U.cssVar('--surface', '#fff');
          ctx.lineWidth = 1;
          ctx.strokeRect(x0 + j * size, y0 + i * size, size, size);
          ctx.fillStyle = v > 0.5 ? '#fff' : U.text();
          ctx.font = '600 ' + Math.max(10, size * 0.22) + 'px ' + U.cssVar('--font-mono', 'monospace');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(2), x0 + (j + 0.5) * size, y0 + (i + 0.5) * size);
        }
      }
      // x labels (true)
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let j = 0; j < n; j++) {
        ctx.fillText(`F${j + 1}`, x0 + (j + 0.5) * size, y0 + n * size + 6);
      }
      // y labels (estimated)
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i < n; i++) {
        ctx.fillText(`F̂${i + 1}`, x0 - 6, y0 + (i + 0.5) * size);
      }
      U.text(ctx, '진짜 요인', x0 + n * size / 2, y0 + n * size + 26,
             { align: 'center', size: 11 });
      // title
      U.text(ctx, title, x0 + n * size / 2, y0 - 14,
             { align: 'center', size: 12, bold: true, color: U.text() });
    }

    function drawColorbar(ctx, w, h, total) {
      // small horizontal at bottom right corner
      const barW = 140, barH = 10;
      const x = w - 30 - barW, y = h - 28;
      for (let i = 0; i < barW; i++) {
        ctx.fillStyle = colorMix(i / barW);
        ctx.fillRect(x + i, y, 1, barH);
      }
      ctx.strokeStyle = U.border();
      ctx.strokeRect(x, y, barW, barH);
      U.text(ctx, '0.0', x, y + barH + 4, { size: 10, color: U.textMuted(), baseline: 'top' });
      U.text(ctx, '1.0', x + barW, y + barH + 4, { size: 10, color: U.textMuted(), baseline: 'top', align: 'right' });
      U.text(ctx, '|상관|', x + barW / 2, y - 6, { size: 10, color: U.textMuted(), align: 'center', baseline: 'bottom' });
    }
    function colorMix(t) {
      const a = hexToRgb(U.cssVar('--bg-warm', '#f5f0e8'));
      const b = hexToRgb(U.accent());
      const r = Math.round(a.r + (b.r - a.r) * t);
      const g = Math.round(a.g + (b.g - a.g) * t);
      const bl = Math.round(a.b + (b.b - a.b) * t);
      return `rgb(${r},${g},${bl})`;
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
