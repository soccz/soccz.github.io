/* paper-deep — Visualization Registry
 *
 * 사용법 (Markdown 안에서):
 *   ```viz:<type>:title=...,caption=...,(viz별 params)
 *   ```
 *
 * 각 viz 모듈은 다음 시그니처로 등록:
 *   VIZ_REGISTRY[<type>] = function (canvas, controlsEl, params) { ... }
 *
 * canvas: HTMLCanvasElement (16:9 비율 wrap 안)
 * controlsEl: <div class="viz-controls"></div> (슬라이더/체크 박스 등 추가)
 * params: ```viz:type:k=v,k=v 의 키-값 객체
 */

(function (global) {
  const VIZ_REGISTRY = {};
  global.VIZ_REGISTRY = VIZ_REGISTRY;

  // Shared utilities used by all viz modules
  global.VIZ_UTIL = {
    /* DPR-aware canvas sizing — CSS controls layout; JS only sets pixel buffer.
       Do NOT touch canvas.style.* (it overrides explicit px sizes in CSS). */
    setupCanvas(canvas) {
      const dpr = window.devicePixelRatio || 1;
      let w = canvas.clientWidth;
      let h = canvas.clientHeight;
      if (!w || !h) {
        const r = canvas.getBoundingClientRect();
        w = w || r.width || 600;
        h = h || r.height || 320;
      }
      w = Math.max(w, 200);
      h = Math.max(h, 160);
      const tw = Math.round(w * dpr);
      const th = Math.round(h * dpr);
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
      const ctx = canvas.getContext('2d');
      // Reset to identity then apply dpr (avoid cumulative scaling across redraws).
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h, dpr };
    },

    /* Returns current CSS var value (computed) */
    cssVar(name, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    },

    /* Add a slider with live value display */
    addSlider(controlsEl, { label, min, max, step, value, onInput, fmt }) {
      const wrap = document.createElement('label');
      const lab = document.createElement('span');
      lab.textContent = label;
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = min; inp.max = max; inp.step = step;
      inp.value = value;
      const val = document.createElement('span');
      val.className = 'val';
      const fmtFn = fmt || ((v) => String(Math.round(parseFloat(v) * 100) / 100));
      val.textContent = fmtFn(value);
      inp.addEventListener('input', () => {
        val.textContent = fmtFn(inp.value);
        onInput(parseFloat(inp.value));
      });
      wrap.appendChild(lab);
      wrap.appendChild(inp);
      wrap.appendChild(val);
      controlsEl.appendChild(wrap);
      return inp;
    },

    /* Add a toggle checkbox */
    addToggle(controlsEl, { label, value, onChange }) {
      const wrap = document.createElement('label');
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = !!value;
      const lab = document.createElement('span');
      lab.textContent = label;
      inp.addEventListener('change', () => onChange(inp.checked));
      wrap.appendChild(inp);
      wrap.appendChild(lab);
      controlsEl.appendChild(wrap);
      return inp;
    },

    /* Common axis drawing */
    drawAxes(ctx, w, h, padL, padR, padT, padB, opts = {}) {
      ctx.strokeStyle = opts.color || global.VIZ_UTIL.cssVar('--border', '#e5ddd3');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      ctx.lineTo(padL, h - padB);
      ctx.lineTo(w - padR, h - padB);
      ctx.stroke();
    },

    /* Draw horizontal gridlines */
    drawHGrid(ctx, w, h, padL, padR, padT, padB, lines = 5) {
      const innerH = h - padT - padB;
      ctx.strokeStyle = global.VIZ_UTIL.cssVar('--border-light', '#eee7de');
      ctx.lineWidth = 1;
      for (let i = 0; i <= lines; i++) {
        const y = padT + (innerH * i) / lines;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
      }
    },

    /* Text helpers */
    text(ctx, str, x, y, opts = {}) {
      ctx.save();
      ctx.fillStyle = opts.color || global.VIZ_UTIL.cssVar('--text-secondary', '#5c4f42');
      ctx.font = (opts.bold ? '600 ' : '') + (opts.size || 12) + 'px ' +
                  global.VIZ_UTIL.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = opts.align || 'left';
      ctx.textBaseline = opts.baseline || 'alphabetic';
      ctx.fillText(str, x, y);
      ctx.restore();
    },

    /* Number formatting */
    fmt(v, digits = 2) {
      if (!isFinite(v)) return '—';
      if (Math.abs(v) >= 100) return v.toFixed(0);
      if (Math.abs(v) >= 10) return v.toFixed(1);
      return v.toFixed(digits);
    },

    /* Color helpers — use semantic CSS vars */
    accent: () => global.VIZ_UTIL.cssVar('--accent', '#c4724e'),
    accentSoft: () => global.VIZ_UTIL.cssVar('--accent-soft', '#e8a98a'),
    accentLight: () => global.VIZ_UTIL.cssVar('--accent-light', '#fdf0ea'),
    text: () => global.VIZ_UTIL.cssVar('--text', '#1a1410'),
    textMuted: () => global.VIZ_UTIL.cssVar('--text-muted', '#96887a'),
    border: () => global.VIZ_UTIL.cssVar('--border', '#e5ddd3'),
    bg: () => global.VIZ_UTIL.cssVar('--bg-warm', '#f5f0e8'),
    good: () => global.VIZ_UTIL.cssVar('--color-good', '#5a8a64'),
    bad:  () => global.VIZ_UTIL.cssVar('--color-bad',  '#c45a4e'),
    warn: () => global.VIZ_UTIL.cssVar('--color-warn', '#d4a04c'),
    info: () => global.VIZ_UTIL.cssVar('--color-info', '#4e7ec4')
  };
})(window);
