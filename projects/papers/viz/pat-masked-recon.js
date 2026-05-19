/* viz: pat-masked-recon
 * PatchTST self-supervised masked reconstruction schematic.
 * Shows N=10 patches, mask ratio slider, reconstruction process.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['pat-masked-recon'] = function (canvas, controls, params) {
    let maskRatio = parseFloat(params.mask) || 0.4;
    const N = 10; // demo number of patches

    function makeSlider(label, val, min, max, step, onChange) {
      const wrap = document.createElement('label');
      wrap.style.cssText = 'margin-right:18px;';
      const lb = document.createElement('span'); lb.textContent = label + ': ';
      const valSpan = document.createElement('span');
      valSpan.textContent = (val * 100).toFixed(0) + '%';
      valSpan.style.cssText = 'font-weight:600;color:var(--accent);margin:0 6px;';
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = min; slider.max = max; slider.step = step; slider.value = val;
      slider.style.cssText = 'vertical-align:middle;width:140px;';
      slider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        valSpan.textContent = (v * 100).toFixed(0) + '%';
        onChange(v);
      });
      wrap.appendChild(lb); wrap.appendChild(valSpan); wrap.appendChild(slider);
      controls.appendChild(wrap);
      return wrap;
    }

    makeSlider('Mask ratio', maskRatio, 0.1, 0.7, 0.05, v => { maskRatio = v; draw(); });

    // Deterministic mask indices based on N and ratio (fixed pattern for clarity)
    function getMaskedIndices(n, ratio) {
      const nMask = Math.round(n * ratio);
      // Deterministic pseudo-random based on simple LFSR-ish
      const indices = [];
      let seed = 7;
      const used = new Set();
      while (indices.length < nMask) {
        seed = (seed * 17 + 31) % 101;
        const idx = seed % n;
        if (!used.has(idx)) {
          used.add(idx);
          indices.push(idx);
        }
      }
      return new Set(indices);
    }

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 40, padR = 40, padT = 50;
      const innerW = w - padL - padR;
      const patchW = innerW / N - 4;
      const patchH = 50;

      const maskedSet = getMaskedIndices(N, maskRatio);
      const nMasked = maskedSet.size;

      // Title
      ctx.fillStyle = U.text();
      ctx.font = '600 14px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`Masked Self-supervised Reconstruction · ${nMasked} of ${N} patches masked`, w/2, 10);

      // Row 1: Original patches
      const row1Y = padT + 20;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('1. Original patches:', padL, row1Y - 18);

      for (let i = 0; i < N; i++) {
        const x = padL + i * (patchW + 4) + 2;
        // Synthetic waveform color
        const val = 0.4 + 0.4 * Math.sin(i * 0.5);
        const c = Math.floor(150 + 90 * val);
        ctx.fillStyle = `rgb(${c-30}, ${c+20}, ${c+30})`;
        ctx.fillRect(x, row1Y, patchW, patchH);
        ctx.fillStyle = '#333';
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`p${i+1}`, x + patchW/2, row1Y + patchH/2);
      }

      // Row 2: Masked
      const row2Y = row1Y + patchH + 50;
      ctx.fillStyle = U.textMuted();
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(`2. Random mask (${(maskRatio*100).toFixed(0)}% set to zero):`, padL, row2Y - 18);

      for (let i = 0; i < N; i++) {
        const x = padL + i * (patchW + 4) + 2;
        if (maskedSet.has(i)) {
          // Masked patch — gray with [MASK] label
          ctx.fillStyle = '#374151';
          ctx.fillRect(x, row2Y, patchW, patchH);
          ctx.fillStyle = '#fff';
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('MASK', x + patchW/2, row2Y + patchH/2);
        } else {
          const val = 0.4 + 0.4 * Math.sin(i * 0.5);
          const c = Math.floor(150 + 90 * val);
          ctx.fillStyle = `rgb(${c-30}, ${c+20}, ${c+30})`;
          ctx.fillRect(x, row2Y, patchW, patchH);
          ctx.fillStyle = '#333';
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(`p${i+1}`, x + patchW/2, row2Y + patchH/2);
        }
      }

      // Arrow + Transformer label
      const tfY = row2Y + patchH + 18;
      ctx.fillStyle = '#a78bfa';
      ctx.fillRect(padL, tfY, innerW, 24);
      ctx.fillStyle = '#fff';
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Transformer Encoder (vanilla, same as supervised)', w/2, tfY + 12);

      // Row 3: Reconstructed
      const row3Y = tfY + 24 + 18;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText('3. Reconstruct (Linear D→P head, MSE only on masked):', padL, row3Y - 18);

      for (let i = 0; i < N; i++) {
        const x = padL + i * (patchW + 4) + 2;
        if (maskedSet.has(i)) {
          // Reconstructed: red border to highlight
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(x, row3Y, patchW, patchH);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, row3Y, patchW, patchH);
          ctx.fillStyle = '#ef4444';
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(`p̂${i+1}`, x + patchW/2, row3Y + patchH/2);
        } else {
          // Unmask patches passed through
          ctx.fillStyle = U.cssVar('--surface', '#f3f4f6');
          ctx.fillRect(x, row3Y, patchW, patchH);
          ctx.strokeStyle = U.textMuted();
          ctx.lineWidth = 1;
          ctx.strokeRect(x, row3Y, patchW, patchH);
          ctx.fillStyle = U.textMuted();
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('(skip)', x + patchW/2, row3Y + patchH/2);
        }
      }

      // Footer
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(`MSE loss = avg over masked patches: L = 1/${nMasked} Σ ||p̂_i - p_i||² for i ∈ masked`, w/2, h - 8);
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
