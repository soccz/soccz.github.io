/* viz: qf-qrisk-table1
 * QuantileFormer (IJCAI 2025) Table 1 — 6 datasets × 5 quantiles × 9 models q-risk.
 * Exact values from paper Table 1.
 */

(function () {
  const U = window.VIZ_UTIL;

  const QRISK = {
    Electricity: {
      0.5: { DeepAR:1.0002, MQRNN:1.1648, TFT:1.1547, Transformer:1.3703, Autoformer:1.0584, FEDformer:1.9429, PatchTST:1.8354, iTransformer:1.3430, QuantileFormer:0.7469 },
      0.6: { DeepAR:1.1177, MQRNN:1.5772, TFT:1.0037, Transformer:0.8873, Autoformer:0.9191, FEDformer:1.0447, PatchTST:1.3134, iTransformer:1.0348, QuantileFormer:0.8136 },
      0.7: { DeepAR:1.9544, MQRNN:1.6336, TFT:1.0440, Transformer:1.0098, Autoformer:1.0301, FEDformer:0.9669, PatchTST:1.0657, iTransformer:1.2174, QuantileFormer:0.3330 },
      0.8: { DeepAR:1.2077, MQRNN:1.8193, TFT:0.8772, Transformer:0.9005, Autoformer:0.8786, FEDformer:3.0007, PatchTST:0.8800, iTransformer:0.9072, QuantileFormer:0.4340 },
      0.9: { DeepAR:1.0830, MQRNN:0.8273, TFT:0.7618, Transformer:0.9439, Autoformer:0.6420, FEDformer:1.0618, PatchTST:0.7567, iTransformer:1.2742, QuantileFormer:0.5121 }
    },
    Wind: {
      0.5: { DeepAR:1.0205, MQRNN:2.1937, TFT:0.9526, Transformer:1.0011, Autoformer:1.4353, FEDformer:1.1361, PatchTST:1.4666, iTransformer:1.5983, QuantileFormer:0.8403 },
      0.6: { DeepAR:0.9987, MQRNN:4.4670, TFT:0.8611, Transformer:1.0585, Autoformer:1.6054, FEDformer:1.0831, PatchTST:0.9831, iTransformer:1.0314, QuantileFormer:0.9105 },
      0.7: { DeepAR:0.7805, MQRNN:5.5987, TFT:0.9778, Transformer:0.9898, Autoformer:1.3345, FEDformer:1.2615, PatchTST:1.1398, iTransformer:0.8091, QuantileFormer:0.7346 },
      0.8: { DeepAR:1.0182, MQRNN:5.9560, TFT:0.6568, Transformer:0.9006, Autoformer:0.9921, FEDformer:0.6544, PatchTST:0.9008, iTransformer:0.6814, QuantileFormer:0.5842 },
      0.9: { DeepAR:1.4419, MQRNN:1.8574, TFT:0.4658, Transformer:0.9750, Autoformer:0.6361, FEDformer:0.3876, PatchTST:0.3667, iTransformer:0.9900, QuantileFormer:0.3369 }
    },
    ETTm1: {
      0.5: { DeepAR:1.2026, MQRNN:16.5845, TFT:0.4930, Transformer:1.0397, Autoformer:1.8463, FEDformer:0.6619, PatchTST:1.4268, iTransformer:0.7514, QuantileFormer:0.1536 },
      0.6: { DeepAR:1.1749, MQRNN:21.9918, TFT:0.7829, Transformer:0.8740, Autoformer:1.3424, FEDformer:0.8673, PatchTST:1.3088, iTransformer:0.4112, QuantileFormer:0.1642 },
      0.7: { DeepAR:0.7901, MQRNN:17.9190, TFT:0.6769, Transformer:0.7372, Autoformer:1.1008, FEDformer:0.4927, PatchTST:1.0240, iTransformer:0.8834, QuantileFormer:0.2689 },
      0.8: { DeepAR:1.0616, MQRNN:12.0559, TFT:0.4976, Transformer:0.4998, Autoformer:0.8392, FEDformer:0.5491, PatchTST:0.5100, iTransformer:0.5824, QuantileFormer:0.4340 },
      0.9: { DeepAR:0.5388, MQRNN:3.6909, TFT:0.3513, Transformer:0.3618, Autoformer:0.4774, FEDformer:0.3865, PatchTST:0.2816, iTransformer:0.1228, QuantileFormer:0.0596 }
    },
    ETTh1: {
      0.5: { DeepAR:2.3414, MQRNN:1.4757, TFT:1.4639, Transformer:1.1989, Autoformer:1.7221, FEDformer:0.9480, PatchTST:1.4719, iTransformer:0.8850, QuantileFormer:0.3007 },
      0.6: { DeepAR:0.7631, MQRNN:1.6722, TFT:1.0443, Transformer:0.8805, Autoformer:1.2556, FEDformer:0.8875, PatchTST:1.4558, iTransformer:0.9508, QuantileFormer:0.6130 },
      0.7: { DeepAR:1.2217, MQRNN:1.0317, TFT:0.9283, Transformer:0.7284, Autoformer:1.1977, FEDformer:0.8328, PatchTST:1.1307, iTransformer:0.8607, QuantileFormer:0.2912 },
      0.8: { DeepAR:1.0815, MQRNN:1.1949, TFT:0.7382, Transformer:0.4868, Autoformer:0.9091, FEDformer:0.7208, PatchTST:0.4275, iTransformer:0.4721, QuantileFormer:0.4273 },
      0.9: { DeepAR:1.9889, MQRNN:1.2239, TFT:0.3662, Transformer:0.5546, Autoformer:0.4569, FEDformer:0.4582, PatchTST:0.3166, iTransformer:0.3129, QuantileFormer:0.3388 }
    },
    Solar: {
      0.5: { DeepAR:0.8666, MQRNN:0.8994, TFT:1.0039, Transformer:1.0391, Autoformer:1.1641, FEDformer:1.0363, PatchTST:1.0806, iTransformer:1.0705, QuantileFormer:1.0641 },
      0.6: { DeepAR:1.1173, MQRNN:1.3492, TFT:1.1082, Transformer:1.1617, Autoformer:1.2367, FEDformer:1.1708, PatchTST:1.1242, iTransformer:1.1843, QuantileFormer:1.0480 },
      0.7: { DeepAR:1.2854, MQRNN:1.0459, TFT:1.2493, Transformer:1.1381, Autoformer:1.2088, FEDformer:1.0261, PatchTST:1.2547, iTransformer:1.1845, QuantileFormer:1.1832 },
      0.8: { DeepAR:1.4512, MQRNN:1.1921, TFT:1.3740, Transformer:1.0794, Autoformer:1.0030, FEDformer:1.5427, PatchTST:1.1935, iTransformer:1.3705, QuantileFormer:1.0008 },
      0.9: { DeepAR:1.6117, MQRNN:1.7157, TFT:1.0015, Transformer:1.0777, Autoformer:0.6167, FEDformer:0.6414, PatchTST:0.5950, iTransformer:1.6083, QuantileFormer:0.5883 }
    },
    Traffic: {
      0.5: { DeepAR:1.0502, MQRNN:1.8146, TFT:1.1494, Transformer:0.9664, Autoformer:0.9908, FEDformer:2.4497, PatchTST:0.9775, iTransformer:1.8998, QuantileFormer:0.8489 },
      0.6: { DeepAR:0.8813, MQRNN:2.2111, TFT:0.8900, Transformer:0.9325, Autoformer:1.1109, FEDformer:0.9188, PatchTST:1.6937, iTransformer:1.3545, QuantileFormer:0.8291 },
      0.7: { DeepAR:1.2484, MQRNN:2.5796, TFT:0.8500, Transformer:1.0574, Autoformer:0.8686, FEDformer:2.3784, PatchTST:1.1269, iTransformer:1.1941, QuantileFormer:0.8489 },
      0.8: { DeepAR:0.9394, MQRNN:2.9482, TFT:0.5862, Transformer:0.8679, Autoformer:0.6064, FEDformer:1.7356, PatchTST:0.5962, iTransformer:0.8247, QuantileFormer:0.5998 },
      0.9: { DeepAR:1.1539, MQRNN:0.9940, TFT:1.0570, Transformer:0.9247, Autoformer:0.4970, FEDformer:0.8770, PatchTST:1.1450, iTransformer:1.5621, QuantileFormer:0.4688 }
    }
  };

  const MODELS = ['DeepAR','MQRNN','TFT','Transformer','Autoformer','FEDformer','PatchTST','iTransformer','QuantileFormer'];
  const COLORS = {
    DeepAR:'#9ca3af', MQRNN:'#fb7185', TFT:'#a78bfa', Transformer:'#60a5fa',
    Autoformer:'#10b981', FEDformer:'#f59e0b', PatchTST:'#22d3ee', iTransformer:'#fbbf24',
    QuantileFormer:'#ef4444'
  };

  VIZ_REGISTRY['qf-qrisk-table1'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Electricity';
    let quantile = parseFloat(params.quantile || 0.5);

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(QRISK).forEach(d => {
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

    const wq = document.createElement('label');
    const lq = document.createElement('span'); lq.textContent = 'Quantile';
    wq.appendChild(lq);
    [0.5, 0.6, 0.7, 0.8, 0.9].forEach(q => {
      const btn = document.createElement('button');
      btn.textContent = q.toFixed(1);
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (Math.abs(q - quantile) < 1e-6) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wq.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        quantile = q; draw();
      });
      wq.appendChild(btn);
    });
    controls.appendChild(wq);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 70;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = QRISK[dataset][quantile];
      const vals = MODELS.map(m => row[m]);
      const yMin = 0;
      const yMax = Math.max(...vals) * 1.15;
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
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText('q-risk (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 1 · ${dataset} · q=${quantile.toFixed(1)}`, w/2, padT - 24);

      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...vals);
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m];
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
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textBaseline = 'top';
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
