/**
 * NGO Frontend — Profile Page Dynamic Integration
 * Fetches GET /api/users/profile → renders stats, recent activities, and profile details
 * Posts PUT /api/users/profile → updates user's phone, address, state, etc.
 */

async function initProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('authToken');

    if (!user || !token) {
        window.location.href = 'signin.html';
        return;
    }

    // Set basics from local storage
    const displayName = document.getElementById('profile-display-name');
    const displayEmail = document.getElementById('profile-display-email');
    const avatar = document.getElementById('profile-av-lg');
    const pdName = document.getElementById('pd-name');
    const pdEmail = document.getElementById('pd-email');

    if (displayName) displayName.textContent = user.name;
    if (displayEmail) displayEmail.textContent = user.email;
    if (avatar) avatar.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    if (pdName) pdName.textContent = user.name;
    if (pdEmail) pdEmail.textContent = user.email;

    // Fetch deep profile and activities
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    
    try {
        const res = await fetch(`${apiUrl}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            if (res.status === 401) {
                // Token expired
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                window.location.href = 'signin.html';
                return;
            }
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        renderProfileData(data.profile || {});
        renderActivities(data.recentActivities || { donations: [], applications: [] });

    } catch (e) {
        console.warn('[Profile] Failed to fetch profile details:', e.message);
        if (typeof toast === 'function') toast('warn', 'Sync Error', 'Could not load your full activity feed.', '⚠️');
    }

    // Wire up the form
    const form = document.getElementById('profile-update-form');
    if (form) form.addEventListener('submit', handleProfileUpdate);
}

function renderProfileData(prof) {
    // Fill the display info
    const pPhone = document.getElementById('pd-phone');
    const pLoc   = document.getElementById('pd-location');
    const pBio   = document.getElementById('pd-bio'); // if it exists
    const pDate  = document.getElementById('pd-member-since');
    const pDob   = document.getElementById('pd-dob');

    if (pPhone) pPhone.textContent = prof.phoneNumber || 'Not provided';
    const locArr = [prof.city, prof.state, prof.country].filter(Boolean);
    if (pLoc) pLoc.textContent = locArr.length ? locArr.join(', ') : 'Not provided';
    
    if (pDate && prof.createdAt) {
        const d = new Date(prof.createdAt);
        pDate.textContent = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    
    if (pDob) {
        if (prof.dob) {
            const d = new Date(prof.dob);
            pDob.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } else {
            pDob.textContent = 'Not provided';
        }
    }

    // Fill the edit form
    const fPhone   = document.getElementById('prof-phone');
    const fAddress = document.getElementById('prof-address');
    const fCity    = document.getElementById('prof-city');
    const fState   = document.getElementById('prof-state');
    const fCountry = document.getElementById('prof-country');
    const fBio     = document.getElementById('prof-bio');
    const fDob     = document.getElementById('prof-dob');

    if (fPhone) fPhone.value = prof.phoneNumber || '';
    if (fAddress) fAddress.value = prof.address || '';
    if (fCity) fCity.value = prof.city || '';
    if (fState) fState.value = prof.state || '';
    if (fCountry) fCountry.value = prof.country || '';
    if (fBio) fBio.value = prof.bio || '';
    if (fDob && prof.dob) fDob.value = prof.dob.split('T')[0];
}

function renderActivities(acts) {
    const { donations = [], applications = [] } = acts;

    // Calculate metrics
    let totalDonated = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const mDonated = document.getElementById('metric-donated');
    const mEvents = document.getElementById('metric-events');
    const mHours = document.getElementById('metric-hours');

    if (mDonated) {
        mDonated.textContent = totalDonated >= 1000 
            ? '₦' + (totalDonated / 1000).toFixed(totalDonated % 1000 === 0 ? 0 : 1) + 'k' 
            : '₦' + totalDonated;
    }
    if (mEvents) mEvents.textContent = applications.length; // rough mockup
    if (mHours) mHours.textContent = (applications.length * 4) + 'hrs'; // rough mockup

    // Build mixed activity timeline
    const all = [];
    donations.forEach(d => {
        all.push({ type: 'donation', date: new Date(d.createdAt), item: d });
    });
    applications.forEach(a => {
        all.push({ type: 'volunteer', date: new Date(a.createdAt), item: a });
    });

    all.sort((a, b) => b.date - a.date);

    const listEl = document.getElementById('activity-list');
    if (!listEl) return;

    if (all.length === 0) {
        listEl.innerHTML = `<div style="font-size:13px;color:var(--muted);padding:14px 0;">No recent activity yet.</div>`;
        return;
    }

    listEl.innerHTML = all.slice(0, 6).map((x, i) => {
        const isLast = i === all.length - 1 || i === 5;
        const dStr = x.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        let colorClass = 'blue';
        let msgHtml = '';

        if (x.type === 'donation') {
            colorClass = 'green';
            msgHtml = `Donated <strong>₦${(x.item.amount || 0).toLocaleString()}</strong> to ${x.item.program || 'General Fund'}`;
        } else {
            colorClass = 'gold';
            msgHtml = `Applied to volunteer for <strong>${x.item.preferredProgram || 'AWEDI'}</strong>`;
        }

        return `
        <div class="act-item">
            <div class="act-dot-c">
                <div class="act-d ${colorClass}"></div>
                ${!isLast ? '<div class="act-line"></div>' : ''}
            </div>
            <div>
                <div class="act-msg">${msgHtml}</div>
                <div class="act-time">${dStr}</div>
            </div>
        </div>`;
    }).join('');
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    const btn = document.getElementById('prof-submit-btn');

    const payload = {
        phoneNumber: document.getElementById('prof-phone')?.value?.trim(),
        dob: document.getElementById('prof-dob')?.value || undefined,
        address: document.getElementById('prof-address')?.value?.trim(),
        city: document.getElementById('prof-city')?.value?.trim(),
        state: document.getElementById('prof-state')?.value?.trim(),
        country: document.getElementById('prof-country')?.value?.trim(),
        bio: document.getElementById('prof-bio')?.value?.trim()
    };

    if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

    try {
        const res = await fetch(`${apiUrl}/users/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to update profile.');
        }

        const updatedProfile = await res.json();
        renderProfileData(updatedProfile);

        if (typeof toast === 'function') toast('success', 'Saved!', 'Your profile has been successfully updated.', '✅');

    } catch (err) {
        console.error('[Profile Update] Error:', err);
        if (typeof toast === 'function') toast('error', 'Update Failed', err.message || 'Please try again.', '❌');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Save Changes'; }
    }
}
