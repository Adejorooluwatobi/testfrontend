/**
 * NGO Frontend — Authentication Integration
 * Handles User Sign Up (POST /api/users/register) and Sign In (POST /api/users/login)
 */

async function handleSignUp(e) {
    e.preventDefault();
    const btn = document.getElementById('signup-submit-btn');
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';

    const fname = document.getElementById('signup-fname').value.trim();
    const lname = document.getElementById('signup-lname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-pass').value;

    const username = fname + ' ' + lname;

    if (!username || !email || !pass) {
        if (typeof toast === 'function') toast('warn', 'Missing Fields', 'Please fill out all required fields.', '⚠️');
        return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Joining...'; }

    try {
        const res = await fetch(`${apiUrl}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password: pass })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status} - Registration failed.`);
        }

        const data = await res.json();
        
        // Optionally save user info to localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.id,
            name: data.username,
            email: data.email,
            role: 'Supporter'
        }));

        if (typeof toast === 'function') toast('success', 'Welcome!', 'Account created successfully. Taking you to your dashboard...', '🎉');
        setTimeout(() => window.location.href = 'profile.html', 1500);

    } catch (err) {
        console.error('[SignUp] Error:', err);
        if (typeof toast === 'function') toast('error', 'Registration Failed', err.message || 'Please try again.', '❌');
        if (btn) { btn.disabled = false; btn.textContent = 'Join Us →'; }
    }
}

async function handleSignIn(e) {
    e.preventDefault();
    const btn = document.getElementById('signin-submit-btn');
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:5000/api';

    const email = document.getElementById('signin-email').value.trim();
    const pass = document.getElementById('signin-pass').value;

    if (!email || !pass) {
        if (typeof toast === 'function') toast('warn', 'Missing Fields', 'Please enter your email and password.', '⚠️');
        return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Signing In...'; }

    try {
        const res = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Invalid credentials or login failed.');
        }

        const data = await res.json();
        
        // Save user info + JWT token to localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.id,
            name: data.username,
            email: data.email,
            role: 'Supporter'
        }));

        if (typeof toast === 'function') toast('success', 'Signed In!', 'Redirecting to your profile...', '🔓');
        setTimeout(() => window.location.href = 'profile.html', 1500);

    } catch (err) {
        console.error('[SignIn] Error:', err);
        if (typeof toast === 'function') toast('error', 'Login Failed', err.message || 'Please check your credentials.', '❌');
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In →'; }
    }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);

    const signinForm = document.getElementById('signin-form');
    if (signinForm) signinForm.addEventListener('submit', handleSignIn);
});
