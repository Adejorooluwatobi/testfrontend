/**
 * NGO Frontend — Donation Page Dynamic Integration (v2.1.1)
 * Renders donation options and impact data from DUMMY_DATA.donation.
 */

let _currentAmount = 5000;

function _pickAmount(btn, val) {
    document.querySelectorAll('.donate-amt-btn').forEach(b => {
        b.classList.remove('sel');
        b.style.color = 'var(--text)';
        b.style.borderColor = 'var(--border)';
        b.style.background = 'var(--surface2)';
    });
    btn.classList.add('sel');
    btn.style.color = '';
    btn.style.borderColor = '';
    btn.style.background = '';
    
    _currentAmount = val;
    const row = document.getElementById('donate-custom-row');
    if (row) row.style.display = val === 'custom' ? 'block' : 'none';
    
    // Update button text
    const sBtn = document.getElementById('donate-submit-btn');
    if (sBtn) {
        const displayVal = val === 'custom' ? '...' : ('₦' + val.toLocaleString());
        sBtn.textContent = `Complete Donation — ${displayVal} →`;
    }
}

function renderDonate(data) {
    const defaults = (window.DUMMY_DATA && window.DUMMY_DATA.donation) ? window.DUMMY_DATA.donation : {};
    const d = data || defaults;

    // Banner
    const tit = document.getElementById('donate-banner-title');
    const desc = document.getElementById('donate-banner-desc');
    const hdr = document.getElementById('donate-banner-header');
    if (tit) tit.textContent = d.banner?.title || d.title || 'Make a Donation 💚';
    if (desc) desc.textContent = d.banner?.description || d.description || '';
    if (hdr) hdr.textContent = d.banner?.header || 'Choose Your Impact';

    // Suggested Amounts (from API: choose.suggestedAmounts OR legacy: amounts)
    const amounts = d.choose?.suggestedAmounts || d.suggestedAmounts || d.amounts || [2500, 5000, 10000, 25000, 50000];
    const defaultSel = amounts[1] || amounts[0];
    _currentAmount = defaultSel;
    const grid = document.getElementById('donate-amounts-grid');
    if (grid) {
        grid.innerHTML = amounts.map(a => `
            <button class="donate-amt-btn ${a === defaultSel ? 'sel' : ''}" 
                    style="${a !== defaultSel ? 'color:var(--text);border-color:var(--border);background:var(--surface2);' : ''}" 
                    onclick="_pickAmount(this, ${a})">₦${Number(a).toLocaleString()}</button>
        `).join('') + `<button class="donate-amt-btn" style="color:var(--text);border-color:var(--border);background:var(--surface2);" onclick="_pickAmount(this, 'custom')">Custom ✍️</button>`;
        const sBtn = document.getElementById('donate-submit-btn');
        if (sBtn) sBtn.textContent = `Complete Donation — ₦${Number(defaultSel).toLocaleString()} →`;
    }

    // Programs dropdown (from API: choose.programs)
    const progSelect = document.getElementById('donate-program-select');
    if (progSelect && Array.isArray(d.choose?.programs) && d.choose.programs.length > 0) {
        progSelect.innerHTML = ['General Fund (Recommended)', ...d.choose.programs].map(p => `<option>${p}</option>`).join('');
    }

    // Addition callouts (from API: addition[])
    const impactCol = document.getElementById('donate-addition-col');
    // Check for new `addition` array first, then fall back to legacy `impacts`
    const additionItems = d.addition || d.impacts;
    if (impactCol && Array.isArray(additionItems) && additionItems.length > 0) {
        impactCol.innerHTML = additionItems.map(item => {
            // New format: { header, description } | Legacy format: { icon, text }
            if (item.header !== undefined) {
                const lines = (item.description || '').split('\n').filter(l => l.trim());
                const descHtml = lines.length > 0
                    ? lines.map(l => `<div style="font-size:13px;color:var(--muted);line-height:1.9;padding:2px 0;">${l}</div>`).join('')
                    : '';
                return `
                <div style="padding:12px 14px;background:linear-gradient(135deg,rgba(30,92,58,.08),rgba(192,82,42,.06));border-radius:10px;border:1px solid var(--border);margin-bottom:10px;">
                    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">${item.header}</div>
                    ${descHtml}
                </div>`;
            }
            return `<div style="display:flex;gap:10px;align-items:center;font-size:13.5px;margin-bottom:10px;"><span style="font-size:20px;">${item.icon || '💡'}</span><span>${item.text || ''}</span></div>`;
        }).join('');
    }

    // Impact Cards (from API: card[])
    const cardCol = document.getElementById('donate-cards-col');
    const cards = d.card || [];
    if (cardCol && cards.length > 0) {
        cardCol.innerHTML = cards.map(c => {
            const pct = Number(c.progress) || 0;
            const raised = Number(c.amountRaised) || 0;
            const goal = Number(c.annualGoal) || 0;
            const metricsHtml = Array.isArray(c.items) && c.items.length > 0
                ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:8px;margin-top:12px;">
                    ${c.items.map(item => `
                        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center;">
                            <div style="font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--accent);">${item.figure || ''}</div>
                            <div style="font-size:10px;color:var(--muted);">${item.details || ''}</div>
                        </div>`).join('')}
                  </div>` : '';
            return `
            <div class="card card-pad" style="margin-bottom:14px;">
                <h4 style="font-family:'Playfair Display',serif;font-size:15px;margin-bottom:12px;">${c.header || 'Funding Progress'}</h4>
                <div style="margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:5px;">
                        <span>${goal > 0 ? 'Annual Goal: ₦' + goal.toLocaleString() : 'Progress'}</span>
                        <span style="font-weight:700;color:var(--accent);">${pct}%</span>
                    </div>
                    <div style="background:var(--surface2);border-radius:20px;height:10px;overflow:hidden;">
                        <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:20px;"></div>
                    </div>
                    ${raised > 0 && goal > 0 ? `<div style="font-size:12px;color:var(--muted);margin-top:5px;">₦${raised.toLocaleString()} raised of ₦${goal.toLocaleString()} goal</div>` : ''}
                </div>
                ${metricsHtml}
            </div>`;
        }).join('');
    } else if (cardCol && d.progress) {
        // Legacy fallback
        const p = d.progress;
        cardCol.innerHTML = `
            <div class="card card-pad" style="margin-bottom:14px;">
                <h4 style="font-family:'Playfair Display',serif;font-size:15px;margin-bottom:12px;">2025 Funding Progress</h4>
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:5px;"><span>${p.goalLabel || ''}</span><span style="font-weight:700;color:var(--accent);">${p.percent}%</span></div>
                <div style="background:var(--surface2);border-radius:20px;height:10px;overflow:hidden;"><div style="width:${p.percent}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:20px;"></div></div>
                <div style="font-size:12px;color:var(--muted);margin-top:5px;">₦${Number(p.current).toLocaleString()} raised of ₦${Number(p.target).toLocaleString()} goal</div>
                <div style="display:flex;gap:10px;margin-top:12px;">
                    <div style="flex:1;background:var(--surface2);border-radius:9px;padding:11px;text-align:center;"><div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--accent);">${p.donors}</div><div style="font-size:11px;color:var(--muted);">Donors</div></div>
                    <div style="flex:1;background:var(--surface2);border-radius:9px;padding:11px;text-align:center;"><div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--terra);">${p.avgDonation}</div><div style="font-size:11px;color:var(--muted);">Avg Donation</div></div>
                </div>
            </div>`;
    }

    // Bank Accounts (from API: details[])
    const bankCol = document.getElementById('donate-details-col');
    const bankDetails = d.details;
    if (bankCol && Array.isArray(bankDetails) && bankDetails.length > 0) {
        bankCol.innerHTML = bankDetails.map(b => `
            <div class="card card-pad" style="background:var(--surface2);margin-bottom:14px;">
                ${b.header ? `<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--accent);margin-bottom:10px;">${b.header}</div>` : ''}
                <div style="font-size:13px;color:var(--muted);line-height:2;">
                    ${b.accountname ? `<div><strong style="color:var(--text);">Account Name:</strong> ${b.accountname}</div>` : ''}
                    ${b.bank ? `<div><strong style="color:var(--text);">Bank:</strong> ${b.bank}</div>` : ''}
                    ${b.accountno ? `<div><strong style="color:var(--text);">Account No:</strong> <span style="font-size:15px;font-weight:700;color:var(--text);letter-spacing:1px;">${b.accountno}</span></div>` : ''}
                    ${b.text ? `<div style="margin-top:8px;font-size:12px;opacity:.8;">${b.text}</div>` : ''}
                </div>
            </div>`).join('');
    } else if (bankCol && d.bank) {
        // Legacy string fallback
        bankCol.innerHTML = `<div class="card card-pad" style="background:var(--surface2);margin-bottom:14px;"><div style="font-size:13px;color:var(--muted);line-height:1.8;"><strong style="color:var(--text);">Bank Transfer:</strong><br/>${d.bank}</div></div>`;
    }
}

async function initDonate() {
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';
    try {
        const res = await fetch(`${apiUrl}/donation`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('No donation endpoint');
        const data = await res.json();
        renderDonate(Array.isArray(data) ? data[0] : data);
    } catch (e) {
        console.warn('[Donate] Backend fallback. Applying mock delay (500ms)...');
        setTimeout(() => {
            renderDonate(null);
            console.log('[Donate] Local dummy data loaded.');
        }, 500);
    }
}

window.initDonate = initDonate;
window._pickAmount = _pickAmount;
