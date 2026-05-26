/* viz: timesnet-inception - Inception block multi-scale conv */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['timesnet-inception'] = function (canvas, controls, params) {
    let highlightKernel = 'all';

    U.addSelect(controls, {
      label: 'Highlight kernel',
      options: [
        { value: 'all', label: 'All 6 kernels (combined)' },
        { value: '1', label: '1×1 (pointwise)' },
        { value: '3', label: '3×3 (short)' },
        { value: '5', label: '5×5 (medium)' },
        { value: '7', label: '7×7 (long)' },
        { value: '9', label: '9×9 (longer)' },
        { value: '11', label: '11×11 (longest)' }
      ],
      value: 'all',
      onChange: (v) => { highlightKernel = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Inception Block Multi-Scale (paper §3.3)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('6 parallel kernels: 1×1, 3×3, 5×5, 7×7, 9×9, 11×11', w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      // Draw 6 kernel squares around a central feature map
      const kernels = [1, 3, 5, 7, 9, 11];
      const featSize = 16;  // 16x16 feature map
      const cellPix = Math.min(plotW / 30, plotH / 20);
      const featPix = featSize * cellPix;
      const cx = padL + plotW / 2 - featPix / 2;
      const cy = padT + plotH / 2 - featPix / 2 + 10;

      // Draw feature map background
      ctx.fillStyle = '#94a3b8';
      ctx.globalAlpha = 0.2;
      ctx.fillRect(cx, cy, featPix, featPix);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = U.text();
      ctx.lineWidth = 1;
      ctx.strokeRect(cx, cy, featPix, featPix);

      // Draw grid
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 0.3;
      for (let i = 1; i < featSize; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * cellPix, cy); ctx.lineTo(cx + i * cellPix, cy + featPix);
        ctx.moveTo(cx, cy + i * cellPix); ctx.lineTo(cx + featPix, cy + i * cellPix);
        ctx.stroke();
      }

      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Feature map (period × cycles)', cx + featPix/2, cy - 6);

      // Draw kernel overlays
      const colors = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#7c3aed'];
      const showAll = (highlightKernel === 'all');

      kernels.forEach((k, idx) => {
        const show = showAll || highlightKernel === k.toString();
        if (!show) return;
        const kPix = k * cellPix;
        // Center of feature map
        const kx = cx + (featSize - k) / 2 * cellPix;
        const ky = cy + (featSize - k) / 2 * cellPix;
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 2;
        ctx.globalAlpha = showAll ? 0.6 : 1.0;
        ctx.strokeRect(kx, ky, kPix, kPix);
        // Label
        ctx.fillStyle = colors[idx];
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
        if (showAll || highlightKernel === k.toString()) {
          ctx.fillText(`${k}×${k}`, kx + kPix + 4, ky + 12 + (idx * 14) - 30);
        }
      });
      ctx.globalAlpha = 1;

      // Receptive field text
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      const desc = [
        '1×1: pointwise (no neighborhood)',
        '3×3: 3-step adjacent',
        '5×5: 5-step pattern',
        '7×7: 7-step pattern',
        '9×9: 9-step pattern',
        '11×11: 11-step pattern',
      ];
      desc.forEach((d, idx) => {
        ctx.fillStyle = colors[idx];
        ctx.fillText(d, padL + 10, padT + plotH - 100 + idx * 14);
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
