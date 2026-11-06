(() => {
  const reader = document.querySelector('[data-magazine]');
  if (!reader) return;
  const pages = JSON.parse(reader.querySelector('[data-magazine-pages]').textContent);
  const book = reader.querySelector('[data-book]');
  const left = reader.querySelector('[data-book-left]');
  const right = reader.querySelector('[data-book-right]');
  const leaf = reader.querySelector('[data-book-turn]');
  const front = leaf.querySelector('[data-leaf-front]');
  const back = leaf.querySelector('[data-leaf-back]');
  const previous = reader.querySelector('[data-book-previous]');
  const next = reader.querySelector('[data-book-next]');
  const zoomLeft = reader.querySelector('[data-zoom-left]');
  const zoomRight = reader.querySelector('[data-zoom-right]');
  const status = reader.querySelector('[data-book-status]');
  const small = matchMedia('(max-width: 640px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let compact = small.matches;
  let index = 0;
  let busy = false;
  let timer = 0;
  let start = null;
  let turnId = 0;

  function spreads() {
    if (compact) return pages.map((_, i) => [null, i]);
    const result = [[null, 0]];
    for (let i = 1; i < pages.length; i += 2) result.push([i, i + 1 < pages.length ? i + 1 : null]);
    return result;
  }
  function picture(img, page) {
    img.hidden = page === null;
    if (page === null) { img.removeAttribute('src'); img.alt = ''; return; }
    if (img.getAttribute('src') !== pages[page].src) img.src = pages[page].src;
    img.alt = pages[page].alt;
  }
  function frame(el, page) {
    el.hidden = page === null;
    picture(el.querySelector('img'), page);
  }
  function zoom(button, page, side) {
    button.hidden = page === null;
    if (page === null) return;
    button.dataset.zoom = pages[page].src;
    button.dataset.alt = pages[page].alt;
    button.dataset.caption = pages[page].label;
    button.textContent = page === 0 ? 'Enlarge cover ↗' : `Enlarge ${compact ? 'page' : side + ' page'} ↗`;
    button.setAttribute('aria-label', `Enlarge ${pages[page].label}`);
  }
  function render() {
    const active = document.activeElement;
    const [l, r] = spreads()[index];
    reader.classList.toggle('is-compact', compact);
    reader.classList.toggle('is-cover', !compact && index === 0);
    frame(left, l); frame(right, r);
    zoom(zoomLeft, l, 'left'); zoom(zoomRight, r, 'right');
    previous.disabled = index === 0;
    next.disabled = index === spreads().length - 1;
    const shown = [l, r].filter(p => p !== null);
    status.textContent = shown.length === 1
      ? `${pages[shown[0]].label} · ${shown[0] + 1} of ${pages.length}`
      : `Pages ${shown[0] + 1}–${shown[1] + 1} of ${pages.length}`;
    book.setAttribute('aria-label', `${status.textContent}. Use the left and right arrow keys to turn pages.`);
    reader.setAttribute('aria-busy', 'false');
    if ((active === previous && previous.disabled) || (active === next && next.disabled) || (active === zoomLeft && zoomLeft.hidden) || (active === zoomRight && zoomRight.hidden)) book.focus({preventScroll:true});
  }
  function finish(id) {
    if (id !== turnId) return;
    clearTimeout(timer);
    busy = false;
    leaf.hidden = true;
    leaf.style.transition = 'none';
    render();
  }
  function turn(target) {
    const all = spreads();
    if (busy || target < 0 || target >= all.length || target === index) return;
    const old = all[index];
    const destination = all[target];
    const forward = target > index;
    index = target;
    if (reduced.matches) { render(); return; }
    busy = true;
    const id = ++turnId;
    reader.setAttribute('aria-busy', 'true');
    if (forward) {
      frame(left, old[0]); frame(right, destination[1]);
      picture(front, old[1]); picture(back, destination[0]);
    } else {
      frame(left, destination[0]); frame(right, old[1]);
      picture(front, destination[1]); picture(back, old[0]);
    }
    leaf.hidden = false;
    leaf.style.transition = 'none';
    leaf.style.transform = forward ? 'rotateY(0deg)' : 'rotateY(-180deg)';
    reader.classList.toggle('is-cover', !compact && index === 0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (id !== turnId || !busy) return;
      leaf.style.transition = 'transform 580ms cubic-bezier(.3,.08,.2,1)';
      leaf.style.transform = forward ? 'rotateY(-180deg)' : 'rotateY(0deg)';
      timer = setTimeout(() => finish(id), 650);
    }));
  }
  leaf.addEventListener('transitionend', event => {
    if (event.target === leaf && event.propertyName === 'transform' && busy) finish(turnId);
  });
  previous.addEventListener('click', () => turn(index - 1));
  next.addEventListener('click', () => turn(index + 1));
  reader.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); turn(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turn(index - 1); }
  });
  book.addEventListener('pointerdown', event => {
    if (busy || (event.pointerType === 'mouse' && event.button !== 0)) return;
    start = {x: event.clientX, y: event.clientY, id: event.pointerId};
    if (event.pointerType === 'mouse') { event.preventDefault(); book.focus({preventScroll:true}); book.setPointerCapture(event.pointerId); }
    book.classList.add('is-grabbed');
  });
  book.addEventListener('pointerup', event => {
    if (!start || event.pointerId !== start.id) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = null; book.classList.remove('is-grabbed');
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) { turn(index + (dx < 0 ? 1 : -1)); return; }
    if (Math.abs(dx) > 14 || Math.abs(dy) > 14) return;
    const rect = book.getBoundingClientRect();
    const split = compact ? .3 : .5;
    turn(index + ((event.clientX - rect.left) / rect.width < split && index !== 0 ? -1 : 1));
  });
  book.addEventListener('pointercancel', () => { start = null; book.classList.remove('is-grabbed'); });
  small.addEventListener('change', event => {
    const current = spreads()[index].filter(p => p !== null)[0];
    ++turnId; clearTimeout(timer); busy = false; leaf.hidden = true;
    compact = event.matches;
    index = spreads().findIndex(spread => spread.includes(current));
    render();
  });
  for (const page of pages) { const preload = new Image(); preload.src = page.src; }
  render();
})();
