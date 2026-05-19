/* viz: qf-cpaw-table3
 * QuantileFormer Table 3 — cpaw across 6 datasets × 7 models.
 * "-" in paper = null (OOM or not run).
 */

(function () {
  const U = window.VIZ_UTIL;

  const CPAW = {
    Electricity:  { DeepAR:5.2890, MQRNN:3.8166, TFT:2.0002, Transformer:null, Autoformer:3.2389, FEDformer:2.3841, QuantileFormer:1.9902 },
    Wind:         { DeepAR:5.4470, MQRNN:2.8071, TFT:2.4662, Transformer:null, Autoformer:3.2790, FEDformer:2.1214, QuantileFormer:1.8435 },
    ETTm1:        { DeepAR:3.8999, MQRNN:8.4531, TFT:2.6199, Transformer:0.8988, Autoformer:1.8055, FEDformer:3.7312, QuantileFormer:5.0815 },
    ETTh1:        { DeepAR:8.6446, MQRNN:5.2274, TFT:2.1166, Transformer:null, Autoformer:1.8830, FEDformer:1.1557, QuantileFormer:4.4471 },
    Traffic:      { DeepAR:4.8742, MQRNN:1.6137, TFT:3.0367, Transformer:null, Autoformer:2.3327, FEDformer:2.8512, QuantileFormer:1.5858 },
    Solar:        { DeepAR:11.2021, MQRNN:5.6390, TFT:1.7246, Transformer:2.3645, Autoformer:4.2420, FEDformer:2.1066, QuantileFormer:0.8335 }
  };

  const MODELS = ['DeepAR','MQRNN','TFT','Transformer','Autoformer','FEDformer','QuantileFormer'];
  const COLORS = {
    DeepAR:'#9ca3af', MQRNN:'#fb7185', TFT:'#a78bfa', Transformer:'#60a5fa',
    Autoformer:'#10b981', FEDformer:'#f59e0b', QuantileFormer:'#ef4444'
  };

  VIZ_REGISTRY['qf-cpaw-table3'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Electricity';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(CPAW).forEach(d => {
      const btn = document.createElement('button');
      btn.textContent = d;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.78rem;';
      if (d === dataset) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        dataset = d; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 70;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = CPAW[dataset];
      const valid = MODELS.map(m => row[m]).filter(v => v != null);
      const yMin = 0;
      const yMax = Math.max(...valid) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 6;
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
        ctx.fillText(yv.toFixed(1), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('cpaw (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 3 · cpaw · ${dataset}`, w/2, padT - 24);

      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...valid);
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m];
        if (v == null) {
          ctx.fillStyle = U.textMuted();
          ctx.font = '600 22px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('—', cx, padT + innerH * 0.5);
        } else {
          const top = yToPix(v);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = (Math.abs(v - minVal) < 1e-6) ? 1.0 : 0.78;
          ctx.fillRect(cx - barW/2, top, barW, barH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = U.text();
          ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(2), cx, top - 8);
        }
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx, h - padB + 8);
        ctx.rotate(Math.PI / 6);
        ctx.fillText(m, 0, 0);
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
