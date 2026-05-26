/* viz: tg-architecture-flow
 * TimeGrad full architecture flow — RNN encoding (left) + Diffusion (right).
 * Highlights how h_{t-1} conditions ε_θ across N diffusion steps.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['tg-architecture-flow'] = function (canvas, controls, params) {
    let activeStep = params.step || 'rnn';  // rnn | encoding | diffusion | output

    const stepsWrap = document.createElement('label');
    const stepsLabel = document.createElement('span'); stepsLabel.textContent = 'Step';
    stepsWrap.appendChild(stepsLabel);
    [
      ['rnn', '1. RNN encode'],
      ['encoding', '2. h_{t-1}'],
      ['diffusion', '3. Reverse loop'],
      ['output', '4. x^0_t output']
    ].forEach(([k, label]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (k === activeStep) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        stepsWrap.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        activeStep = k; draw();
      });
      stepsWrap.appendChild(btn);
    });
    controls.appendChild(stepsWrap);

    function box(ctx, x, y, w, h, label, sublabel, active) {
      const color = active ? U.accent() : U.textMuted();
      ctx.fillStyle = color;
      ctx.globalAlpha = active ? 0.18 : 0.08;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = active ? 2.2 : 1.5;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = active ? U.text() : U.textMuted();
      ctx.font = (active ? '600 ' : '') + '13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x + w / 2, y + h / 2 - 8);
      if (sublabel) {
        ctx.fillStyle = U.textMuted();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(sublabel, x + w / 2, y + h / 2 + 10);
      }
    }

    function arrow(ctx, x1, y1, x2, y2, color, active) {
      ctx.strokeStyle = color;
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.globalAlpha = active ? 1 : 0.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const ah = active ? 9 : 7;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - ah * Math.cos(ang - 0.4), y2 - ah * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - ah * Math.cos(ang + 0.4), y2 - ah * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padX = 30, padY = 30;
      const usableW = w - padX * 2;
      const usableH = h - padY * 2;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('TimeGrad Architecture Flow — RNN conditioning + Diffusion reverse loop', w / 2, padY - 8);

      // ── Left half: RNN ──
      const leftX = padX;
      const leftW = usableW * 0.4;
      const midY = padY + usableH / 2;

      // History boxes
      const boxW = 90, boxH = 36, gapY = 12;
      box(ctx, leftX, midY - boxH - gapY/2 - boxH - gapY, boxW, boxH, 'x⁰_{t-2}', 'past obs', activeStep === 'rnn');
      box(ctx, leftX, midY - boxH/2, boxW, boxH, 'x⁰_{t-1}', 'previous obs', activeStep === 'rnn');
      box(ctx, leftX, midY + boxH/2 + gapY, boxW, boxH, 'c_{t-1}', 'covariates', activeStep === 'rnn');

      // RNN box
      const rnnX = leftX + boxW + 50;
      const rnnW = 110, rnnH = 70;
      const rnnY = midY - rnnH / 2;
      box(ctx, rnnX, rnnY, rnnW, rnnH, 'RNN', 'LSTM 2-layer hidden=40', activeStep === 'rnn' || activeStep === 'encoding');

      // Arrows from history to RNN
      arrow(ctx, leftX + boxW + 4, midY - boxH - gapY/2 - boxH/2 - boxH + gapY, rnnX - 4, midY - 20, U.text(), activeStep === 'rnn');
      arrow(ctx, leftX + boxW + 4, midY, rnnX - 4, midY, U.text(), activeStep === 'rnn');
      arrow(ctx, leftX + boxW + 4, midY + boxH/2 + gapY + boxH/2, rnnX - 4, midY + 20, U.text(), activeStep === 'rnn');

      // h_{t-1} output box
      const hX = rnnX + rnnW + 30;
      const hW = 90;
      box(ctx, hX, rnnY + rnnH/2 - boxH/2, hW, boxH, 'h_{t-1}', 'hidden state', activeStep === 'encoding');
      arrow(ctx, rnnX + rnnW + 4, midY, hX - 4, midY, U.accent(), activeStep === 'encoding');

      // ── Right half: Diffusion ──
      const rightX = hX + hW + 80;
      const rightW = w - padX - rightX;

      // Diffusion chain boxes (compressed)
      const stepsCount = 5;  // N, N-1, ..., 1 (mock 5)
      const diffBoxW = (rightW - 20 * 4) / stepsCount;
      const diffBoxH = 50;
      const diffY = midY - diffBoxH / 2;

      const labels = ['x^N', 'x^{N-1}', '...', 'x^1', 'x^0'];
      const sublabels = ['~N(0,I)', '', '', '', 'predicted'];

      for (let i = 0; i < stepsCount; i++) {
        const x = rightX + i * (diffBoxW + 20);
        const isLast = i === stepsCount - 1;
        box(ctx, x, diffY, diffBoxW, diffBoxH, labels[i], sublabels[i],
            (activeStep === 'diffusion' && i < stepsCount - 1) ||
            (activeStep === 'output' && isLast));

        if (i < stepsCount - 1) {
          // arrow with ε_θ label
          arrow(ctx, x + diffBoxW + 2, midY, x + diffBoxW + 18, midY, U.accent(), activeStep === 'diffusion' || activeStep === 'output');
          if (i === 0 || i === 2) {
            ctx.fillStyle = U.accent();
            ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
            ctx.textAlign = 'center';
            ctx.fillText('ε_θ(·, h_{t-1}, n)', x + diffBoxW + 10, midY + diffBoxH/2 + 14);
          }
        }
      }

      // h_{t-1} → diffusion conditioning arrow (curved)
      ctx.strokeStyle = U.accent();
      ctx.lineWidth = activeStep === 'diffusion' || activeStep === 'output' ? 2 : 1;
      ctx.globalAlpha = activeStep === 'diffusion' || activeStep === 'output' ? 0.8 : 0.3;
      ctx.beginPath();
      const cStartX = hX + hW / 2;
      const cStartY = rnnY + rnnH/2 + boxH/2 + 4;
      const cEndX = rightX + (rightW) / 2;
      const cEndY = midY + diffBoxH/2 + 30;
      ctx.moveTo(cStartX, cStartY);
      ctx.quadraticCurveTo(cStartX, cEndY + 30, cEndX, cEndY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Phase label below
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      let phaseDesc = '';
      switch (activeStep) {
        case 'rnn': phaseDesc = 'Step 1: RNN consumes past observations + covariates'; break;
        case 'encoding': phaseDesc = 'Step 2: Final hidden state h_{t-1} encodes all history'; break;
        case 'diffusion': phaseDesc = 'Step 3: Reverse Markov chain — N=100 Langevin steps with ε_θ conditioned on h_{t-1}'; break;
        case 'output': phaseDesc = 'Step 4: Clean prediction x^0_t (this becomes input for next time step)'; break;
      }
      ctx.fillText(phaseDesc, w / 2, h - padY + 4);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
