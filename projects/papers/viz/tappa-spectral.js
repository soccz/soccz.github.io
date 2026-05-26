/* viz: tappa-spectral - RoPE spectral decomposition */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['tappa-spectral'] = function (canvas, controls, params) {
    let theta_base = 10000;
    let head_dim = 64;

    U.addSelect(controls, {
      label: 'Model',
      options: [
        { value: '10000_64', label: 'LLaMA-2 (d=64, θ_base=10000)' },
        { value: '500000_64', label: 'LLaMA-3 (d=64, θ_base=500K)' },
        { value: '1000000_64', label: 'Qwen (d=64, θ_base=1M)' },
      ],
      value: '10000_64',
      onChange: (v) => {
        const [t, d] = v.split('_').map(Number);
        theta_base = t; head_dim = d; draw();
      }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(`RoPE Spectral Decomposition (θ_base=${theta_base}, d=${head_dim})`, w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText('각 frequency k 의 period (= 2π/θ_k) — pattern type 결정 인자', w/2, 40);

      const padL = 70, padR = 40, padT = 60, padB = 80;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      const K = head_dim / 2;
      // Compute periods
      const periods = [];
      for (let k = 0; k < K; k++) {
        const theta_k = Math.pow(theta_base, -2 * k / head_dim);
        periods.push(2 * Math.PI / theta_k);
      }

      const yMin = Math.log10(Math.min(...periods)) - 0.5;
      const yMax = Math.log10(Math.max(...periods)) + 0.5;
      const xToPix = (k) => padL + plotW * (k / (K - 1));
      const yToPix = (p) => padT + plotH * (1 - (Math.log10(p) - yMin) / (yMax - yMin));

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = yMin; i <= yMax; i += 1) {
        const v = Math.pow(10, i);
        const py = padT + plotH * (1 - (i - yMin) / (yMax - yMin));
        const lbl = v < 100 ? v.toFixed(1) : `${(v/1000).toFixed(0)}K`;
        ctx.fillText(lbl, padL - 8, py);
      }

      // X ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let k = 0; k < K; k += Math.max(1, Math.floor(K/8))) {
        ctx.fillText(String(k), xToPix(k), padT + plotH + 6);
      }

      // Plot line
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k < K; k++) {
        const px = xToPix(k), py = yToPix(periods[k]);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points
      for (let k = 0; k < K; k++) {
        const px = xToPix(k), py = yToPix(periods[k]);
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, 2*Math.PI);
        ctx.fill();
      }

      // Pattern annotation
      const annotations = [
        { period_low: 0, period_high: 10, color: '#dc2626', label: 'Fine diagonal' },
        { period_low: 10, period_high: 100, color: '#9333ea', label: 'Block (10-100 tokens)' },
        { period_low: 100, period_high: 10000, color: '#ea580c', label: 'Stripe (long-range)' },
      ];
      annotations.forEach(a => {
        // Find k range
        let k_lo = K, k_hi = 0;
        for (let k = 0; k < K; k++) {
          if (periods[k] >= a.period_low && periods[k] <= a.period_high) {
            k_lo = Math.min(k_lo, k);
            k_hi = Math.max(k_hi, k);
          }
        }
        if (k_lo <= k_hi) {
          ctx.fillStyle = a.color;
          ctx.globalAlpha = 0.1;
          ctx.fillRect(xToPix(k_lo), padT, xToPix(k_hi) - xToPix(k_lo), plotH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = a.color;
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center';
          ctx.fillText(a.label, (xToPix(k_lo) + xToPix(k_hi)) / 2, padT + 12);
        }
      });

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Frequency index k', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('Period (tokens, log)', 0, 0);
      ctx.restore();
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
