/* viz: tg-diffusion-process
 * TimeGrad Eq 1 + Eq 3 — Forward Markov chain visualization.
 * β schedule (linear from 1e-4 to 0.1) + α_bar accumulation + noise samples at each step n.
 * Sliders: n (current step), beta_max, mode (β / α_bar / sample)
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-diffusion-process'] = function (canvas, controls, params) {
    let nStep = parseInt(params.n || '50');
    let betaMax = parseFloat(params.beta_max || '0.1');
    let mode = params.mode || 'sample';
    const N = 100;

    // Controls
    U.addSlider(controls, {
      label: 'n (diffusion step)', min: 1, max: N, step: 1, value: nStep,
      onInput: (v) => { nStep = parseInt(v); draw(); },
      fmt: (v) => String(parseInt(v))
    });
    U.addSlider(controls, {
      label: 'β_N (final noise)', min: 0.05, max: 0.3, step: 0.01, value: betaMax,
      onInput: (v) => { betaMax = parseFloat(v); draw(); },
      fmt: (v) => parseFloat(v).toFixed(2)
    });

    const modeWrap = document.createElement('label');
    const modeLabel = document.createElement('span'); modeLabel.textContent = 'View';
    modeWrap.appendChild(modeLabel);
    [['sample', 'Sample x^n'], ['beta', 'β schedule'], ['alphabar', 'ᾱ_n']].forEach(([k, label]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (k === mode) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        modeWrap.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        mode = k; draw();
      });
      modeWrap.appendChild(btn);
    });
    controls.appendChild(modeWrap);

    function computeSchedule() {
      const betas = new Array(N);
      const alphaBars = new Array(N);
      let prev = 1;
      for (let i = 0; i < N; i++) {
        betas[i] = 1e-4 + (betaMax - 1e-4) * i / (N - 1);
        prev = prev * (1 - betas[i]);
        alphaBars[i] = prev;
      }
      return { betas, alphaBars };
    }

    // Synthetic D=10 multivariate signal (paper-like)
    function syntheticX0(D) {
      const x = new Array(D);
      for (let i = 0; i < D; i++) {
        // sinusoidal pattern with entity-specific phase
        x[i] = Math.sin(2 * Math.PI * i / D + 0.3) * (0.5 + 0.3 * Math.cos(i));
      }
      return x;
    }

    function noisySample(x0, alphaBar, seed) {
      const D = x0.length;
      const out = new Array(D);
      // Simple deterministic noise (seed-based)
      for (let i = 0; i < D; i++) {
        const eps = Math.sin(seed * 7.31 + i * 2.71) * Math.cos(seed * 5.13 + i * 1.91);
        out[i] = Math.sqrt(alphaBar) * x0[i] + Math.sqrt(1 - alphaBar) * eps;
      }
      return out;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 60, padR = 30, padT = 36, padB = 52;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const { betas, alphaBars } = computeSchedule();

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      let title = '';
      if (mode === 'sample') title = `x^n_t  (n = ${nStep}, ᾱ_n = ${alphaBars[nStep-1].toExponential(2)})`;
      else if (mode === 'beta') title = 'β schedule (linear)';
      else title = 'ᾱ_n cumulative product (forward signal preservation)';
      ctx.fillText(title, w / 2, padT - 14);

      // Grid
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';

      if (mode === 'sample') {
        const D = 10;
        const x0 = syntheticX0(D);
        const xn = noisySample(x0, alphaBars[nStep - 1], nStep);

        // y axis: -2 to 2 (signal range)
        for (let i = 0; i <= 4; i++) {
          const val = 2 - i;
          const py = padT + innerH * i / 4;
          ctx.fillText(val.toFixed(1), padL - 8, py);
        }
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const idx = Math.floor((D - 1) * i / 5);
          ctx.fillText(String(idx), padL + innerW * i / 5, padT + innerH + 6);
        }

        const xToPix = (i) => padL + innerW * i / (D - 1);
        const yToPix = (v) => padT + innerH * (1 - (v + 2) / 4);

        // Original x^0 (dashed)
        ctx.strokeStyle = U.accent();
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let i = 0; i < D; i++) {
          const px = xToPix(i); const py = yToPix(x0[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Noisy x^n (solid)
        ctx.strokeStyle = U.accent();
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i < D; i++) {
          const px = xToPix(i); const py = yToPix(xn[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Dots on x^n
        ctx.fillStyle = U.accent();
        for (let i = 0; i < D; i++) {
          const px = xToPix(i); const py = yToPix(xn[i]);
          ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fill();
        }

        // Axis labels
        ctx.fillStyle = U.text();
        ctx.textAlign = 'center';
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText('entity index i (D=10)', padL + innerW / 2, h - 8);
        ctx.save();
        ctx.translate(16, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText('signal value', 0, 0);
        ctx.restore();

        // Legend
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillStyle = U.accent();
        ctx.globalAlpha = 0.5;
        ctx.fillText('— — x^0 (clean)', padL + 8, padT + 14);
        ctx.globalAlpha = 1;
        ctx.fillText(`──  x^n (n=${nStep})`, padL + 8, padT + 30);
      } else {
        // Plot betas or alpha_bars over n
        const series = mode === 'beta' ? betas : alphaBars;
        let vMin = Infinity, vMax = -Infinity;
        for (const v of series) { if (v < vMin) vMin = v; if (v > vMax) vMax = v; }
        const range = vMax - vMin || 1;

        // y axis ticks
        for (let i = 0; i <= 4; i++) {
          const val = vMax - range * i / 4;
          const py = padT + innerH * i / 4;
          ctx.fillText(val.toExponential(1), padL - 8, py);
        }
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const nVal = Math.round(N * i / 5);
          ctx.fillText(String(nVal), padL + innerW * i / 5, padT + innerH + 6);
        }

        const xToPix = (i) => padL + innerW * i / (N - 1);
        const yToPix = (v) => padT + innerH * (1 - (v - vMin) / range);

        // Curve
        ctx.strokeStyle = U.accent();
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const px = xToPix(i); const py = yToPix(series[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Current n highlight
        const cx = xToPix(nStep - 1);
        const cy = yToPix(series[nStep - 1]);
        ctx.fillStyle = U.bad();
        ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 2 * Math.PI); ctx.fill();

        // Labels
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center';
        ctx.fillStyle = U.text();
        ctx.fillText('diffusion step n', padL + innerW / 2, h - 8);
        ctx.save();
        ctx.translate(14, padT + innerH / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText(mode === 'beta' ? 'β_n' : 'ᾱ_n', 0, 0);
        ctx.restore();

        // Current value annotation
        ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left';
        ctx.fillStyle = U.bad();
        ctx.fillText(`n=${nStep}: ${series[nStep - 1].toExponential(2)}`, cx + 10, cy - 4);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
