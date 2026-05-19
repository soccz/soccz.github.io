/* viz: qf-vae-graph
 * VAE variable dependency graph (Eq 9-15).
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['qf-vae-graph'] = function (canvas, controls, params) {
    let K = parseInt(params.K || 4, 10);

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'K (components)';
    wb.appendChild(lb);
    [2, 4, 6, 8].forEach(kv => {
      const btn = document.createElement('button');
      btn.textContent = String(kv);
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (kv === K) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        K = kv; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      // Layout: 5 columns
      const cols = [
        { x: 80,  label: 'Priors',            items: [`ν_k, ζ_k`, `ς_k, κ_k`] },
        { x: 250, label: 'Sampling (Eq 9)',   items: [`b_t ~ N(ν, ζ)`, `λ_t ~ Beta(ς, κ)`] },
        { x: 420, label: 'Discrete (Eq 9)',   items: [`c_t ~ Bernoulli(∏λ)`] },
        { x: 590, label: 'Latent',            items: [`z_t = Σ b·ż`] },
        { x: 760, label: 'Output (Eq 15)',    items: [`χ^d_out`] }
      ];

      // Map x to canvas
      const xMin = 0, xMax = 840;
      const xScale = (x) => 40 + (x / xMax) * (w - 80);

      // Draw nodes
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const nodeR = 22;
      const nodeXs = [];
      const nodeYs = [];

      cols.forEach((col, ci) => {
        const xp = xScale(col.x);
        col.items.forEach((item, i) => {
          const yp = 80 + i * 70 + (col.items.length === 1 ? 35 : 0);
          // Box
          ctx.fillStyle = ['#fbbf24', '#60a5fa', '#a78bfa', '#10b981', '#ef4444'][ci];
          ctx.globalAlpha = 0.18;
          ctx.fillRect(xp - 85, yp - 22, 170, 44);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = ['#fbbf24', '#60a5fa', '#a78bfa', '#10b981', '#ef4444'][ci];
          ctx.lineWidth = 1.5;
          ctx.strokeRect(xp - 85, yp - 22, 170, 44);
          ctx.fillStyle = U.text();
          ctx.fillText(item, xp, yp);
          nodeXs.push(xp);
          nodeYs.push(yp);
        });
        ctx.fillStyle = U.textMuted();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(col.label, xp, 30);
        ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      });

      // Edges
      function arrow(x1, y1, x2, y2) {
        ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        // Arrow head
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const ah = 8;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ah * Math.cos(ang - 0.3), y2 - ah * Math.sin(ang - 0.3));
        ctx.lineTo(x2 - ah * Math.cos(ang + 0.3), y2 - ah * Math.sin(ang + 0.3));
        ctx.closePath();
        ctx.fillStyle = U.cssVar('--text-muted', '#6b7280');
        ctx.fill();
      }
      // priors → sampling
      arrow(xScale(80) + 85, 80, xScale(250) - 85, 80);   // ν, ζ → b
      arrow(xScale(80) + 85, 150, xScale(250) - 85, 150); // ς, κ → λ
      // sampling → discrete
      arrow(xScale(250) + 85, 150, xScale(420) - 85, 115); // λ → c
      // discrete + b → latent
      arrow(xScale(420) + 85, 115, xScale(590) - 85, 115); // c → z (through prod)
      arrow(xScale(250) + 85, 80,  xScale(590) - 85, 115); // b → z (curved)
      // latent → output
      arrow(xScale(590) + 85, 115, xScale(760) - 85, 115); // z → χ^d_out

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`VAE Variable Dependency Graph (Eq 9-15) · K=${K} components`, w/2, 4);

      // Footer
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('ϕ (encoder) infers prior params · θ (decoder) reconstructs χ^d_out from latent z_t', w/2, h - 8);
      ctx.fillText('K = number of Gaussian components in mixture inference', w/2, h - 22);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
