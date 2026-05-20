/* viz: autoencoder-fig3-alpha
 * paper Fig. 3 재현 — 95 managed portfolios 의 α scatter.
 * 모델 토글로 FF5, PCA, CA0~CA3 비교 — 빨간 점이 |t(α)|>3 (유의 mispricing).
 * Gu, Kelly, Xiu (2021).
 *
 * 주의: paper Fig. 3 의 정확한 α 값들은 본문에 numerical 미발표.
 * 본 viz 는 reasonable simulation — paper 가 명시한 # of |t|>3 (FF5=37, CA2=8) 와
 * 잔존 α 크기 (< 7 bps/월) 만 정확히 맞춤. 점들의 정확한 위치는 plausible distribution.
 */

(function () {
  const U = window.VIZ_UTIL;

  /* paper Section 3.5 의 명시 정보 + 본 viz 의 추정값:
   * FF5: 37 / 95 portfolios with |t(α)|>3.0
   * CA2: 8 / 95 portfolios with |t(α)|>3.0
   * 잔존 α < 7 bps/월 for CA2
   * 다른 모델들의 정확한 #는 paper 본문 미명시 (Fig 3 시각만)
   */
  const MODELS = {
    'FF5':  { n_sig: 37, max_alpha: 30 },      // bps/월
    'PCA':  { n_sig: 32, max_alpha: 28 },      // 추정
    'CA0':  { n_sig: 18, max_alpha: 14 },      // 추정
    'CA1':  { n_sig: 11, max_alpha: 9 },       // 추정
    'CA2':  { n_sig: 8,  max_alpha: 7 },       // paper 명시
    'CA3':  { n_sig: 9,  max_alpha: 8 }        // 추정 (CA2 와 비슷)
  };

  /* 95 portfolio 의 alpha t-stat 분포를 합리적으로 시뮬레이션 */
  function genAlphas(model, seed) {
    const cfg = MODELS[model];
    const arr = [];
    let s = seed * 7919;
    function rng() { s = (s * 9301 + 49297) % 233280; return s / 233280; }

    const N = 95;
    const n_sig = cfg.n_sig;
    const max_a = cfg.max_alpha;

    for (let i = 0; i < N; i++) {
      let alpha_bp, t_stat, is_sig;
      if (i < n_sig) {
        // 유의: |t|>3, α 분포는 0 ~ max_alpha 범위
        is_sig = true;
        const sign = rng() > 0.5 ? 1 : -1;
        alpha_bp = sign * (3 + rng() * (max_a - 3));
        t_stat = sign * (3 + rng() * 4);
      } else {
        // 무의: |t|<=3
        is_sig = false;
        const sign = rng() > 0.5 ? 1 : -1;
        alpha_bp = sign * rng() * 6;
        t_stat = sign * rng() * 2.8;
      }
      arr.push({ idx: i, alpha: alpha_bp, t: t_stat, sig: is_sig });
    }
    // 인덱스로 셔플
    arr.sort(() => rng() - 0.5);
    return arr;
  }

  VIZ_REGISTRY['autoencoder-fig3-alpha'] = function (canvas, controls, params) {
    let model = params.model || 'CA2';

    /* model 버튼 */
    const wrap = document.createElement('label');
    const lab = document.createElement('span');
    lab.textContent = 'Model';
    wrap.appendChild(lab);
    Object.keys(MODELS).forEach(m => {
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

      const padL = 56, padR = 28, padT = 36, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const xMin = 0, xMax = 95;
      const yMin = -32, yMax = 32;
      const xToPix = (x) => padL + ((x - xMin) / (xMax - xMin)) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      /* gridlines */
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let yv = -30; yv <= 30; yv += 10) {
        const yp = yToPix(yv);
        ctx.beginPath();
        ctx.moveTo(padL, yp);
        ctx.lineTo(w - padR, yp);
        ctx.globalAlpha = (yv === 0) ? 0.7 : 0.25;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* y labels */
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let yv = -30; yv <= 30; yv += 10) {
        ctx.fillText(yv.toString(), padL - 8, yToPix(yv));
      }

      /* y-axis title */
      ctx.save();
      ctx.translate(14, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('α (basis points / month)', 0, 0);
      ctx.restore();

      /* x-axis title */
      ctx.fillStyle = U.text();
      ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Managed Portfolio Index (1–95)', w / 2, h - padB + 26);

      /* title */
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`${model} · Pricing Errors α (OOS 1987–2016)`, w / 2, padT - 24);

      /* α 값 그리기 */
      const seed = Object.keys(MODELS).indexOf(model) + 1;
      const alphas = genAlphas(model, seed);

      alphas.forEach((a, i) => {
        const px = xToPix(i + 0.5);
        const py = yToPix(a.alpha);
        ctx.beginPath();
        if (a.sig) {
          // 빨간 채워진 점 = 유의 (|t|>3)
          ctx.fillStyle = U.bad();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 빈 사각형 = 무의
          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 1.4;
          ctx.strokeRect(px - 3, py - 3, 6, 6);
        }
      });

      /* axis */
      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();

      /* annotation: count of |t|>3 */
      const cfg = MODELS[model];
      ctx.fillStyle = U.bad();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText(`|t(α)| > 3:  ${cfg.n_sig} / 95`, w - padR, padT - 4);

      /* annotation: max α */
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(`잔존 max |α| ≈ ${cfg.max_alpha} bps/월`, padL + 6, padT - 4);

      /* legend */
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      const lx = padL + 6;
      const ly = h - padB - 12;
      ctx.fillStyle = U.bad();
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = U.text();
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('|t|>3 (유의)', lx + 10, ly);

      ctx.strokeStyle = U.textMuted();
      ctx.lineWidth = 1.2;
      ctx.strokeRect(lx + 80, ly - 4, 8, 8);
      ctx.fillStyle = U.text();
      ctx.fillText('|t|≤3 (무의)', lx + 95, ly);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
