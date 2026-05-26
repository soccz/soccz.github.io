/* viz: pat-table1-evolution
 * PatchTST narrative — Traffic (T=96) ablation progression.
 * Combines paper Table 7 (patching/CI ablation) + Table 4 (self-supervised) + Table 3 (baselines).
 */

(function () {
  const U = window.VIZ_UTIL;

  // All values are paper-exact (Table 3, 4, 7/10 for Traffic, T=96)
  const STAGES = [
    { label:'Original TST',                detail:'channel-mixing, no patch (Table 10) — OOM on Traffic; show vanilla Informer instead', mse:0.733, color:'#94a3b8', note:'Informer (Table 3)' },
    { label:'FEDformer',                   detail:'channel-mixing baseline (Table 3)', mse:0.576, color:'#9ca3af' },
    { label:'DLinear',                     detail:'Linear baseline, L=336 (Table 3)', mse:0.410, color:'#cbd5e1' },
    { label:'Only CI',                     detail:'Channel-indep, no patch (Table 10)', mse:0.397, color:'#fbbf24' },
    { label:'P+CI (PatchTST/42 sup.)',     detail:'Channel-indep + patching (Table 7)', mse:0.367, color:'#a78bfa' },
    { label:'Self-sup PatchTST/42',        detail:'Self-supervised pre-training (Table 4)', mse:0.352, color:'#ef4444' }
  ];

  VIZ_REGISTRY['pat-table1-evolution'] = function (canvas, controls, params) {
    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 70, padR = 28, padT = 38, padB = 130;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const yMin = 0;
      const yMax = 0.85;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

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
      ctx.fillText('Traffic T=96 — Baselines → CI → Patch+CI → Self-supervised', w/2, padT - 24);

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
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx + 8, h - padB + 8);
        ctx.rotate(-Math.PI / 5);
        ctx.fillText(s.label, 0, 0);
        ctx.restore();
      });

      // 0.733 → 0.352 annotation
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      const x1 = padL + groupW * 0.5, xL = padL + groupW * 5.5;
      const annY = padT + 4;
      ctx.beginPath();
      ctx.moveTo(x1, annY);
      ctx.lineTo(xL, annY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1, annY); ctx.lineTo(x1, annY + 8);
      ctx.moveTo(xL, annY); ctx.lineTo(xL, annY + 8);
      ctx.stroke();
      ctx.setLineDash([]);
      const txt = '0.733 → 0.352 = 52% MSE reduction';
      ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = U.cssVar('--surface', '#f3f4f6');
      ctx.globalAlpha = 0.85;
      ctx.fillRect((x1+xL)/2 - tw/2 - 4, annY - 5, tw + 8, 16);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(txt, (x1+xL)/2, annY - 4);

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
