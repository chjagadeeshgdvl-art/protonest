const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const fs = require('fs');
const qrCodeLib = require('qrcode');

let client = null;
let isReady = false;
const qrPath = './public/whatsapp-qr.png';

// Initialize WhatsApp client with local session persistence
function initWhatsApp() {
    client = new Client({
        authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        }
    });

    client.on('qr', async (qr) => {
        console.log('\n📱 ======================================');
        console.log('📱  SCAN THE QR CODE AT http://localhost:3000/qr.html');
        console.log('📱 ======================================\n');
        qrcode.generate(qr, { small: true });

        // Also save it as an image for web viewing
        try {
            await qrCodeLib.toFile(qrPath, qr, { scale: 8 });
        } catch (err) {
            console.error('Failed to generate QR image:', err);
        }
    });

    client.on('ready', () => {
        isReady = true;
        console.log('✅ WhatsApp client is ready and connected!');
        // Remove QR image if it exists so the web page knows we're done
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
        // Auto-reconnect after 5 seconds
        setTimeout(() => {
            console.log('🔄 Attempting WhatsApp reconnection...');
            client.initialize();
        }, 5000);
    });

    client.initialize().catch(err => {
        console.error('❌ Failed to initialize WhatsApp client (Chromium dependencies missing?):', err.message);
    });
}

// Send a WhatsApp message to a phone number
// phone should be like '916303228967' (country code + number, no +)
async function sendWhatsAppMessage(phone, message) {
    if (!isReady || !client) {
        console.warn('⚠️ WhatsApp not ready — message not sent to', phone);
        return false;
    }

    try {
        // WhatsApp expects format: countrycode + number + @c.us
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

    // Customer phone: just the 10-digit number, prepend 91
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
