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

    if (tit) tit.textContent = d.title;
    if (desc) desc.textContent = d.description;
    if (off) off.textContent = d.office;
    if (ph) ph.innerHTML = d.phone;
    if (em) em.innerHTML = d.email;
}

async function initContact() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/contact`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('No contact endpoint');
        const data = await res.json();
        renderContact(Array.isArray(data) ? data[0] : data);
    } catch (e) {
        console.warn('[Contact] Backend fallback. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderContact(null);
            console.log('[Contact] Local dummy data loaded.');
        }, 500);
    }
}

// Form Submission Implementation (Mock)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contact-submit-btn');
            if (btn) btn.disabled = true;
            
            if (typeof toast === 'function') {
                toast('info', 'Sending Message...', 'Connecting to server...', '✉️');
            }

            // Simulated API call
            setTimeout(() => {
                if (btn) btn.disabled = false;
                if (typeof toast === 'function') {
                    toast('success', 'Message Sent!', 'We\'ve received your message and will respond soon.', '🚀');
                }
                form.reset();
            }, 1500);
        };
    }
});

window.initContact = initContact;
