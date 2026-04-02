// auth.js — Stripped: No account system. Cart-count only.
function updateCartCount() {
    const count = typeof getCartCount === 'function' ? getCartCount() : 0;
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}
document.addEventListener('DOMContentLoaded', updateCartCount);
