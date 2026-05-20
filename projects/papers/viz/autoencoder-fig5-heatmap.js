/* viz: autoencoder-fig5-heatmap
 * paper Fig. 5 재현 — 94 특성 전체 ranking heatmap (5 모델 × 94 특성).
 * Gu, Kelly, Xiu (2021), Section 3.6.
 *
 * 주의: paper Fig. 5 의 정확한 94 변수 ranking 수치는 본문 미발표.
 * 본 viz 는 paper 명시 정보 (top 20 의 3 카테고리, top 20 ≈ 80~90% contribution)
 * + Gu-Kelly-Xiu (2019) 와 거의 일치 한다는 paper 의 언급 을 기반으로 plausible distribution.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* 94 특성 (paper Section 3.6 명시 + Gu-Kelly-Xiu 2019 의 dataset).
   * 정확히 94개. 순서는 합계 importance ranking 으로 추정. */
  const VARS = [
    // Top 20 (price trend + liquidity + risk 카테고리)
    'mom1m', 'mvel1', 'mom12m', 'retvol', 'idiovol', 'beta', 'chmom',
    'turn', 'baspread', 'maxret', 'mom36m', 'indmom', 'std_turn',
    'betasq', 'dolvol', 'ill', 'zerotrade', 'lev', 'agr', 'roeq',
    // Rank 21-50
    'currat', 'rd', 'ep', 'cashpr', 'bm', 'sp', 'ms', 'salecash',
    'depr', 'invest', 'pchcurrat', 'pchsale_pchinvt', 'pchsale_pchrect',
    'sgr', 'cashdebt', 'pchgm_pchsale', 'pchsale_pchxsga', 'pchcapx_ia',
    'chinv', 'cinvest', 'orgcap', 'pricedelay', 'roavol', 'sue', 'rsup',
    'roic', 'gma', 'ear', 'rd_sale', 'realestate',
    // Rank 51-94
    'cfp', 'cfp_ia', 'chcsho', 'chempia', 'chfeps', 'chmom_d', 'chnanalyst',
    'chpmia', 'chtx', 'convind', 'divi', 'divo', 'dy', 'egr',
    'fgr5yr', 'grcapx', 'grltnoa', 'herf', 'hire', 'IPO', 'lgr',
    'mom6m', 'mve_ia', 'nincr', 'operprof', 'pchdepr', 'pchgm', 'pchquick',
    'pchsale', 'pchxsga', 'ps', 'quick', 'rd_mve', 'salecashdiff',
    'salerec', 'secured', 'securedind', 'sin', 'tang', 'tb', 'cfvol',
    'pcoa', 'cps', 'dolvolq'
  ];

  /* 각 모델별 importance ranking (paper 가 모든 모델에서 거의 같은 top 20 라고 명시) */
  function genImportance(modelIdx, seed) {
    const arr = new Array(VARS.length);
    let s = seed * 7919 + modelIdx * 31;
    function rng() { s = (s * 9301 + 49297) % 233280; return s / 233280; }

    // Top 20 은 비슷한 importance (모든 모델에서)
    for (let i = 0; i < 20; i++) {
      // 진한 파랑 (높은 importance, 1.0 to 0.5)
      arr[i] = 1.0 - i / 20 * 0.5;
    }
    // Rank 21-50 은 중간 (0.4 to 0.15)
    for (let i = 20; i < 50; i++) {
      arr[i] = 0.4 - (i - 20) / 30 * 0.25 + (rng() - 0.5) * 0.05;
    }
    // Rank 51-94 은 거의 0 (0.1 to 0.0)
    for (let i = 50; i < VARS.length; i++) {
      arr[i] = 0.1 - (i - 50) / (VARS.length - 50) * 0.1 + (rng() - 0.5) * 0.03;
      if (arr[i] < 0) arr[i] = 0;
    }
    return arr;
  }

  const MODELS = ['IPCA', 'CA0', 'CA1', 'CA2', 'CA3'];

  VIZ_REGISTRY['autoencoder-fig5-heatmap'] = function (canvas, controls, params) {
    let showAll = params.showAll !== 'false';

    /* toggle: Top 30 vs All 94 */
    U.addToggle(controls, {
      label: '94개 모두 표시 (off: Top 30)',
      value: showAll,
      onChange: (v) => { showAll = v; draw(); }
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 96, padR = 60, padT = 56, padB = 16;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const Nshow = showAll ? VARS.length : 30;
      const rowH = innerH / Nshow;
      const colW = innerW / MODELS.length;

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`Variable Importance Heatmap · ${showAll ? 'All 94' : 'Top 30'}`, w / 2, padT - 36);

      /* column headers (model names) */
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      MODELS.forEach((m, mi) => {
        ctx.fillStyle = U.text();
        ctx.fillText(m, padL + colW * (mi + 0.5), padT - 4);
      });

      /* heatmap cells */
      const imp_arrs = MODELS.map((_, mi) => genImportance(mi, mi + 1));

      for (let i = 0; i < Nshow; i++) {
        // 변수명 (왼쪽)
        if (rowH > 8) {
          ctx.fillStyle = U.text();
          ctx.font = '9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(VARS[i], padL - 4, padT + rowH * (i + 0.5));
        }
        // 각 모델 cell
        MODELS.forEach((m, mi) => {
          const imp = imp_arrs[mi][i];
          // 진한 파랑 → 흰색
          const intensity = Math.max(0, Math.min(1, imp));
          const r = Math.round(255 - intensity * (255 - 78));
          const g = Math.round(255 - intensity * (255 - 126));
          const b = Math.round(255 - intensity * (255 - 196));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(padL + colW * mi, padT + rowH * i, colW, rowH);
        });
      }

      /* cell borders (very subtle) */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 0.3;
      for (let mi = 0; mi <= MODELS.length; mi++) {
        ctx.beginPath();
        ctx.moveTo(padL + colW * mi, padT);
        ctx.lineTo(padL + colW * mi, padT + innerH);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL + innerW, padT);
      ctx.moveTo(padL, padT + innerH);
      ctx.lineTo(padL + innerW, padT + innerH);
      ctx.stroke();

      /* 색 범례 (우측) */
      const legX = w - padR + 8;
      const legH = innerH * 0.6;
      const legW = 14;
      const legY = padT + innerH * 0.2;
      const grad = ctx.createLinearGradient(0, legY, 0, legY + legH);
      grad.addColorStop(0, 'rgb(78,126,196)');
      grad.addColorStop(1, 'rgb(255,255,255)');
      ctx.fillStyle = grad;
      ctx.fillRect(legX, legY, legW, legH);
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.strokeRect(legX, legY, legW, legH);

      ctx.fillStyle = U.text();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('high', legX + legW + 4, legY + 6);
      ctx.fillText('low', legX + legW + 4, legY + legH - 6);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
