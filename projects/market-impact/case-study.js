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
const sections = [...document.querySelectorAll('.chapter[id]')];
const links = [...document.querySelectorAll('.contents a')];
let scheduled = false;
let lastActive;
function updateReadingPosition() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0}%`;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 170) active = section;
  }
  links.forEach(link => {
    if (active && link.getAttribute('href') === `#${active.id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (active !== lastActive) {
    const selected = links.find(link => link.getAttribute('aria-current') === 'true');
    const list = selected?.closest('ol');
    if (list && list.scrollWidth > list.clientWidth) {
      list.scrollLeft = selected.offsetLeft + selected.offsetWidth / 2 - list.clientWidth / 2;
    }
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

// Diagram links lead into native disclosures; opening them also works with
// direct URLs and browser history. Native summaries remain usable without JS.
function revealLinkedWorkstream() {
  const target = document.getElementById(location.hash.slice(1));
  if (!target?.matches('details.workstream')) return;
  target.open = true;
  target.querySelector('summary').focus({preventScroll: true});
}
window.addEventListener('hashchange', revealLinkedWorkstream);
document.querySelector('.development-atlas')?.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link?.hash === location.hash) revealLinkedWorkstream();
});
revealLinkedWorkstream();
