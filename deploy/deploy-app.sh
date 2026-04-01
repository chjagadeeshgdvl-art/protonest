#!/bin/bash
# ================================================================
#  ProtoNest — App Deployment Script
#  Run this as your regular user (NOT root) after setup-oracle.sh
#  Usage: chmod +x deploy-app.sh && ./deploy-app.sh
# ================================================================

set -e

REPO_URL="https://github.com/chjagadeeshgdvl-art/protonest.git"
APP_DIR="$HOME/protonest"
CHROMIUM_PATH=$(which chromium-browser 2>/dev/null || which chromium 2>/dev/null || echo "/usr/bin/chromium-browser")

echo "
╔══════════════════════════════════════════════════════════╗
║   🚀 Deploying ProtoNest Application                    ║
╚══════════════════════════════════════════════════════════╝
"

# ── 1. Clone or Pull Repository ──────────────────────────────
if [ -d "$APP_DIR" ]; then
    echo "📂 Repository exists — pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "📂 Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# ── 2. Install Dependencies ──────────────────────────────────
echo "📦 Installing npm dependencies..."
npm install --production
echo "   ✅ Dependencies installed"

# ── 3. Set Environment Variables ─────────────────────────────
echo "🔧 Configuring environment..."
cat > "$APP_DIR/.env" << EOF
PORT=3000
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=$CHROMIUM_PATH
PUPPETEER_SKIP_DOWNLOAD=true
ADMIN_EMAIL=chjagadeesh.gdvl@gmail.com
ADMIN_PHONE=916303228967
EOF
echo "   ✅ Environment configured"

# ── 4. Create PM2 Ecosystem Config ──────────────────────────
cat > "$APP_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
    apps: [{
        name: 'protonest',
        script: 'server.js',
        cwd: __dirname,
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        env_file: '.env',
        error_file: './logs/error.log',
        out_file: './logs/output.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        merge_logs: true
    }]
};
EOF

# Create logs directory
mkdir -p "$APP_DIR/logs"

# ── 5. Load .env into PM2 ───────────────────────────────────
# Export env vars so PM2 picks them up
export $(cat "$APP_DIR/.env" | xargs)

# ── 6. Start/Restart with PM2 ───────────────────────────────
echo "🚀 Starting ProtoNest with PM2..."
cd "$APP_DIR"
pm2 delete protonest 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# ── 7. Set PM2 to start on boot ─────────────────────────────
echo "🔄 Configuring PM2 startup..."
pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true
pm2 save

# ── 8. Get Public IP ────────────────────────────────────────
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "YOUR_PUBLIC_IP")

echo "
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✅ ProtoNest is LIVE!                                     ║
║                                                              ║
║   🌐 Site URL:    http://$PUBLIC_IP                   ║
║   📱 WhatsApp QR: http://$PUBLIC_IP/qr.html           ║
║   🛒 API:         http://$PUBLIC_IP/api               ║
║                                                              ║
║   📋 Useful PM2 Commands:                                   ║
║      pm2 status         — Check app status                   ║
║      pm2 logs protonest — View live logs                     ║
║      pm2 restart protonest — Restart the app                 ║
║      pm2 monit          — Real-time monitoring               ║
║                                                              ║
║   ⚡ NEXT STEP: Open the WhatsApp QR page in your           ║
║      browser and scan it with your phone to connect          ║
║      WhatsApp notifications!                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"
