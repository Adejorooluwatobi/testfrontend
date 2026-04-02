/**
 * NGO Frontend — Programs Page Dynamic Integration (v2.1.1)
 * Fetches GET /api/program → renders banner + card[] on programs.html
 */

let _programData = [];

function _progTagClass(header, i) {
    if (!header) return 'pt-edu';
    const tagMap = { education:'pt-edu', health:'pt-health', empowerment:'pt-terra', livelihood:'pt-terra', environment:'pt-edu', water:'pt-health', women:'pt-terra' };
    const k = header.toLowerCase();
    for (const key of Object.keys(tagMap)) { if (k.includes(key)) return tagMap[key]; }
    return ['pt-edu','pt-health','pt-terra'][i % 3];
}

function renderPrograms(rawData) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.programs) ? window.DUMMY_DATA.programs : {};
    const banner = rawData?.banner || defaults.banner;
    const cards  = (Array.isArray(rawData?.card) && rawData.card.length) ? rawData.card : defaults.card;
    _programData = cards;

    // Banner
    const hdrEl  = document.getElementById('prog-banner-header');
    const titEl  = document.getElementById('prog-banner-title');
    const descEl = document.getElementById('prog-banner-desc');
    if (hdrEl)  hdrEl.textContent  = banner.header;
    if (titEl)  titEl.textContent  = banner.title;
    if (descEl) descEl.textContent = banner.description;

    // Cards
    const gridEl = document.getElementById('programs-full-grid');
    if (!gridEl) return;

    const bannerCycle = ['pb-edu','pb-water','pb-health','pb-women','pb-skills','pb-food'];
    const emojis = ['📚','💧','🏥','👩','🛠️','🌾'];

    gridEl.innerHTML = cards.map((c, i) => {
        const progress = Number(c.progress) || 0;
        const bannerClass = bannerCycle[i % bannerCycle.length];
        const tagClass = _progTagClass(c.header, i);
        const activeIcon = (c.icon && (c.icon.startsWith('http') || c.icon.includes('/upload/') || c.icon.length > 10))
            ? `<img src="${c.icon}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
            : (c.icon || emojis[i % 6]);

        const bannerHtml = c.image
            ? `<div class="prog-banner ${bannerClass}" style="padding:0;overflow:hidden;"><img src="${c.image}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;"></div>`
            : `<div class="prog-banner ${bannerClass}">${activeIcon}</div>`;
        
        return `<div class="prog-card">
            ${bannerHtml}
            <div class="prog-body">
                <span class="prog-tag ${tagClass}">${c.header || 'Program'}</span>
                <div class="prog-title">${c.title}</div>
                <div class="prog-desc">${c.description}</div>
                <div style="margin-bottom:14px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:5px;"><span>Progress</span><span style="font-weight:700;color:var(--accent);">${progress}%</span></div>
                    <div style="background:var(--surface2);border-radius:20px;height:6px;overflow:hidden;"><div style="width:${progress}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent3));border-radius:20px;"></div></div>
                </div>
                <div class="prog-footer" style="flex-direction:column; align-items:stretch; gap:10px;">
                    <button class="btn-accent" style="font-size:12px;padding:10px 14px;" onclick="openProgramModal(${i})">${c.buttonText || 'Learn More'}</button>
                    <a href="program-details.html?id=${i}" style="font-size:11px; text-align:center; color:var(--muted); text-decoration:none; font-weight:600;">View Full Detailed Page</a>
                </div>
            </div>
        </div>`;
    }).join('');
}

function openProgramModal(idx) {
    const p = _programData[idx];
    if (!p) return;
    const modal = document.getElementById('program-modal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const tag = document.getElementById('modal-tag');
    const banner = document.getElementById('modal-banner');
    const progTxt = document.getElementById('modal-progress-text');
    const progBar = document.getElementById('modal-progress-bar');
    const reach = document.getElementById('modal-reach');
    const viewBtn = document.getElementById('modal-view-page');
    const galleryWrap = document.getElementById('modal-gallery-wrap');
    const gallery = document.getElementById('modal-gallery');

    if (title) title.textContent = p.title;
    if (desc) desc.innerHTML = (p.description || '').split('\n').map(l => `<p style="margin-bottom:15px;">${l}</p>`).join('');
    
    if (tag) {
        tag.textContent = p.header || 'Program';
        tag.className = `modal-tag ${_progTagClass(p.header, idx)}`;
    }

    if (banner) {
        // Reset styles for safe fallback
        banner.style.display = 'block';
        banner.style.background = '';
        
        if (p.image) {
            banner.innerHTML = `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`;
        } else if (p.icon) {
            banner.style.display = 'flex';
            banner.style.alignItems = 'center';
            banner.style.justifyContent = 'center';
            banner.style.background = '#1a2a4a';
            banner.style.position = 'relative';
            banner.innerHTML = `
                <img src="${p.icon}" style="width:100%;height:100%;object-fit:cover;opacity:0.25;filter:blur(8px);position:absolute;inset:0;z-index:0;">
                <img src="${p.icon}" style="height:140px;width:auto;position:relative;z-index:1;object-fit:contain;">
            `;
        } else {
            const emojis = ['📚','💧','🏥','👩','🛠️','🌾'];
            const cycle = ['#1e5c3a', '#c0522a', '#1a3a8a'];
            banner.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:100px;background:${cycle[idx%3]};">${emojis[idx%6]}</div>`;
        }
    }

    if (progTxt) progTxt.textContent = `${Number(p.progress) || 0}%`;
    if (progBar) progBar.style.width = `${Number(p.progress) || 0}%`;
    if (reach) reach.innerHTML = `Our Reach: <span style="font-weight:700;color:var(--text);">${p.reaching || '---'}</span>`;

    if (viewBtn) viewBtn.href = `program-details.html?id=${idx}`;

    if (galleryWrap && gallery) {
        // API field is `images[]` (admin portal FormArray: getCardImages)
        const imgs = (Array.isArray(p.images) && p.images.length > 0) ? p.images
                   : (Array.isArray(p.gallery) && p.gallery.length > 0) ? p.gallery : [];

        if (imgs.length > 0) {
            galleryWrap.style.display = 'block';
            gallery.style.display = 'flex';
            gallery.style.gap = '10px';
            gallery.style.overflowX = 'auto';
            gallery.style.paddingBottom = '10px';

            // Auto-set first gallery image as the main banner if no standalone image/icon
            if (banner && !p.image && !p.icon) {
                banner.style.display = 'block';
                banner.style.background = '';
                banner.innerHTML = `<img src="${imgs[0]}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`;
            }

            gallery.innerHTML = imgs.map(img => {
                const safe = img.replace(/'/g, "\\'");
                return `<img src="${img}"
                     style="width:90px;height:90px;min-width:90px;border-radius:10px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:border 0.2s;"
                     onclick="document.getElementById('modal-banner').style.display='block';document.getElementById('modal-banner').innerHTML='<img src=&quot;${img}&quot; style=&quot;width:100%;height:100%;object-fit:cover;&quot;>'"
                     onmouseover="this.style.borderColor='var(--accent)'"
                     onmouseout="this.style.borderColor='transparent'">`;
            }).join('');
        } else {
            galleryWrap.style.display = 'none';
            gallery.innerHTML = '';
        }
    }
}

function closeProgramModal() {
    const modal = document.getElementById('program-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

async function initPrograms() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/program`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderPrograms(Array.isArray(data) ? data[0] : data);
    } catch (e) {
        console.warn('[Programs] Backend fallback triggered. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderPrograms(null);
            console.log('[Programs] Local dummy data loaded.');
        }, 500);
    }
}

window.initPrograms = initPrograms;
window.openProgramModal = openProgramModal;
window.closeProgramModal = closeProgramModal;
