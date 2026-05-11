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

// ── SHARED HELPERS ──
const isMobile = ()=> window.matchMedia('(max-width:768px)').matches;

function buildDots(container, count, cls, onClick){
  for(let i=0;i<count;i++){
    const d = document.createElement('button');
    d.className = cls+(i===0?' on':'');
    d.setAttribute('aria-label','Slide '+(i+1));
    d.addEventListener('click',()=>onClick(i));
    container.appendChild(d);
  }
}

function addSwipe(el, threshold, onNext, onPrev){
  let startX=0, dragging=false;
  el.addEventListener('mousedown',  e=>{ startX=e.clientX; dragging=true; });
  el.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; dragging=true; },{passive:true});
  function end(x){ if(!dragging)return; dragging=false; const d=x-startX; if(d<-threshold)onNext(); else if(d>threshold)onPrev(); }
  window.addEventListener('mouseup', e=>end(e.clientX));
  el.addEventListener('touchend',    e=>end(e.changedTouches[0].clientX));
}

// ── DESTINATION CAROUSEL ──
(function(){
  const track   = document.getElementById('carTrack');
  const slides  = Array.from(track.querySelectorAll('.dest-slide'));
  const dotsWrap= document.getElementById('carDots');
  const section = document.getElementById('destinations');
  let active=0, timer=null, hovered=false;

  function getOffset(){
    const sw = slides[0].offsetWidth;
    return -(active*(sw+20)) + window.innerWidth/2 - sw/2;
  }

  function update(){
    track.style.transform = `translateX(${getOffset()}px)`;
    slides.forEach((s,i)=>s.classList.toggle('active',i===active));
    dotsWrap.querySelectorAll('.car-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
  }

  function go(n){ active=(n+slides.length)%slides.length; update(); }

  function startTimer(){
    clearInterval(timer); timer=null;
    if(hovered || isMobile()) return;
    timer=setInterval(()=>go(active+1),6000);
  }
  function stopTimer(){ clearInterval(timer); timer=null; }

  buildDots(dotsWrap, slides.length, 'car-dot', go);

  document.getElementById('carPrev').addEventListener('click',()=>go(active-1));
  document.getElementById('carNext').addEventListener('click',()=>go(active+1));

  addSwipe(document.getElementById('carWrap'), 40, ()=>go(active+1), ()=>go(active-1));

  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(i!==active)go(i)}));

  window.addEventListener('resize',update);
  update();

  // Auto-advance: only while section is in view; blocked on mobile
  section.addEventListener('mouseenter',()=>{ hovered=true;  stopTimer(); });
  section.addEventListener('mouseleave',()=>{ hovered=false; startTimer(); });

  new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) startTimer(); else stopTimer(); });
  },{threshold:.15}).observe(section);
})();

// ── YACHT SLIDESHOW ──
(function(){
  const slides  = Array.from(document.querySelectorAll('.yt-slide'));
  const dotsWrap= document.getElementById('ytDots');
  const progress= document.getElementById('ytProgress');
  const section = document.getElementById('yacht');
  let active=0, timer=null;
  const INTERVAL = 7000;

  function update(){
    slides.forEach((s,i)=>s.classList.toggle('on',i===active));
    dotsWrap.querySelectorAll('.yt-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
    progress.style.width = ((active+1)/slides.length*100)+'%';
  }

  function go(n){ active=(n+slides.length)%slides.length; update(); }

  function startTimer(){
    clearInterval(timer); timer=null;
    if(isMobile()) return;
    timer=setInterval(()=>go(active+1),INTERVAL);
  }
  function stopTimer(){ clearInterval(timer); timer=null; }

  buildDots(dotsWrap, slides.length, 'yt-dot', go);

  document.getElementById('ytPrev').addEventListener('click',()=>{ stopTimer(); go(active-1); startTimer(); });
  document.getElementById('ytNext').addEventListener('click',()=>{ stopTimer(); go(active+1); startTimer(); });

  section.addEventListener('mouseenter', stopTimer);
  section.addEventListener('mouseleave', startTimer);

  startTimer();
  update();
})();

// ── CIRCLE CAROUSEL ──
(function(){
  const carousel= document.getElementById('circle-carousel');
  const track   = document.getElementById('circle-track');
  const slides  = Array.from(track.querySelectorAll('.cc-slide'));
  const dotsWrap= document.getElementById('ccDots');
  let active=0, timer=null, paused=false;
  const INTERVAL = 12000;

  function update(){
    track.style.transform = `translateX(-${active*100}%)`;
    dotsWrap.querySelectorAll('.cc-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
    slides[active].querySelectorAll('.reveal:not(.on)').forEach(el=>{
      setTimeout(()=>el.classList.add('on'),200);
    });
  }

  function go(n){ active=(n+slides.length)%slides.length; update(); }

  function startTimer(){
    clearInterval(timer); timer=null;
    if(paused || isMobile()) return;
    timer=setInterval(()=>go(active+1),INTERVAL);
  }
  function stopTimer(){ clearInterval(timer); timer=null; }

  buildDots(dotsWrap, slides.length, 'cc-dot', go);

  const btnPrev = document.getElementById('ccPrev');
  const btnNext = document.getElementById('ccNext');
  btnPrev.addEventListener('mousedown', e=>e.stopPropagation());
  btnNext.addEventListener('mousedown', e=>e.stopPropagation());
  btnPrev.addEventListener('click', ()=>go(active-1));
  btnNext.addEventListener('click', ()=>go(active+1));

  addSwipe(track, 50, ()=>go(active+1), ()=>go(active-1));

  carousel.addEventListener('mouseenter', ()=>{ paused=true;  stopTimer(); });
  carousel.addEventListener('mouseleave', ()=>{ paused=false; startTimer(); });

  startTimer();
  update();
})();
