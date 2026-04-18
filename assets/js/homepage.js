/**
 * NGO Frontend — Homepage Dynamic Integration (v2.1.1)
 * Fetches data from GET /api/homepage and renders:
 * Hero, What We Do, Stats, Quotes, Testimonials, Partners
 */

/* ══════════════════════
   RENDER HELPERS
   ══════════════════════ */

function renderHero(banner) {
    if (!banner) return;
    const eye = document.getElementById('hero-eyebrow-text');
    const tit = document.getElementById('hero-title');
    const sub = document.getElementById('hero-subtitle');
    const stats = document.getElementById('hero-stats');
    const hero = document.getElementById('hero-section');
    
    // Fallback to DUMMY_DATA
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.homepage) ? window.DUMMY_DATA.homepage.banner : {};
    
    if (eye) eye.textContent = banner.header || defaults.header;
    if (tit) tit.innerHTML = banner.title || defaults.title;
    if (sub) sub.textContent = banner.description || defaults.description;
    
    // Banner Background Overload
    if (hero) {
        if (banner.imageUrl) {
            hero.style.backgroundImage = `url(${banner.imageUrl})`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
            hero.style.backgroundRepeat = 'no-repeat';
        } else {
            hero.style.backgroundImage = ''; // Falls back to CSS gradient
        }
    }

    const summary = banner.bannerSummary || defaults.bannerSummary;
    if (stats && summary) {
        stats.innerHTML = summary.map((s, i) => {
            const figure = s.count || s.figure || '0';
            const label  = s.label || 'Metric';
            return `
            <div class="hero-stat"><div class="hero-stat-val">${figure}</div><div class="hero-stat-lbl">${label}</div></div>
            ${i < summary.length - 1 ? '<div class="hero-divider"></div>' : ''}
        `;}).join('');
    }
}

