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
  el.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; dragging=true; },{passive:true});
  el.addEventListener('touchend',   e=>{ if(!dragging)return; dragging=false; const d=e.changedTouches[0].clientX-startX; if(d<-threshold)onNext(); else if(d>threshold)onPrev(); });
}

// ── DESTINATION CAROUSEL ──
(function(){
  const track   = document.getElementById('carTrack');
  const slides  = Array.from(track.querySelectorAll('.dest-slide'));
  const dotsWrap= document.getElementById('carDots');
  let active=0;

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

  buildDots(dotsWrap, slides.length, 'car-dot', go);

  document.getElementById('carPrev').addEventListener('click',()=>go(active-1));
  document.getElementById('carNext').addEventListener('click',()=>go(active+1));

  addSwipe(document.getElementById('carWrap'), 40, ()=>go(active+1), ()=>go(active-1));

  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(i!==active)go(i)}));

  window.addEventListener('resize',update);
  update();
})();

// ── YACHT SLIDESHOW ──
(function(){
  const slides  = Array.from(document.querySelectorAll('.yt-slide'));
  const dotsWrap= document.getElementById('ytDots');
  const progress= document.getElementById('ytProgress');
  let active=0;

  function update(){
    slides.forEach((s,i)=>s.classList.toggle('on',i===active));
    dotsWrap.querySelectorAll('.yt-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
    progress.style.width = ((active+1)/slides.length*100)+'%';
  }

  function go(n){ active=(n+slides.length)%slides.length; update(); }

  buildDots(dotsWrap, slides.length, 'yt-dot', go);

  document.getElementById('ytPrev').addEventListener('click',()=>go(active-1));
  document.getElementById('ytNext').addEventListener('click',()=>go(active+1));

  update();
})();

// ── CIRCLE CAROUSEL ──
(function(){
  const track   = document.getElementById('circle-track');
  const slides  = Array.from(track.querySelectorAll('.cc-slide'));
  const dotsWrap= document.getElementById('ccDots');
  let active=0;

  function update(){
    track.style.transform = `translateX(-${active*100}%)`;
    dotsWrap.querySelectorAll('.cc-dot').forEach((d,i)=>d.classList.toggle('on',i===active));
    slides[active].querySelectorAll('.reveal:not(.on)').forEach(el=>{
      setTimeout(()=>el.classList.add('on'),200);
    });
  }

  function go(n){ active=(n+slides.length)%slides.length; update(); }

  buildDots(dotsWrap, slides.length, 'cc-dot', go);

  const btnPrev = document.getElementById('ccPrev');
  const btnNext = document.getElementById('ccNext');
  btnPrev.addEventListener('mousedown', e=>e.stopPropagation());
  btnNext.addEventListener('mousedown', e=>e.stopPropagation());
  btnPrev.addEventListener('click', ()=>go(active-1));
  btnNext.addEventListener('click', ()=>go(active+1));

  addSwipe(track, 50, ()=>go(active+1), ()=>go(active-1));

  update();
})();
