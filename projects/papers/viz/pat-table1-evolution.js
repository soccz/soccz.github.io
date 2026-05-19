/* viz: pat-table1-evolution
 * PatchTST Table 1 — Case study evolution on Traffic (T=96).
 * Shows the narrative 0.518 → 0.447 → 0.397 → 0.367 → 0.349 across 5 configurations.
 */

(function () {
  const U = window.VIZ_UTIL;

  const STAGES = [
    { label:'(1) L=96, N=96',                  detail:'Channel-indep, no patch, short window', L:96,  N:96,  patch:false, selfSup:false, mse:0.518, color:'#94a3b8' },
    { label:'(2) L=380→N=96 downsampled',      detail:'Channel-indep, no patch, downsampled to 96 tokens', L:380, N:96,  patch:false, selfSup:false, mse:0.447, color:'#fbbf24' },
    { label:'(3) L=336, N=336',                detail:'Channel-indep, no patch, full L=336 tokens', L:336, N:336, patch:false, selfSup:false, mse:0.397, color:'#60a5fa' },
    { label:'(4) PatchTST/42 supervised',      detail:'Channel-indep + PATCHING (P=16, S=8) → N=42', L:336, N:42,  patch:true,  selfSup:false, mse:0.367, color:'#a78bfa' },
    { label:'(5) PatchTST/42 self-supervised', detail:'Same + self-supervised pre-training', L:336, N:42,  patch:true,  selfSup:true,  mse:0.349, color:'#ef4444' },
    { label:'FEDformer (channel-mixing)',      detail:'Channel-mixing, L=96', L:96,  N:96,  patch:false, selfSup:false, mse:0.597, color:'#9ca3af' },
    { label:'DLinear',                          detail:'Linear baseline, L=336', L:336, N:0,   patch:false, selfSup:false, mse:0.410, color:'#9ca3af' }
  ];

  VIZ_REGISTRY['pat-table1-evolution'] = function (canvas, controls, params) {
    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 28, padT = 38, padB = 130;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = 0;
      const yMax = 0.65;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      // Grid
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const yv = yMin + (yMax - yMin) * i / 5;
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('MSE on Traffic (T=96, lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('paper Table 1 — Case study on Traffic (5 PatchTST stages + 2 baselines)', w/2, padT - 24);

      const groupW = innerW / STAGES.length;
      const barW = groupW * 0.65;
      const minVal = Math.min(...STAGES.map(s => s.mse));
      STAGES.forEach((s, i) => {
        const cx = padL + groupW * (i + 0.5);
        const top = yToPix(s.mse);
        const barH = (h - padB) - top;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = (Math.abs(s.mse - minVal) < 1e-9) ? 1.0 : 0.78;
        ctx.fillRect(cx - barW/2, top, barW, barH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(s.mse.toFixed(3), cx, top - 10);
        // labels
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx + 8, h - padB + 8);
        ctx.rotate(-Math.PI / 5);
        ctx.fillText(s.label, 0, 0);
        ctx.restore();
      });

      // Show 33% improvement annotation
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      const x1 = padL + groupW * 0.5, x5 = padL + groupW * 4.5;
      ctx.beginPath();
      ctx.moveTo(x1, yToPix(0.518) - 30);
      ctx.lineTo(x5, yToPix(0.518) - 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('0.518 → 0.349 = 33% reduction', (x1+x5)/2, yToPix(0.518) - 35);

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
