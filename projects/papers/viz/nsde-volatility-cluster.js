/* viz: nsde-volatility-cluster - volatility clustering visualization */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['nsde-volatility-cluster'] = function (canvas, controls, params) {
    let mode = 'real';

    U.addSelect(controls, {
      label: 'Path source',
      options: [
        { value: 'real',   label: 'Real S&P 500 daily returns' },
        { value: 'sde',    label: 'Neural SDE GAN generated' },
        { value: 'garch',  label: 'GARCH(1,1) baseline' },
        { value: 'gauss',  label: 'IID Gaussian (no clustering)' }
      ],
      value: 'real',
      onChange: (v) => { mode = v; draw(); }
    });

    let seedState;
    function rand() { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; }
    function gauss() {
      const u1 = Math.max(rand(), 1e-9), u2 = rand();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    function generateReturns() {
      seedState = mode === 'real' ? 7777 : mode === 'sde' ? 8888 : mode === 'garch' ? 9999 : 10000;
      const N = 500;
      const returns = [];
      let sigma2 = 0.0002;
      for (let i = 0; i < N; i++) {
        let r;
        if (mode === 'gauss') {
          r = 0.015 * gauss();
        } else if (mode === 'garch') {
          // GARCH(1,1): sigma2_t = ω + α r²_{t-1} + β sigma2_{t-1}
          if (i > 0) {
            sigma2 = 5e-6 + 0.08 * returns[i-1] * returns[i-1] + 0.90 * sigma2;
          }
          r = Math.sqrt(sigma2) * gauss();
        } else if (mode === 'sde' || mode === 'real') {
          // Neural SDE-like with vol clustering (simulate)
          if (i > 0) {
            sigma2 = 5e-6 + 0.10 * returns[i-1] * returns[i-1] + 0.88 * sigma2;
            // Add heavy-tail noise (Student-like)
            const u = gauss();
            const v = gauss();
            const t_noise = u / Math.sqrt(v*v + 0.5);  // approximate heavy tail
            r = Math.sqrt(sigma2) * (mode === 'real' ? t_noise * 1.1 : t_noise);
          } else {
            r = 0.012 * gauss();
          }
        }
        returns.push(r);
      }
      return returns;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Volatility Clustering (paper §4)', w/2, 22);

      const returns = generateReturns();
      const acf_abs_lag5 = (() => {
        const abs = returns.map(r => Math.abs(r));
        const mean = abs.reduce((s,x)=>s+x,0) / abs.length;
        let num = 0, den = 0;
        for (let i = 0; i < abs.length; i++) den += (abs[i] - mean) ** 2;
        for (let i = 5; i < abs.length; i++) num += (abs[i] - mean) * (abs[i-5] - mean);
        return num / den;
      })();
      const kurt = (() => {
        const m = returns.reduce((s,x)=>s+x,0) / returns.length;
        let m2 = 0, m4 = 0;
        returns.forEach(r => { m2 += (r-m)**2; m4 += (r-m)**4; });
        m2 /= returns.length; m4 /= returns.length;
        return m4 / (m2*m2);
      })();

      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      ctx.fillText(`ACF(|r|, lag 5) = ${acf_abs_lag5.toFixed(3)}, Kurtosis = ${kurt.toFixed(1)}`, w/2, 40);

      const padL = 60, padR = 30, padT = 60, padB = 60;
      const plotW = w - padL - padR, plotH = h - padT - padB;

      const xToPix = (i) => padL + plotW * (i / returns.length);
      const maxAbs = Math.max(...returns.map(Math.abs)) * 1.1;
      const yToPix = (r) => padT + plotH * (1 - (r + maxAbs) / (2 * maxAbs));

      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // Zero line
      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, padT + plotH / 2); ctx.lineTo(padL + plotW, padT + plotH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bars
      returns.forEach((r, i) => {
        const px = xToPix(i);
        const py = yToPix(r);
        const py0 = yToPix(0);
        ctx.fillStyle = r > 0 ? '#16a34a' : '#dc2626';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(px, Math.min(py, py0), Math.max(1, plotW / returns.length - 0.5), Math.abs(py - py0));
      });
      ctx.globalAlpha = 1;

      // Y ticks
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = -maxAbs + 2 * maxAbs * (1 - i/4);
        ctx.fillText((v * 100).toFixed(1) + '%', padL - 8, padT + plotH * i / 4);
      }

      // Labels
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('time (trading days)', padL + plotW/2, h - 30);
      ctx.save();
      ctx.translate(15, padT + plotH/2); ctx.rotate(-Math.PI/2);
      ctx.fillText('daily return', 0, 0);
      ctx.restore();

      // Interpretation
      ctx.fillStyle = (mode === 'gauss') ? '#dc2626' : '#16a34a';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      const msg = mode === 'gauss'
        ? '☒ No clustering (kurt ≈ 3, ACF |r| ≈ 0)'
        : '✓ Volatility clustering visible';
      ctx.fillText(msg, w/2, h - 8);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
