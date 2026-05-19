/* viz: pat-patching
 * PatchTST Patching mechanism — L timestep input → N=L/S+offset patches of length P.
 * Sliding window visualization with P and S sliders.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['pat-patching'] = function (canvas, controls, params) {
    let P = parseInt(params.P, 10) || 16;
    let S = parseInt(params.S, 10) || 8;
    const L = 64;  // demo length

    function makeSlider(label, val, min, max, step, onChange) {
      const wrap = document.createElement('label');
      wrap.style.cssText = 'margin-right:18px;';
      const lb = document.createElement('span'); lb.textContent = label + ': ';
      const valSpan = document.createElement('span'); valSpan.textContent = val; valSpan.style.cssText = 'font-weight:600;color:var(--accent);margin:0 6px;';
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = min; slider.max = max; slider.step = step; slider.value = val;
      slider.style.cssText = 'vertical-align:middle;width:140px;';
      slider.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        valSpan.textContent = v;
        onChange(v);
      });
      wrap.appendChild(lb); wrap.appendChild(valSpan); wrap.appendChild(slider);
      controls.appendChild(wrap);
      return wrap;
    }

    makeSlider('Patch length P', P, 2, 24, 1, v => { P = v; draw(); });
    makeSlider('Stride S', S, 1, 16, 1, v => { S = v; draw(); });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 50, padR = 20, padT = 40, padB = 30;
      const innerW = w - padL - padR;

      // Original time series: L timesteps as small boxes
      const cellW = innerW / L;
      const cellH = 24;
      const seriesY = padT + 10;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const N = Math.floor((L - P) / S) + 2;
      ctx.fillText(`L=${L} timesteps · P=${P} · S=${S} → N=${N} patches`, w/2, 12);

      // Original time series boxes
      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('Original time series:', padL, seriesY - 12);

      for (let i = 0; i < L; i++) {
        const cx = padL + i * cellW;
        // Synthetic waveform color
        const val = 0.4 + 0.4 * Math.sin(i * 0.4) + 0.2 * Math.sin(i * 0.13);
        const c = Math.floor(180 + 70 * val);
        ctx.fillStyle = `rgb(${c-50}, ${c}, ${c+30})`;
        ctx.fillRect(cx + 0.5, seriesY, cellW - 1, cellH);
        if (cellW > 14) {
          ctx.fillStyle = '#333';
          ctx.font = '8px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(i + 1, cx + cellW / 2, seriesY + cellH / 2);
        }
      }

      // Patches below
      const patchY = seriesY + cellH + 40;
      const patchH = 20;
      const maxPatchesPerRow = Math.min(N, 10);
      const patchRows = Math.ceil(N / maxPatchesPerRow);
      const patchW = cellW * P;

      ctx.fillStyle = U.textMuted();
      ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(`${N} patches (P=${P} timesteps each, stride S=${S}):`, padL, patchY - 12);

      const colors = ['#ef4444', '#f97316', '#fbbf24', '#a78bfa', '#60a5fa', '#22d3ee', '#10b981', '#84cc16'];

      for (let k = 0; k < N; k++) {
        const startTimestep = k * S;
        const endTimestep = Math.min(startTimestep + P, L);
        const x0 = padL + startTimestep * cellW;
        const widthEff = (endTimestep - startTimestep) * cellW;
        const py = patchY + 30 + k * (patchH + 4);
        const color = colors[k % colors.length];

        // Draw patch arrow from source area to patch box
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.rect(x0, seriesY - 2, P * cellW, cellH + 4);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw patch indicator at bottom
        ctx.fillStyle = color;
        const pxStart = padL + startTimestep * cellW;
        ctx.fillRect(pxStart, py, widthEff, patchH);
        ctx.fillStyle = '#fff';
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(`patch ${k+1} (t=${startTimestep+1}..${Math.min(startTimestep+P, L)})`, pxStart + 6, py + patchH/2);

        if (k >= 6) break; // Show only first 7 patches to keep visual clean
      }

      if (N > 7) {
        ctx.fillStyle = U.textMuted();
        ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`... ${N - 7} more patches`, w/2, patchY + 30 + 7 * (patchH + 4) + 10);
      }
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
