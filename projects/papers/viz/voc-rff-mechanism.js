/* viz: voc-rff-mechanism
 * Kelly-Malamud-Zhou (JF 2024) Equation 20 — Random Fourier Features.
 * G_t (1차원 demo) → ω·G → sin(γω'G), cos(γω'G).
 * Slider 로 G component 변화시 RFF 의 진동.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['voc-rff-mechanism'] = function (canvas, controls, params) {
    let gValue = parseFloat(params.g || '0');         // raw input
    let gamma = parseFloat(params.gamma || '2');      // bandwidth
    const K = 6;                                       // number of RFFs to show
    // Fixed random omega
    const omegas = [-1.6, -0.8, -0.3, 0.4, 1.0, 1.8];

    U.addSlider(controls, {
      label: 'G_t (predictor)', min: -2, max: 2, step: 0.05, value: gValue,
      onInput: (v) => { gValue = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });
    U.addSlider(controls, {
      label: 'γ (bandwidth)', min: 0.1, max: 5, step: 0.1, value: gamma,
      onInput: (v) => { gamma = v; draw(); },
      fmt: (v) => parseFloat(v).toFixed(1)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      // Two panels: left for input axis, right for RFF values
      const padL = 50, padR = 28, padT = 32, padB = 40;
      const iw = w - padL - padR, ih = h - padT - padB;
      if (iw <= 0 || ih <= 0) return;

      // Background grid
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 4);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const xMin = -2, xMax = 2;
      const yMin = -1.1, yMax = 1.1;
      const xToP = (x) => padL + (x - xMin) / (xMax - xMin) * iw;
      const yToP = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * ih;

      // y-axis ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (const y of [-1, -0.5, 0, 0.5, 1]) {
        ctx.fillText(y.toFixed(1), padL - 8, yToP(y));
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (const x of [-2, -1, 0, 1, 2]) {
        ctx.fillText(x.toFixed(1), xToP(x), padT + ih + 6);
      }
      U.text(ctx, 'G (raw predictor value)', w / 2, h - 8, { align: 'center', size: 12, color: U.text() });
      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      U.text(ctx, 'sin / cos (γω·G)', 0, 0, { align: 'center', size: 12, color: U.text() });
      ctx.restore();

      // Zero line
      ctx.strokeStyle = '#bbb';
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(padL, yToP(0)); ctx.lineTo(padL + iw, yToP(0)); ctx.stroke();
      ctx.setLineDash([]);

      // Plot sin and cos curves for several omegas
      const colors = ['#c4724e', '#4e7ec4', '#5a8a64', '#d4a04c', '#a07ec4', '#888'];
      const N = 200;
      omegas.forEach((omega, idx) => {
        const color = colors[idx % colors.length];
        // sin curve
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const x = xMin + (xMax - xMin) * i / N;
          const y = Math.sin(gamma * omega * x);
          const px = xToP(x), py = yToP(y);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      // Current G_t vertical line
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = 2.0;
      ctx.beginPath(); ctx.moveTo(xToP(gValue), padT); ctx.lineTo(xToP(gValue), padT + ih); ctx.stroke();

      // Dots at current G_t for each omega's sin
      ctx.fillStyle = U.accent();
      omegas.forEach((omega, idx) => {
        const y = Math.sin(gamma * omega * gValue);
        ctx.beginPath();
        ctx.arc(xToP(gValue), yToP(y), 4, 0, Math.PI * 2);
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fill();
      });

      // Annotation: current G value
      ctx.fillStyle = U.text();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`G = ${gValue.toFixed(2)}`, xToP(gValue) + 8, padT + 14);
      ctx.fillText(`γ = ${gamma.toFixed(1)}`, xToP(gValue) + 8, padT + 28);
      ctx.fillText(`6 random ω drawn from N(0, 1)`, padL + 8, padT + 14);

      if (params.title) {
        ctx.fillStyle = U.text();
        ctx.font = '600 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(params.title, w / 2, padT - 12);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
