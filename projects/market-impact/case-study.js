'use strict';

// Synthetic example: vary the number of observations without changing either
// policy's within-policy rate. This illustrates weighting, not model accuracy.
document.querySelectorAll('[data-aggregation]').forEach(demo => {
  const slider = demo.querySelector('#a-repeat');
  function updateAggregation() {
    const copies = Number(slider.value);
    const hits = 8 * copies;
    const count = 10 * copies;
    const pooled = (hits + 2) / (count + 10) * 100;
    demo.querySelector('#a-repeat-value').value = `${copies}배`;
    demo.querySelector('#a-count').textContent = `${hits} / ${count}`;
    demo.querySelector('#pooled-result').textContent = `${pooled.toFixed(1)}%`;
    demo.querySelector('#pooled-bar').style.width = `${pooled}%`;
    demo.querySelector('#pooled-formula').textContent = `(${hits} + 2) ÷ (${count} + 10)`;
  }
  slider.addEventListener('input', updateAggregation);
  updateAggregation();
});

// Content remains readable without JavaScript; tabs are enhanced only here.
document.querySelectorAll('[data-tabs]').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const activate = tab => {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      activate(tabs[target]);
      tabs[target].focus();
    });
  });
  if (tabs.length) activate(tabs[0]);
});

const progress = document.querySelector('.read-progress');
const sections = [...document.querySelectorAll('.chapter[id], .reading-overview[id]')];
const links = [...document.querySelectorAll('.contents a')];
const readingMenu = document.querySelector('.reading-menu');
const compactReading = window.matchMedia('(max-width: 780px)');
function setReadingMenuLayout() {
  if (readingMenu) readingMenu.open = !compactReading.matches;
}
setReadingMenuLayout();
compactReading.addEventListener('change', setReadingMenuLayout);
links.forEach(link => link.addEventListener('click', () => {
  if (readingMenu && compactReading.matches) readingMenu.open = false;
}));
let scheduled = false;
let lastActive;
function updateReadingPosition() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0}%`;
  let active = sections[0];
  const readingEdge = compactReading.matches
    ? Math.max(170, (document.getElementById('navbar')?.offsetHeight || 60)
      + (readingMenu?.querySelector('summary')?.offsetHeight || 48) + 32)
    : 170;
  for (const section of sections) {
    if (section.checkVisibility() && section.getBoundingClientRect().top <= readingEdge) active = section;
  }
  const group = active?.dataset.readingGroup || active?.id;
  links.forEach(link => {
    if (group && link.getAttribute('href') === `#${group}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (active !== lastActive) {
    const selected = links.find(link => link.hasAttribute('aria-current'));
    const current = document.querySelector('.reading-current');
    if (current && selected) current.textContent = selected.textContent.replace(/^(\d{2})/, '$1 · ');
    lastActive = active;
  }
  scheduled = false;
}
function schedulePositionUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateReadingPosition);
}
window.addEventListener('scroll', schedulePositionUpdate, {passive:true});
window.addEventListener('resize', schedulePositionUpdate);
updateReadingPosition();

// Preserve existing deep links even when supplementary material is folded.
function revealLinkedContent() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches('details')) parent.open = true;
  }
  const focus = target.querySelector('h2, h3, h4') || target;
  focus.setAttribute('tabindex', '-1');
  requestAnimationFrame(() => {
    // Run after the native anchor action, including clicks on the same hash.
    focus.focus({preventScroll: true});
    target.scrollIntoView({block: 'start', behavior: 'instant'});
    schedulePositionUpdate();
  });
}
window.addEventListener('hashchange', revealLinkedContent);
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  if (link.hash === location.hash) revealLinkedContent();
}));
document.querySelectorAll('details').forEach(detail => {
  detail.addEventListener('toggle', schedulePositionUpdate);
});
revealLinkedContent();
