/* viz: pat-channel-indep
 * PatchTST Channel-independence vs Channel-mixing schematic.
 * Shows M=3 channels processed in two different ways.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['pat-channel-indep'] = function (canvas, controls, params) {
    let mode = params.mode || 'channel-indep';

    function makeToggle() {
      const wb = document.createElement('label');
      const lb = document.createElement('span'); lb.textContent = 'Mode';
      wb.appendChild(lb);
      [['channel-indep', 'Channel-independence (PatchTST)'], ['channel-mix', 'Channel-mixing (Informer/FEDformer)']].forEach(([k, label]) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
        if (k === mode) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
        btn.addEventListener('click', () => {
          wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
          btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
          mode = k; draw();
        });
        wb.appendChild(btn);
      });
      controls.appendChild(wb);
    }
    makeToggle();

    function drawBox(ctx, x, y, w, h, label, color, alpha=1.0) {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * 0.2;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x + w/2, y + h/2);
      ctx.globalAlpha = 1;
    }

    function arrow(ctx, x1, y1, x2, y2, color='#6b7280') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const ah = 6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - ah * Math.cos(ang - 0.4), y2 - ah * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - ah * Math.cos(ang + 0.4), y2 - ah * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const M = 3;
      const colors = ['#ef4444', '#60a5fa', '#10b981'];

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const title = mode === 'channel-indep' ?
        'Channel-Independence — same weights, M independent forwards' :
        'Channel-Mixing — concatenate variables, single forward';
      ctx.fillText(title, w/2, 8);

      const boxW = 100;
      const boxH = 32;
      const padX = 60;

      if (mode === 'channel-indep') {
        // 3 univariate inputs → 3 patching → 3 transformer (same weight) → 3 outputs
        const cols = 4;
        const colWidth = (w - 2 * padX) / cols;
        const startX = padX;
        const rowH = 60;

        // Headers
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.textAlign = 'center';
        ['Input x^(i)', 'Patches', 'Transformer (shared W)', 'Output ŷ^(i)'].forEach((t, c) => {
          ctx.fillText(t, startX + colWidth * (c + 0.5), 40);
        });

        for (let i = 0; i < M; i++) {
          const y = 70 + i * rowH;
          // Input
          drawBox(ctx, startX + 0.5*colWidth - boxW/2, y, boxW, boxH, `x^(${i+1}) ∈ R^L`, colors[i]);
          // Patches
          drawBox(ctx, startX + 1.5*colWidth - boxW/2, y, boxW, boxH, `patches (P, N)`, colors[i]);
          // Transformer (all share same weight!)
          drawBox(ctx, startX + 2.5*colWidth - boxW/2, y, boxW, boxH, 'Transformer', '#a78bfa', 1.0);
          // Output
          drawBox(ctx, startX + 3.5*colWidth - boxW/2, y, boxW, boxH, `ŷ^(${i+1}) ∈ R^T`, colors[i]);

          // arrows
          arrow(ctx, startX + 0.5*colWidth + boxW/2, y + boxH/2, startX + 1.5*colWidth - boxW/2, y + boxH/2, colors[i]);
          arrow(ctx, startX + 1.5*colWidth + boxW/2, y + boxH/2, startX + 2.5*colWidth - boxW/2, y + boxH/2, colors[i]);
          arrow(ctx, startX + 2.5*colWidth + boxW/2, y + boxH/2, startX + 3.5*colWidth - boxW/2, y + boxH/2, colors[i]);
        }

        // Highlight shared weight
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(startX + 2.5*colWidth - boxW/2 - 4, 64, boxW + 8, M * rowH + 4);
        ctx.setLineDash([]);
        ctx.fillStyle = '#dc2626';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('Same Transformer instance (weight sharing)', startX + 2.5*colWidth - boxW/2 - 4, 64 + M * rowH + 8);

      } else {
        // Channel-mixing: concatenate M variables at each timestep into single token sequence
        const colWidth = (w - 2 * padX) / 4;
        const startX = padX;

        // Headers
        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.textAlign = 'center';
        ['Multivariate x', 'Concatenated tokens', 'Transformer', 'Output ŷ'].forEach((t, c) => {
          ctx.fillText(t, startX + colWidth * (c + 0.5), 40);
        });

        // M channels stacked vertically into single block
        const blockY = 80;
        const blockH = M * 32;
        for (let i = 0; i < M; i++) {
          drawBox(ctx, startX + 0.5*colWidth - boxW/2, blockY + i * 32, boxW, 32, `x^(${i+1})`, colors[i]);
        }

        // Single concatenated input
        drawBox(ctx, startX + 1.5*colWidth - boxW/2, blockY + blockH/2 - boxH/2, boxW, boxH * 1.5, `x_t ∈ R^M`, '#94a3b8');

        // Single Transformer
        drawBox(ctx, startX + 2.5*colWidth - boxW/2, blockY + blockH/2 - boxH/2, boxW, boxH * 1.5, 'Transformer\n(channel-mix)', '#a78bfa');

        // Output (multivariate)
        for (let i = 0; i < M; i++) {
          drawBox(ctx, startX + 3.5*colWidth - boxW/2, blockY + i * 32, boxW, 32, `ŷ^(${i+1})`, colors[i]);
        }

        // arrows
        const midY = blockY + blockH / 2;
        for (let i = 0; i < M; i++) {
          arrow(ctx, startX + 0.5*colWidth + boxW/2, blockY + i * 32 + 16, startX + 1.5*colWidth - boxW/2, midY, colors[i]);
        }
        arrow(ctx, startX + 1.5*colWidth + boxW/2, midY, startX + 2.5*colWidth - boxW/2, midY, '#6b7280');
        for (let i = 0; i < M; i++) {
          arrow(ctx, startX + 2.5*colWidth + boxW/2, midY, startX + 3.5*colWidth - boxW/2, blockY + i * 32 + 16, colors[i]);
        }

        ctx.fillStyle = '#dc2626';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('All M channels mixed into single token sequence', startX + 1.5*colWidth - boxW/2, blockY + blockH + 12);
      }

      // Footer
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      const footnote = mode === 'channel-indep' ?
        'Parameters O(P·D) — independent of M. Generalizes well across different channel counts.' :
        'Parameters O(M·D) — scales with M. Risk of overfitting to spurious cross-channel correlations.';
      ctx.fillText(footnote, w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
