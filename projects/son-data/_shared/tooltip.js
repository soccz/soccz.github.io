/* Generic floating tooltip for charts.
 *
 * Auto-attaches to:
 *   - .bar-row (reads .bar-label + .bar-fill)
 *   - [data-tooltip] (any element with explicit attribute)
 *   - .conf-cell (confusion matrix)
 *   - .heatmap-cell (cross-league)
 *   - SVG <path>/<circle> with sibling <title> (native, but augmented here)
 *
 * Usage: <script src="/projects/son-data/_shared/tooltip.js"></script>
 */
(function () {
  // Tooltip element
  const tip = document.createElement('div');
  tip.className = 'sd-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  function show(text) {
    tip.innerHTML = text;
    tip.style.opacity = '1';
    tip.setAttribute('aria-hidden', 'false');
  }
  function hide() {
    tip.style.opacity = '0';
    tip.setAttribute('aria-hidden', 'true');
  }
  function move(x, y) {
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    let left = x + 14;
    let top = y + 14;
    if (left + tw > window.innerWidth - 8) left = x - tw - 14;
    if (top + th > window.innerHeight - 8) top = y - th - 14;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function inferTooltip(el) {
    // explicit attribute wins
    if (el.dataset.tooltip) return el.dataset.tooltip;
    // bar-row: read label + fill
    if (el.classList && el.classList.contains('bar-row')) {
      const label = el.querySelector('.bar-label')?.textContent.trim();
      const fill = el.querySelector('.bar-fill')?.textContent.trim();
      if (label && fill) return `<strong>${escape(label)}</strong>: ${escape(fill)}`;
    }
    return null;
  }
  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  }

  // Pre-compute tooltips for bar-row 자동 inference
  function autoAttach() {
    document.querySelectorAll('.bar-row').forEach(row => {
      if (!row.dataset.tooltip) {
        const label = row.querySelector('.bar-label')?.textContent.trim();
        const fill = row.querySelector('.bar-fill')?.textContent.trim();
        if (label && fill) row.dataset.tooltip = `${label}: ${fill}`;
      }
    });
    // Add tooltips to conf-cell numeric cells
    document.querySelectorAll('.conf-cell:not(.head)').forEach(cell => {
      if (!cell.dataset.tooltip) {
        const val = cell.textContent.trim();
        if (val && /^\d/.test(val)) cell.dataset.tooltip = `Count: ${val}`;
      }
    });
  }

  function findTarget(e) {
    let el = e.target;
    while (el && el !== document.body) {
      if (el.dataset && el.dataset.tooltip) return el;
      // 자동 inference 케이스: .bar-row 내부에서도 동작
      if (el.classList && el.classList.contains('bar-row')) return el;
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener('mouseover', e => {
    const target = findTarget(e);
    if (!target) return;
    const text = inferTooltip(target);
    if (!text) return;
    show(text);
    move(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', e => {
    if (tip.style.opacity === '1') move(e.clientX, e.clientY);
  });
  document.addEventListener('mouseout', e => {
    const target = findTarget(e);
    if (target) hide();
  });
  // 스크롤 시 숨김 (위치 어긋남 방지)
  document.addEventListener('scroll', hide, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoAttach);
  } else {
    autoAttach();
  }
})();
