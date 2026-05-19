/* viz: pat-table14-seeds
 * PatchTST Table 14 — Random seed variance across 5 seeds {2019..2023}.
 * paper exact mean ± std values for both supervised and self-supervised.
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → horizon → mode → [mean_mse, std_mse, mean_mae, std_mae]
  const T14 = {
    Weather: {
      96:  { Sup:[0.1525,0.0024,0.2002,0.0023], SelfSup:[0.1450,0.0008,0.1937,0.0010] },
      192: { Sup:[0.1975,0.0015,0.2434,0.0010], SelfSup:[0.1893,0.0003,0.2364,0.0006] },
      336: { Sup:[0.2494,0.0012,0.2841,0.0014], SelfSup:[0.2413,0.0003,0.2774,0.0005] },
      720: { Sup:[0.3194,0.0002,0.3352,0.0003], SelfSup:[0.3156,0.0020,0.3316,0.0016] },
    },
    Traffic: {
      96:  { Sup:[0.3669,0.0006,0.2504,0.0007], SelfSup:[0.3528,0.0022,0.2443,0.0016] },
      192: { Sup:[0.3858,0.0004,0.2586,0.0004], SelfSup:[0.3729,0.0013,0.2531,0.0009] },
      336: { Sup:[0.3994,0.0010,0.2672,0.0016], SelfSup:[0.3846,0.0020,0.2588,0.0011] },
      720: { Sup:[0.4383,0.0097,0.2913,0.0104], SelfSup:[0.4241,0.0007,0.2816,0.0010] },
    },
    Electricity: {
      96:  { Sup:[0.1304,0.0006,0.2234,0.0006], SelfSup:[0.1256,0.0002,0.2210,0.0003] },
      192: { Sup:[0.1482,0.0002,0.2403,0.0002], SelfSup:[0.1451,0.0002,0.2397,0.0010] },
      336: { Sup:[0.1659,0.0006,0.2596,0.0006], SelfSup:[0.1624,0.0010,0.2576,0.0009] },
      720: { Sup:[0.2019,0.0006,0.2917,0.0006], SelfSup:[0.1990,0.0002,0.2916,0.0002] },
    },
    ETTh1: {
      96:  { Sup:[0.3752,0.0008,0.3999,0.0004], SelfSup:[0.3700,0.0035,0.4001,0.0023] },
      192: { Sup:[0.4127,0.0012,0.4207,0.0006], SelfSup:[0.4146,0.0012,0.4287,0.0013] },
      336: { Sup:[0.4278,0.0033,0.4334,0.0028], SelfSup:[0.4285,0.0018,0.4402,0.0017] },
      720: { Sup:[0.4462,0.0035,0.4637,0.0027], SelfSup:[0.4670,0.0052,0.4768,0.0033] },
    },
    ETTh2: {
      96:  { Sup:[0.2749,0.0005,0.3363,0.0006], SelfSup:[0.2869,0.0039,0.3439,0.0016] },
      192: { Sup:[0.3385,0.0010,0.3789,0.0014], SelfSup:[0.3523,0.0048,0.3855,0.0027] },
      336: { Sup:[0.3288,0.0010,0.3823,0.0027], SelfSup:[0.3779,0.0057,0.4112,0.0030] },
      720: { Sup:[0.3784,0.0010,0.4212,0.0009], SelfSup:[0.3993,0.0054,0.4385,0.0038] },
    },
    ETTm1: {
      96:  { Sup:[0.2893,0.0009,0.3415,0.0007], SelfSup:[0.2876,0.0012,0.3427,0.0011] },
      192: { Sup:[0.3316,0.0008,0.3695,0.0007], SelfSup:[0.3296,0.0026,0.3688,0.0016] },
      336: { Sup:[0.3661,0.0022,0.3914,0.0012], SelfSup:[0.3583,0.0015,0.3879,0.0016] },
      720: { Sup:[0.4200,0.0056,0.4243,0.0033], SelfSup:[0.4094,0.0044,0.4193,0.0013] },
    },
    ETTm2: {
      96:  { Sup:[0.1647,0.0011,0.2538,0.0010], SelfSup:[0.1637,0.0020,0.2537,0.0024] },
      192: { Sup:[0.2223,0.0018,0.2936,0.0014], SelfSup:[0.2175,0.0011,0.2908,0.0013] },
      336: { Sup:[0.2775,0.0020,0.3297,0.0010], SelfSup:[0.2706,0.0016,0.3260,0.0016] },
      720: { Sup:[0.3648,0.0024,0.3833,0.0010], SelfSup:[0.3539,0.0023,0.3799,0.0024] },
    }
  };

  const HORIZONS = [96, 192, 336, 720];

  VIZ_REGISTRY['pat-table14-seeds'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Weather';
    let metric  = params.metric || 'MSE';

    function makeToggle(label, items, current, onSelect) {
      const wb = document.createElement('label');
      const lb = document.createElement('span'); lb.textContent = label;
      wb.appendChild(lb);
      items.forEach(it => {
        const btn = document.createElement('button');
        btn.textContent = String(it);
        btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
        if (it === current) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
        btn.addEventListener('click', () => {
          wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
          btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
          onSelect(it);
        });
        wb.appendChild(btn);
      });
      controls.appendChild(wb);
    }

    makeToggle('Dataset', Object.keys(T14), dataset, d => { dataset = d; draw(); });
    makeToggle('Metric', ['MSE', 'MAE'], metric, m => { metric = m; draw(); });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 30, padT = 36, padB = 64;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // gather values: for each horizon, supervised + selfsup mean + std
      const idx_mean = metric === 'MSE' ? 0 : 2;
      const idx_std  = metric === 'MSE' ? 1 : 3;
      const vals = [];
      HORIZONS.forEach(h => {
        const r = T14[dataset][h];
        vals.push(r.Sup[idx_mean] + r.Sup[idx_std]);
        vals.push(r.SelfSup[idx_mean] + r.SelfSup[idx_std]);
      });
      const yMin = 0;
      const yMax = Math.max(...vals) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      // grid
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(yv)); ctx.lineTo(w-padR, yToPix(yv));
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(yv.toFixed(3), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric + ' ± std (5 seeds: 2019-2023)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 14 · ${dataset} · ${metric} with error bars`, w/2, padT - 24);

      // Grouped bars per horizon
      const groupW = innerW / HORIZONS.length;
      const barW = groupW * 0.32;
      HORIZONS.forEach((horizon, hi) => {
        const r = T14[dataset][horizon];
        const cx = padL + groupW * (hi + 0.5);
        const supMean = r.Sup[idx_mean], supStd = r.Sup[idx_std];
        const selfMean = r.SelfSup[idx_mean], selfStd = r.SelfSup[idx_std];

        // Sup (left, blue)
        const topSup = yToPix(supMean);
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(cx - barW - 2, topSup, barW, (h - padB) - topSup);
        // error bar
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 1.5;
        const errSupTop = yToPix(supMean + supStd);
        const errSupBot = yToPix(supMean - supStd);
        const errSupX = cx - barW/2 - 2;
        ctx.beginPath();
        ctx.moveTo(errSupX, errSupTop); ctx.lineTo(errSupX, errSupBot);
        ctx.moveTo(errSupX - 4, errSupTop); ctx.lineTo(errSupX + 4, errSupTop);
        ctx.moveTo(errSupX - 4, errSupBot); ctx.lineTo(errSupX + 4, errSupBot);
        ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.font = '600 9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(supMean.toFixed(4), errSupX, errSupTop - 8);

        // SelfSup (right, red)
        const topSelf = yToPix(selfMean);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx + 2, topSelf, barW, (h - padB) - topSelf);
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.5;
        const errSelfTop = yToPix(selfMean + selfStd);
        const errSelfBot = yToPix(selfMean - selfStd);
        const errSelfX = cx + barW/2 + 2;
        ctx.beginPath();
        ctx.moveTo(errSelfX, errSelfTop); ctx.lineTo(errSelfX, errSelfBot);
        ctx.moveTo(errSelfX - 4, errSelfTop); ctx.lineTo(errSelfX + 4, errSelfTop);
        ctx.moveTo(errSelfX - 4, errSelfBot); ctx.lineTo(errSelfX + 4, errSelfBot);
        ctx.stroke();
        ctx.fillStyle = U.text();
        ctx.font = '600 9px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(selfMean.toFixed(4), errSelfX, errSelfTop - 8);

        // horizon label
        ctx.fillStyle = U.text();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('T=' + horizon, cx, h - padB + 8);
      });

      // legend
      const lgY = padT - 4;
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#60a5fa'; ctx.fillRect(w - padR - 130, lgY, 12, 12);
      ctx.fillStyle = U.text(); ctx.fillText('Supervised', w - padR - 113, lgY + 6);
      ctx.fillStyle = '#ef4444'; ctx.fillRect(w - padR - 60, lgY, 12, 12);
      ctx.fillStyle = U.text(); ctx.fillText('Self-sup', w - padR - 43, lgY + 6);

      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h-padB); ctx.lineTo(w-padR, h-padB);
      ctx.stroke();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
