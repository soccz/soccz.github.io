/**
 * Visualization registry — paper viewer 의 ```viz:<type>:<params>``` 블록을
 * 인터랙티브 캔버스로 변환한다.
 *
 * 새 viz 추가법:
 *   VIZ_REGISTRY[<type>] = (canvas, params) => { ... draw to canvas ... }
 *
 * Markdown 사용 예:
 *   ```viz:grokking-curve:title=Modular arithmetic
 *   ```
 */

(function (global) {
  const VIZ = {};

  /* ─────────────────────────────────────────────
   *  1. grokking-curve  — train/test acc 시간차
   *     Power 2022 / Wang 2024 의 phase transition
   * ───────────────────────────────────────────── */
  VIZ['grokking-curve'] = function (canvas, params) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const padL = 56, padR = 24, padT = 32, padB = 40;
    const w = W - padL - padR, h = H - padT - padB;
    const N = 240;
    const memStep = parseFloat(params.mem_step || '0.05');
    const grokStep = parseFloat(params.grok_step || '0.55');
    const grokWidth = parseFloat(params.grok_width || '0.12');

    const trainAcc = i => {
      const x = i / (N - 1);
      return 0.05 + 0.95 / (1 + Math.exp(-(x - memStep) * 60));
    };
    const testAcc = i => {
      const x = i / (N - 1);
      return 0.05 + 0.95 / (1 + Math.exp(-(x - grokStep) / grokWidth));
    };

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#e5ddd3'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padT + h * i / 5;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + w, y); ctx.stroke();
    }

    ctx.fillStyle = '#96887a'; ctx.font = '11px "Inter", sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      ctx.fillText(((5 - i) * 20) + '%', padL - 8, padT + h * i / 5 + 4);
    }
    ctx.textAlign = 'center';
    ['10²', '10³', '10⁴', '10⁵', '10⁶'].forEach((label, i) => {
      ctx.fillText(label, padL + w * i / 4, padT + h + 18);
    });
    ctx.textAlign = 'left';
    ctx.fillText('Training steps (log)', padL, H - 8);

    const drawCurve = (fn, color, label) => {
      ctx.strokeStyle = color; ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = padL + (i / (N - 1)) * w;
        const y = padT + (1 - fn(i)) * h;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    drawCurve(trainAcc, '#c4724e', 'train');
    drawCurve(testAcc, '#5a7a96', 'test');

    ctx.fillStyle = '#c4724e'; ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillText('train', padL + w * 0.18, padT + 14);
    ctx.fillStyle = '#5a7a96';
    ctx.fillText('test (delayed gen)', padL + w * grokStep + 8, padT + h * 0.42);

    if (params.title) {
      ctx.fillStyle = '#1a1410'; ctx.font = '600 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(params.title, W / 2, padT - 12);
    }
  };

  /* ─────────────────────────────────────────────
   *  2. attention-pattern  — APF motif 시각화
   *     stripe / diagonal / spike / block / checker
   * ───────────────────────────────────────────── */
  VIZ['attention-pattern'] = function (canvas, params) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const motif = params.motif || 'diagonal';
    const N = parseInt(params.n || '32', 10);
    const padL = 48, padT = 32, padB = 24, padR = 24;
    const size = Math.min(W - padL - padR, H - padT - padB);
    const cell = size / N;
    const x0 = padL + ((W - padL - padR) - size) / 2;
    const y0 = padT;

    ctx.clearRect(0, 0, W, H);

    const score = (i, j) => {
      switch (motif) {
        case 'diagonal': {
          const d = Math.abs(i - j);
          return Math.exp(-d * d / (2 * 1.5 * 1.5));
        }
        case 'stripe': {
          const lag = parseInt(params.lag || '4', 10);
          const d = Math.abs((i - j) % lag);
          return Math.exp(-d * d / 0.8);
        }
        case 'spike': {
          if (j === 0) return 1;
          if (i === j) return 0.5;
          return 0.05;
        }
        case 'block': {
          const block = parseInt(params.block || '8', 10);
          return (Math.floor(i / block) === Math.floor(j / block)) ? 0.85 : 0.05;
        }
        case 'checker': {
          return ((i + j) % 2 === 0) ? 0.9 : 0.1;
        }
        case 'edge': {
          if (j <= 1 || j >= N - 2) return 0.95;
          return 0.05;
        }
        default:
          return Math.random() * 0.4;
      }
    };

    let max = 0;
    const grid = [];
    for (let i = 0; i < N; i++) {
      const row = [];
      for (let j = 0; j < N; j++) {
        if (j > i) { row.push(0); continue; }
        const s = score(i, j);
        row.push(s);
        if (s > max) max = s;
      }
      const sum = row.reduce((a, b) => a + b, 0) || 1;
      for (let j = 0; j < N; j++) row[j] = row[j] / sum;
      grid.push(row);
    }
    let gmax = 0;
    for (const row of grid) for (const v of row) if (v > gmax) gmax = v;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const v = grid[i][j] / (gmax || 1);
        const r = Math.round(255 - (255 - 196) * v);
        const g = Math.round(247 - (247 - 114) * v);
        const b = Math.round(242 - (242 - 78) * v);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x0 + j * cell, y0 + i * cell, cell + 0.5, cell + 0.5);
      }
    }

    ctx.strokeStyle = '#d4c8b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 - 0.5, y0 - 0.5, size + 1, size + 1);

    ctx.fillStyle = '#1a1410';
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`motif = ${motif}`, x0 + size / 2, y0 - 12);

    ctx.save();
    ctx.translate(padL - 28, y0 + size / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#96887a';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('query position', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#96887a';
    ctx.textAlign = 'center';
    ctx.fillText('key position', x0 + size / 2, y0 + size + 18);
  };

  /* ─────────────────────────────────────────────
   *  3. phase-transition  — weight decay × grokking step
   *     Power 2022 의 wd 강도 ↑ → grokking 빨라짐
   * ───────────────────────────────────────────── */
  VIZ['phase-transition'] = function (canvas, params) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const padL = 56, padR = 24, padT = 36, padB = 44;
    const w = W - padL - padR, h = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#e5ddd3'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + h * i / 4;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + w, y); ctx.stroke();
    }

    const N = 80;
    const points = [];
    for (let i = 0; i < N; i++) {
      const wd = -3 + (3.0) * i / (N - 1);
      const wdLin = Math.pow(10, wd);
      const grokSteps = 1.0 / (wdLin + 1e-3);
      const noise = (Math.sin(i * 0.7) * 0.15);
      points.push({ wd, log10Steps: Math.log10(grokSteps) + noise });
    }
    const xMin = -3, xMax = 0;
    const yMin = Math.min(...points.map(p => p.log10Steps)) - 0.5;
    const yMax = Math.max(...points.map(p => p.log10Steps)) + 0.5;

    ctx.fillStyle = '#fdf0ea';
    ctx.fillRect(padL, padT, w, h);

    ctx.strokeStyle = '#c4724e';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = padL + (p.wd - xMin) / (xMax - xMin) * w;
      const y = padT + (1 - (p.log10Steps - yMin) / (yMax - yMin)) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#c4724e';
    points.filter((_, i) => i % 8 === 0).forEach(p => {
      const x = padL + (p.wd - xMin) / (xMax - xMin) * w;
      const y = padT + (1 - (p.log10Steps - yMin) / (yMax - yMin)) * h;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#96887a'; ctx.font = '11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    [-3, -2, -1, 0].forEach(v => {
      ctx.fillText(`10${v < 0 ? '⁻' + (-v) : v}`,
                   padL + (v - xMin) / (xMax - xMin) * w, padT + h + 18);
    });
    ctx.fillText('weight decay λ', padL + w / 2, H - 10);

    ctx.save();
    ctx.translate(padL - 32, padT + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('grokking steps (log)', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#1a1410'; ctx.font = '600 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(params.title || 'Weight decay → faster grokking',
                 W / 2, padT - 14);
  };

  /* ─────────────────────────────────────────────
   *  4. ode-time  — physical vs economic time axis
   *     ContiFormer 류: t (wall-clock) vs τ (information time)
   * ───────────────────────────────────────────── */
  VIZ['ode-time'] = function (canvas, params) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const padL = 56, padR = 24, padT = 36, padB = 44;
    const w = W - padL - padR, h = H - padT - padB;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#e5ddd3';
    for (let i = 0; i <= 4; i++) {
      const y = padT + h * i / 4;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + w, y); ctx.stroke();
    }

    const N = 200;
    const series = [];
    let s = 0;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const vol = 0.4 + 0.8 * Math.exp(-Math.pow((t - 0.55) * 6, 2));
      const dt = vol * (1 / N);
      s += dt;
      series.push({ t, tau: s, vol });
    }
    const tauMax = series[series.length - 1].tau;

    ctx.strokeStyle = '#5a7a96'; ctx.lineWidth = 2.4;
    ctx.beginPath();
    series.forEach((p, i) => {
      const x = padL + p.t * w;
      const y = padT + (1 - p.t) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.strokeStyle = '#c4724e'; ctx.lineWidth = 2.4;
    ctx.beginPath();
    series.forEach((p, i) => {
      const x = padL + p.t * w;
      const y = padT + (1 - p.tau / tauMax) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#5a7a96'; ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillText('t (wall-clock)', padL + w * 0.05, padT + h * 0.6);
    ctx.fillStyle = '#c4724e';
    ctx.fillText('τ (economic time)', padL + w * 0.55, padT + h * 0.25);

    ctx.fillStyle = '#1a1410'; ctx.font = '600 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(params.title || 'Physical vs Economic time', W / 2, padT - 14);
    ctx.fillStyle = '#96887a'; ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('elapsed clock time →', padL + w / 2, padT + h + 22);
  };

  global.VIZ_REGISTRY = VIZ;
})(window);
