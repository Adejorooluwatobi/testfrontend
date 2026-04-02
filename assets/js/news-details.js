/**
 * NGO Frontend — News Detail Dynamic Integration (v2.1.2)
 * Fetches the full news list and renders the specific article by index.
 */

async function initNewsDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10) || 0;
    const apiUrl = (typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:5000/api');

    console.log(`[News Details] Loading index: ${id}`);

    try {
        const res = await fetch(`${apiUrl}/news`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Cannot fetch news');
        const data = await res.json();
        const raw = Array.isArray(data) ? data[0] : data;
        const cards = (Array.isArray(raw?.cards) && raw.cards.length) ? raw.cards : null;
        if (cards && cards[id]) {
            renderArticle(cards[id], id);
            return;
        }
        throw new Error('Article not found in list');
    } catch (err) {
        console.warn('[News Details] Fallback triggered:', err.message);
        setTimeout(() => {
            const fallback = (window.DUMMY_DATA && window.DUMMY_DATA.news) ? window.DUMMY_DATA.news.cards : [];
            const article = fallback[id] || fallback[0];
            if (article) renderArticle(article, id);
        }, 500);
    }
}

function renderArticle(a, idx) {
    if (!a) return;
    idx = idx || 0;

    const bgColors = ['#1a2a4a', '#1a4a2a', '#4a1a2a', '#2a1a4a', '#1a3a2a', '#3a2a1a'];
    const emojis  = ['🌿', '💧', '🏆', '👩‍💼', '🌾', '🎓'];

    const tit = document.getElementById('news-title');
    const tag = document.getElementById('news-tag');
    const dat = document.getElementById('news-date');
    const con = document.getElementById('news-content');
    const bg  = document.getElementById('news-hero-bg');

    if (tit) tit.textContent = a.title || 'Article';
    if (tag) tag.textContent = a.header || a.tag || 'News';
    if (dat) dat.textContent = a.date || 'Recently';

    // Full content: split newlines into paragraphs
    if (con) {
        const text = a.description || a.excerpt || '';
        const lines = text.split('\n').filter(l => l.trim());
        con.innerHTML = lines.length > 0
            ? lines.map(l => `<p>${l}</p>`).join('')
            : `<p>${text}</p>`;
    }

    // Hero banner — use card image/icon first, then fallback gradient
    if (bg) {
        if (a.image) {
            bg.innerHTML = `<img src="${a.image}" alt="${a.title || 'News'}">`;
        } else if (a.icon && (a.icon.startsWith('http') || a.icon.includes('/upload/'))) {
            bg.innerHTML = `<img src="${a.icon}" alt="${a.title || 'News'}">`;
        } else {
            bg.style.background = `linear-gradient(135deg, ${bgColors[idx % bgColors.length]}, ${bgColors[(idx + 2) % bgColors.length]})`;
            bg.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:140px;opacity:0.2;">${emojis[idx % emojis.length]}</div>`;
        }
    }

    document.title = `${a.title || 'Article'} — AWEDI`;
}

window.initNewsDetails = initNewsDetails;
document.addEventListener('DOMContentLoaded', initNewsDetails);

