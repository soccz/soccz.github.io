/* viz: lettau-r2-comparison - paper Table 1 정확 수치 (RP-PCA vs PCA, K=3/5) */
(function () {
  const U = window.VIZ_UTIL;
  VIZ_REGISTRY['lettau-r2-comparison'] = function (canvas, controls, params) {
    let metric = 'SR_OOS';
    U.addSelect(controls, {
      label: 'Metric',
      options: [
        { value: 'SR_IS',     label: 'In-Sample Sharpe' },
        { value: 'SR_OOS',    label: 'Out-of-Sample Sharpe (★ paper main)' },
        { value: 'RMSa_OOS',  label: 'OOS RMS α (lower better)' },
        { value: 'Idio_OOS',  label: 'OOS Idio. Variation %' }
      ],
      value: 'SR_OOS',
      onChange: (v) => { metric = v; draw(); }
    });

    // paper Table 1 exact values (γ=10, 37 anomaly × N=370 portfolios, 07/1963-12/2017)
    const data = {
      'PCA (K=3)':    { SR_IS: 0.17, SR_OOS: 0.14, RMSa_OOS: 0.15, Idio_OOS: 14.66, color: '#94a3b8' },
      'RP-PCA (K=3)': { SR_IS: 0.23, SR_OOS: 0.18, RMSa_OOS: 0.15, Idio_OOS: 14.57, color: '#0891b2' },
      'PCA (K=5)':    { SR_IS: 0.24, SR_OOS: 0.17, RMSa_OOS: 0.14, Idio_OOS: 12.56, color: '#94a3b8' },
      'RP-PCA (K=5) ★': { SR_IS: 0.53, SR_OOS: 0.45, RMSa_OOS: 0.12, Idio_OOS: 12.70, color: '#dc2626' },
    };

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('paper Table 1 — RP-PCA vs PCA (37 anomalies, N=370, T=650)', w/2, 22);
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.fillStyle = U.textMuted();
      const metricNames = {
        SR_IS: 'In-sample maximum Sharpe ratio',
        SR_OOS: 'Out-of-sample Sharpe ratio',
        RMSa_OOS: 'OOS root-mean-squared α (pricing error)',
        Idio_OOS: 'OOS idiosyncratic variation (%)'
      };
      ctx.fillText(`${metricNames[metric]} — γ=10 (paper의 main spec)`, w/2, 40);

      const padL = 200, padR = 60, padT = 60, padB = 50;
      const plotW = w - padL - padR, plotH = h - padT - padB;
      const models = Object.keys(data);
      const barH = plotH / models.length * 0.7;
      const gap = plotH / models.length * 0.3;
      const values = models.map(m => data[m][metric]);
      const maxV = Math.max(...values) * 1.15;

      models.forEach((m, i) => {
        const y = padT + i * (barH + gap);
        const v = data[m][metric];
        const barLen = plotW * (v / maxV);
        ctx.fillStyle = data[m].color;
        ctx.fillRect(padL, y, barLen, barH);
        ctx.strokeStyle = U.text();
        ctx.lineWidth = 0.5;
        ctx.strokeRect(padL, y, barLen, barH);

        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-mono', 'monospace');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(m, padL - 8, y + barH/2);

        ctx.fillStyle = '#fff';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right';
        const display = metric === 'Idio_OOS' ? v.toFixed(2) + '%' : v.toFixed(2);
        if (barLen > 40) ctx.fillText(display, padL + barLen - 6, y + barH/2 + 3);
      });

      // RP-PCA K=5 vs PCA K=5 ratio annotation
      const rpOver = data['RP-PCA (K=5) ★'][metric] / data['PCA (K=5)'][metric];
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left';
      ctx.fillText(`★ RP-PCA / PCA ratio = ${rpOver.toFixed(2)}× (K=5)`,
                   padL + plotW * 0.4, padT + plotH - 8);

      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('higher = better (RMS α 제외)', padL + plotW/2, h - 15);
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });
  };
})();
