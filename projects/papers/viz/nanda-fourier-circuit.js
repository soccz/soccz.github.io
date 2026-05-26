/* viz: nanda-fourier-circuit
 * Fourier basis circuit visualization (Nanda 2023 Figure 2).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['nanda-fourier-circuit'] = function (canvas, controls, params) {
    const p = 113;
    const critical_K = [14, 25, 36, 45, 62, 78];
    let selected_k = 14;

    U.addSelect(controls, {
      label: 'Frequency k',
      options: critical_K.map(k => ({ value: String(k), label: `k = ${k}` })),
      value: '14',
      onChange: (v) => { selected_k = parseInt(v); draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`Fourier Circuit — frequency k=${selected_k} (Nanda 2023 §3.2)`, w / 2, 22);

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`cos(2π·${selected_k}·n/${p}) — 학습된 transformer W_E 의 singular vector`, w / 2, 40);

      const padL = 50, padR = 30, padT = 70, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // Draw cos & sin basis
      const cos_values = [];
      const sin_values = [];
      for (let n = 0; n < p; n++) {
        cos_values.push(Math.cos(2 * Math.PI * selected_k * n / p));
        sin_values.push(Math.sin(2 * Math.PI * selected_k * n / p));
      }

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 4);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xToPix = (n) => padL + innerW * (n / (p - 1));
      const yToPix = (v) => padT + innerH * 0.5 * (1 - v);

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [-1, -0.5, 0, 0.5, 1].forEach((v, i) => {
        ctx.fillText(v.toFixed(1), padL - 8, yToPix(v));
      });

      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      [0, 20, 40, 60, 80, 100, p-1].forEach(n => {
        if (n < p) ctx.fillText(String(n), xToPix(n), padT + innerH + 4);
      });

      // Cos curve
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let n = 0; n < p; n++) {
        const px = xToPix(n), py = yToPix(cos_values[n]);
        if (n === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Sin curve
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let n = 0; n < p; n++) {
        const px = xToPix(n), py = yToPix(sin_values[n]);
        if (n === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Zero line
      ctx.strokeStyle = U.textMuted();
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(0));
      ctx.lineTo(padL + innerW, yToPix(0));
      ctx.stroke();

      // Legend
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(padL + 10, h - 25, 14, 6);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(`cos(2π·${selected_k}·n/113)`, padL + 28, h - 22);
      ctx.fillStyle = '#dc2626';
      ctx.setLineDash([4, 3]);
      ctx.fillRect(padL + 180, h - 25, 14, 6);
      ctx.fillStyle = U.text();
      ctx.fillText(`sin(2π·${selected_k}·n/113)`, padL + 198, h - 22);

      // Axis labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Integer n ∈ [0, 112]', padL + innerW / 2, h - 6);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
