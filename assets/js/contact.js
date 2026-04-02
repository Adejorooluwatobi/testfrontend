/**
 * NGO Frontend — Contact Page Dynamic Integration (v2.1.1)
 * Renders contact info from DUMMY_DATA.contact and handles form submission.
 */

function renderContact(data) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.contact) ? window.DUMMY_DATA.contact : {};
    const d = data || defaults;

    const tit = document.getElementById('contact-title');
    const desc = document.getElementById('contact-desc');
    const off = document.getElementById('contact-office');
    const ph = document.getElementById('contact-phone');
    const em = document.getElementById('contact-email');

    if (tit) tit.textContent = d.title || 'Get In Touch ✉️';
    if (desc) desc.textContent = d.description || '';

    // Handle real API structure `contactInformation` or fallback to dummy
    if (d.contactInformation) {
        const info = d.contactInformation;
        if (off) off.innerHTML = (info.ourOffice && info.ourOffice.length) ? info.ourOffice.join('<br/>') : 'No office address.';
        if (ph) ph.innerHTML = (info.phoneNumbers && info.phoneNumbers.length) ? info.phoneNumbers.join('<br/>') : 'No phone listed.';
        if (em) em.innerHTML = (info.emailAddress && info.emailAddress.length) ? info.emailAddress.join('<br/>') : 'No email listed.';
    } else {
        // Fallback for dummy-data.js structure
        if (off) off.textContent = d.office || '...';
        if (ph) ph.innerHTML = d.phone || '...';
        if (em) em.innerHTML = d.email || '...';
    }
}

async function initContact() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/contact`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Backend returns single object but check for array just in case
        renderContact(Array.isArray(data) ? data[0] : data);
    } catch (e) {
        console.warn('[Contact] Backend fallback. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderContact(null);
            console.log('[Contact] Local dummy data loaded.');
        }, 500);
    }
}

// REAL Consultation Submission Implementation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
            const btn = document.getElementById('contact-submit-btn');
            
            // Gather field values
            const payload = {
                firstname: document.getElementById('contact-fname')?.value,
                lastname: document.getElementById('contact-lname')?.value,
                email: document.getElementById('contact-email-input')?.value,
                phonenumber: document.getElementById('contact-phone-input')?.value,
                subject: document.getElementById('contact-subject')?.value,
                message: document.getElementById('contact-message')?.value
            };

            if (btn) btn.disabled = true;
            if (typeof toast === 'function') {
                toast('info', 'Sending Message...', 'Please wait as we connect to our server.', '✉️');
            }

            try {
                const res = await fetch(`${apiUrl}/consultation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error('Failed to submit message.');

                if (typeof toast === 'function') {
                    toast('success', 'Message Sent!', 'Your message has been received! We will reach out within 24 hours.', '🚀');
                }
                form.reset();
            } catch (err) {
                console.error('[Contact] Submission error:', err);
                if (typeof toast === 'function') {
                    toast('error', 'Submission Failed', err.message || 'There was a problem sending your message.', '❌');
                }
            } finally {
                if (btn) btn.disabled = false;
            }
        };
    }
});

window.initContact = initContact;

