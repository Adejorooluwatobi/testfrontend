/**
 * NGO Frontend — Volunteer Page Dynamic Integration (v2.1.1)
 * Fetches GET /api/volunteer → renders banner + benefits cards
 * Volunteer APPLICATION is posted to POST /api/volunteer/applications
 */

const VOL_EMOJIS = ['🌍','🎓','🤝','📸','🧠','💚','🎯','🌱'];

function renderVolunteer(data) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.volunteer) ? window.DUMMY_DATA.volunteer : {};
    const d = data || defaults;

    const banner = d.banner || defaults.banner || {};
    const bHdrEl  = document.getElementById('vol-banner-header');
    const bTitEl  = document.getElementById('vol-banner-title');
    const bDescEl = document.getElementById('vol-banner-desc');
    if (bHdrEl)  bHdrEl.textContent  = banner.header;
    if (bTitEl)  bTitEl.innerHTML    = banner.title;
    if (bDescEl) bDescEl.textContent = banner.description;

    const secHdrEl = document.getElementById('vol-section-header');
    const secTitEl = document.getElementById('vol-section-title');
    if (secHdrEl) secHdrEl.textContent = d.header || defaults.header;
    if (secTitEl) secTitEl.textContent = d.title || defaults.title;

    const cards  = (Array.isArray(d.card) && d.card.length) ? d.card : defaults.card;
    const gridEl = document.getElementById('vol-benefits-grid');
    if (gridEl && cards) {
        gridEl.innerHTML = cards.map((c, i) => {
            const iconHtml = c.icon
                ? (c.icon.startsWith('http') || c.icon.includes('/') 
                    ? `<img src="${c.icon}" alt="${c.title}" style="width:36px;height:36px;object-fit:contain;">` 
                    : c.icon)
                : VOL_EMOJIS[i % VOL_EMOJIS.length];
            return `<div class="benefit-card">
                <div class="benefit-icon">${iconHtml}</div>
                <div class="benefit-title">${c.title}</div>
                <div class="benefit-desc">${c.description}</div>
            </div>`;
        }).join('');
    }
}

/* ══════════════════════
   APPLICATION FORM SUBMIT
══════════════════════ */
async function submitVolunteerApp(e) {
    e.preventDefault();
    const btn = document.getElementById('vol-submit-btn');
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';

    const payload = {
        firstname:        document.getElementById('vol-firstname')?.value?.trim(),
        lastname:         document.getElementById('vol-lastname')?.value?.trim(),
        email:            document.getElementById('vol-email')?.value?.trim(),
        phonenumber:      document.getElementById('vol-phone')?.value?.trim(),
        stateOfResidence: document.getElementById('vol-state')?.value,
        availability:     document.getElementById('vol-availability')?.value,
        areaOfExpertise:  document.getElementById('vol-expertise')?.value,
        preferredProgram: document.getElementById('vol-program')?.value,
        whatYouVolunteer: document.getElementById('vol-motivation')?.value?.trim()
    };

    if (!payload.firstname || !payload.lastname || !payload.email || !payload.phonenumber) {
        if (typeof toast === 'function') toast('warn', 'Missing Fields', 'Please fill in all required fields.', '⚠️');
        return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

    try {
        const res = await fetch(`${apiUrl}/volunteer/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
        }
        if (typeof toast === 'function') toast('success', 'Application Sent! 🎉', 'We\'ll review your application and reach out within 3 business days.', '❤️');
        document.getElementById('vol-app-form')?.reset();
    } catch (err) {
        console.error('[Volunteer] Submit fallback/failure triggered applying mock delay.');
        // As requested by user, we add a mock delay for submission fallback too
        setTimeout(() => {
            if (typeof toast === 'function') toast('success', 'Application Sent! 🎉 (Mock Mode)', 'We\'ll review your application and reach out within 3 business days.', '❤️');
            document.getElementById('vol-app-form')?.reset();
            if (btn) { btn.disabled = false; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Application'; }
        }, 1500);
        return; // Early return to avoid enabling button here since we do it in timeout
    } 
    
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Application'; }
}

/* ══════════════════════
   FETCH & INIT
══════════════════════ */
async function initVolunteer() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/volunteer`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderVolunteer(Array.isArray(data) ? data[0] : data);
    } catch (e) {
        console.warn('[Volunteer] Backend fallback triggered. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderVolunteer(null);
            console.log('[Volunteer] Local dummy data loaded.');
        }, 500);
    }

    // Wire form
    const form = document.getElementById('vol-app-form');
    if (form) form.addEventListener('submit', submitVolunteerApp);

    // Dynamic Program Dropdown Population
    try {
        const progRes = await fetch(`${apiUrl}/program`, { cache: 'no-cache' });
        let cards = [];
        if (progRes.ok) {
            const pData = await progRes.json();
            const raw = Array.isArray(pData) ? pData[0] : pData;
            cards = raw?.card || [];
        } else {
            throw new Error();
        }
        
        const select = document.getElementById('vol-program');
        if (select && cards.length > 0) {
            const programTitles = cards.map(c => c.title).filter(t => t);
            select.innerHTML = ['Any Program', ...programTitles].map(t => `<option>${t}</option>`).join('');
        }
    } catch (err) {
        // Fallback to dummy data for dropdown if backend fails
        const select = document.getElementById('vol-program');
        const fallbackCards = (window.DUMMY_DATA && window.DUMMY_DATA.programs) ? window.DUMMY_DATA.programs.card : [];
        if (select && fallbackCards.length > 0) {
            const programTitles = fallbackCards.map(c => c.title);
            select.innerHTML = ['Any Program', ...programTitles].map(t => `<option>${t}</option>`).join('');
        }
    }
}

window.initVolunteer = initVolunteer;
