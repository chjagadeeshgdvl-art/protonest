const fs = require('fs');
const path = require('path');

const generatePage = (id, name, price, img, features, desc) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ProtoNest</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .breadcrumb { margin: 15px 0; font-size: 13px; color: var(--text-secondary); }
        .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .product-detail-layout { display: grid; grid-template-columns: 40% 35% 25%; gap: 30px; background: white; padding: 30px; border-radius: var(--border-radius); box-shadow: var(--box-shadow); }
        .product-imagery { display: flex; flex-direction: column; gap: 15px; }
        .main-image { width: 100%; height: 400px; background: #f8f8f8; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
        .main-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .product-info h1 { font-size: 24px; line-height: 1.3; margin-bottom: 10px; font-weight: 400; }
        .brand-link { color: var(--link-color); font-size: 14px; text-decoration: none; }
        .brand-link:hover { text-decoration: underline; color: #E7352C; }
        .ratings { color: #ff9900; font-size: 16px; margin: 10px 0 15px 0; display: flex; align-items: center; gap: 10px; }
        .ratings-count { color: var(--link-color); font-size: 14px; }
        .price-block { padding: 15px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 20px; }
        .price-label { font-size: 14px; color: var(--text-secondary); margin-bottom: 5px; }
        .price-current { font-size: 28px; color: var(--danger); font-weight: 500; }
        .about-item-title { font-weight: bold; margin-bottom: 10px; font-size: 16px; }
        .bullet-list { margin-left: 20px; line-height: 1.6; font-size: 14px; }
        .buy-box { border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 20px; background-color: #fff; }
        .buy-box-price { font-size: 24px; font-weight: 500; color: #111; margin-bottom: 10px; }
        .delivery-info { font-size: 14px; margin-bottom: 15px; line-height: 1.4; }
        .delivery-date { font-weight: bold; }
        .stock-status { color: var(--success); font-size: 18px; margin-bottom: 15px; font-weight: 500; }
        .btn-add-cart { background-color: #FFD814; color: #111; width: 100%; border-radius: 50px; padding: 12px; font-size: 14px; margin-bottom: 10px; border: 1px solid #FCD200; cursor: pointer; }
        .btn-add-cart:hover { background-color: #F7CA00; }
        .btn-buy-now { background-color: #FFA41C; color: #111; width: 100%; border-radius: 50px; padding: 12px; font-size: 14px; border: 1px solid #FF8F00; cursor: pointer; }
        .btn-buy-now:hover { background-color: #FA8900; }
        .secure-transaction { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 5px; margin-top: 15px; }
        .toast { position: fixed; top: 20px; right: 20px; background: #067D62; color: white; padding: 15px 25px; border-radius: 8px; font-weight: 500; z-index: 9999; transform: translateX(120%); transition: transform 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .toast.show { transform: translateX(0); }
    </style>
</head>
<body style="background-color: var(--white);">
    <div class="toast" id="toast">✓ Added to Cart!</div>
    <header>
        <div class="container header-top">
            <a href="index.html" class="logo">Proto<span>Nest</span></a>
            <div class="search-bar">
                <input type="text" placeholder="Search ESP NodeMCU Prototypes...">
                <button type="button" style="background-color:#E7352C; color:white;">Search</button>
            </div>
            <div class="header-actions">
                <a href="cart.html" style="color: white; font-weight: bold;">Cart <span class="cart-count">0</span></a>
            </div>
        </div>
    </header>
    <nav style="background-color: #4A1A1A;">
        <div class="container">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="arduino.html">Arduino Prototypes</a></li>
                <li><a href="raspberry.html">Raspberry Pi</a></li>
                <li><a href="esp.html" style="color: #FF9900; border-bottom: 2px solid #FF9900;">ESP NodeMCU</a></li>
                <li><a href="components.html">Electronic Components</a></li>
            </ul>
        </div>
    </nav>
    <main class="container">
        <div class="breadcrumb">
            <a href="index.html">Home</a> ›
            <a href="esp.html">ESP NodeMCU Prototypes</a> ›
            <span>${name}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-imagery">
                <div class="main-image"><img src="${img}" alt="${name}"></div>
            </div>
            <div class="product-info">
                <h1>${name}</h1>
                <a href="esp.html" class="brand-link">Visit the JK Labs ESP Innovation Store</a>
                <div class="ratings">⭐⭐⭐⭐⭐ <a href="#" class="ratings-count">${Math.floor(Math.random()*200 + 40)} ratings</a></div>
                <div class="price-block">
                    <div class="price-label">JK Labs Certified ESP Prototype</div>
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <span class="price-current">₹${price.toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Inclusive of all taxes</div>
                </div>
                <div class="about-item-title">About this item</div>
                <ul class="bullet-list">
                    ${features.map(f => `<li>${f}</li>`).join('\n                    ')}
                </ul>
                <p style="margin-top: 20px; font-size: 15px; color: #333; line-height: 1.6;">${desc}</p>
            </div>
            <div>
                <div class="buy-box">
                    <div class="buy-box-price">₹${price.toLocaleString()}.00</div>
                    <div class="delivery-info">FREE delivery <span class="delivery-date">in 3-5 business days</span></div>
                    <div class="stock-status">In stock</div>
                    <div style="font-size: 14px; margin-bottom: 15px; line-height: 1.4;">
                        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
                            <span style="color: var(--text-secondary);">Ships from</span> <span>JK Labs</span>
                            <span style="color: var(--text-secondary);">Sold by</span> <span>JK Labs Custom Builds</span>
                        </div>
                    </div>
                    <button class="btn-add-cart" id="addToCartBtn">Add to Cart</button>
                    <button class="btn-buy-now" id="buyNowBtn">Buy Now</button>
                    <div class="secure-transaction">🔒 Secure transaction</div>
                </div>
            </div>
        </div>
    </main>
    <footer style="background-color: var(--secondary-color); color: white; padding: 40px 0; margin-top: 60px;">
        <div style="text-align: center;"><p>&copy; 2026 ProtoNest by JK Labs. All rights reserved.</p></div>
    </footer>
    <script src="js/cart.js"></script>
    <script>
        const product = {
            id: '${id}',
            name: '${name}',
            price: ${price},
            image: '${img}'
        };
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            addToCart(product);
            const toast = document.getElementById('toast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
        document.getElementById('buyNowBtn').addEventListener('click', () => {
            addToCart(product);
            window.location.href = 'cart.html';
        });
    </script>
</body>
</html>`;
};

// 1. Relay
fs.writeFileSync(path.join(__dirname, 'public', 'product-esp-relay.html'), generatePage(
    'esp-relay', '4-Channel WiFi Relay Module (NodeMCU v3)', 399, '/images/products/relay.jpg',
    [
        '<strong>WiFi Enabled Control:</strong> Native ESP8266 NodeMCU integration for instantaneous control over LAN or cloud.',
        '<strong>4 Isolated Channels:</strong> High power optical isolation preventing power backflow to your controller.',
        '<strong>Plug & Play Ready:</strong> Header pins soldered and logic pre-mapped.',
        '<strong>High Voltage Capable:</strong> Switches up to 250V AC or 30V DC per channel securely.'
    ],
    'A central stepping stone into home automation or industrial AC/DC switching. Wirelessly connect your web-app or smartphone to control anything from heavy-duty floodlights to motorized gates.'
));

// 2. Home Automation
fs.writeFileSync(path.join(__dirname, 'public', 'product-esp-home.html'), generatePage(
    'esp-home', 'ESP Home Automation System', 1499, '/images/products/home.webp',
    [
        '<strong>Blynk / Web Interface:</strong> Out-of-the-box GUI configured for smartphone and browser management.',
        '<strong>Multi-Load Switching:</strong> Switch domestic appliances securely using integrated modules.',
        '<strong>IoT Ready:</strong> ESP32 processor ensures 24/7 uptime and seamless WiFi reconnection protocols.',
        '<strong>Real-time Status Updates:</strong> Dashboard updates dynamically mirroring physical state.'
    ],
    'A turnkey IoT solution to upgrade a standard residence into a smart home. Provides total connectivity over standard WiFi to track energy, control lighting, and handle remote locking seamlessly.'
));

// 3. Industry
fs.writeFileSync(path.join(__dirname, 'public', 'product-esp-industry.html'), generatePage(
    'esp-industry', 'ESP Industrial Security System', 1899, '/images/products/industry.jpg',
    [
        '<strong>MQTT Communication:</strong> Highly reliable broker architecture built for industrial environments.',
        '<strong>Multi-Sensor Hub:</strong> Connects to industrial PIR, laser trap, and proximity modules.',
        '<strong>Battery Backup:</strong> Failsafe circuitry keeping the board online during grid shutdowns.',
        '<strong>Rugged Enclosure:</strong> Includes an IP65 rated dust and water resistant shell.'
    ],
    'Scalable security IoT framework built specifically for warehouses and commercial properties. Integrates with industry-standard protocols ensuring an unbroken chain of security alerts and sensor matrices.'
));

// 4. WiFi Car
fs.writeFileSync(path.join(__dirname, 'public', 'product-esp-wifi-car.html'), generatePage(
    'esp-wificar', 'ESP WiFi RC Car', 2499, '/images/products/wifi_car.jpg',
    [
        '<strong>Real-Time Low Latency:</strong> Steer without lag through a dedicated AP hotspot or local LAN.',
        '<strong>2WD / 4WD Ready:</strong> Included motor drivers deliver substantial torque to the chassis.',
        '<strong>Camera Expansion Port:</strong> ESP32-CAM ready for FPV streaming capabilities.',
        '<strong>Web Hosting Onboard:</strong> Emits its own HTML/JS interface directly from the microchip—no app download necessary.'
    ],
    'The quintessential introduction to wireless robotics. Rather than basic Bluetooth, this ESP chassis lets you pilot the RC vehicle completely via browser through an internal WiFi server, enabling essentially infinite control range over a strong WLAN backbone.'
));
console.log('ESP Pages generated!');

// Now, wire up esp.html to use these new files.
const rpiPath = path.join(__dirname, 'public', 'esp.html');
let rpi = fs.readFileSync(rpiPath, 'utf8');

// Strip generic links to be safe
rpi = rpi.replace(/ href="#" /g, ' href="" ');
rpi = rpi.replace(/href=""/g, '');

// Relay
rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/relay.jpg"',
    '<a href="product-esp-relay.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/relay.jpg"'
);
rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/relay.jpg"',
    '<a href="product-esp-relay.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/relay.jpg"'
);

// Home
rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/home.webp"',
    '<a href="product-esp-home.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/home.webp"'
);

// Industry
rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/industry.jpg"',
    '<a href="product-esp-industry.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/industry.jpg"'
);

// RC Car
rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/wifi_car.jpg"',
    '<a href="product-esp-wifi-car.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/wifi_car.jpg"'
);

fs.writeFileSync(rpiPath, rpi, 'utf8');
console.log('Updated links in esp.html');
