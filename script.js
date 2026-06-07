/* ============================================================
   PEMANCINGAN GERRY — JAVASCRIPT v3 (MOBILE FIXED)
   ============================================================ */

/* ============================================================
   DATA EVENT
   ============================================================ */
const STORAGE_KEY = 'pg_events';
const MONTHS_ID   = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

function defaultEvents() {
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  function fmtDate(month0, day) {
    return `${y}-${String(month0+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
  return [
    { id:1, judul:'Turnamen Mancing Bulanan',  tanggal:fmtDate(m,15), kategori:'🏆 Lomba',       deskripsi:'Kompetisi mancing antar komunitas se-Jabodetabek. Ikan terberat menang!',   detail1:'Hadiah Rp 5 Juta',   detail2:'Maks. 50 Peserta' },
    { id:2, judul:'Family Fishing Day',         tanggal:fmtDate(m,22), kategori:'👨‍👩‍👧 Family', deskripsi:'Acara mancing keluarga dengan berbagai game seru dan hiburan anak-anak.',   detail1:'Hadiah & Doorprize', detail2:'Bebas Anak-Anak' },
    { id:3, judul:'Night Fishing Battle',       tanggal:fmtDate(m,30), kategori:'🌙 Malam',       deskripsi:'Lomba mancing malam hari spesial. Siapa yang strike paling banyak menang!', detail1:'Hadiah Rp 3 Juta',   detail2:'20:00 – 04:00' },
  ];
}

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p) && p.length > 0) return p; }
  } catch(e) {}
  return defaultEvents();
}
function saveEvents(ev) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ev)); } catch(e) {}
}

let events = loadEvents();
let deleteTargetId = null;

/* ============================================================
   RENDER EVENT
   ============================================================ */
function renderEvents() {
  const grid = document.getElementById('event-grid');
  if (!grid) return;
  const isAdmin = document.body.classList.contains('admin-mode');
  const sorted  = [...events].sort((a,b) => new Date(a.tanggal) - new Date(b.tanggal));

  if (sorted.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-size:48px;margin-bottom:12px">📅</div>
      <p>${isAdmin ? 'Klik tombol di bawah untuk tambah event baru.' : 'Pantau terus untuk info event selanjutnya!'}</p></div>`;
    updateCountdown(null); return;
  }

  grid.innerHTML = sorted.map(ev => {
    const d   = new Date(ev.tanggal + 'T00:00:00');
    const day = d.getDate();
    const mon = MONTHS_ID[d.getMonth()];
    return `<div class="event-card reveal-up" data-id="${ev.id}">
      <div class="event-admin-actions">
        <button class="ea-btn ea-edit" onclick="openEditEvent(${ev.id})" title="Edit"><i class="fa fa-pen"></i></button>
        <button class="ea-btn ea-del"  onclick="confirmDeleteEvent(${ev.id})" title="Hapus"><i class="fa fa-trash"></i></button>
      </div>
      <div class="event-date"><span class="ed-day">${day}</span><span class="ed-month">${mon}</span></div>
      <div class="event-info">
        <div class="event-tag">${ev.kategori}</div>
        <h3>${ev.judul}</h3>
        <p>${ev.deskripsi}</p>
        <div class="event-detail">
          <span><i class="fa fa-trophy"></i> ${ev.detail1}</span>
          <span><i class="fa fa-users"></i> ${ev.detail2}</span>
        </div>
        <a href="https://wa.me/6208965658966?text=Daftar+${encodeURIComponent(ev.judul)}" target="_blank" class="btn btn-sm btn-primary ripple">Daftar Sekarang</a>
      </div>
    </div>`;
  }).join('');

  document.querySelectorAll('.event-card.reveal-up').forEach(el => setTimeout(() => el.classList.add('visible'), 50));

  const now      = new Date();
  const upcoming = sorted.find(ev => new Date(ev.tanggal + 'T00:00:00') >= now);
  updateCountdown(upcoming ? new Date(upcoming.tanggal + 'T08:00:00') : null);

  const lbl = document.getElementById('countdown-label');
  if (lbl && upcoming) {
    const d2 = new Date(upcoming.tanggal + 'T00:00:00');
    lbl.textContent = `⏳ ${upcoming.judul} (${d2.getDate()} ${MONTHS_ID[d2.getMonth()]}) — Mulai dalam:`;
  }
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
let countdownTarget = null;
function updateCountdown(t) { countdownTarget = t; }
function tickCountdown() {
  const els = ['cd-days','cd-hours','cd-mins','cd-secs'].map(id => document.getElementById(id));
  if (!els[0]) return;
  if (!countdownTarget) { els.forEach(e => { if(e) e.textContent='--'; }); return; }
  let diff = Math.max(0, countdownTarget - new Date());
  const parts = [
    Math.floor(diff/86400000), diff%=86400000, Math.floor(diff/3600000), diff%=3600000,
    Math.floor(diff/60000),    diff%=60000,    Math.floor(diff/1000)
  ];
  const vals = [parts[0], parts[2], parts[4], parts[6]];
  els.forEach((el,i) => { if(el) el.textContent = String(vals[i]).padStart(2,'0'); });
}

/* ============================================================
   ADMIN
   ============================================================ */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'gerry2025';

function doLogin() {
  const user = (document.getElementById('login-user')?.value||'').trim();
  const pass = (document.getElementById('login-pass')?.value||'').trim();
  const errEl = document.getElementById('login-error');
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.body.classList.add('admin-mode');
    closeModal('modal-login');
    const hint = document.getElementById('event-admin-hint');
    if (hint) hint.style.display='inline-flex';
    document.getElementById('login-user').value='';
    document.getElementById('login-pass').value='';
    if (errEl) errEl.style.display='none';
    showToast('✅ Login berhasil! Mode admin aktif.');
    renderEvents();
  } else {
    if (errEl) errEl.style.display='block';
    document.getElementById('login-pass').value='';
    document.getElementById('login-pass').focus();
  }
}
function doLogout() {
  document.body.classList.remove('admin-mode');
  const hint = document.getElementById('event-admin-hint');
  if (hint) hint.style.display='none';
  showToast('👋 Keluar dari mode admin.');
  renderEvents();
}

