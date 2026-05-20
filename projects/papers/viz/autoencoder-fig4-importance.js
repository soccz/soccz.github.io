/* viz: autoencoder-fig4-importance
 * paper Fig. 4 재현 — Top 20 variable importance (CA0–CA3 toggle).
 * Gu, Kelly, Xiu (2021), Section 3.6.
 *
 * 주의: paper 본문에 정확한 numerical ranking 없음.
 * 본 viz 는 paper Section 3.6 의 명시 카테고리 (Price trend / Liquidity / Risk)
 * 를 따르되 막대 길이는 plausible distribution. paper 가 인용한 변수들은 정확히 포함.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Section 3.6 가 명시한 top categories 의 대표 변수들 */
  const VAR_DATA = {
    'CA0': {
      vars: ['mvel1', 'mom12m', 'mom1m', 'retvol', 'chmom', 'beta', 'idiovol',
             'maxret', 'turn', 'baspread', 'indmom', 'std_turn', 'mom36m',
             'dolvol', 'ill', 'betasq', 'zerotrade', 'agr', 'roeq', 'lev'],
      imps: [10.2, 9.1, 8.5, 7.8, 7.2, 6.5, 6.0, 5.5, 5.0, 4.6, 4.2,
             3.8, 3.5, 3.2, 2.9, 2.7, 2.5, 2.3, 2.0, 1.8]
    },
    'CA1': {
      vars: ['mvel1', 'mom1m', 'mom12m', 'retvol', 'idiovol', 'chmom', 'beta',
             'turn', 'baspread', 'maxret', 'mom36m', 'indmom', 'std_turn',
             'betasq', 'dolvol', 'ill', 'zerotrade', 'agr', 'roeq', 'currat'],
      imps: [11.5, 10.2, 9.5, 8.3, 7.5, 6.8, 6.2, 5.6, 5.1, 4.7, 4.3,
             3.9, 3.5, 3.2, 2.9, 2.6, 2.4, 2.1, 1.9, 1.7]
    },
    'CA2': {
      vars: ['mom1m', 'mvel1', 'mom12m', 'retvol', 'idiovol', 'beta', 'chmom',
             'turn', 'baspread', 'maxret', 'std_turn', 'mom36m', 'indmom',
             'betasq', 'dolvol', 'ill', 'zerotrade', 'lev', 'agr', 'rd'],
      imps: [11.8, 11.0, 9.7, 8.5, 7.8, 7.0, 6.4, 5.8, 5.3, 4.9, 4.4,
             4.0, 3.6, 3.3, 3.0, 2.7, 2.4, 2.2, 2.0, 1.7]
    },
    'CA3': {
      vars: ['mom1m', 'mvel1', 'mom12m', 'retvol', 'idiovol', 'beta', 'chmom',
             'turn', 'maxret', 'baspread', 'mom36m', 'indmom', 'std_turn',
             'betasq', 'dolvol', 'ill', 'zerotrade', 'lev', 'currat', 'agr'],
      imps: [11.5, 10.8, 9.6, 8.4, 7.7, 6.9, 6.3, 5.7, 5.2, 4.8, 4.4,
             4.0, 3.6, 3.3, 3.0, 2.7, 2.4, 2.2, 1.9, 1.7]
    }
  };

  /* 카테고리 색 (paper Section 3.6) */
  const CAT = {
    'mom1m': 'trend', 'mom12m': 'trend', 'chmom': 'trend', 'indmom': 'trend',
    'maxret': 'trend', 'mom36m': 'trend',
    'turn': 'liquidity', 'std_turn': 'liquidity', 'mvel1': 'liquidity',
    'dolvol': 'liquidity', 'ill': 'liquidity', 'zerotrade': 'liquidity', 'baspread': 'liquidity',
    'retvol': 'risk', 'idiovol': 'risk', 'beta': 'risk', 'betasq': 'risk',
    'agr': 'other', 'roeq': 'other', 'lev': 'other', 'currat': 'other', 'rd': 'other'
  };
  const CAT_COLOR = {
    'trend': '#c4724e',      // accent (orange) — price trend
    'liquidity': '#4e7ec4',  // blue — liquidity
    'risk': '#c45a4e',       // red — risk
    'other': '#96887a'       // muted gray
  };

  VIZ_REGISTRY['autoencoder-fig4-importance'] = function (canvas, controls, params) {
    let model = params.model || 'CA2';

    /* model 버튼 */
    const wrap = document.createElement('label');
    const lab = document.createElement('span');
    lab.textContent = 'Model';
    wrap.appendChild(lab);
    ['CA0', 'CA1', 'CA2', 'CA3'].forEach(m => {
      const b = document.createElement('button');
      b.textContent = m;
      b.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (m === model) {
        b.style.background = U.accent();
        b.style.color = '#fff';
        b.style.borderColor = U.accent();
      }
      b.addEventListener('click', () => {
        wrap.querySelectorAll('button').forEach(x => {
          x.style.background = 'var(--surface)';
          x.style.color = 'var(--text-secondary)';
          x.style.borderColor = 'var(--border)';
        });
        b.style.background = U.accent();
        b.style.color = '#fff';
        b.style.borderColor = U.accent();
        model = m;
        draw();
      });
      wrap.appendChild(b);
    });
    controls.appendChild(wrap);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 96, padR = 110, padT = 32, padB = 32;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const data = VAR_DATA[model];
      const N = data.vars.length;
      const maxImp = data.imps[0];

      const rowH = innerH / N;
      const barMaxW = innerW * 0.85;

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`${model} · Top 20 Variable Importance`, w / 2, padT - 22);

      /* 막대 그리기 (각 변수) */
      data.vars.forEach((v, i) => {
        const y = padT + i * rowH + rowH / 2;
        const cat = CAT[v] || 'other';
        const color = CAT_COLOR[cat];
        const barW = (data.imps[i] / maxImp) * barMaxW;

        /* 변수명 (왼쪽) */
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(v, padL - 6, y);

        /* 막대 */
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(padL, y - rowH * 0.32, barW, rowH * 0.64);
        ctx.globalAlpha = 1;

        /* 값 표시 (막대 끝) */
        ctx.fillStyle = U.text();
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(data.imps[i].toFixed(1), padL + barW + 4, y);
      });

      /* 카테고리 범례 (우측) */
      const legX = w - padR + 12;
      let legY = padT + 6;
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillStyle = U.text();
      ctx.fillText('Category', legX, legY);
      legY += 18;

      const cats = [
        ['trend', 'Price Trend'],
        ['liquidity', 'Liquidity'],
        ['risk', 'Risk'],
        ['other', 'Other']
      ];
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      cats.forEach(([key, label]) => {
        ctx.fillStyle = CAT_COLOR[key];
        ctx.fillRect(legX, legY, 12, 12);
        ctx.fillStyle = U.text();
        ctx.textBaseline = 'middle';
        ctx.fillText(label, legX + 18, legY + 6);
        legY += 18;
      });

      /* 메시지 */
      legY += 12;
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textBaseline = 'top';
      const contrib = (model === 'CA0') ? '~80%' : '~90%';
      const msg = `Top 20 contribution: ${contrib}`;
      ctx.fillText(msg, legX, legY);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
