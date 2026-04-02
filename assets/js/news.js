/**
 * NGO Frontend — News Page Dynamic Integration (v2.1.1)
 * Fetches data from GET /api/news and renders the news grid.
 */

let _newsData = [];

function renderNews(data) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.news) ? window.DUMMY_DATA.news : {};
    const d = data || defaults;
    
    const hdr = document.getElementById('news-banner-header');
    const tit = document.getElementById('news-banner-title');
    const desc = document.getElementById('news-banner-desc');
    const grid = document.getElementById('news-grid');

    if (hdr) hdr.textContent = d.header || defaults.header;
    if (tit) {
        if (d.title) { tit.textContent = d.title; tit.style.display = 'block'; }
        else { tit.style.display = 'none'; }
    }
    if (desc) desc.textContent = d.description || defaults.description;

    if (grid) {
        const cards = (d.cards && d.cards.length) ? d.cards : defaults.cards;
        _newsData = cards; // Store for modal access
        
        grid.innerHTML = cards.map((c, i) => {
            const emojis = ['🌿', '💧', '🏆', '👩‍💼', '🌾', '🎓'];
            const colors = ['ni-1', 'ni-2', 'ni-3', '', '', ''];
            const style = i >= 3 ? `background:linear-gradient(135deg, ${['#8a4a1a','#1a4a2a','#4a1a8a'][i%3]}, ${['#c08030','#3a8a50','#7a3ac0'][i%3]});` : '';
            
            return `
                <div class="news-card">
                    <div class="news-img ${!c.icon && !c.image ? (colors[i % 6] || '') : ''}" style="${!c.icon && !c.image ? style : ''}">
                        ${(c.icon || c.image) 
                            ? `<img src="${c.icon || c.image}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;">` 
                            : emojis[i % 6]}
                    </div>
                    <div class="news-body">
                        <div class="news-tag">${c.header || c.tag || 'News'}</div>
                        <div class="news-title" style="cursor:pointer;" onclick="openNewsModal(${i})">${c.title || 'Update'}</div>
                        <div class="news-excerpt">${c.description || c.excerpt || 'Read more about our recent updates.'}</div>
                        <div class="news-footer" style="flex-direction:column; align-items:stretch; gap:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; opacity:0.7;">
                                <span>${c.date || 'Recently'}</span>
                                <span class="read-more" style="font-size:12px;" onclick="openNewsModal(${i})">Read Quick Preview →</span>
                            </div>
                            <a href="news-details.html?id=${i}" style="font-size:11px; text-align:center; color:var(--muted); text-decoration:none; font-weight:600; padding:4px; border-top:1px solid var(--border);">Read Full Article on New Page</a>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }
}

/* ── MODAL LOGIC ── */
function openNewsModal(idx) {
    const n = _newsData[idx];
    if (!n) return;

    const modal = document.getElementById('news-modal');
    const banner = document.getElementById('modal-news-banner');
    const tag = document.getElementById('modal-news-tag');
    const date = document.getElementById('modal-news-date');
    const title = document.getElementById('modal-news-title');
    const desc = document.getElementById('modal-news-desc');
    const viewBtn = document.getElementById('modal-view-news-page');

    if (modal) modal.classList.add('active');

    // Navigation
    if (viewBtn) viewBtn.href = `news-details.html?id=${idx}`;

    // Populate
    if (tag) tag.textContent = n.tag || n.header || 'News';
    if (date) date.textContent = n.date || 'Recently';
    if (title) title.textContent = n.title;
    
    if (desc) {
        const fullContent = n.description || n.excerpt || 'No content provided.';
        desc.innerHTML = fullContent.split('\n').filter(l => l.trim().length > 0).map(l => `<p style="margin-bottom:15px;">${l}</p>`).join('');
    }

    if (banner) {
        if (n.image || n.icon) {
            banner.innerHTML = `<img src="${n.image || n.icon}" alt="${n.title}" style="width:100%;height:100%;object-fit:cover;">`;
        } else {
            const style = idx >= 3 ? `background:linear-gradient(135deg, ${['#8a4a1a','#1a4a2a','#4a1a8a'][idx%3]}, ${['#c08030','#3a8a50','#7a3ac0'][idx%3]});` : '';
            const emojis = ['🌿', '💧', '🏆', '👩‍💼', '🌾', '🎓'];
            const colors = ['ni-1', 'ni-2', 'ni-3', '', '', ''];
            banner.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:120px;${style}" class="${colors[idx%6] || ''}">${emojis[idx%6]}</div>`;
        }
    }

    document.body.style.overflow = 'hidden'; 
}

function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

window.onclick = function(event) {
    const modal = document.getElementById('news-modal');
    if (event.target == modal) closeNewsModal();
}

async function initNews() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/news`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderNews(Array.isArray(data) ? data[0] : data);
    } catch (err) {
        console.warn('[News] Backend fallback triggered. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderNews(null);
            console.log('[News] Local dummy data loaded.');
        }, 500);
    }
}

window.initNews = initNews;
window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;
