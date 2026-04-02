
/* ══════════════════════
   STATE
══════════════════════ */
let storedUser = null;
try { storedUser = JSON.parse(localStorage.getItem('currentUser')); } catch(e) {}
let isLoggedIn = !!storedUser;
let currentUser = storedUser ? Object.assign(storedUser, { 
    initials: storedUser.name ? storedUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U' 
}) : { name: 'John Doe', email: 'john@email.com', initials: 'JD' };

let isDark = localStorage.getItem('theme') === 'dark';
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

let mobileMenuOpen = false;

/* ══════════════════════
   TOAST SYSTEM
══════════════════════ */
const TOAST_COLORS = { success: '#16a34a', error: '#c0392b', info: '#1a5c8a', warn: '#c9962a' };
const TOAST_BG = { success: 'rgba(22,163,74,.1)', error: 'rgba(184,50,50,.1)', info: 'rgba(26,92,138,.1)', warn: 'rgba(201,150,42,.1)' };

function toast(type = 'info', title = '', msg = '', icon = '') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.borderLeft = `3px solid ${TOAST_COLORS[type]}`;
  t.innerHTML = `
    <div class="t-ico" style="background:${TOAST_BG[type]}">${icon}</div>
    <div><div class="t-title" style="color:${TOAST_COLORS[type]}">${title}</div>${msg ? `<div class="t-msg">${msg}</div>` : ''}</div>
    <button class="t-close" onclick="removeToast(this.parentElement)">×</button>
    <div class="toast-bar" style="background:${TOAST_COLORS[type]}"></div>`;
  c.appendChild(t);
  setTimeout(() => removeToast(t), 4400);
}
function removeToast(el) {
  if (!el || !el.parentElement) return;
  el.classList.add('out');
  setTimeout(() => el.remove(), 280);
}

/* ══════════════════════
   THEME
══════════════════════ */
function toggleTheme() {
  isDark = !isDark;
  const theme = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  toast(isDark ? 'info' : 'info', isDark ? 'Dark Mode On 🌙' : 'Light Mode On ☀️', '', isDark ? '🌙' : '☀️');
}

async function loadIncludes() {
  const base = new URL(window.location.href);
  const hUrl = new URL('includes/header_final.html', base).href + '?v=2.1.5';
  const fUrl = new URL('includes/footer.html', base).href + '?v=2.1.5';

  try {
    const hRes = await fetch(hUrl, { cache: 'no-cache' });
    if (hRes.ok) {
      document.getElementById('header-placeholder').innerHTML = await hRes.text();
      // Ensure menu is initialized after HTML is injected
      if (typeof initMobileMenu === 'function') initMobileMenu();
      if (typeof highlightActiveLink === 'function') highlightActiveLink();
      // Settling delay for ID indexing in DOM
      setTimeout(() => { if (typeof updateAuthUI === 'function') updateAuthUI(); }, 200);
    }
    const fRes = await fetch(fUrl, { cache: 'no-cache' });
    if (fRes.ok) {
      document.getElementById('footer-placeholder').innerHTML = await fRes.text();
    }
  } catch (err) { console.error('Includes failed:', err); }
}

function highlightActiveLink() {
  const path = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const links = document.querySelectorAll('.nav-link, #mobile-menu .mob-nav-link');

  links.forEach(l => {
    const href = l.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('/').pop().toLowerCase();

    if (cleanHref === path || (path === 'index.html' && (cleanHref === '' || cleanHref === '#'))) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });
}

/* ══════════════════════
   NAVIGATION
══════════════════════ */
function showPage(id, navEl, navId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');

  // Update desktop nav active
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (navId) {
    const ln = document.getElementById(navId);
    if (ln) ln.classList.add('active');
  } else if (navEl) {
    navEl.classList.add('active');
  }

  closeMobileMenu();
  closeDD();
  closeNotif();
  window.scrollTo(0, 0);

  // Animate counters on home
  if (id === 'home') animateCounters();

  // Fix responsive grids
  fixResponsiveGrids();
}

