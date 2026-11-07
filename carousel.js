document.querySelectorAll('.photo-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-slides');
  const slides = Array.from(track.children);
  if (slides.length < 2) return;

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.innerHTML = `
    <button class="carousel-arrow" type="button" data-step="-1" aria-label="Previous photo">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>
    </button>
    <button class="carousel-arrow" type="button" data-step="1" aria-label="Next photo">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>
    </button>
  `;
  const status = document.createElement('p');
  status.className = 'carousel-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-atomic', 'true');
  track.before(controls);
  track.after(status);
  carousel.classList.add('carousel-ready');

  let index = 0;
  let pointer = null;
  let suppressClick = false;
  carousel.tabIndex = 0;
  track.style.touchAction = 'pan-y';

  function showSlide(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      slide.hidden = position !== index;
    });
    const caption = slides[index].querySelector('figcaption').textContent.trim();
    const count = `Photo ${index + 1} of ${slides.length}`;
    status.textContent = count;
    const detail = document.createElement('span');
    detail.className = 'visually-hidden';
    detail.textContent = `. ${caption}`;
    status.append(detail);
  }

  controls.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => showSlide(index + Number(button.dataset.step)));
  });
  carousel.addEventListener('keydown', (event) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!step || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    showSlide(index + step);
  });
  track.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'||event.pointerType==='pen')pointer={x:event.clientX,y:event.clientY};
  });
  track.addEventListener('pointerup',event=>{
    if(!pointer)return;
    const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;pointer=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClick=true;showSlide(index+(dx<0?1:-1));}
  });
  track.addEventListener('click',event=>{if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}},true);
  track.addEventListener('pointercancel',()=>pointer=null);
  showSlide(0);
});
