// ── HERO LOAD ANIMATION ──
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('hero').classList.add('loaded');
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target)}});
},{threshold:.14});
reveals.forEach(el=>ro.observe(el));

// ── DESTINATION CAROUSEL ──
(function(){
  const track = document.getElementById('carTrack');
  const slides = Array.from(track.querySelectorAll('.dest-slide'));
  const dotsWrap = document.getElementById('carDots');
  let active = 0;
  let startX = 0, isDragging = false;

  // Build dots
  slides.forEach((_,i)=>{
    const d = document.createElement('button');
    d.className = 'car-dot'+(i===0?' on':'');
    d.setAttribute('aria-label','Slide '+(i+1));
    d.addEventListener('click',()=>go(i));
    dotsWrap.appendChild(d);
  });

  function getOffset(){
    const w = window.innerWidth;
    const slideEl = slides[0];
    const sw = slideEl.offsetWidth;
    const gap = 20;
    return -(active*(sw+gap)) + w/2 - sw/2;
  }

  function update(){
    track.style.transform = `translateX(${getOffset()}px)`;
    slides.forEach((s,i)=>s.classList.toggle('active',i===active));
    dotsWrap.querySelectorAll('.car-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
  }

  function go(n){
    active = (n+slides.length)%slides.length;
    update();
  }

  document.getElementById('carPrev').addEventListener('click',()=>go(active-1));
  document.getElementById('carNext').addEventListener('click',()=>go(active+1));

  // Touch/drag
  const wrap = document.getElementById('carWrap');
  wrap.addEventListener('mousedown',e=>{startX=e.clientX;isDragging=true});
  wrap.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;isDragging=true},{passive:true});
  wrap.addEventListener('mouseup',e=>{if(!isDragging)return;isDragging=false;const d=e.clientX-startX;if(d<-40)go(active+1);else if(d>40)go(active-1)});
  wrap.addEventListener('touchend',e=>{if(!isDragging)return;isDragging=false;const d=e.changedTouches[0].clientX-startX;if(d<-40)go(active+1);else if(d>40)go(active-1)});

  // Non-active clicks
  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(i!==active)go(i)}));

  window.addEventListener('resize',update);
  update();

  // Auto-advance — pauses on hover, resumes on mouseleave
  const section4 = document.getElementById('destinations');
  let timer4 = setInterval(()=>go(active+1),6000);
  section4.addEventListener('mouseenter',()=>clearInterval(timer4));
  section4.addEventListener('mouseleave',()=>{ timer4 = setInterval(()=>go(active+1),6000); });
})();

// ── YACHT SLIDESHOW ──
(function(){
  const slides = Array.from(document.querySelectorAll('.yt-slide'));
  const dotsWrap = document.getElementById('ytDots');
  const progress = document.getElementById('ytProgress');
  let active = 0;
  const INTERVAL = 7000;
  let timer;

  slides.forEach((_,i)=>{
    const d = document.createElement('button');
    d.className='yt-dot'+(i===0?' on':'');
    d.setAttribute('aria-label','Slide '+(i+1));
    d.addEventListener('click',()=>go(i));
    dotsWrap.appendChild(d);
  });

  function update(){
    slides.forEach((s,i)=>s.classList.toggle('on',i===active));
    dotsWrap.querySelectorAll('.yt-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
    progress.style.width = ((active+1)/slides.length*100)+'%';
  }

  function go(n){
    active=(n+slides.length)%slides.length;
    update();
  }

  function startTimer(){ timer = setInterval(()=>go(active+1),INTERVAL); }
  function stopTimer(){ clearInterval(timer); }

  document.getElementById('ytPrev').addEventListener('click',()=>{ stopTimer(); go(active-1); startTimer(); });
  document.getElementById('ytNext').addEventListener('click',()=>{ stopTimer(); go(active+1); startTimer(); });

  // Pause on hover, resume on mouseleave
  const section7 = document.getElementById('yacht');
  section7.addEventListener('mouseenter', stopTimer);
  section7.addEventListener('mouseleave', startTimer);

  startTimer();
  update();
})();

// ── CIRCLE CAROUSEL (§§ 9b · 10) ──
(function(){
  const carousel = document.getElementById('circle-carousel');
  const track    = document.getElementById('circle-track');
  const slides   = Array.from(track.querySelectorAll('.cc-slide'));
  const dotsWrap = document.getElementById('ccDots');
  const INTERVAL = 12000;
  let active = 0;
  let timer  = null;
  let paused = false;

  // Build dots
  slides.forEach((_,i)=>{
    const d = document.createElement('button');
    d.className = 'cc-dot' + (i===0 ? ' on' : '');
    d.setAttribute('aria-label', 'Slide '+(i+1));
    d.addEventListener('click', ()=>go(i));
    dotsWrap.appendChild(d);
  });

  function update(){
    track.style.transform = `translateX(-${active * 100}%)`;
    dotsWrap.querySelectorAll('.cc-dot').forEach((d,i)=>d.classList.toggle('on', i===active));
    slides[active].querySelectorAll('.reveal:not(.on)').forEach(el=>{
      setTimeout(()=>el.classList.add('on'), 200);
    });
  }

  function go(n){
    active = (n + slides.length) % slides.length;
    update();
  }

  // Always clear before (re)starting — prevents double timers
  function startTimer(){
    clearInterval(timer);
    timer = null;
    if(paused) return;
    timer = setInterval(()=>go(active+1), INTERVAL);
  }

  function stopTimer(){
    clearInterval(timer);
    timer = null;
  }

  // Arrows — block mousedown from reaching the drag handler on the track
  const btnPrev = document.getElementById('ccPrev');
  const btnNext = document.getElementById('ccNext');
  btnPrev.addEventListener('mousedown', e=>e.stopPropagation());
  btnNext.addEventListener('mousedown', e=>e.stopPropagation());
  btnPrev.addEventListener('click', ()=>go(active-1));
  btnNext.addEventListener('click', ()=>go(active+1));

  // Swipe / drag — scoped to the track only, nav bar excluded
  let startX = 0, dragging = false;
  track.addEventListener('mousedown', e=>{ startX=e.clientX; dragging=true; });
  track.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; dragging=true; },{passive:true});
  window.addEventListener('mouseup', e=>{
    if(!dragging) return;
    dragging = false;
    const d = e.clientX - startX;
    if(d < -50) go(active+1);
    else if(d > 50) go(active-1);
  });
  track.addEventListener('touchend', e=>{
    if(!dragging) return;
    dragging = false;
    const d = e.changedTouches[0].clientX - startX;
    if(d < -50) go(active+1);
    else if(d > 50) go(active-1);
  });

  // Pause on hover, resume on mouseleave — paused flag guards startTimer
  carousel.addEventListener('mouseenter', ()=>{ paused=true;  stopTimer(); });
  carousel.addEventListener('mouseleave', ()=>{ paused=false; startTimer(); });

  startTimer();
  update();
})();