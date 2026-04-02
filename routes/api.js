const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { sendWhatsAppMessage, sendCustomerWhatsApp, sendAdminWhatsApp } = require('../services/whatsapp');

// ==================== EMAIL & NOTIFICATION CONFIG ====================
const ADMIN_EMAIL = 'chjagadeesh.gdvl@gmail.com';
const ADMIN_PHONE = '916303228967';

const RESEND_API_KEY = 're_9N6LKo7i_FUMHrnCEKy2Mk919zTWVaWdm';

async function sendResendEmail(to, subject, html) {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'ProtoNest by JK Labs <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                html: html
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || JSON.stringify(data));
        }
        return data;
    } catch (err) {
        throw new Error('Resend API Error: ' + err.message);
    }
}

function formatINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Background Task Wrapper to prevent Unhandled Rejections bubbling
function runBackground(promise, name) {
    promise.catch(err => console.error(`[Background Error in ${name}]:`, err.message));
}

async function sendCustomerEmail(order, customer) {
    try {
        const subject = `Order Confirmed! 🎉 Your ProtoNest Order #${order.id}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
                <div style="background: #1D1D1F; padding: 20px; text-align: center;">
                    <h1 style="color: #0071E3; margin: 0;">Proto<span style="color: #fff;">Nest</span></h1>
                    <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 12px;">by JK Labs</p>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #34C759;">✅ Order Placed Successfully!</h2>
                    <p>Hi <strong>${customer.name}</strong>,</p>
                    <p>Thank you for shopping with ProtoNest! Your order has been confirmed.</p>
                    <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Date:</strong> ${order.date || new Date().toLocaleString()}</p>
                        <p><strong>Payment:</strong> ${order.payment}</p>
                        <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
                    </div>
                    <h3>📦 Items Ordered:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${order.items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 0;">${item.name} × ${item.quantity}</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${formatINR(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                        <tr style="border-top: 2px solid #1D1D1F;">
                            <td style="padding: 10px 0; font-weight: bold; font-size: 18px;">Total</td>
                            <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #FF3B30;">${formatINR(order.total)}</td>
                        </tr>
                    </table>
                    <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>📍 Delivery Address:</strong></p>
                        <p>${customer.address}</p>
                    </div>
                    <p style="text-align: center; color: #565959; font-size: 12px; margin-top: 30px;">
                        © 2026 ProtoNest by JK Labs. All rights reserved.
                    </p>
                </div>
            </div>
        `;
        await sendResendEmail(customer.email, subject, html);
        console.log('✅ Customer email sent to:', customer.email);
    } catch (err) {
        console.error('❌ Failed to send customer email to', customer.email, ':', err.message);
    }
}

async function sendAdminEmail(order, customer) {
    try {
        const subject = `🔔 New Order: #${order.id} from ${customer.name} — ${formatINR(order.total)}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
                <div style="background: #FF3B30; padding: 15px; text-align: center;">
                    <h2 style="color: #fff; margin: 0;">🔔 NEW ORDER RECEIVED</h2>
                </div>
                <div style="padding: 25px;">
                    <h3>Order #${order.id}</h3>
                    <p><strong>Date:</strong> ${order.date || new Date().toLocaleString()}</p>
                    <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0071E3;">
                        <h4 style="margin-top: 0;">👤 Customer Details</h4>
                        <p><strong>Name:</strong> ${customer.name}</p>
                        <p><strong>Phone:</strong> ${customer.phone}</p>
                        <p><strong>Email:</strong> ${customer.email}</p>
                        <p><strong>Address:</strong> ${customer.address}</p>
                        ${customer.notes ? `<p><strong>Notes:</strong> ${customer.notes}</p>` : ''}
                    </div>
                    <h4>📦 Items:</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${order.items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 8px 0;">${item.name} × ${item.quantity}</td>
                                <td style="padding: 8px 0; text-align: right;">${formatINR(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                        <tr style="border-top: 2px solid #333;">
                            <td style="padding: 10px 0; font-weight: bold; font-size: 18px;">Total</td>
                            <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #FF3B30;">${formatINR(order.total)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        `;
        await sendResendEmail(ADMIN_EMAIL, subject, html);
        console.log('✅ Admin email notification sent');
    } catch (err) {
        console.error('❌ Failed to send admin email:', err.message);
    }
}

