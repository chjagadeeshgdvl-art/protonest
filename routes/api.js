const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { getDb } = require('../database/db');
const { sendWhatsAppMessage, sendCustomerWhatsApp, sendAdminWhatsApp } = require('../services/whatsapp');

// ==================== EMAIL & NOTIFICATION CONFIG ====================
const ADMIN_EMAIL = 'chjagadeesh.gdvl@gmail.com';
const ADMIN_PHONE = '916303228967'; 

let transporter = null;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ADMIN_EMAIL,
            pass: 'gfuz bafd thps hyxc'
        }
    });
    transporter.verify((error) => {
        if (error) console.error('❌ Email transporter verification failed:', error.message);
        else console.log('✅ Email transporter verified and ready to send!');
    });
} catch (err) {
    console.warn('⚠️ Email transporter setup failed:', err.message);
}

function formatINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Background Task Wrapper to prevent Unhandled Rejections bubbling
function runBackground(promise, name) {
    promise.catch(err => console.error(`[Background Error in ${name}]:`, err.message));
}

async function sendCustomerEmail(order, customer) {
    if (!transporter) { console.warn('⚠️ Email transporter not available — skipping customer email'); return; }
    try {
        const mailOptions = {
            from: `"ProtoNest by JK Labs" <${ADMIN_EMAIL}>`,
            to: customer.email,
            subject: `Order Confirmed! 🎉 Your ProtoNest Order #${order.id}`,
            html: `
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
            `
        };
        await transporter.sendMail(mailOptions);
        console.log('✅ Customer email sent to:', customer.email);
    } catch (err) {
        console.error('❌ Failed to send customer email to', customer.email, ':', err.message);
    }
}

async function sendAdminEmail(order, customer) {
    if (!transporter) { console.warn('⚠️ Email transporter not available — skipping admin email'); return; }
    try {
        const mailOptions = {
            from: `"ProtoNest Orders" <${ADMIN_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `🔔 New Order: #${order.id} from ${customer.name} — ${formatINR(order.total)}`,
            html: `
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
            `
        };
        await transporter.sendMail(mailOptions);
        console.log('✅ Admin email notification sent');
    } catch (err) {
        console.error('❌ Failed to send admin email:', err.message);
    }
}

// ==================== AUTH ====================
const otpStore = new Map();

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp, name) {
    if (!transporter) { console.warn('⚠️ Email transporter not available — OTP email not sent to', email); return; }
    try {
        await transporter.sendMail({
            from: `"ProtoNest by JK Labs" <${ADMIN_EMAIL}>`,
            to: email,
            subject: `🔐 Your ProtoNest Verification Code: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #1D1D1F, #2C2C2E); padding: 24px; text-align: center;">
                        <h1 style="color: #0071E3; margin: 0; font-size: 22px;">Proto<span style="color: #fff;">Nest</span></h1>
                    </div>
                    <div style="padding: 32px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔐</div>
                        <h2 style="color: #1D1D1F; margin: 0 0 8px;">Email Verification</h2>
                        <p style="color: #6E6E73; margin: 0 0 24px;">Hi <strong>${name}</strong>, use the code below to verify your account</p>
                        <div style="background: #F5F5F7; padding: 16px 24px; border-radius: 12px; display: inline-block; margin-bottom: 24px;">
                            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1D1D1F;">${otp}</span>
                        </div>
                        <p style="color: #86868B; font-size: 13px;">This code expires in 5 minutes. Do not share it with anyone.</p>
                    </div>
                    <div style="background: #F5F5F7; padding: 16px; text-align: center;">
                        <p style="color: #86868B; font-size: 11px; margin: 0;">© 2026 ProtoNest by JK Labs</p>
                    </div>
                </div>
            `
        });
        console.log('✅ OTP email sent to:', email);
    } catch (err) {
        console.error('❌ Failed to send OTP email to', email, ':', err.message);
    }
}

async function sendOtpWhatsAppAction(phone, otp, name) {
    const customerPhone = '91' + phone;
    const msg = `🔐 *JK Labs Verification*\n\nHi *${name}*, your WhatsApp verification code is:\n\n*${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`;
    await sendWhatsAppMessage(customerPhone, msg);
}

