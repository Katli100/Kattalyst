(() => {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const viewer=document.getElementById('artwork-viewer');
  const viewerImg=document.getElementById('viewer-image');
  const viewerCaption=document.getElementById('viewer-caption');
  let lastTrigger=null;
  function openArtwork(src,alt,caption,trigger){
    if(!viewer || typeof viewer.showModal!=='function'){window.open(src,'_blank','noopener');return;}
    lastTrigger=trigger;
    viewerImg.src=src;viewerImg.alt=alt;
    document.getElementById('viewer-title').textContent=caption || alt;
    viewerCaption.textContent=caption || '';
    viewer.showModal();
    viewer.querySelector('[data-close-viewer]').focus();
  }
  document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>openArtwork(button.dataset.zoom,button.dataset.alt || button.querySelector('img')?.alt || '',button.dataset.caption,button)));
  if(viewer){
    viewer.querySelector('[data-close-viewer]').addEventListener('click',()=>viewer.close());
    viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
    viewer.addEventListener('close',()=>{if(lastTrigger?.isConnected)lastTrigger.focus();});
  }
  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    const art=carousel.querySelector('[data-open-current]');
    const images=[...art.querySelectorAll('img')];
    const caption=carousel.querySelector('[data-carousel-caption]');
    const count=carousel.querySelector('[data-carousel-count]');
    const thumbnails=[...carousel.querySelectorAll('[data-carousel-goto]')];
    let index=0,start=null,suppressClick=false;
    function show(n){index=(n+images.length)%images.length;images.forEach((img,i)=>img.hidden=i!==index);caption.textContent=images[index].dataset.caption;count.textContent=`${index+1} / ${images.length}`;art.setAttribute('aria-label',`Enlarge ${images[index].dataset.caption}`);thumbnails.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));}
    thumbnails.forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.carouselGoto))));
    carousel.querySelector('[data-previous]').addEventListener('click',()=>show(index-1));
    carousel.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
    art.addEventListener('click',()=>{if(suppressClick){suppressClick=false;return;}openArtwork(images[index].src,images[index].alt,images[index].dataset.caption,art);});
    carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}});
    art.style.touchAction='pan-y';
    art.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.pointerType==='pen')start={x:event.clientX,y:event.clientY};});
    art.addEventListener('pointerup',event=>{if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClick=true;show(index+(dx<0?1:-1));}});
    art.addEventListener('pointercancel',()=>start=null);
    show(0);
  });
  document.querySelectorAll('[data-tabs]').forEach(group=>{
    const tabs=[...group.querySelectorAll('[role=tab]')];
    function activate(tab,focus=false){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
    tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{let n;if(event.key==='ArrowRight')n=(i+1)%tabs.length;if(event.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;if(event.key==='Home')n=0;if(event.key==='End')n=tabs.length-1;if(n!==undefined){event.preventDefault();activate(tabs[n],true);}});});
  });
  if(!reduced){
    const field=document.querySelector('.color-field');
    let scheduled=false;
    const update=()=>{field?.style.setProperty('--drift',Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));scheduled=false;};
    addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(update);scheduled=true;}},{passive:true});update();
    const hero=document.querySelector('.hero-art');
    if(hero&&matchMedia('(hover:hover)').matches){hero.addEventListener('pointermove',event=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',`${((event.clientX-r.left)/r.width-.5)*10}px`);hero.style.setProperty('--my',`${((event.clientY-r.top)/r.height-.5)*10}px`);});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--mx','0px');hero.style.setProperty('--my','0px');});}
    if('IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.05});document.querySelectorAll('.project-card,.case-heading,.closing').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
  }
})();
