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

// ── ESCAPE SWIPE HINT (mobile / tablet) ──
(function(){
  const grid = document.querySelector('.escape-grid');
  if(!grid) return;
  let cancelled = false, animId = null;

  function animate(duration, ease, onProgress, onDone){
    const start = performance.now();
    (function step(now){
      if(cancelled) return;
      const t = Math.min((now - start) / duration, 1);
      onProgress(ease(t));
      if(t < 1) animId = requestAnimationFrame(step);
      else onDone();
    })(start);
  }

  function hint(){
    if(cancelled) return;
    const card = grid.querySelector('.esc-card');
    if(!card) return;
    const target = card.offsetWidth * 0.55;
    grid.style.scrollSnapType = 'none'; // prevent browser snap during animation

    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeInOut = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

    // slide left, then snap back
    animate(900, easeOut, v => { grid.scrollLeft = target * v; }, ()=>{
      animate(600, easeInOut, v => { grid.scrollLeft = target * (1 - v); }, ()=>{
        restore();
        setTimeout(()=>{ if(!cancelled) hint(); }, 3000);
      });
    });
  }

  function restore(){
    grid.scrollLeft = 0;
    grid.style.scrollSnapType = '';
  }

  grid.addEventListener('touchstart', ()=>{
    cancelled = true;
    if(animId) cancelAnimationFrame(animId);
    restore();
  }, {once:true, passive:true});

  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && window.matchMedia('(max-width:1024px)').matches && !cancelled){
        obs.unobserve(e.target);
        hint();
      }
    });
  }, {threshold:.25});
  obs.observe(document.getElementById('escape'));
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

  update();
})();

// ── AUDIENCE ACCORDION (mobile / tablet) ──
(function(){
  const cols = document.querySelectorAll('#audience .aud-col');
  if(!cols.length) return;
  cols.forEach(col=>{
    col.addEventListener('click',()=>{
      if(!window.matchMedia('(max-width:768px)').matches) return;
      const wasOpen = col.classList.contains('open');
      cols.forEach(c=>c.classList.remove('open'));
      if(!wasOpen) col.classList.add('open');
    });
  });
})();

// ── COOKIE CONSENT ──
(function(){
  const el = document.getElementById('cookie-consent');
  if(!el) return;
  const KEY = 'fiama-cookie-consent';

  // Load Google Analytics only after consent (wire GA snippet here when ready)
  function loadAnalytics(){
    if(window.__fiamaGA) return;
    window.__fiamaGA = true;
    // TODO: inject Google Analytics (gtag.js) here once the GA ID exists.
  }

  const choice = localStorage.getItem(KEY);
  if(choice === 'accepted'){ loadAnalytics(); return; }
  if(choice === 'declined'){ return; }

  setTimeout(()=>{ el.hidden = false; }, 1200);
  el.querySelector('.ck-accept').addEventListener('click', ()=>{
    localStorage.setItem(KEY, 'accepted'); el.hidden = true; loadAnalytics();
  });
  el.querySelector('.ck-decline').addEventListener('click', ()=>{
    localStorage.setItem(KEY, 'declined'); el.hidden = true;
  });
})();

// ── QUOTE MODAL ──
(function(){
  const modal = document.getElementById('quote-modal');
  if(!modal) return;
  const form = modal.querySelector('.qm-form');
  const success = modal.querySelector('.qm-success');

  function open(e){
    e && e.preventDefault();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('qm-locked');
    const first = modal.querySelector('input,select');
    if(first) setTimeout(()=>first.focus(),120);
  }

  function close(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('qm-locked');
  }

  document.querySelectorAll('[data-open-quote]').forEach(b=>b.addEventListener('click', open));
  modal.querySelectorAll('[data-close-quote]').forEach(b=>b.addEventListener('click', close));
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape' && modal.classList.contains('open')) close(); });

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    const btn = form.querySelector('.qm-submit');
    btn.disabled = true;
    try{
      const res = await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json',Accept:'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await res.json();
      if(!data.success) throw new Error(data.message || 'send failed');
      success.hidden = false;
      setTimeout(()=>{ close(); form.reset(); success.hidden = true; btn.disabled = false; }, 2600);
    }catch(err){
      btn.disabled = false;
      alert('Something went wrong. Please try again, or contact us on WhatsApp.');
    }
  });
})();