function openAddEvent() {
  document.getElementById('modal-event-title').textContent='➕ Tambah Event';
  document.getElementById('ev-id').value='';
  document.getElementById('ev-judul').value='';
  document.getElementById('ev-deskripsi').value='';
  document.getElementById('ev-detail1').value='';
  document.getElementById('ev-detail2').value='';
  const tom = new Date(); tom.setDate(tom.getDate()+1);
  document.getElementById('ev-tanggal').value=tom.toISOString().split('T')[0];
  document.getElementById('ev-kategori').value='🏆 Lomba';
  openModal('modal-event');
}
function openEditEvent(id) {
  const ev = events.find(e=>e.id===id);
  if (!ev) return;
  document.getElementById('modal-event-title').textContent='✏️ Edit Event';
  document.getElementById('ev-id').value=ev.id;
  document.getElementById('ev-judul').value=ev.judul;
  document.getElementById('ev-tanggal').value=ev.tanggal;
  document.getElementById('ev-kategori').value=ev.kategori;
  document.getElementById('ev-deskripsi').value=ev.deskripsi;
  document.getElementById('ev-detail1').value=ev.detail1;
  document.getElementById('ev-detail2').value=ev.detail2;
  openModal('modal-event');
}
function saveEvent() {
  const judul    = (document.getElementById('ev-judul')?.value||'').trim();
  const tanggal  = (document.getElementById('ev-tanggal')?.value||'').trim();
  const kategori = document.getElementById('ev-kategori')?.value||'🏆 Lomba';
  const deskripsi= (document.getElementById('ev-deskripsi')?.value||'').trim();
  const detail1  = (document.getElementById('ev-detail1')?.value||'').trim();
  const detail2  = (document.getElementById('ev-detail2')?.value||'').trim();
  if (!judul)   { showToast('⚠️ Judul event wajib diisi!'); return; }
  if (!tanggal) { showToast('⚠️ Tanggal wajib diisi!'); return; }
  const idVal = document.getElementById('ev-id')?.value;
  if (idVal) {
    const idx = events.findIndex(e=>String(e.id)===String(idVal));
    if (idx>-1) events[idx]={...events[idx],judul,tanggal,kategori,deskripsi,detail1,detail2};
    showToast('✅ Event berhasil diperbarui!');
  } else {
    const newId = events.length>0 ? Math.max(...events.map(e=>e.id))+1 : 1;
    events.push({id:newId,judul,tanggal,kategori,deskripsi,detail1,detail2});
    showToast('✅ Event baru berhasil ditambahkan!');
  }
  saveEvents(events);
  closeModal('modal-event');
  renderEvents();
}
function confirmDeleteEvent(id) { deleteTargetId=id; openModal('modal-delete'); }
function doDeleteEvent() {
  events=events.filter(e=>e.id!==deleteTargetId);
  saveEvents(events); closeModal('modal-delete');
  renderEvents(); showToast('🗑️ Event berhasil dihapus.'); deleteTargetId=null;
}
window.openEditEvent=openEditEvent;
window.confirmDeleteEvent=confirmDeleteEvent;

