const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const rootDir = __dirname;
const dbPath = path.join(rootDir, 'database', 'protonest-data.json');
let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const products = [
    {
        id: 'ard-flood',
        name: 'Arduino Flood Alert System',
        desc: 'An automated early warning prototype designed to track rising water levels. Upon detecting critical thresholds, this system logs data and automatically triggers loud sirens and indicator LEDs to save lives and property.',
        features: ['Water Level Sensors', 'Piezo Buzzer Alarm', 'LED Status Indicators', 'Arduino Uno Core'],
        price: 0,
        img: '/images/products/placeholder-flood.jpg'
    },
    {
        id: 'ard-irrigation',
        name: 'Smart Irrigation Control',
        desc: 'Optimize water usage with this smart agricultural prototype. The system uses a soil moisture sensor to dynamically monitor dry dirt and automatically activates a miniature 5V water pump only when the plants absolutely need hydration.',
        features: ['5V Submersible Water Pump', 'Soil Moisture Dual-Prong Sensor', 'Relay Module Controller', 'Automated Loop Logic'],
        price: 0,
        img: '/images/products/placeholder-irrigation.jpg'
    },
    {
        id: 'ard-gas',
        name: 'Gas Leakage Alert System',
        desc: 'A critical safety device utilizing the highly sensitive MQ-2 gas sensor. It sniffs the ambient air for dangerous concentrations of LPG, methane, or smoke, immediately halting potential disasters with audio-visual warnings and auto-shutoff relays.',
        features: ['MQ-2 Combustible Gas Sensor', 'Exhaust Fan Relay Auto-trigger', 'LCD Status Feed', 'High dB Alarm'],
        price: 0,
        img: '/images/products/placeholder-gas.jpg'
    },
    {
        id: 'ard-fall',
        name: 'Fall Detection System',
        desc: 'A wearable smart device prototype engineered for elderly care. Utilizing a 6-axis MPU6050 accelerometer and gyroscope, the logic actively monitors the wearer\'s balance and triggers an emergency SMS via a GSM module upon detecting a sudden hard fall.',
        features: ['MPU6050 Gyroscope & Accelerometer', 'GSM Module for SMS Alerts', 'Wearable Compact Chassis', 'False-Alarm Reset Button'],
        price: 0,
        img: '/images/products/placeholder-fall.jpg'
    },
    {
        id: 'ard-medicine',
        name: 'Smart Medicine Reminder',
        desc: 'Never miss a dosage again. This Arduino-driven pillbox relies on RTC (Real-Time Clock) synchronization to visually highlight and unlock specific medicine compartments exactly when the patient\'s prescription schedule dictates.',
        features: ['DS3231 Real Time Clock', 'LED Compartment Indicators', 'Servo Locking Mechanism', 'Audio Reminder Buzzer'],
        price: 0,
        img: '/images/products/placeholder-medicine.jpg'
    },
    {
        id: 'ard-health',
        name: 'Remote Health Monitoring IoT',
        desc: 'Bridge the gap between patient and doctor. This IoT framework reads live vitals (Pulse & SpO2) through specialized sensors and pipes the packets over a Wi-Fi module directly to a secure online cloud dashboard accessible by medical staff.',
        features: ['Pulse Oximeter Sensor', 'ESP8266 Wi-Fi Extension', 'Cloud Dashboard Integration', 'Live Vital Screen'],
        price: 0,
        img: '/images/products/placeholder-health.jpg'
    },
    {
        id: 'ard-toll',
        name: 'Smart Toll Gate Automation',
        desc: 'A miniaturized logistics prototype designed for smooth traffic ticketing. Utilizing RFID tags and readers, the Arduino scans passing cars, deducts virtual currency from their account, and physically raises the toll barrier servo without requiring the driver to stop.',
        features: ['RFID RC522 Card Scanner', 'Fast-actuation Servo Barrier', 'I2C LCD Billing Display', 'Account Database Storage'],
        price: 0,
        img: '/images/products/placeholder-toll.jpg'
    }
];

