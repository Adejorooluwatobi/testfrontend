/**
 * NGO Frontend — Program Details Dynamic Integration (v2.1.2)
 * Fetches the full programs list and renders the specific program by index.
 */

async function initProgramDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10) || 0;
    const apiUrl = (typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:5000/api');

    console.log(`[Program Details] Loading index: ${id}`);

    try {
        const res = await fetch(`${apiUrl}/program`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Cannot fetch programs');
        const data = await res.json();
        const raw = Array.isArray(data) ? data[0] : data;
        const cards = (Array.isArray(raw?.card) && raw.card.length) ? raw.card : null;
        if (cards && cards[id]) {
            renderProgram(cards[id], id);
            return;
        }
        throw new Error('Program not found in list');
    } catch (err) {
        console.warn('[Program Details] Fallback triggered:', err.message);
        setTimeout(() => {
            const fallback = (window.DUMMY_DATA && window.DUMMY_DATA.programs) ? window.DUMMY_DATA.programs.card : [];
            const prog = fallback[id] || fallback[0];
            if (prog) renderProgram(prog, id);
        }, 500);
    }
}

function renderProgram(p, idx) {
    if (!p) return;
    idx = idx || 0;

    const bannerCycle = ['#1e5c3a', '#c0522a', '#1a3a8a', '#5c1e4a', '#2a5c3a', '#5c4a1e'];
    const emojis = ['📚','💧','🏥','👩','🛠️','🌾'];

    const tit = document.getElementById('prog-title');
    const tag = document.getElementById('prog-tag');
    const desc = document.getElementById('prog-desc');
    const hero = document.getElementById('prog-hero');
    const progressBar = document.getElementById('prog-progress-bar');
    const reach = document.getElementById('prog-reach-text');

    if (tit) tit.textContent = p.title;
    if (tag) tag.textContent = p.header || 'Program';
    if (desc) desc.innerHTML = (p.description || '').split('\n').filter(l => l.trim()).map(pp => `<p>${pp}</p>`).join('');

    const pr = Number(p.progress) || 0;
    if (progressBar) progressBar.style.width = pr + '%';
    if (reach) reach.textContent = `Reaching ${p.reaching || '---'}`;

    // Hero banner
    if (hero) {
        if (p.image) {
            hero.style.backgroundImage = `url(${p.image})`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        } else if (p.icon && (p.icon.startsWith('http') || p.icon.includes('/upload/'))) {
            hero.style.backgroundImage = `url(${p.icon})`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
            hero.style.filter = 'brightness(0.6)';
        } else {
            hero.style.backgroundColor = bannerCycle[idx % bannerCycle.length];
        }
    }

    document.title = `${p.title} — AWEDI`;

    // Gallery: API field is `images[]` from admin portal; fallback to `gallery` for backwards compat
    const galleryImgs = (Array.isArray(p.images) && p.images.length > 0) ? p.images
                      : (Array.isArray(p.gallery) && p.gallery.length > 0) ? p.gallery : [];

    const existing = document.getElementById('prog-gallery-section');
    if (existing) existing.remove();

    if (galleryImgs.length > 0) {
        const gallerySection = document.createElement('div');
        gallerySection.id = 'prog-gallery-section';
        gallerySection.style.cssText = 'max-width:800px;margin:0 auto 60px;';
        gallerySection.innerHTML = `
            <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:20px;color:var(--text);">Image Gallery</h3>
            <div id="prog-main-img" style="width:100%;height:420px;border-radius:18px;overflow:hidden;margin-bottom:14px;background:var(--surface2);">
                <img src="${galleryImgs[0]}" style="width:100%;height:100%;object-fit:cover;" alt="Gallery Image">
            </div>
            <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:10px;">
                ${galleryImgs.map((img, gi) => `
                    <img src="${img}"
                         style="width:100px;height:100px;min-width:100px;border-radius:10px;object-fit:cover;cursor:pointer;border:2px solid ${gi === 0 ? 'var(--accent)' : 'transparent'};transition:border 0.2s;"
                         onclick="
                             document.querySelector('#prog-main-img img').src='${img}';
                             document.querySelectorAll('#prog-gallery-section div + div img').forEach(function(el){el.style.borderColor='transparent'});
                             this.style.borderColor='var(--accent)';
                         "
                         onmouseover="this.style.opacity='0.85'"
                         onmouseout="this.style.opacity='1'">
                `).join('')}
            </div>
        `;
        const descEl = document.getElementById('prog-desc');
        if (descEl && descEl.parentNode) {
            descEl.parentNode.insertBefore(gallerySection, descEl.nextSibling);
        }
    }
}

window.initProgramDetails = initProgramDetails;
document.addEventListener('DOMContentLoaded', initProgramDetails);

