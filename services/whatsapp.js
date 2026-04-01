let client = null;
let isReady = false;

// Initialize WhatsApp client — gracefully handles missing Chromium on cloud hosts
function initWhatsApp() {
    try {
        const { Client, LocalAuth } = require('whatsapp-web.js');
        const qrcode = require('qrcode-terminal');
        const fs = require('fs');
        const qrCodeLib = require('qrcode');

        const qrPath = './public/whatsapp-qr.png';

        client = new Client({
            authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process']
            }
        });

        client.on('qr', async (qr) => {
            console.log('\n📱 ======================================');
            console.log('📱  SCAN THE QR CODE AT http://localhost:3000/qr.html');
            console.log('📱 ======================================\n');
            qrcode.generate(qr, { small: true });

            try {
                await qrCodeLib.toFile(qrPath, qr, { scale: 8 });
            } catch (err) {
                console.error('Failed to generate QR image:', err);
            }
        });

        client.on('ready', () => {
            isReady = true;
            console.log('✅ WhatsApp client is ready and connected!');
            const fs = require('fs');
            if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);
        });

        client.on('authenticated', () => {
            console.log('🔐 WhatsApp authenticated successfully!');
        });

        client.on('auth_failure', (msg) => {
            console.error('❌ WhatsApp auth failed:', msg);
            isReady = false;
        });

        client.on('disconnected', (reason) => {
            console.log('📱 WhatsApp disconnected:', reason);
            isReady = false;
            // Auto-reconnect after 10 seconds
            setTimeout(() => {
                console.log('🔄 Attempting WhatsApp reconnection...');
                try {
                    client.initialize().catch(err => {
                        console.warn('⚠️ WhatsApp reconnection failed:', err.message);
                    });
                } catch (e) {
                    console.warn('⚠️ WhatsApp reconnection error:', e.message);
                }
            }, 10000);
        });

        client.initialize().catch(err => {
            console.warn('⚠️ WhatsApp client initialization failed (Chromium not available? Running on cloud host?):', err.message);
            console.warn('⚠️ WhatsApp notifications will be disabled. Server continues running normally.');
            client = null;
        });

    } catch (err) {
        console.warn('⚠️ WhatsApp module failed to load:', err.message);
        console.warn('⚠️ WhatsApp notifications disabled — server will continue without WhatsApp.');
        client = null;
        isReady = false;
    }
}

// Send a WhatsApp message to a phone number
// phone should be like '916303228967' (country code + number, no +)
async function sendWhatsAppMessage(phone, message) {
    if (!isReady || !client) {
        console.warn('⚠️ WhatsApp not ready — message not sent to', phone);
        return false;
    }

    try {
        const chatId = phone + '@c.us';
        await client.sendMessage(chatId, message);
        console.log('✅ WhatsApp message sent to:', phone);
        return true;
    } catch (err) {
        console.error('❌ WhatsApp send failed to', phone, ':', err.message);
        return false;
    }
}

// Helper: Format INR
function fmtINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Send order confirmation to customer via WhatsApp
async function sendCustomerWhatsApp(order, customer) {
    let msg = `🛒 *JK Labs — Order Confirmed!*\n\n`;
    msg += `Hi *${customer.name}*, your order has been placed successfully! 🎉\n\n`;
    msg += `📋 *Order ID:* ${order.id}\n`;
    msg += `📅 *Date:* ${order.date}\n\n`;
    msg += `📦 *Items Ordered:*\n`;
    order.items.forEach((item, i) => {
        msg += `  ${i + 1}. ${item.name} × ${item.quantity} = ${fmtINR(item.price * item.quantity)}\n`;
    });
    msg += `\n💰 *Total:* ${fmtINR(order.total)}\n`;
    msg += `💳 *Payment:* ${order.payment}\n`;
    msg += `🚚 *Estimated Delivery:* ${order.estimatedDelivery}\n\n`;
    msg += `Thank you for shopping with ProtoNest! ⚡\n`;
    msg += `For queries, contact us at ${process.env.ADMIN_PHONE || '6303228967'}`;

    const customerPhone = '91' + customer.phone.replace(/^(\+?91)/, '');
    return await sendWhatsAppMessage(customerPhone, msg);
}

// Send new order alert to admin via WhatsApp
async function sendAdminWhatsApp(order, customer) {
    let msg = `🔔 *NEW ORDER — JK Labs*\n\n`;
    msg += `📋 *Order ID:* ${order.id}\n`;
    msg += `📅 *Date:* ${order.date}\n\n`;
    msg += `👤 *Customer:* ${customer.name}\n`;
    msg += `📱 *Phone:* ${customer.phone}\n`;
    msg += `📧 *Email:* ${customer.email}\n`;
    msg += `📍 *Address:* ${customer.address}\n`;
    if (customer.notes) msg += `📝 *Notes:* ${customer.notes}\n`;
    msg += `\n📦 *Items:*\n`;
    order.items.forEach((item, i) => {
        msg += `  ${i + 1}. ${item.name} × ${item.quantity} = ${fmtINR(item.price * item.quantity)}\n`;
    });
    msg += `\n💰 *Total:* ${fmtINR(order.total)}\n`;
    msg += `💳 *Payment:* ${order.payment}\n`;
    msg += `🚚 *Delivery:* ${order.estimatedDelivery}`;

    return await sendWhatsAppMessage('916303228967', msg);
}

function getWhatsAppStatus() {
    return isReady;
}

module.exports = { initWhatsApp, sendWhatsAppMessage, sendCustomerWhatsApp, sendAdminWhatsApp, getWhatsAppStatus };
