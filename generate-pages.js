const fs = require('fs');
const path = require('path');

const generatePage = (id, name, price, img, features, desc) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ProtoGods by JK labs</title>
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
        .brand-link:hover { text-decoration: underline; color: #c45500; }
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
                <input type="text" placeholder="Search for electronic components...">
                <button type="button" style="background-color:#C51A4A; color:white;">Search</button>
            </div>
            <div class="header-actions">
                <a href="cart.html" style="color: white; font-weight: bold;">Cart <span class="cart-count">0</span></a>
            </div>
        </div>
    </header>
    <nav style="background-color: #5d0f25;">
        <div class="container">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="arduino.html">Arduino Prototypes</a></li>
                <li><a href="raspberry.html" style="color: #FF9900; border-bottom: 2px solid #FF9900;">Raspberry Pi</a></li>
                <li><a href="esp.html">ESP NodeMCU</a></li>
                <li><a href="components.html">Electronic Components</a></li>
            </ul>
        </div>
    </nav>
    <main class="container">
        <div class="breadcrumb">
            <a href="index.html">Home</a> ›
            <a href="raspberry.html">Raspberry Pi Prototypes</a> ›
            <span>${name}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-imagery">
                <div class="main-image"><img src="${img}" alt="${name}"></div>
            </div>
            <div class="product-info">
                <h1>${name}</h1>
                <a href="raspberry.html" class="brand-link">Visit the ProtoGods by JK labs Store by JK Labs</a>
                <div class="ratings">⭐⭐⭐⭐⭐ <a href="#" class="ratings-count">${Math.floor(Math.random()*150 + 20)} ratings</a></div>
                <div class="price-block">
                    <div class="price-label">JK Labs Certified Prototype</div>
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
        <div style="text-align: center;"><p>&copy; 2026 ProtoGods by JK labs. All rights reserved.</p></div>
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

// 1. Door
fs.writeFileSync(path.join(__dirname, 'public', 'product-rp-door.html'), generatePage(
    'rp-door', 'Raspberry Pi Smart Door Lock System', 14999, '/images/products/door.jpg',
    [
        '<strong>Facial Recognition:</strong> Built-in OpenCV module for instantaneous verified entries.',
        '<strong>RFID Access:</strong> Comes with 5 RFID tags for physical entry.',
        '<strong>Mobile Dashboard:</strong> Remotely open doors and monitor access logs.',
        '<strong>Solenoid Strike Lock:</strong> Commercial grade electronic latch mechanism.'
    ],
    'The ultimate IoT security framework built atop the reliable Raspberry Pi 4 setup. Our Smart Door Lock array integrates cutting-edge biometric facial scanning with high-security hardware locking mechanisms.'
));

// 2. Secure
fs.writeFileSync(path.join(__dirname, 'public', 'product-rp-secure.html'), generatePage(
    'rp-secure', 'Raspberry Pi Intruder Security System', 17999, '/images/products/secure.jpg',
    [
        '<strong>PIR Sensors:</strong> Advanced IR motion tracking capturing movement up to 10 meters.',
        '<strong>Auto Email/SMS Alerts:</strong> Triggers instantaneous photo uploads via Node.js backend.',
        '<strong>Pi Camera Module v2:</strong> High fidelity 1080p capture and constant surveillance mapping.',
        '<strong>Self-sufficient Logging:</strong> 32 GB isolated storage logs.'
    ],
    'Protect an entire room or facility with continuous data monitoring, built around the power of Python scripts and a discrete Raspberry Pi camera ecosystem.'
));

// 3. Avoid
fs.writeFileSync(path.join(__dirname, 'public', 'product-rp-avoid.html'), generatePage(
    'rp-avoid', 'Raspberry Pi Obstacle Avoiding Robot', 25999, '/images/products/avoid.jpg',
    [
        '<strong>Autonomous Pathfinding:</strong> Utilizes dual HC-SR04 ultrasonic sensors for millimeter accuracy.',
        '<strong>L298N Motor Driver:</strong> Heavy duty current output for 4WD chassis.',
        '<strong>OpenCV Processing:</strong> Capable of analyzing surrounding boundaries in real-time.',
        '<strong>Premium Chassis:</strong> Highly durable metal alloy frame.'
    ],
    'A fully fledged AI prototype bot capable of mapping a room and steering clear of dynamic obstacles. Essential for researchers and hobbyists looking to implement self-driving logic.'
));

// 4. Agri
fs.writeFileSync(path.join(__dirname, 'public', 'product-rp-agri.html'), generatePage(
    'rp-agri', 'Raspberry Pi Smart Agricultural System', 19999, '/images/products/agri.png',
    [
        '<strong>Automated Irrigation:</strong> Controls up to 3 separate water pumps based on dynamic rules.',
        '<strong>Moisture Tracking:</strong> Includes specialized soil moisture electrodes.',
        '<strong>DHT11 Environmental Sensors:</strong> Tracks ambient temperature and humidity seamlessly.',
        '<strong>Crop Dashboard:</strong> Includes a fully configured web-UI graphing historical data.'
    ],
    'Bring smart IoT to the farm or greenhouse. This system ensures plants receive the perfect volume of water exactly when they need it, reducing waste and boosting yields through precision agritech.'
));
console.log('Pages generated!');
