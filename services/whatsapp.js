const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const qrCodeLib = require('qrcode');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

let sock = null;
let isReady = false;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..');
const AUTH_DIR = path.join(DATA_DIR, '.wwebjs_auth', 'baileys_auth');
const QR_PATH = path.join(__dirname, '..', 'public', 'whatsapp-qr.png');

// ── Initialize WhatsApp Client (Baileys — NO Chromium needed) ───────
async function initWhatsApp() {
    try {
        // Ensure auth directory exists
        if (!fs.existsSync(AUTH_DIR)) {
            fs.mkdirSync(AUTH_DIR, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
        const { version } = await fetchLatestBaileysVersion();

        sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ['ProtoNest by JK Labs', 'Chrome', '120.0.0'],
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 25000,
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: false,
        });

        // ── QR Code Event ───────────────────────────────────────
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('\n📱 ======================================');
                console.log('📱  SCAN THE QR CODE TO CONNECT WHATSAPP');
                console.log('📱  Also available at: /qr.html');
                console.log('📱 ======================================\n');
                
                // Show QR in terminal
                qrcodeTerminal.generate(qr, { small: true });

                // Save QR as image for web page
                try {
                    await qrCodeLib.toFile(QR_PATH, qr, { 
                        scale: 8, 
                        margin: 2,
                        color: { dark: '#1D1D1F', light: '#FFFFFF' }
                    });
                    console.log('📱 QR code saved to /public/whatsapp-qr.png');
                } catch (err) {
                    console.error('Failed to save QR image:', err.message);
                }
            }

            if (connection === 'close') {
                isReady = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                
                console.log(`📱 WhatsApp disconnected (code: ${statusCode})`);
                
                // Remove QR image on disconnect
                if (fs.existsSync(QR_PATH)) fs.unlinkSync(QR_PATH);

                if (shouldReconnect) {
                    console.log('🔄 Reconnecting WhatsApp in 5 seconds...');
                    setTimeout(() => initWhatsApp(), 5000);
                } else {
                    console.log('❌ WhatsApp logged out. Delete .wwebjs_auth/baileys_auth folder and restart to re-authenticate.');
                    // Clear auth state on logout so fresh QR appears on restart
                    if (fs.existsSync(AUTH_DIR)) {
                        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
                    }
                }
            }

            if (connection === 'open') {
                isReady = true;
                console.log('✅ WhatsApp client is ready and connected!');
                
                // Remove QR image once connected
                if (fs.existsSync(QR_PATH)) {
                    fs.unlinkSync(QR_PATH);
                }
            }
        });

        // ── Save credentials on update ──────────────────────────
        sock.ev.on('creds.update', saveCreds);

        console.log('📱 WhatsApp client initializing (Baileys — no Chromium needed)...');

    } catch (err) {
        console.warn('⚠️ WhatsApp initialization failed:', err.message);
        console.warn('⚠️ WhatsApp notifications will be disabled. Server continues normally.');
        sock = null;
        isReady = false;
        
        // Retry after 30 seconds
        setTimeout(() => {
            console.log('🔄 Retrying WhatsApp initialization...');
            initWhatsApp();
        }, 30000);
    }
}

// ── Send a WhatsApp message ─────────────────────────────────────────
// phone should be like '916303228967' (country code + number, no +)
async function sendWhatsAppMessage(phone, message) {
    if (!isReady || !sock) {
        console.warn('⚠️ WhatsApp not ready — message not sent to', phone);
        return false;
    }

    try {
        // Baileys uses @s.whatsapp.net for individual chats
        const jid = phone + '@s.whatsapp.net';
        await sock.sendMessage(jid, { text: message });
        console.log('✅ WhatsApp message sent to:', phone);
        return true;
    } catch (err) {
        console.error('❌ WhatsApp send failed to', phone, ':', err.message);
        return false;
    }
}

// ── Helper: Format INR ──────────────────────────────────────────────
function fmtINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Send order confirmation to customer via WhatsApp ────────────────
async function sendCustomerWhatsApp(order, customer) {
    let msg = `🛒 *ProtoNest — Order Confirmed!*\n\n`;
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
    msg += `For queries, contact us at 6303228967`;

    // Normalize phone: remove +91 prefix if present, then prepend 91
    const cleanPhone = customer.phone.replace(/^\+?91/, '');
    const customerPhone = '91' + cleanPhone;
    return await sendWhatsAppMessage(customerPhone, msg);
}

// ── Send new order alert to admin via WhatsApp ──────────────────────
async function sendAdminWhatsApp(order, customer) {
    let msg = `🔔 *NEW ORDER — ProtoNest*\n\n`;
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
