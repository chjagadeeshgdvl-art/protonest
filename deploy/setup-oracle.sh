#!/bin/bash
# ================================================================
#  ProtoNest — Oracle Cloud VM Setup Script
#  Run this ONCE on a fresh Ubuntu 22.04/24.04 ARM instance
#  Usage: chmod +x setup-oracle.sh && sudo ./setup-oracle.sh
# ================================================================

set -e

echo "
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⚡ ProtoNest Oracle Cloud Setup                       ║
║   Setting up Node.js + Chromium + Nginx + PM2            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
"

# ── 1. System Update ─────────────────────────────────────────
echo "📦 [1/7] Updating system packages..."
apt update && apt upgrade -y

# ── 2. Install Node.js 20 LTS ────────────────────────────────
echo "📦 [2/7] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "   ✅ Node.js $(node -v) installed"
echo "   ✅ npm $(npm -v) installed"

# ── 3. Install Chromium + Dependencies ────────────────────────
echo "📦 [3/7] Installing Chromium browser (for WhatsApp Web.js)..."
apt install -y chromium-browser || apt install -y chromium
apt install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libasound2 \
    libxshmfence1 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    wget \
    ca-certificates \
    git

# Find Chromium path
CHROMIUM_PATH=$(which chromium-browser 2>/dev/null || which chromium 2>/dev/null || echo "/usr/bin/chromium-browser")
echo "   ✅ Chromium installed at: $CHROMIUM_PATH"

# ── 4. Install PM2 (Process Manager) ─────────────────────────
echo "📦 [4/7] Installing PM2 process manager..."
npm install -g pm2
echo "   ✅ PM2 installed"

# ── 5. Install Nginx (Reverse Proxy) ─────────────────────────
echo "📦 [5/7] Installing Nginx..."
apt install -y nginx
echo "   ✅ Nginx installed"

# ── 6. Configure Firewall (iptables) ─────────────────────────
echo "🔒 [6/7] Configuring firewall rules..."
# Oracle Cloud uses iptables — open ports 80, 443, and 3000
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
netfilter-persistent save 2>/dev/null || iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
echo "   ✅ Ports 80, 443, 3000 opened"

# ── 7. Configure Nginx Reverse Proxy ─────────────────────────
echo "🌐 [7/7] Configuring Nginx as reverse proxy..."
cat > /etc/nginx/sites-available/protonest << 'NGINX_CONF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression for faster loading
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Max upload size
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX_CONF

# Enable the site
ln -sf /etc/nginx/sites-available/protonest /etc/nginx/sites-enabled/protonest
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx
systemctl enable nginx
echo "   ✅ Nginx configured as reverse proxy (port 80 → 3000)"

echo "
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ✅ System setup complete!                              ║
║                                                          ║
║   Next: Run the deploy script as your regular user:      ║
║   $ chmod +x deploy-app.sh && ./deploy-app.sh            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
"