function renderWhatWeDo(data, programs) {
    if (!data) return;
    const eye = document.getElementById('whatwedo-eyebrow');
    const tit = document.getElementById('whatwedo-title');
    const sub = document.getElementById('whatwedo-desc');
    const grid = document.getElementById('programs-grid');

    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.homepage) ? window.DUMMY_DATA.homepage.whatWeDo : {};

    if (eye) eye.textContent = data.header || defaults.header;
    if (tit) tit.innerHTML = data.title || defaults.title;
    if (sub) sub.textContent = data.description || defaults.description;
    
    // Automatically use the centralized Programs list (ignoring legacy homepage-specific overrides)
    const activePrograms = (programs && programs.length) ? programs : (data.items || []);

    if (grid && activePrograms && activePrograms.length) {
        // Only show first 3 for homepage
        const displayed = activePrograms.slice(0, 3);
        grid.innerHTML = displayed.map((p, i) => {
           const prog = p || {};
           const progress = Number(prog.progress) || 0;
           const emojis = ['📚','💧','🏥','👩','🛠️','🌾'];
           const bannerClasses = ['pb-edu','pb-water','pb-health','pb-women','pb-skills','pb-food'];
           const tagClasses = ['pt-edu','pt-health','pt-health','pt-terra','pt-terra','pt-edu'];
           const activeIcon = (prog.icon && (prog.icon.startsWith('http') || prog.icon.includes('/upload/') || prog.icon.length > 10))
                ? `<img src="${prog.icon}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
                : (prog.icon || emojis[i%6]);
           
           return `
            <div class="prog-card">
              <div class="prog-banner ${bannerClasses[i%6]}">${activeIcon}</div>
              <div class="prog-body">
                <span class="prog-tag ${tagClasses[i%6]}">${prog.header || 'Program'}</span>
                <div class="prog-title">${prog.title}</div>
                <div class="prog-desc">${prog.description}</div>
                <div style="margin-bottom:14px;">
                  <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:5px;"><span>Progress</span><span style="font-weight:700;color:var(--accent);">${progress}%</span></div>
                  <div style="background:var(--surface2);border-radius:20px;height:6px;overflow:hidden;"><div style="width:${progress}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent3));border-radius:20px;"></div></div>
                </div>
                <div class="prog-footer">
                  <div class="prog-reach">Reaching <span>${prog.reaching || '---'}</span></div>
                  <a href="programs.html" class="btn-accent" style="font-size:12px;padding:7px 14px;">Learn More</a>
                </div>
              </div>
            </div>`;
        }).join('');
    }
}

function renderQuote(quote) {
    if (!quote) return;
    const tx = document.getElementById('quote-text');
    const au = document.getElementById('quote-author');
    const mt = document.getElementById('quote-metrics');

    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.homepage) ? window.DUMMY_DATA.homepage.quote : {};

    if (tx) tx.textContent = quote.text || defaults.text;
    if (au) au.textContent = quote.author || defaults.author;
    
    const cards = quote.cards || defaults.cards;
    if (mt && cards) {
        mt.innerHTML = cards.map(c => {
            const figure = c.value || c.figure || '0';
            const label  = c.title || c.label  || 'Metric';
            return `<div class="impact-metric"><div class="impact-metric-val">${figure}</div><div class="impact-metric-lbl">${label}</div></div>`;
        }).join('');
    }
}

function renderTestimonials(testi) {
    if (!testi) return;
    const eye = document.getElementById('testimonials-eyebrow');
    const tit = document.getElementById('testimonials-title');
    const desc = document.getElementById('testimonials-desc');
    const grid = document.getElementById('testimonials-grid');

    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.homepage) ? window.DUMMY_DATA.homepage.testimonials : {};

    if (eye) eye.textContent = testi.header || defaults.header;
    if (tit) tit.textContent = testi.title || defaults.title;
    if (desc) desc.textContent = testi.description || '';

    const items = (testi.items && testi.items.length) ? testi.items : defaults.items;
    if (grid && items) {
        grid.innerHTML = items.map(m => {
            const loc = m.role || m.location || 'Member';
            const av  = m.image || m.avatar || '👤';
            const avatarHtml = av.startsWith('http') 
                ? `<img src="${av}" style="width:100%;height:100%;object-fit:cover;border-radius:9px;">` 
                : av;
            return `
            <div class="testi-card">
              <div class="testi-stars">★★★★★</div>
              <div class="testi-text">${m.text}</div>
              <div class="testi-author">
                <div class="testi-av ${m.color || 'si-green'}" style="border-radius:9px;">${avatarHtml}</div>
                <div><div class="testi-name">${m.author}</div><div class="testi-loc">${loc}</div></div>
              </div>
            </div>
        `;}).join('');
    }
}

function renderPartners(partners) {
    const row = document.getElementById('partners-row');
    if (!row) return;
    
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.homepage) ? window.DUMMY_DATA.homepage.partners : [];
    const list = (partners && partners.length) ? partners : defaults;

    row.innerHTML = list.map(p => {
        if (typeof p === 'object') {
            const logoHtml = p.logo ? `<img src="${p.logo}" alt="${p.name}">` : '';
            return `<div class="partner-logo">${logoHtml}<span>${p.name}</span></div>`;
        }
        return `<div class="partner-logo">${p}</div>`;
    }).join('');
}

function renderDonateSection(donate) {
    if (!donate) return;
    const tit = document.getElementById('donate-title');
    const desc = document.getElementById('donate-desc');
    const wrap = document.getElementById('donate-btn-wrap');
    
    if (tit) tit.textContent = donate.title   || 'Nigeria needs your help.';
    if (desc) desc.textContent = donate.description || 'Join thousands of Nigerians making a difference.';

    if (wrap && Array.isArray(donate.buttons) && donate.buttons.length) {
        wrap.innerHTML = donate.buttons.map(b => {
            const link = b.link || 'donate.html';
            return `<a href="${link}" class="btn-donate">${b.label}</a>`;
        }).join('');
    }
}

/* ══════════════════════
   INIT
   ══════════════════════ */

async function initHomepage() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    console.log('[Homepage] Fetching dynamic content pipeline (v2.1.1)...');

    try {
        const [hRes, pRes] = await Promise.all([
            fetch(`${apiUrl}/homepage`, { cache: 'no-cache' }),
            fetch(`${apiUrl}/program`, { cache: 'no-cache' })
        ]);

        if (!hRes.ok) throw new Error('Backend unreachable');

        const hData = await hRes.json();
        const pData = pRes.ok ? await pRes.json() : null;
        const home = Array.isArray(hData) ? hData[0] : hData;

        // Correctly extract the cards array from the program response (handle single object or array)
        const programObj = Array.isArray(pData) ? pData[0] : pData;
        const progs = programObj?.card || [];

        renderHero(home?.banner);
        renderWhatWeDo(home?.whatWeDo, progs);
        renderQuote(home?.quote);
        renderTestimonials(home?.testimonials);
        renderPartners(home?.partners);
        renderDonateSection(home?.donate);
        
        console.log('[Homepage] Content updated from backend.');
    } catch (err) {
        console.warn('[Homepage] Backend fallback triggered. Applying mock delay (500ms)...');
        
        // Mock loading delay as requested by user
        setTimeout(() => {
            if (window.DUMMY_DATA && window.DUMMY_DATA.homepage) {
                const fallback = window.DUMMY_DATA.homepage;
                const progFallback = window.DUMMY_DATA.programs?.card || [];
                renderHero(fallback.banner);
                renderWhatWeDo(fallback.whatWeDo, progFallback);
                renderQuote(fallback.quote);
                renderTestimonials(fallback.testimonials);
                renderPartners(fallback.partners);
                console.log('[Homepage] Local dummy data loaded.');
            }
        }, 500);
    }
}

// Global scope expose
window.initHomepage = initHomepage;