/* ══════════════════════
   MOBILE MENU
══════════════════════ */
function initMobileMenu() {
  const dialog = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.getElementById('mob-close-btn');
  if (!dialog || !hamburger) return;

  hamburger.onclick = (e) => { e.stopPropagation(); openMobileMenu(); };
  if (closeBtn) closeBtn.onclick = (e) => { e.stopPropagation(); closeMobileMenu(); };

  dialog.onclick = function (e) {
    if (e.target === dialog) closeMobileMenu();
  };
}

function ensureMobileMenuExists() {
  let dialog = document.getElementById('mobile-menu') || document.querySelector('.mob-dialog');
  if (dialog) {
      // If it exists in header, move to body for better placement
      if (dialog.parentElement !== document.body) {
          console.log('[Debug] Moving Mobile Menu to body for resilience...');
          document.body.appendChild(dialog);
      }
      return dialog;
  }

  console.log('[Debug] Self-healing: Manifesting Mobile Menu...');
  dialog = document.createElement('dialog');
  dialog.id = 'mobile-menu';
  dialog.className = 'mob-dialog';
  dialog.innerHTML = `
    <div class="mob-panel">
      <div class="mob-panel-header">
        <a href="index.html" class="nav-brand" onclick="closeMobileMenu()">
          <img src="assets/img/20260325_155744.png" alt="AWEDI Logo" class="brand-logo-img" style="height:38px;">
          <div><div class="brand-name">AWEDI</div></div>
        </a>
        <button class="mob-close-btn" id="mob-close-btn" aria-label="Close menu">&times;</button>
      </div>
      <nav class="mob-nav">
        <a href="index.html" class="mob-nav-link" id="mn-home" onclick="closeMobileMenu()">Home</a>
        <a href="about.html" class="mob-nav-link" id="mn-about" onclick="closeMobileMenu()">About Us</a>
        <a href="programs.html" class="mob-nav-link" id="mn-programs" onclick="closeMobileMenu()">Programs</a>
        <a href="volunteer.html" class="mob-nav-link" id="mn-volunteer" onclick="closeMobileMenu()">Volunteer</a>
        <a href="donate.html" class="mob-nav-link" id="mn-donate" onclick="closeMobileMenu()">Donate</a>
        <a href="news.html" class="mob-nav-link" id="mn-news" onclick="closeMobileMenu()">News</a>
        <a href="contact.html" class="mob-nav-link" id="mn-contact" onclick="closeMobileMenu()">Contact</a>
      </nav>
      <div class="mob-auth" id="mob-auth-btns"></div>
    </div>
  `;
  document.body.appendChild(dialog);
  // Re-bind close button
  const cb = dialog.querySelector('#mob-close-btn');
  if (cb) cb.onclick = closeMobileMenu;
  return dialog;
}

function openMobileMenu() {
  console.log('[Debug] Mobile menu: Open requested (v2.0.0)');
  const dialog = ensureMobileMenuExists();
  if (mobileMenuOpen) return;
  
  try {
      if (typeof dialog.showModal === 'function') {
          dialog.showModal();
      } else {
          dialog.setAttribute('open', '');
      }
  } catch(e) { dialog.setAttribute('open', ''); }
  
  mobileMenuOpen = true;
  document.body.style.overflow = 'hidden';
  console.log('[Debug] Mobile menu: Opened');
}

function closeMobileMenu() {
  console.log('[Debug] Mobile menu: Close requested');
  const dialog = document.getElementById('mobile-menu');
  if (!dialog) return;
  mobileMenuOpen = false;
  document.body.style.overflow = '';
  try {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  } catch(e) { dialog.removeAttribute('open'); }
  console.log('[Debug] Mobile menu: Closed');
}

function toggleMobileMenu() {
  mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
}