const generatePage = (prod) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prod.name} - ProtoNest</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .breadcrumb { margin: 15px 0; font-size: 13px; color: var(--text-secondary); }
        .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .product-detail-layout { display: grid; grid-template-columns: 40% 35% 25%; gap: 30px; background: white; padding: 30px; border-radius: var(--border-radius); box-shadow: var(--box-shadow); }
        .product-imagery { display: flex; flex-direction: column; gap: 15px; }
        .main-image { width: 100%; height: 400px; background: #f8f8f8; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .main-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
        /* Placeholder specific styling */
        .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #eaeaea; color: #888; font-size: 18px; font-weight: bold; text-align: center; padding: 20px; }
        
        .product-info h1 { font-size: 24px; line-height: 1.3; margin-bottom: 20px; font-weight: 500; }
        .brand-link { color: var(--link-color); font-size: 14px; text-decoration: none; }
        .brand-link:hover { text-decoration: underline; color: #00979C; }
        .ratings { color: #ff9900; font-size: 16px; margin: 10px 0 15px 0; display: flex; align-items: center; gap: 10px; }
        .ratings-count { color: var(--link-color); font-size: 14px; }
        .price-block { padding: 15px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 20px; }
        .price-label { font-size: 14px; color: var(--text-secondary); margin-bottom: 5px; }
        .price-current { font-size: 28px; color: var(--danger); font-weight: 500; }
        .about-item-title { font-weight: bold; margin-bottom: 15px; font-size: 18px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .bullet-list { margin-left: 20px; line-height: 1.7; font-size: 15px; margin-bottom: 20px; }
        .product-description { font-size: 15px; color: #333; line-height: 1.8; text-align: justify; padding: 20px; background-color: #fcfcfc; border-left: 4px solid #00979C; border-radius: 4px; }
        .buy-box { border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 25px; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .buy-box-price { font-size: 28px; font-weight: 600; color: #111; margin-bottom: 15px; }
        .delivery-info { font-size: 14px; margin-bottom: 15px; line-height: 1.4; color: #0f1111; }
        .delivery-date { font-weight: bold; color: #007185; }
        .stock-status { color: #007600; font-size: 18px; margin-bottom: 15px; font-weight: 500; }
        .btn-add-cart { background-color: #FFD814; color: #111; width: 100%; border-radius: 50px; padding: 14px; font-size: 15px; font-weight: 500; margin-bottom: 10px; border: 1px solid #FCD200; cursor: pointer; transition: background 0.2s; }
        .btn-add-cart:hover { background-color: #F7CA00; }
        .btn-buy-now { background-color: #FFA41C; color: #111; width: 100%; border-radius: 50px; padding: 14px; font-size: 15px; font-weight: 500; border: 1px solid #FF8F00; cursor: pointer; transition: background 0.2s; }
        .btn-buy-now:hover { background-color: #FA8900; }
        .secure-transaction { font-size: 13px; color: #007185; display: flex; align-items: center; gap: 8px; margin-top: 15px; font-weight: 500; }
        .toast { position: fixed; top: 20px; right: 20px; background: #067D62; color: white; padding: 15px 25px; border-radius: 8px; font-weight: 500; z-index: 9999; transform: translateX(120%); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .toast.show { transform: translateX(0); }
    </style>
</head>
<body style="background-color: #f2f2f2;">
    <div class="toast" id="toast">✓ Item successfully added to Cart!</div>
    <header>
        <div class="container header-top">
            <a href="index.html" class="logo">Proto<span>Nest</span></a>
            <div class="search-bar">
                <input type="text" placeholder="Search the Arduino Prototype Library...">
                <button type="button" style="background-color:#00979C; color:white;">Search</button>
            </div>
            <div class="header-actions">
                <a href="cart.html" style="color: white; font-weight: bold; font-size: 16px;">Cart <span class="cart-count">0</span></a>
            </div>
        </div>
    </header>
    <nav style="background-color: #006064;">
        <div class="container">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="arduino.html" style="color: #00E5FF; border-bottom: 2px solid #00E5FF;">Arduino Prototypes</a></li>
                <li><a href="raspberry.html">Raspberry Pi</a></li>
                <li><a href="esp.html">ESP NodeMCU</a></li>
                <li><a href="components.html">Electronic Components</a></li>
            </ul>
        </div>
    </nav>
    <main class="container" style="margin-top: 20px; margin-bottom: 60px;">
        <div class="breadcrumb">
            <a href="index.html">Home</a> ›
            <a href="arduino.html">Arduino Prototypes Library</a> ›
            <span style="color: #111; font-weight: 500;">${prod.name}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-imagery">
                <div class="main-image">
                    <!-- Update image src when available -->
                    <img src="${prod.img}" alt="${prod.name}" onerror="this.outerHTML='<div class=\\'img-placeholder\\'>[Insert Image Here]</div>'">
                </div>
            </div>
            <div class="product-info">
                <h1>${prod.name}</h1>
                <a href="arduino.html" class="brand-link">Explore more ProtoNest Custom Builds by JK Labs</a>
                <div class="ratings">⭐⭐⭐⭐⭐ <a href="#" class="ratings-count">${Math.floor(Math.random()*150 + 20)} Verified Reviews</a></div>
                <div class="price-block">
                    <div class="price-label">Official Prototype Kit</div>
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <!-- Update Price Here -->
                        <span class="price-current">₹${prod.price === 0 ? '[Enter Price]' : prod.price.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="about-item-title">Core Specifications & Hardware Overview</div>
                <ul class="bullet-list">
                    ${prod.features.map(f => `<li>${f}</li>`).join('\n                    ')}
                </ul>
                
                <div class="about-item-title">Comprehensive Project Context</div>
                <div class="product-description">
                    ${prod.desc}
                </div>
            </div>
            <div>
                <div class="buy-box">
                    <div class="buy-box-price">₹${prod.price === 0 ? '[Enter Price]' : prod.price.toLocaleString() + '.00'}</div>
                    <div class="delivery-info"><span style="color: #007600;">FREE priority shipping</span> to your location <br><br>Estimated delivery: <span class="delivery-date">Within 2 to 4 business days</span></div>
                    <div class="stock-status">In stock and Ready to Ship</div>
                    <div style="font-size: 13px; margin-bottom: 25px; line-height: 1.5;">
                        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
                            <span style="color: var(--text-secondary);">Dispatches from</span> <span>ProtoNest Central Hub</span>
                            <span style="color: var(--text-secondary);">Assembled by</span> <span>JK Labs Advanced Engineering</span>
                        </div>
                    </div>
                    <button class="btn-add-cart" id="addToCartBtn">🛒 Add to Cart</button>
                    <button class="btn-buy-now" id="buyNowBtn">⚡ Buy Now</button>
                    <div class="secure-transaction">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        SSL Secure Server Transaction
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer style="background-color: #232F3E; color: white; padding: 50px 0;">
        <div style="text-align: center;"><p>&copy; 2026 ProtoNest by JK Labs. All rights reserved.</p></div>
    </footer>
    <script src="js/cart.js"></script>
    <script>
        const product = {
            id: '${prod.id}',
            name: '${prod.name}',
            price: ${prod.price},
            image: '${prod.img}'
        };
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            addToCart(product);
            const toast = document.getElementById('toast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        });
        document.getElementById('buyNowBtn').addEventListener('click', () => {
            addToCart(product);
            window.location.href = 'cart.html';
        });
    </script>
</body>
</html>`;
};

// 1. Generate individual HTML Pages
products.forEach((prod) => {
    fs.writeFileSync(path.join(rootDir, 'public', `product-${prod.id}.html`), generatePage(prod));
});
console.log('7 New Prototype Pages Generated with placeholders!');

// 2. Add to Database
let DB_modified = false;
products.forEach((prod) => {
    // avoid duplicates if script runs twice
    if(!data.products.find(p => p.id === uuidv4)) { 
        data.products.push({
            id: uuidv4(),
            name: prod.name,
            description: prod.desc,
            price: prod.price, // PlaceHolder 0
            original_price: null,
            category: 'prototypes',
            sub_category: 'arduino',
            platform: 'arduino',
            rating: 5,
            rating_count: 0,
            stock: 10,
            features: prod.features
        });
        DB_modified = true;
    }
});

if(DB_modified) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Appended items to protonest-data.json');
}

// 3. Inject into arduino.html grid
const htmlPath = path.join(rootDir, 'public', 'arduino.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// The injection point is the end of the <div class="product-grid"> section.
// Usually ends with '                </div>\n            </div>\n        </div>\n    </main>'
const endBlockIndex = html.lastIndexOf('                </div>\\n            </div>\\n        </div>\\n    </main>');
const altEndBlockIndex = html.lastIndexOf('</div>\n            </div>\n        </div>\n    </main>');
let injectionIndex = endBlockIndex !== -1 ? endBlockIndex : altEndBlockIndex;

// Just in case formatting changed, we can find the closing div of product-grid
// Or we can just substring replace
const marker = '    </main>';
if(html.includes('<!-- End Product Grid -->')) {
    // safe injection mark if it existed
}

let addedCards = '';
products.forEach((prod, index) => {
    // Only construct new cards if they don't already exist in the HTML
    if (!html.includes(prod.name)) {
        addedCards += `
                    <!-- New Item ${index+1} -->
                    <a href="product-${prod.id}.html" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="${prod.img}" alt="${prod.name}" style="width:100%; height:100%; object-fit:contain;" onerror="this.outerHTML='<div style=\\'color:#999;font-weight:bold;\\'>[Insert Image]</div>'">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">${prod.name}</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 0</div>
                        <div class="product-price">₹ [Enter Price]</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>\n`;
    }
});

if (addedCards) {
    const injectionTerm = '                </div>\n            </div>\n        </div>\n    </main>';
    html = html.replace(injectionTerm, addedCards + injectionTerm);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('Appended product cards to arduino.html grid');
} else {
    console.log('Cards already exist in arduino.html, skipping append.');
}
