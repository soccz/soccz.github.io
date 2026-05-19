/* viz: pt-motion-table3
 * ProTran Table 3 — Motion prediction ADE / FDE.
 */

(function () {
  const U = window.VIZ_UTIL;

  const MOTION = {
    'Human3.6M': {
      ADE: { ERD:0.722, acLSTM:0.789, 'MT-VAE':0.457, 'Pose-Knows':0.461, 'HP-GAN':0.858, 'Best-Many':0.448, GMVAE:0.461, DeliGAN:0.483, DSP:0.493, DLow:0.425, ProTran:0.381 },
      FDE: { ERD:0.969, acLSTM:1.126, 'MT-VAE':0.595, 'Pose-Knows':0.560, 'HP-GAN':0.867, 'Best-Many':0.533, GMVAE:0.555, DeliGAN:0.534, DSP:0.592, DLow:0.518, ProTran:0.491 }
    },
    'HumanEva-I': {
      ADE: { ERD:0.382, acLSTM:0.429, 'MT-VAE':0.345, 'Pose-Knows':0.269, 'HP-GAN':0.772, 'Best-Many':0.271, GMVAE:0.305, DeliGAN:0.306, DSP:0.273, DLow:0.251, ProTran:0.258 },
      FDE: { ERD:0.461, acLSTM:0.541, 'MT-VAE':0.403, 'Pose-Knows':0.296, 'HP-GAN':0.749, 'Best-Many':0.279, GMVAE:0.345, DeliGAN:0.322, DSP:0.290, DLow:0.268, ProTran:0.255 }
    }
  };

  const MODELS = ['ERD','acLSTM','MT-VAE','Pose-Knows','HP-GAN','Best-Many','GMVAE','DeliGAN','DSP','DLow','ProTran'];
  const COLORS = {
    ERD:'#9ca3af', acLSTM:'#fb7185', 'MT-VAE':'#a78bfa', 'Pose-Knows':'#22d3ee',
    'HP-GAN':'#84cc16', 'Best-Many':'#fbbf24', GMVAE:'#10b981', DeliGAN:'#f59e0b',
    DSP:'#06b6d4', DLow:'#60a5fa', ProTran:'#ef4444'
  };

  VIZ_REGISTRY['pt-motion-table3'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Human3.6M';
    let metric = params.metric || 'ADE';

    const wb = document.createElement('label');
    const lb = document.createElement('span'); lb.textContent = 'Dataset';
    wb.appendChild(lb);
    Object.keys(MOTION).forEach(d => {
      const btn = document.createElement('button');
      btn.textContent = d;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (d === dataset) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        dataset = d; draw();
      });
      wb.appendChild(btn);
    });
    controls.appendChild(wb);

    const wm = document.createElement('label');
    const lm = document.createElement('span'); lm.textContent = 'Metric';
    wm.appendChild(lm);
    ['ADE', 'FDE'].forEach(mv => {
      const btn = document.createElement('button');
      btn.textContent = mv;
      btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
      if (mv === metric) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
      btn.addEventListener('click', () => {
        wm.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
        btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
        metric = mv; draw();
      });
      wm.appendChild(btn);
    });
    controls.appendChild(wm);

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 80;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = MOTION[dataset][metric];
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
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric + ' (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 3 · ${dataset} · ${metric}`, w/2, padT - 24);

      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...vals);
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m];
        const top = yToPix(v);
        const barH = (h - padB) - top;
        ctx.fillStyle = COLORS[m];
        ctx.globalAlpha = (Math.abs(v - minVal) < 1e-9) ? 1.0 : 0.78;
        ctx.fillRect(cx - barW/2, top, barW, barH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = U.text();
        ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(v.toFixed(3), cx, top - 8);
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