/* ============================================================
   MODALS
   ============================================================ */
function openModal(id) {
  const el=document.getElementById(id);
  if (el){el.classList.add('active');document.body.style.overflow='hidden';}
}
function closeModal(id) {
  const el=document.getElementById(id);
  if (el){el.classList.remove('active');document.body.style.overflow='';}
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
  document.querySelectorAll('.toast-pg').forEach(t=>t.remove());
  const toast=document.createElement('div');
  toast.className='toast-pg';
  toast.innerHTML=msg;
  toast.style.cssText=`position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(10px);
    background:rgba(7,14,26,0.97);color:#fff;padding:12px 22px;border-radius:99px;font-size:13.5px;
    z-index:9000;border:1px solid rgba(255,255,255,.14);box-shadow:0 4px 24px rgba(0,0,0,.5);
    animation:toastAnim 3.2s ease forwards;white-space:nowrap;max-width:90vw;text-align:center;`;
  if (!document.getElementById('toast-kf')){
    const s=document.createElement('style');s.id='toast-kf';
    s.textContent=`@keyframes toastAnim{0%{opacity:0;transform:translateX(-50%) translateY(14px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}85%{opacity:1}100%{opacity:0}}`;
    document.head.appendChild(s);
  }
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),3300);
}

/* ============================================================
   SLIDER
   ============================================================ */
function initSlider({sliderId,prevId,nextId,dotsId,itemClass,auto=false,interval=4500}) {
  const slider=document.getElementById(sliderId);
  if(!slider) return;
  const items=slider.querySelectorAll(itemClass);
  const prevBtn=document.getElementById(prevId);
  const nextBtn=document.getElementById(nextId);
  const dotsWrap=document.getElementById(dotsId);
  if(!items.length) return;
  let cur=0,autoTimer=null;

  if(dotsWrap){
    items.forEach((_,i)=>{
      const d=document.createElement('div');
      d.className='dot'+(i===0?' active':'');
      d.addEventListener('click',()=>{stopAuto();goTo(i);startAuto();});
      dotsWrap.appendChild(d);
    });
  }

  function shown(){
    if(window.innerWidth<640) return 1;
    if(window.innerWidth<960) return 2;
    return 3;
  }
  function goTo(idx){
    const max=Math.max(0,items.length-shown());
    cur=Math.max(0,Math.min(idx,max));
    // Ukur gap aktual dari elemen
    const itemEl=items[0];
    const gap=parseInt(getComputedStyle(slider).gap)||22;
    const w=itemEl.getBoundingClientRect().width+gap;
    slider.style.transform=`translateX(-${cur*w}px)`;
    if(dotsWrap) dotsWrap.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
  }
  function next(){goTo(cur+1>Math.max(0,items.length-shown())?0:cur+1);}
  function prev(){goTo(cur<=0?Math.max(0,items.length-shown()):cur-1);}

  if(nextBtn) nextBtn.addEventListener('click',()=>{stopAuto();next();startAuto();});
  if(prevBtn) prevBtn.addEventListener('click',()=>{stopAuto();prev();startAuto();});

  function startAuto(){if(!auto)return;stopAuto();autoTimer=setInterval(next,interval);}
  function stopAuto(){if(autoTimer)clearInterval(autoTimer);}

  let tx=0;
  slider.addEventListener('touchstart',e=>{tx=e.changedTouches[0].screenX;},{passive:true});
  slider.addEventListener('touchend',e=>{
    const diff=tx-e.changedTouches[0].screenX;
    if(Math.abs(diff)>40){stopAuto();diff>0?next():prev();startAuto();}
  },{passive:true});

  window.addEventListener('resize',()=>goTo(cur),{passive:true});
  startAuto();
}

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('pg_theme',theme);
  // Desktop toggle
  const icon=document.getElementById('tb-icon');
  const label=document.getElementById('tb-label');
  // Mobile toggle
  const iconMob=document.getElementById('tb-icon-mob');
  const labelMob=document.getElementById('tb-label-mob');

  if(theme==='light'){
    if(icon) icon.textContent='☀️';
    if(label) label.textContent='Mode Terang';
    if(iconMob) iconMob.textContent='☀️';
    if(labelMob) labelMob.textContent='Ganti ke Mode Gelap';
  } else {
    if(icon) icon.textContent='🌙';
    if(label) label.textContent='Mode Gelap';
    if(iconMob) iconMob.textContent='🌙';
    if(labelMob) labelMob.textContent='Ganti ke Mode Terang';
  }
}