/* ══════════════════════
   DROPDOWNS
══════════════════════ */
function createDynamicDD(parentBtn) {
  console.log('[Debug] Self-healing: Injecting dynamic dropdown...');
  const div = document.createElement('div');
  div.className = 'dd-menu';
  div.id = 'header-profile-dropdown';
  div.innerHTML = `
    <div class="dd-header">
      <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;" id="dd-name">${currentUser.name || 'John Doe'}</div>
      <div style="font-size:12px;color:var(--muted);" id="dd-email">${currentUser.email || 'john@email.com'}</div>
    </div>
    <div class="dd-item" onclick="window.location.href='profile.html';closeDD()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Profile</div>
    <div class="dd-item" onclick="window.location.href='donate.html';closeDD()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Donate Now</div>
    <div class="dd-item" onclick="window.location.href='volunteer.html';closeDD()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78z"/></svg>Volunteer</div>
    <div class="dd-sep"></div>
    <div class="dd-item danger" onclick="doLogout()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign Out</div>
  `;
  parentBtn.appendChild(div);
  return div;
}

function toggleDD(e) {
  console.log('[Debug] toggleDD triggered');
  if (e && e.stopPropagation) e.stopPropagation();
  
  const btn = e.target.closest('.prof-btn');
  if (!btn) return;

  // Look for menu inside the button wrapper
  let d = document.getElementById('header-profile-dropdown') || btn.querySelector('.dd-menu');
  
  // SELF-HEALING FALLBACK
  if (!d) { 
      d = createDynamicDD(btn);
  }

  const o = d.classList.toggle('open');
  console.log('[Debug] Dropdown state:', o ? 'Opened' : 'Closed');
  const c = document.getElementById('prof-chev');
  if (c) c.style.transform = o ? 'rotate(180deg)' : '';
  if (o) closeNotif();
}
function closeDD() {
  const d = document.getElementById('header-profile-dropdown') || document.querySelector('.dd-menu');
  if (d) d.classList.remove('open');
  const c = document.getElementById('prof-chev');
  if (c) c.style.transform = '';
}
function toggleNotif(e) {
  if (e) e.stopPropagation();
  const p = document.getElementById('notif-panel');
  if (p) {
    const o = p.classList.toggle('open');
    if (o) closeDD();
  }
}
function closeNotif() {
  const p = document.getElementById('notif-panel');
  if (p) p.classList.remove('open');
}
function markNotifRead() {
  document.querySelectorAll('.np-dot').forEach(d => { d.className = 'np-empty'; });
  document.getElementById('notif-badge').style.display = 'none';
  toast('info', 'All Clear', 'All notifications marked as read.', '✓');
}

document.addEventListener('click', e => {
  const target = e.target;
  
  // Toggle Profile Dropdown
  if (target.closest('.prof-btn')) {
    e.preventDefault();
    toggleDD(e);
    return;
  }
  
  // Toggle Notifications
  if (target.closest('.nav-icon-btn')) {
    e.preventDefault();
    toggleNotif(e);
    return;
  }
  
  // Toggle Mobile Menu (Hamburger)
  if (target.closest('#hamburger')) {
    e.preventDefault();
    openMobileMenu();
    return;
  }

  // Close when clicking outside
  if (!target.closest('#prof-wrap')) closeDD();
  if (!target.closest('#notif-wrap')) closeNotif();
});

/* ══════════════════════
   AUTH
══════════════════════ */
// auth.js now handles sign in and sign up

function doLogout() {
  isLoggedIn = false;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
  closeDD();
  updateAuthUI();
  toast('info', 'Signed Out', 'You have been signed out safely.', '👋');
  setTimeout(() => window.location.href = 'index.html', 800);
}

