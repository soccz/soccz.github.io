/* viz: pt-ablation-table2
 * ProTran Table 2 — Ablation on Traffic.
 */

(function () {
  const U = window.VIZ_UTIL;

  const ABL = [
    { label:'A: Full (2-layer)',   crps:0.028, two:true,  one:false, ctx:true,  det:false, color:'#ef4444' },
    { label:'B: One Layer',        crps:0.031, two:false, one:true,  ctx:true,  det:false, color:'#60a5fa' },
    { label:'C: No Context Attn',  crps:0.033, two:false, one:true,  ctx:false, det:false, color:'#f59e0b' },
    { label:'D: Deterministic',    crps:0.041, two:false, one:true,  ctx:true,  det:true,  color:'#9ca3af' }
  ];

  VIZ_REGISTRY['pt-ablation-table2'] = function (canvas, controls, params) {
    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 110;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = 0;
      const yMax = Math.max(...ABL.map(a => a.crps)) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        ctx.fillText(yv.toFixed(3), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('CRPS_sum on Traffic', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('paper Table 2 · Ablation on Traffic', w/2, padT - 24);

      const groupW = innerW / ABL.length;
      const barW = groupW * 0.55;
      ABL.forEach((a, i) => {
        const cx = padL + groupW * (i + 0.5);
        const top = yToPix(a.crps);
        const barH = (h - padB) - top;
        ctx.fillStyle = a.color;
        ctx.globalAlpha = (i === 0) ? 1.0 : 0.78;
        ctx.fillRect(cx - barW/2, top, barW, barH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(a.crps.toFixed(3), cx, top - 8);
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx, h - padB + 8);
        ctx.rotate(Math.PI / 8);
        ctx.fillText(a.label, 0, 0);
        ctx.restore();
      });

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
