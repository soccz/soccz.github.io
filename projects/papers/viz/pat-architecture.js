/* viz: pat-architecture
 * Interactive PatchTST architecture — toggle between (a) overview / (b) supervised / (c) self-supervised
 * Mirrors paper Figure 1.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['pat-architecture'] = function (canvas, controls, params) {
    let mode = params.mode || 'overview';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Panel';
    wb.appendChild(lb);
    [['overview', '(a) Model Overview'], ['supervised', '(b) Supervised'], ['self-sup', '(c) Self-supervised']].forEach(([k, label]) => {
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
      label.split('\n').forEach((line, li) => {
        ctx.fillText(line, x + w/2, y + h/2 + li * 12 - (label.split('\n').length - 1) * 6);
      });
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

      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const titleMap = {
        'overview':   '(a) PatchTST Model Overview — M channels, shared Transformer, independent forwards',
        'supervised': '(b) Transformer Backbone (Supervised) — Instance Norm + Patching → Encoder → Flatten + Linear → ŷ',
        'self-sup':   '(c) Transformer Backbone (Self-supervised) — Mask patches → Encoder → Linear D→P → Reconstruct masked'
      };
      ctx.fillText(titleMap[mode], w/2, 8);

      if (mode === 'overview') {
        const M = 3;
        const colors = ['#ef4444', '#60a5fa', '#10b981'];
        const cols = 4;
        const colWidth = (w - 120) / cols;
        const startX = 60;
        const rowH = 56;

        ctx.font = '12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillStyle = U.textMuted();
        ctx.textAlign = 'center';
        ['Multivariate\nx ∈ R^{M×L}', 'Per-channel\nx^(i) ∈ R^L', 'Shared Transformer\n(channel-indep)', 'Output\nŷ ∈ R^{M×T}'].forEach((t, c) => {
          t.split('\n').forEach((line, li) => {
            ctx.fillText(line, startX + colWidth * (c + 0.5), 40 + li * 14);
          });
        });

        // Multivariate input box (combined)
        drawBox(ctx, startX + 0.5*colWidth - 60, 90, 120, 60, 'x', '#94a3b8');

        // Channel split
        for (let i = 0; i < M; i++) {
          const y = 90 + (i - 1) * rowH;
          drawBox(ctx, startX + 1.5*colWidth - 50, y + 20, 100, 32, `x^(${i+1}) ∈ R^L`, colors[i]);
          drawBox(ctx, startX + 2.5*colWidth - 50, y + 20, 100, 32, 'Transformer', '#a78bfa', 1.0);
          drawBox(ctx, startX + 3.5*colWidth - 50, y + 20, 100, 32, `ŷ^(${i+1})`, colors[i]);
          arrow(ctx, startX + 0.5*colWidth + 60, 120, startX + 1.5*colWidth - 50, y + 36, colors[i]);
          arrow(ctx, startX + 1.5*colWidth + 50, y + 36, startX + 2.5*colWidth - 50, y + 36, colors[i]);
          arrow(ctx, startX + 2.5*colWidth + 50, y + 36, startX + 3.5*colWidth - 50, y + 36, colors[i]);
        }
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(startX + 2.5*colWidth - 54, 88, 108, 3 * rowH + 4);
        ctx.setLineDash([]);
        ctx.fillStyle = '#dc2626';
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('shared weights', startX + 2.5*colWidth, 88 + 3 * rowH + 8);

      } else if (mode === 'supervised') {
        // Vertical stack of layers
        const stages = [
          { label:'Input univariate\nx^(i) ∈ R^{1×L}', color:'#94a3b8' },
          { label:'Instance Norm + Patching\n→ R^{P×N}', color:'#60a5fa' },
          { label:'Projection + Position\nW_p ∈ R^{D×P}, W_pos ∈ R^{D×N}', color:'#a78bfa' },
          { label:'Transformer Encoder ×3\n(MHA + BatchNorm + FFN)', color:'#ef4444' },
          { label:'Flatten + Linear Head\nW_head ∈ R^{(D·N)×T}', color:'#fbbf24' },
          { label:'Denormalize\n(InstanceNorm.denormalize)', color:'#10b981' },
          { label:'Output ŷ^(i) ∈ R^{1×T}', color:'#94a3b8' }
        ];
        const stageH = 50;
        const startY = 50;
        const boxW = 320;
        const cx = w / 2;
        stages.forEach((s, i) => {
          drawBox(ctx, cx - boxW/2, startY + i * (stageH + 14), boxW, stageH, s.label, s.color);
          if (i < stages.length - 1) {
            arrow(ctx, cx, startY + i * (stageH + 14) + stageH, cx, startY + (i+1) * (stageH + 14));
          }
        });

      } else if (mode === 'self-sup') {
        const stages = [
          { label:'Input univariate\nx^(i) ∈ R^{1×L=512}', color:'#94a3b8' },
          { label:'Instance Norm + Patching\nP=12, S=12 (non-overlap), N=42', color:'#60a5fa' },
          { label:'Random Mask 40% of patches\n(set to zero)', color:'#dc2626' },
          { label:'Projection + Position\n(same W_p, W_pos as supervised)', color:'#a78bfa' },
          { label:'Transformer Encoder ×3\n(same encoder as supervised)', color:'#ef4444' },
          { label:'Reconstruction head\nLinear D → P', color:'#fbbf24' },
          { label:'Reconstructed patches\nx̂_p ∈ R^{P×N}', color:'#94a3b8' },
          { label:'MSE loss on masked patches only', color:'#10b981' }
        ];
        const stageH = 42;
        const startY = 42;
        const boxW = 340;
        const cx = w / 2;
        stages.forEach((s, i) => {
          drawBox(ctx, cx - boxW/2, startY + i * (stageH + 8), boxW, stageH, s.label, s.color);
          if (i < stages.length - 1) {
            arrow(ctx, cx, startY + i * (stageH + 8) + stageH, cx, startY + (i+1) * (stageH + 8));
          }
        });
      }

      // Footer
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      const footMap = {
        'overview':   'Channel-independence: M independent forwards through SAME Transformer weights',
        'supervised': 'Default: L=336 (PatchTST/42), P=16, S=8, D=128, H=16, 3 encoder layers',
        'self-sup':   'P=12 non-overlapping for self-sup. Loss only on masked indices, not unmasked'
      };
      ctx.fillText(footMap[mode], w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
