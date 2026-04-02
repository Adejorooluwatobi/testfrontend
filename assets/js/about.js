/**
 * NGO Frontend — About Page Dynamic Integration (v2.1.1)
 * Fetches data from GET /api/about and renders banner, mission, vision, team, and journey.
 */

function _aboutMerge(data, defaults) {
    if (!data) return defaults;
    const out = {};
    for (const key of Object.keys(defaults)) {
        const val = data[key];
        if (Array.isArray(defaults[key])) {
            out[key] = (Array.isArray(val) && val.length > 0) ? val : defaults[key];
        } else if (typeof defaults[key] === 'object' && defaults[key] !== null) {
            out[key] = _aboutMerge(val, defaults[key]);
        } else {
            out[key] = (val !== null && val !== undefined && val !== '') ? val : defaults[key];
        }
    }
    return out;
}

function renderAbout(rawData) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.about) ? window.DUMMY_DATA.about : {};
    const data = {
        banner:     _aboutMerge(rawData?.banner,     defaults.banner),
        ourMission: _aboutMerge(rawData?.ourMission, defaults.ourMission),
        ourVision:  _aboutMerge(rawData?.ourVision,  defaults.ourVision),
        team:       _aboutMerge(rawData?.team,       defaults.team),
        ourJourney: (Array.isArray(rawData?.ourJourney) && rawData.ourJourney.length > 0) ? rawData.ourJourney : defaults.ourJourney
    };

    // Rendering Logic
    const bannerH = document.getElementById('about-banner-header');
    const bannerT = document.getElementById('about-banner-title');
    const bannerD = document.getElementById('about-banner-desc');
    if (bannerH) bannerH.textContent = data.banner.header;
    if (bannerT) bannerT.textContent = data.banner.title;
    if (bannerD) bannerD.textContent = data.banner.description;

    const missionE = document.getElementById('about-mission-eyebrow');
    const missionT = document.getElementById('about-mission-title');
    const missionD = document.getElementById('about-mission-desc');
    const missionG = document.getElementById('about-values-grid');
    if (missionE) missionE.textContent = data.ourMission.header;
    if (missionT) missionT.innerHTML = data.ourMission.title;
    if (missionD) missionD.innerHTML = data.ourMission.description.split('\n\n').map(p => `<p style="font-size:15px;color:var(--muted);line-height:1.8;margin-bottom:22px;">${p}</p>`).join('');
    
    if (missionG && data.ourMission.cards) {
        const icons = ['🌱', '🤝', '📊', '⚡', '🎯', '🌍', '💡', '❤️'];
        missionG.innerHTML = data.ourMission.cards.map((c, i) => {
            const iconHtml = c.icon ? `<img src="${c.icon}" style="width:100%;height:100%;object-fit:cover;border-radius:9px;">` : icons[i % 8];
            return `
            <div class="value-card">
                <div class="val-ico si-green" style="border-radius:9px;">${iconHtml}</div>
                <div><div class="val-title">${c.title}</div><div class="val-desc">${c.description}</div></div>
            </div>`;
        }).join('');
    }

    const visionT = document.getElementById('about-vision-title');
    const visionD = document.getElementById('about-vision-desc');
    const visionB = document.getElementById('about-vision-bar');
    const visionI = document.getElementById('about-vision-icon');
    
    if (visionT) visionT.textContent = data.ourVision.title;
    if (visionD) visionD.textContent = data.ourVision.description;
    if (visionB) visionB.style.width = (data.ourVision.progress || 0) + '%';
    
    if (visionI) {
        visionI.innerHTML = data.ourVision.icon ? `<img src="${data.ourVision.icon}" style="height:56px;width:auto;object-fit:contain;border-radius:8px;" alt="Vision">` : '🌍';
    }

    const teamE = document.getElementById('about-team-eyebrow');
    const teamT = document.getElementById('about-team-title');
    const teamD = document.getElementById('about-team-desc');
    
    if (teamE && data.team.header) teamE.textContent = data.team.header;
    if (teamT && data.team.title) teamT.textContent = data.team.title;
    if (teamD && data.team.description) teamD.textContent = data.team.description;

    const teamG = document.getElementById('about-team-grid');
    if (teamG && data.team.card) {
        teamG.innerHTML = data.team.card.map((m, i) => `
            <div class="team-card">
                <div class="team-av tc-green" style="width:72px;height:72px;font-size:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;">
                    ${m.image ? `<img src="${m.image}" style="width:100%;height:100%;object-fit:cover;">` : (i % 2 === 0 ? '👩' : '👨')}
                </div>
                <div class="team-body">
                    <div class="team-name">${m.name || 'Team Member'}</div>
                    <div class="team-role">${m.role || 'Role'}</div>
                    <div class="team-social">
                        ${(Array.isArray(m.socials) && m.socials.length > 0) ? m.socials.map(s => {
                            if (!s.icon && !s.link) return '';
                            const linkHref = (s.link && s.link.trim() !== '') ? (s.link.startsWith('http') ? s.link : `https://${s.link}`) : '#';
                            const iconHtml = (s.icon && s.icon.trim() !== '') ? `<img src="${s.icon}" style="width:16px;height:16px;object-fit:contain;" alt="Social">` : '🔗';
                            return `<a href="${linkHref}" target="_blank">${iconHtml}</a>`;
                        }).join('') : '<span style="font-size:11px;color:var(--muted);opacity:0.7;">No Links</span>'}
                    </div>
                </div>
            </div>`).join('');
    }

    const timeline = document.getElementById('about-timeline');
    if (timeline && data.ourJourney) {
        timeline.innerHTML = data.ourJourney.map(j => `
            <div class="tl-item">
                <div class="tl-year">${j.year}</div>
                <div class="tl-title">${j.title}</div>
                <div class="tl-desc">${j.description}</div>
            </div>`).join('');
    }
}

async function initAbout() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/about`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderAbout(Array.isArray(data) ? data[0] : data);
    } catch (err) {
        console.warn('[About] Backend fallback triggered. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderAbout(null);
            console.log('[About] Local dummy data loaded.');
        }, 500);
    }
}

window.initAbout = initAbout;