// ==================== PRODUCTS ====================
router.get('/products', (req, res) => {
    try {
        const db = getDb();
        const { category, platform, sub_category, search, sort, min_price, max_price } = req.query;
        
        let query = 'SELECT * FROM products WHERE 1=1';
        let params = [];

        if (category) { query += ' AND category = ?'; params.push(category); }
        if (platform) { query += ' AND platform = ?'; params.push(platform); }
        if (sub_category) { query += ' AND sub_category = ?'; params.push(sub_category); }
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (min_price) { query += ' AND price >= ?'; params.push(Number(min_price)); }
        if (max_price) { query += ' AND price <= ?'; params.push(Number(max_price)); }

        if (sort === 'price_asc') query += ' ORDER BY price ASC';
        else if (sort === 'price_desc') query += ' ORDER BY price DESC';
        else if (sort === 'rating') query += ' ORDER BY rating DESC';
        else if (sort === 'newest') query += ' ORDER BY created_at DESC';
        else query += ' ORDER BY rating_count DESC';

        const rows = db.prepare(query).all(...params);
        
        rows.forEach(r => {
            try { r.features = JSON.parse(r.features); } catch(e) { r.features = []; }
        });

        res.json({ count: rows.length, products: rows });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.get('/products/:id', (req, res) => {
    try {
        const product = getDb().prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        try { product.features = JSON.parse(product.features); } catch(e) { product.features = []; }
        res.json(product);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

// ==================== GUEST PLACE ORDER (with email + WhatsApp notifications) ====================
router.post('/place-order', (req, res) => {
    try {
        const { items, customer } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order.' });
        if (!customer || !customer.name || !customer.phone || !customer.email || !customer.address) {
            return res.status(400).json({ error: 'Customer details are required.' });
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderId = 'EM-' + Math.floor(10000 + Math.random() * 90000) + '-' + Math.floor(1000 + Math.random() * 9000);
        const coins = Math.floor(total / 10);
        
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 4);
        const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const orderDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

        const order = { id: orderId, items, total, payment: 'Cash on Delivery', estimatedDelivery, date: orderDate, coins };

        getDb().prepare(`
            INSERT INTO orders (id, user_id, items, total, status, delivery_address, payment_method, coins_earned, estimated_delivery, customer_name, customer_phone, customer_email, customer_notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(orderId, 'guest', JSON.stringify(items), total, 'Order Placed', customer.address, 'Cash on Delivery', coins, estimatedDelivery, customer.name, customer.phone, customer.email, customer.notes || '', new Date().toISOString());

        // Send notifications via Email and WhatsApp (fire-and-forget)
        runBackground(sendCustomerEmail(order, customer), 'Customer Order Email');
        runBackground(sendAdminEmail(order, customer), 'Admin Order Email');
        runBackground(sendCustomerWhatsApp(order, customer), 'Customer WhatsApp');
        runBackground(sendAdminWhatsApp(order, customer), 'Admin WhatsApp');

        res.status(201).json({
            message: 'Order placed successfully!',
            order,
            customer: { name: customer.name, phone: customer.phone, email: customer.email, address: customer.address }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error placing order.' });
    }
});

// ==================== WHATSAPP STATUS ====================
router.get('/whatsapp/status', (req, res) => {
    try {
        const { getWhatsAppStatus } = require('../services/whatsapp');
        const ready = typeof getWhatsAppStatus === 'function' ? getWhatsAppStatus() : false;
        res.json({ ready });
    } catch (err) { res.json({ ready: false, error: err.message }); }
});

// ==================== HEALTH CHECK ====================
router.get('/health', (req, res) => {
    try {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()) + 's',
            memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
            database: 'unknown',
            email: 'Resend API Ready',
            whatsapp: 'unknown',
            products: 0,
            node_version: process.version
        };
        
        try {
            const db = getDb();
            const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
            health.database = 'connected';
            health.products = prodCount.count;
        } catch (err) {
            health.database = 'error: ' + err.message;
            health.status = 'degraded';
        }
        
        try {
            const { getWhatsAppStatus } = require('../services/whatsapp');
            health.whatsapp = getWhatsAppStatus() ? 'connected' : 'disconnected';
        } catch (err) {
            health.whatsapp = 'error: ' + err.message;
        }
        
        return res.json(health);
    } catch (err) {
        return res.status(500).json({ error: 'Health check failed: ' + err.message });
    }
});

module.exports = router;
