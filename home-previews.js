(() => {
  const region = document.querySelector('[data-home-previews]');
  if (!region) return;
  const links = region.querySelector('.preview-links');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const catalog = {
    product: [
      {src:'assets/cordify.webp',title:'Cordify',alt:'Four pastel Cordify cable organizers in a desktop hub'},
      {src:'assets/bitty-thumb.webp',title:'Small Bitty Tech Items Organizer',alt:'Five-slot organizer holding small tech accessories'},
      {src:'assets/pc-showcase-detail.webp',title:'Building Blocks of a PC',alt:'Wooden PC components laid out at the showcase'},
      {src:'assets/p4ul-concept-thumb.webp',title:'P4UL · AI-assisted concept render',alt:'AI-assisted concept render of the P4UL octopus prediction machine'},
      {src:'assets/ge-home-thumb.webp',title:'GE Vernova & AirJoule',alt:'The GE Vernova exhibition model on a pedestal'}
    ],
    graphics: [
      {src:'assets/pg-slide-01.webp',title:'P&G Healthcare Growth Strategy',alt:'Front page of my P&G Healthcare Growth Strategy presentation'},
      {src:'assets/book-drive-1-full.webp',title:'Alpha Omega Epsilon',alt:'Book Drive event flyer I designed for Alpha Omega Epsilon'},
      {src:'assets/housing-1-full.webp',title:'Housing for All',alt:'Housing for All poster with a navy and orange city illustration'},
      {src:'assets/heartsteel-final-1.jpg',title:'HEARTSTEEL',alt:'The cover of my HEARTSTEEL magazine layout exercise'}
    ]
  };
  const previews = [...region.querySelectorAll('[data-preview]')].map(element => {
    const slides = catalog[element.dataset.preview];
    const images = [...element.querySelectorAll('.preview-media img')];
    let index = 0;
    let active = 0;
    let preparing = 0;
    const prepare = () => {
      const next = slides[(index + 1) % slides.length];
      const incoming = images[1 - active];
      incoming.alt = next.alt;
      incoming.setAttribute('aria-hidden', 'true');
      incoming.src = next.src;
    };
    prepare();
    return {
      advance() {
        const incoming = images[1 - active];
        // Keep the current image if the next one is still loading or unavailable.
        if (!incoming.complete || incoming.naturalWidth === 0) return;
        clearTimeout(preparing);
        index = (index + 1) % slides.length;
        images[active].classList.remove('is-active');
        images[active].setAttribute('aria-hidden', 'true');
        incoming.classList.add('is-active');
        incoming.removeAttribute('aria-hidden');
        active = 1 - active;
        element.querySelector('[data-preview-title]').textContent = slides[index].title;
        preparing = setTimeout(prepare, 1600);
      }
    };
  });
  if (previews.length !== 2) return;

  // Product changes at 15 seconds, Graphics at 22.5 seconds, then they
  // alternate every 7.5 seconds: 15 seconds between changes per card.
  let nextPreview = 0;
  let remaining = 15000;
  let timer = null;
  let due = 0;
  const pauses = {pointer:false,focus:false,hidden:document.hidden,reduced:motion.matches};
  function sync() {
    const paused = Object.values(pauses).some(Boolean);
    if (paused && timer !== null) {
      clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, due - performance.now());
    } else if (!paused && timer === null) {
      due = performance.now() + remaining;
      timer = setTimeout(() => {
        timer = null;
        previews[nextPreview].advance();
        nextPreview = 1 - nextPreview;
        remaining = 7500;
        sync();
      }, remaining);
    }
  }
  links.addEventListener('pointerenter', event => {if (event.pointerType === 'mouse' || event.pointerType === 'pen') {pauses.pointer = true; sync();}});
  links.addEventListener('pointerleave', () => {pauses.pointer = false; sync();});
  links.addEventListener('focusin', () => {pauses.focus = true; sync();});
  links.addEventListener('focusout', () => {queueMicrotask(() => {pauses.focus = links.contains(document.activeElement); sync();});});
  document.addEventListener('visibilitychange', () => {pauses.hidden = document.hidden; sync();});
  motion.addEventListener('change', () => {pauses.reduced = motion.matches; sync();});
  if ('IntersectionObserver' in window) {
    pauses.offscreen = true;
    new IntersectionObserver(entries => {pauses.offscreen = !entries[0].isIntersecting; sync();}).observe(region);
  }
  sync();
})();
