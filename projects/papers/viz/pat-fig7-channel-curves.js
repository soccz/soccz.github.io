/* viz: pat-fig7-channel-curves
 * PatchTST Figure 7 — Channel-indep vs Channel-mixing on Weather dataset.
 * Left panel: test loss vs train size (channel-indep converges faster).
 * Right panel: test loss vs epoch (channel-mixing overfits).
 * Values approximate from Fig 7 plots with 5 random seeds error bars.
 */

(function () {
  const U = window.VIZ_UTIL;

  // Test loss vs train fraction
  const TRAIN_SIZE = {
    fractions: [0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1.0],
    channel_indep:  [0.225, 0.190, 0.165, 0.160, 0.158, 0.157, 0.157],
    channel_mixing: [0.258, 0.250, 0.220, 0.190, 0.180, 0.175, 0.172]
  };

  // Test loss vs epoch (first 20 epochs)
  const EPOCH = {
    epochs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20],
    channel_indep:  [0.245, 0.185, 0.175, 0.172, 0.170, 0.168, 0.166, 0.164, 0.162, 0.161, 0.159, 0.158, 0.157, 0.157, 0.156],
    channel_mixing: [0.245, 0.180, 0.170, 0.168, 0.172, 0.177, 0.180, 0.183, 0.186, 0.188, 0.191, 0.193, 0.194, 0.195, 0.196]
  };

  VIZ_REGISTRY['pat-fig7-channel-curves'] = function (canvas, controls, params) {
    let panel = params.panel || 'train_size';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Panel';
    wb.appendChild(lb);
    [['train_size', 'Left: vs train size'], ['epoch', 'Right: vs epoch']].forEach(([k, label]) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (k === panel) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        panel = k; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 130, padT = 38, padB = 56;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const data = panel === 'train_size' ? TRAIN_SIZE : EPOCH;
      const xs = panel === 'train_size' ? data.fractions : data.epochs;
      const allY = [...data.channel_indep, ...data.channel_mixing];
      const yMin = Math.min(...allY) * 0.93;
      const yMax = Math.max(...allY) * 1.05;
      const xMin = xs[0], xMax = xs[xs.length - 1];
      const xToPix = (x) => padL + ((x - xMin) / (xMax - xMin)) * innerW;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.beginPath(); ctx.moveTo(padL, yToPix(yv)); ctx.lineTo(w-padR, yToPix(yv));
        ctx.globalAlpha = 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(yv.toFixed(3), padL - 8, yToPix(yv));
      }

      // x ticks
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      xs.forEach(x => ctx.fillText(panel === 'train_size' ? x.toFixed(2) : String(x), xToPix(x), h - padB + 6));

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const title = panel === 'train_size'
        ? 'paper Fig 7 (left) · Weather · Test loss vs train fraction'
        : 'paper Fig 7 (right) · Weather · Test loss vs epoch';
      ctx.fillText(title, w/2, padT - 24);

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('Test loss (MSE)', 0, 0);
      ctx.restore();

      // x-axis label
      ctx.fillStyle = U.text();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(panel === 'train_size' ? 'train fraction' : 'epoch', padL + innerW / 2, h - padB + 22);

      // Draw lines
      function plot(yarr, color, lw=2.5) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();
        xs.forEach((x, i) => {
          const px = xToPix(x), py = yToPix(yarr[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
        // Points
        xs.forEach((x, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(xToPix(x), yToPix(yarr[i]), 4, 0, 2*Math.PI);
          ctx.fill();
        });
      }
      plot(data.channel_indep, '#ef4444');
      plot(data.channel_mixing, '#60a5fa');

      // Legend
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const legendX = w - padR + 8;
      [
        ['channel-indep', '#ef4444'],
        ['channel-mixing', '#60a5fa']
      ].forEach(([lbl, color], i) => {
        const ly = padT + 14 + i * 22;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(legendX + 6, ly, 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = U.text();
        ctx.fillText(lbl, legendX + 18, ly);
      });

      // Footer interpretation
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(
        panel === 'train_size'
          ? 'Channel-indep converges faster — needs less data to match (red ≪ blue at small train size)'
          : 'Channel-mixing OVERFITS after ~5 epochs (blue ↑), channel-indep keeps decreasing (red ↓)',
        w/2, h - 8
      );

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
