/**
 * NGO Frontend — Dashboard Dynamic Integration (v2.1.1)
 * Renders stats, donation trends, and recent activity from DUMMY_DATA.dashboard.
 */

function renderDashboard(data) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.dashboard) ? window.DUMMY_DATA.dashboard : {};
    const d = data || defaults;

    // Stats
    const statGrid = document.querySelector('.dash-stat-grid');
    if (statGrid && d.stats) {
        statGrid.innerHTML = d.stats.map(s => `
            <div class="dash-card">
                <div style="color:var(--muted); font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:12px;">${s.label}</div>
                <div style="font-family:'Playfair Display',serif; font-size:32px; font-weight:900; color:${s.color || 'var(--accent)'};">${s.value}</div>
                <div style="color:${s.color || 'var(--accent3)'}; font-size:13px; font-weight:600; margin-top:8px;">${s.change}</div>
            </div>`).join('');
    }

    // Donation Trends (Chart placeholder)
    const trendsGrid = document.querySelector('#chart-donations > div:first-child');
    const labelGrid = document.querySelector('#chart-donations > div:last-child');
    if (trendsGrid && (d.donationTrends || defaults.donationTrends)) {
        const trends = d.donationTrends || defaults.donationTrends;
        trendsGrid.innerHTML = trends.map(t => `
            <div class="bar" style="height:${t.value}%;" title="${t.month}: ${t.label}"></div>
        `).join('');
        if (labelGrid) {
            labelGrid.innerHTML = trends.map(t => `<span>${t.month}</span>`).join('');
        }
    }

    // Recent Activity
    const activityList = document.querySelector('.activity-list');
    if (activityList && d.recentActivity) {
        activityList.innerHTML = d.recentActivity.map(a => `
            <div class="act-item">
                <div class="act-dot-c"><div class="act-d ${a.color}"></div><div class="act-line"></div></div>
                <div><div class="act-msg">${a.msg}</div><div class="act-time">${a.time}</div></div>
            </div>`).join('');
    }
}

async function initDashboard() {
    console.log('[Dashboard] Initializing dynamic rendering...');
    // Simulated backend fetch
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        // Dashboard endpoint might not exist yet, so we'll likely fallback
        const res = await fetch(`${apiUrl}/dashboard`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('No dashboard endpoint found.');
        const data = await res.json();
        renderDashboard(data);
    } catch (e) {
        console.warn('[Dashboard] Backend fallback triggered. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderDashboard(null);
            if (typeof toast === 'function') {
                toast('info', 'Mock Mode', 'Showing local management data.', '📊');
            }
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadIncludes === 'function') loadIncludes();
    initDashboard();
});