function updateAuthUI() {
  const authBtns = document.getElementById('signin-header-btn');
  const authBtns2 = document.getElementById('signup-header-btn');
  const profWrap = document.getElementById('prof-wrap');
  const mobAuth = document.getElementById('mob-auth-btns');

  if (isLoggedIn) {
    if (authBtns) authBtns.style.display = 'none';
    if (authBtns2) authBtns2.style.display = 'none';
    if (profWrap) {
        profWrap.style.display = 'flex';
        const pBtn = profWrap.querySelector('.prof-btn');
        if (pBtn) pBtn.onclick = (e) => { 
            if (e && e.stopPropagation) e.stopPropagation();
            toggleDD(e); 
        };
    }
    const nWrap = document.getElementById('notif-wrap');
    if (nWrap) {
        const nBtn = nWrap.querySelector('.nav-icon-btn');
        if (nBtn) nBtn.onclick = (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            toggleNotif(e);
        };
    }

    if (mobAuth) mobAuth.innerHTML = `
      <a href="profile.html" class="mob-btn-ghost" onclick="closeMobileMenu()">My Profile</a>
      <button class="mob-btn-danger" onclick="doLogout();closeMobileMenu()">Sign Out</button>
    `;

    try {
        const hAv = document.getElementById('header-av');
        const hNm = document.getElementById('header-name');
        const dNm = document.getElementById('dd-name');
        const dEm = document.getElementById('dd-email');
        if (hAv) hAv.textContent = currentUser.initials || 'JD';
        if (hNm && currentUser.name) hNm.textContent = currentUser.name.split(' ')[0];
        if (dNm) dNm.textContent = currentUser.name || 'John Doe';
        if (dEm) dEm.textContent = currentUser.email || 'john@email.com';
    } catch(e) { console.warn('Auth UI mapping failed:', e.message); }
  } else {
    if (authBtns) authBtns.style.display = '';
    if (authBtns2) authBtns2.style.display = '';
    if (profWrap) profWrap.style.display = 'none';
    if (mobAuth) mobAuth.innerHTML = `
      <a href="signin.html" class="mob-btn-ghost" onclick="closeMobileMenu()">Sign In</a>
      <a href="signup.html" class="mob-btn-fill" onclick="closeMobileMenu()">Join Us</a>
    `;
  }
}

/* ══════════════════════
   DONATE AMOUNT SELECT
══════════════════════ */
function selectAmt(btn) {
  document.querySelectorAll('#donate-amts .donate-amt-btn').forEach(b => {
    b.classList.remove('sel');
    b.style.color = 'var(--text)';
    b.style.borderColor = 'var(--border)';
    b.style.background = 'var(--surface2)';
  });
  btn.classList.add('sel');
  btn.style.color = '';
  btn.style.borderColor = '';
  btn.style.background = '';
  const isCustom = btn.textContent.includes('Custom');
  document.getElementById('custom-amt-row').style.display = isCustom ? 'block' : 'none';
}
function selectDonateAmt(btn, val) { selectAmt(btn); }

function selectAmt2(btn) {
  document.querySelectorAll('.donate-amt-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  
  // Extract number from text (e.g., "₦5,000" -> 5000)
  const txt = btn.textContent.replace(/[^0-9]/g, '');
  if (txt) {
    sessionStorage.setItem('selected_donation_amount', txt);
  } else {
    sessionStorage.removeItem('selected_donation_amount');
  }
}

/* ══════════════════════
   STAT COUNTERS
══════════════════════ */
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const isFloat = !Number.isInteger(target);
    let v = 0;
    const dur = 1600, step = 16;
    const inc = target / (dur / step);
    const t = setInterval(() => {
      v = Math.min(v + inc, target);
      el.textContent = prefix + (isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString());
      if (v >= target) { el.textContent = prefix + (isFloat ? target.toFixed(1) : target.toLocaleString()); clearInterval(t); }
    }, step);
  });
}

/* ══════════════════════
   RESPONSIVE FIXES
══════════════════════ */
function fixResponsiveGrids() {
  const w = window.innerWidth;
  const dg = document.getElementById('donate-grid');
  if (dg) dg.style.gridTemplateColumns = w <= 768 ? '1fr' : '1.2fr 1fr';
  const pg = document.getElementById('profile-grid');
  if (pg) pg.style.gridTemplateColumns = w <= 768 ? '1fr' : '1.2fr 1fr';
}
window.addEventListener('resize', fixResponsiveGrids);
fixResponsiveGrids();

/* ══════════════════════
   SCROLL HEADER
══════════════════════ */
window.addEventListener('scroll', () => {
  const h = document.getElementById('site-header');
  h.classList.toggle('scrolled', window.scrollY > 20);
});

/* ══════════════════════
   INIT
══════════════════════ */
animateCounters();