function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')||'dark';
  applyTheme(cur==='dark'?'light':'dark');
}

/* ============================================================
   MOBILE NAV MENU
   ============================================================ */
function openNavMenu(){
  const menu=document.getElementById('nav-menu');
  const overlay=document.getElementById('nav-overlay');
  const burger=document.getElementById('hamburger');
  menu?.classList.add('open');
  overlay?.classList.add('active');
  burger?.classList.add('active');
  document.body.style.overflow='hidden';
}
function closeNavMenu(){
  const menu=document.getElementById('nav-menu');
  const overlay=document.getElementById('nav-overlay');
  const burger=document.getElementById('hamburger');
  menu?.classList.remove('open');
  overlay?.classList.remove('active');
  burger?.classList.remove('active');
  document.body.style.overflow='';
}

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded',()=>{

  /* THEME INIT */
  const savedTheme=localStorage.getItem('pg_theme')||'dark';
  applyTheme(savedTheme);

  /* Desktop theme toggle */
  document.getElementById('theme-toggle')?.addEventListener('click',toggleTheme);
  /* Mobile theme toggle (inside nav menu) */
  document.getElementById('theme-toggle-mob')?.addEventListener('click',()=>{
    toggleTheme(); closeNavMenu();
  });

  /* LOADING */
  const loading=document.getElementById('loading-screen');
  if(loading){
    document.body.style.overflow='hidden';
    setTimeout(()=>{loading.classList.add('hidden');document.body.style.overflow='';},2200);
  }

  /* PROMO BAR */
  document.getElementById('promo-close')?.addEventListener('click',()=>{
    document.getElementById('promo-bar')?.classList.add('hidden');
  });

  /* NAVBAR SCROLL */
  const navbar=document.getElementById('navbar');
  const navLinks=document.querySelectorAll('.nav-link');
  const sections=document.querySelectorAll('section[id]');

  window.addEventListener('scroll',()=>{
    navbar?.classList.toggle('scrolled',window.scrollY>60);
    document.getElementById('back-to-top')?.classList.toggle('visible',window.scrollY>400);
  },{passive:true});
  // Trigger once on load
  navbar?.classList.toggle('scrolled',window.scrollY>60);

  /* Active nav via IntersectionObserver */
  const navObs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.remove('active'));
        document.querySelector(`.nav-link[href="#${entry.target.id}"]`)?.classList.add('active');
      }
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  sections.forEach(s=>navObs.observe(s));

  /* HAMBURGER */
  document.getElementById('hamburger')?.addEventListener('click',()=>{
    const isOpen=document.getElementById('nav-menu')?.classList.contains('open');
    isOpen ? closeNavMenu() : openNavMenu();
  });

  /* Close menu on close button */
  document.getElementById('nav-menu-close')?.addEventListener('click',closeNavMenu);

  /* Close menu on overlay click */
  document.getElementById('nav-overlay')?.addEventListener('click',closeNavMenu);

  /* Close menu on nav link click */
  navLinks.forEach(l=>l.addEventListener('click',closeNavMenu));

  /* Mobile Admin btn inside menu */
  document.getElementById('admin-login-btn-mob')?.addEventListener('click',()=>{
    closeNavMenu();
    openModal('modal-login');
  });

  /* LIVE CLOCK */
  const clockEl=document.getElementById('clock-time');
  if(clockEl){
    const tick=()=>{
      const n=new Date();
      clockEl.textContent=[n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
    };
    tick(); setInterval(tick,1000);
  }

  /* HERO PARTICLES */
  const pCont=document.getElementById('particles');
  if(pCont){
    const cnt=window.innerWidth>768?14:6;
    for(let i=0;i<cnt;i++){
      const p=document.createElement('div');
      p.className='particle';
      const sz=Math.random()*5+3;
      p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${Math.random()*6+5}s;--del:-${Math.random()*6}s;--ty:-${Math.random()*55+20}px;--tx:${(Math.random()-.5)*40}px;opacity:${Math.random()*.4+.1}`;
      pCont.appendChild(p);
    }
  }

  /* COUNTER */
  const counters=document.querySelectorAll('.stat-num');
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&!entry.target.dataset.done){
        entry.target.dataset.done='1';
        const target=+entry.target.dataset.target;
        let cur=0; const step=target/60;
        const t=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(t);}entry.target.textContent=Math.round(cur);},18);
      }
    });
  },{threshold:.5});
  counters.forEach(c=>cObs.observe(c));

  /* SCROLL REVEAL */
  const revEls=document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  const rObs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.transitionDelay=entry.target.style.getPropertyValue('--delay')||'0s';
        entry.target.classList.add('visible');
        rObs.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  revEls.forEach(el=>rObs.observe(el));

  /* SLIDERS */
  initSlider({sliderId:'kolam-slider',prevId:'kolam-prev',nextId:'kolam-next',dotsId:'kolam-dots',itemClass:'.kolam-card',auto:true,interval:4500});
  initSlider({sliderId:'testi-slider',prevId:'testi-prev',nextId:'testi-next',dotsId:'testi-dots',itemClass:'.testi-card',auto:true,interval:5000});

  /* LIGHTBOX */
  const galItems=document.querySelectorAll('.galeri-item');
  const lightbox=document.getElementById('lightbox');
  const lbImg=document.getElementById('lb-img');
  let lbIdx=0;
  const lbSrcs=[...galItems].map(el=>el.dataset.src);
  galItems.forEach((el,i)=>el.addEventListener('click',()=>{
    lbIdx=i; lbImg.src=lbSrcs[i];
    lightbox?.classList.add('active');
    document.body.style.overflow='hidden';
  }));
  const closeLb=()=>{lightbox?.classList.remove('active');document.body.style.overflow='';};
  const navLb=dir=>{lbIdx=(lbIdx+dir+lbSrcs.length)%lbSrcs.length;lbImg.src=lbSrcs[lbIdx];};
  document.getElementById('lb-close')?.addEventListener('click',closeLb);
  document.getElementById('lb-prev')?.addEventListener('click',()=>navLb(-1));
  document.getElementById('lb-next')?.addEventListener('click',()=>navLb(1));
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLb();});

  /* EVENTS */
  renderEvents();
  setInterval(tickCountdown,1000);
  tickCountdown();

  /* ADMIN */
  document.getElementById('admin-login-btn')?.addEventListener('click',()=>openModal('modal-login'));
  document.getElementById('admin-logout-btn')?.addEventListener('click',doLogout);
  document.getElementById('login-pass')?.addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
  document.getElementById('login-user')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('login-pass')?.focus();});
  document.getElementById('do-login')?.addEventListener('click',doLogin);
  document.getElementById('do-save-event')?.addEventListener('click',saveEvent);
  document.getElementById('do-delete-event')?.addEventListener('click',doDeleteEvent);
  document.getElementById('add-event-btn')?.addEventListener('click',openAddEvent);

  /* MODAL CLOSE BUTTONS */
  document.querySelectorAll('[data-modal]').forEach(btn=>{
    btn.addEventListener('click',()=>closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay=>{
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal(overlay.id);});
  });

  /* KEYBOARD */
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.modal-overlay.active').forEach(m=>closeModal(m.id));
      closeLb();
      closeNavMenu();
    }
    if(lightbox?.classList.contains('active')){
      if(e.key==='ArrowLeft') navLb(-1);
      if(e.key==='ArrowRight') navLb(1);
    }
  });

  /* KONTAK → WA */
  document.getElementById('send-wa')?.addEventListener('click',()=>{
    const nama=(document.getElementById('nama')?.value||'').trim();
    const hp=(document.getElementById('hp')?.value||'').trim();
    const pesan=(document.getElementById('pesan')?.value||'').trim();
    if(!nama){showToast('⚠️ Mohon isi nama Anda.');return;}
    if(!pesan){showToast('⚠️ Mohon tulis pesan Anda.');return;}
    const msg=encodeURIComponent(`Halo Admin Pemancingan Gerry! 🎣\n\nNama: ${nama}\nNo HP: ${hp||'-'}\n\nPesan:\n${pesan}`);
    window.open(`https://wa.me/6208965658966?text=${msg}`,'_blank');
  });

  /* BACK TO TOP */
  document.getElementById('back-to-top')?.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'smooth'});
  });

  /* SMOOTH ANCHOR */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target=document.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault();window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});}
    });
  });

});