router.post('/auth/register', (req, res) => {
    try {
        const { name, email, phone, password, address, city, state, pincode } = req.body;
        if (!name || !email || !phone || !password || !address || !city || !state || !pincode) return res.status(400).json({ error: 'All fields are required.' });
        if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ error: 'Invalid phone number.' });
        
        const db = getDb();
        const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingEmail) return res.status(409).json({ error: 'Email already registered.' });
        const existingPhone = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
        if (existingPhone) return res.status(409).json({ error: 'Phone number already registered.' });

        const id = uuidv4();
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        db.prepare(`
            INSERT INTO users (id, name, email, phone, password, address, city, state, pincode, verified, coins, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, name, email, phone, hashedPassword, address, city, state, pincode, 0, 100, new Date().toISOString());

        const emailOtp = generateOtp();
        const phoneOtp = generateOtp();
        otpStore.set(email, { emailOtp, phoneOtp, expiresAt: Date.now() + 5 * 60 * 1000 });

        runBackground(sendOtpEmail(email, emailOtp, name), 'OTP Email');
        runBackground(sendOtpWhatsAppAction(phone, phoneOtp, name), 'OTP WhatsApp');

        res.status(201).json({ message: 'OTPs sent! Check your email and WhatsApp.', email });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.post('/auth/verify-otp', (req, res) => {
    try {
        const { email, emailOtp, phoneOtp } = req.body;
        if (!email || !emailOtp || !phoneOtp) return res.status(400).json({ error: 'Both OTPs are required.' });

        const stored = otpStore.get(email);
        if (!stored) return res.status(400).json({ error: 'No OTP found. Please register again.' });
        if (Date.now() > stored.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTPs expired. Please resend.' });
        }
        if (stored.emailOtp !== emailOtp) return res.status(400).json({ error: 'Incorrect email OTP.' });
        if (stored.phoneOtp !== phoneOtp) return res.status(400).json({ error: 'Incorrect WhatsApp OTP.' });

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        db.prepare('UPDATE users SET verified = 1 WHERE id = ?').run(user.id);
        otpStore.delete(email);

        res.json({
            message: 'Account verified successfully! 🎉',
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, coins: user.coins }
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.post('/auth/resend-otp', (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required.' });

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        if (user.verified) return res.status(400).json({ error: 'Account already verified.' });

        const emailOtp = generateOtp();
        const phoneOtp = generateOtp();
        otpStore.set(email, { emailOtp, phoneOtp, expiresAt: Date.now() + 5 * 60 * 1000 });

        runBackground(sendOtpEmail(email, emailOtp, user.name), 'OTP Email');
        runBackground(sendOtpWhatsAppAction(user.phone, phoneOtp, user.name), 'OTP WhatsApp');

        res.json({ message: 'OTPs resent! Check your email and WhatsApp.' });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.post('/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        
        if (!user) return res.status(401).json({ error: 'No account found with this email.' });
        if (!user.verified) return res.status(403).json({ error: 'Account not verified. Please verify your OTPs first.' });
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Incorrect password.' });

        res.json({
            message: 'Login successful!',
            user: {
                id: user.id, name: user.name, email: user.email, phone: user.phone,
                address: user.address, city: user.city, state: user.state, pincode: user.pincode,
                coins: user.coins
            }
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.get('/auth/profile/:userId', (req, res) => {
    try {
        const user = getDb().prepare('SELECT * FROM users WHERE id = ?').get(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({
            id: user.id, name: user.name, email: user.email, phone: user.phone,
            address: user.address, city: user.city, state: user.state, pincode: user.pincode, coins: user.coins
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

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
        
        // Parse features JSON for each product
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

// ==================== CART ====================
router.get('/cart/:userId', (req, res) => {
    try {
        const db = getDb();
        const rows = db.prepare('SELECT c.id as cart_id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?').all(req.params.userId);
        
        let total = 0;
        const items = rows.map(r => {
            total += r.price * r.quantity;
            try { r.features = JSON.parse(r.features); } catch(e) { r.features = []; }
            return {
                id: r.cart_id, quantity: r.quantity, product_id: r.id, user_id: req.params.userId,
                product: { id: r.id, name: r.name, description: r.description, price: r.price, original_price: r.original_price, image: r.image_url, image_url: r.image_url, features: r.features, category: r.category, platform: r.platform }
            };
        });
        res.json({ items, total, count: items.length });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.post('/cart', (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const db = getDb();
        db.prepare(`
            INSERT INTO cart (id, user_id, product_id, quantity) 
            VALUES (?, ?, ?, ?) 
            ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + ?
        `).run(uuidv4(), user_id, product_id, quantity || 1, quantity || 1);
        
        res.json({ message: 'Item added to cart!' });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.delete('/cart/:cartId', (req, res) => {
    try {
        getDb().prepare('DELETE FROM cart WHERE id = ?').run(req.params.cartId);
        res.json({ message: 'Item removed from cart.' });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

// ==================== ORDERS ====================
router.post('/orders', (req, res) => {
    const db = getDb();
    try {
        const { user_id, delivery_address } = req.body;

        const cartItems = db.prepare('SELECT c.product_id, c.quantity, p.name, p.price, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?').all(user_id);
        if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty.' });

        const total = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const coinsEarned = Math.floor(total / 10);
        const orderId = 'EM-' + Math.floor(10000 + Math.random() * 90000) + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const estimated = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const tx = db.transaction(() => {
            // Insert order
            db.prepare(`
                INSERT INTO orders (id, user_id, items, total, status, delivery_address, payment_method, coins_earned, estimated_delivery, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(orderId, user_id, JSON.stringify(cartItems), total, 'Order Placed', delivery_address || 'Default Address', 'Cash on Delivery', coinsEarned, estimated, new Date().toISOString());
            
            // Add coins
            if (user_id !== 'guest') {
                db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(coinsEarned, user_id);
            }

            // Decrease stock
            const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
            for (const item of cartItems) {
                updateStock.run(item.quantity, item.product_id);
            }

            // Clear Cart
            db.prepare('DELETE FROM cart WHERE user_id = ?').run(user_id);
        });
        
        tx();

        const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        
        let customer = null;
        if (user_id !== 'guest') {
            const user = db.prepare('SELECT name, phone, email, address FROM users WHERE id = ?').get(user_id);
            if (user) {
                customer = {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    address: delivery_address || user.address
                };
            }
        }

        if (customer) {
            const orderForNotification = {
                id: orderId,
                date: dateStr,
                items: cartItems.map(c => ({ name: c.name, quantity: c.quantity, price: c.price })),
                total,
                payment: 'Cash on Delivery',
                estimatedDelivery: estimated
            };
            runBackground(sendCustomerEmail(orderForNotification, customer), 'Auth Customer Order Email');
            runBackground(sendAdminEmail(orderForNotification, customer), 'Auth Admin Order Email');
            runBackground(sendCustomerWhatsApp(orderForNotification, customer), 'Auth Customer WhatsApp');
            runBackground(sendAdminWhatsApp(orderForNotification, customer), 'Auth Admin WhatsApp');
        }
        res.status(201).json({
            message: 'Order placed successfully!',
            order: { id: orderId, total, coins_earned: coinsEarned, estimated_delivery: estimated, payment_method: 'Cash on Delivery' }
        });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.get('/orders/:userId', (req, res) => {
    try {
        const rows = getDb().prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.params.userId);
        rows.forEach(r => {
            try { r.items = JSON.parse(r.items); } catch(e) { r.items = []; }
        });
        res.json({ count: rows.length, orders: rows });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

// ==================== GUEST PLACE ORDER (with notifications) ====================
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

// ==================== WISHLIST ====================
router.get('/wishlist/:userId', (req, res) => {
    try {
        const db = getDb();
        const rows = db.prepare('SELECT w.id as wishlist_id, p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?').all(req.params.userId);
        
        const items = rows.map(r => {
            try { r.features = JSON.parse(r.features); } catch(e) { r.features = []; }
            return {
                id: r.wishlist_id, product_id: r.id, user_id: req.params.userId,
                product: { id: r.id, name: r.name, description: r.description, price: r.price, original_price: r.original_price, image: r.image_url, image_url: r.image_url, features: r.features, category: r.category, platform: r.platform }
            };
        });
        res.json({ count: items.length, items });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.post('/wishlist', (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const db = getDb();
        try {
            db.prepare('INSERT INTO wishlist (id, user_id, product_id, added_at) VALUES (?, ?, ?, ?)').run(uuidv4(), user_id, product_id, new Date().toISOString());
            res.json({ message: 'Added to wishlist!' });
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Already in wishlist.' });
            throw e;
        }
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.delete('/wishlist/:wishlistId', (req, res) => {
    try {
        getDb().prepare('DELETE FROM wishlist WHERE id = ?').run(req.params.wishlistId);
        res.json({ message: 'Removed from wishlist.' });
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

// ==================== USER ====================
router.get('/user/:id', (req, res) => {
    try {
        const user = getDb().prepare('SELECT id, name, email, coins, created_at FROM users WHERE id = ?').get(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

// ==================== WHATSAPP STATUS ====================
router.get('/whatsapp/status', (req, res) => {
    try {
        const { getWhatsAppStatus } = require('../services/whatsapp');
        // Handle cases where getWhatsAppStatus might not be loaded yet
        const ready = typeof getWhatsAppStatus === 'function' ? getWhatsAppStatus() : false;
        res.json({ ready });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
