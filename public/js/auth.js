// auth.js — Session management utilities for JK Labs

function getUser() {
    const data = localStorage.getItem('protonest_user');
    return data ? JSON.parse(data) : null;
}

function isLoggedIn() {
    return !!getUser();
}

function logout() {
    localStorage.removeItem('protonest_user');
    window.location.href = 'index.html';
}

// Update header to show user state
function updateAuthHeader() {
    const container = document.querySelector('.header-actions');
    if (!container) return;

    const user = getUser();
    if (user) {
        container.innerHTML = `
            <span style="color: #FF9900; font-weight: 600; margin-right: 12px; font-size: 14px;">Hi, ${user.name.split(' ')[0]}</span>
            <a href="javascript:void(0)" onclick="logout()" style="color: #ccc; font-size: 13px; margin-right: 15px; text-decoration: underline;">Logout</a>
            <a href="cart.html" style="color: white; font-weight: bold;">
                Cart <span class="cart-count">(0)</span>
            </a>
        `;
    } else {
        container.innerHTML = `
            <a href="login.html" class="btn btn-primary" style="margin-right: 15px;">Sign In</a>
            <a href="cart.html" style="color: white; font-weight: bold;">
                Cart <span class="cart-count">(0)</span>
            </a>
        `;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateAuthHeader);
