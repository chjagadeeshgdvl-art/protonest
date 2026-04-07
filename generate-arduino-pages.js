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
            <span style="color: #111; font-weight: 500;">${name}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-imagery">
                <div class="main-image"><img src="${img}" alt="${name}"></div>
            </div>
            <div class="product-info">
                <h1>${name}</h1>
                <a href="arduino.html" class="brand-link">Explore more JK Labs Certified Arduino Core Modules</a>
                <div class="ratings">⭐⭐⭐⭐⭐ <a href="#" class="ratings-count">${Math.floor(Math.random()*300 + 40)} Verified Reviews</a></div>
                <div class="price-block">
                    <div class="price-label">Official Prototype Kit</div>
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <span class="price-current">₹${price.toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">Inclusive of all mandatory electronics taxes</div>
                </div>
                
                <div class="about-item-title">Core Specifications & Hardware Overview</div>
                <ul class="bullet-list">
                    ${features.map(f => `<li>${f}</li>`).join('\n                    ')}
                </ul>
                
                <div class="about-item-title">Comprehensive Project Context</div>
                <div class="product-description">
                    ${desc}
                </div>
            </div>
            <div>
                <div class="buy-box">
                    <div class="buy-box-price">₹${price.toLocaleString()}.00</div>
                    <div class="delivery-info"><span style="color: #007600;">FREE priority shipping</span> to your location <br><br>Estimated delivery: <span class="delivery-date">Within 2 to 4 business days</span></div>
                    <div class="stock-status">In stock and Ready to Ship</div>
                    <div style="font-size: 13px; margin-bottom: 25px; line-height: 1.5;">
                        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
                            <span style="color: var(--text-secondary);">Dispatches from</span> <span>JK Labs Central Hub</span>
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

// 1. Fire
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-fire.html'), generatePage(
    'ard-fire', 'Arduino Fire Fighting Robot', 2999, '/images/products/fire.webp',
    [
        '<strong>Flame Sensors:</strong> High-sensitivity IR receivers mounted radially to detect open fire from up to 80cm away.',
        '<strong>Integrated Water Pump:</strong> Connected to a precision nozzle and actuated via an included L298N driver.',
        '<strong>Autonomous Navigation:</strong> Pre-flashed C++ code allows the chassis to actively sweep a room looking for heat signatures.',
        '<strong>Full Assembly:</strong> Solid metal base structure with high-torque gear motors.'
    ],
    'The Arduino Fire Fighting Robot is a highly specialized autonomous vehicle specifically designed for engineering curriculum and hazardous environment research. When deployed, the robot uses an array of tuned infrared flame sensors to scan for distinct light signatures produced by uncontrolled fires. Upon detecting a flame, the onboard Arduino Uno calculates the precise trajectory, navigates to the source using its dual-motor transmission, and activates a high-capacity miniature water pump to extinguish the threat. This heavily detailed technical prototype serves as a premier foundation for students looking to understand environmental interaction, robotics mapping, and crisis-response automation.'
));

// 2. Sleep
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-sleep.html'), generatePage(
    'ard-sleep', 'Arduino Anti Sleep Alarm', 1899, '/images/products/sleep.jpg',
    [
        '<strong>Eye Blink Sensor:</strong> Specially calibrated infrared optics tracking eyelid movement and duration.',
        '<strong>Buzzer & Vibration Alert:</strong> Equipped with dual-action tactile and 90dB auditory triggers to instantly break sleep patterns.',
        '<strong>Wearable Frame:</strong> Includes an ergonomic optical headset frame to hold the microcontroller securely.',
        '<strong>Low Power Draw:</strong> Built to run for over 48 hours on a standard 9V industrial battery.'
    ],
    'Drowsy driving is a massive hazard across global transport. The Arduino Anti Sleep Alarm is an essential wearable safety prototype engineered to actively counter driver fatigue. The system mounts an ultra-sensitive infrared blink senor near the user\'s orbital bone. The core Arduino program continuously intercepts the optical data matrix, establishing a baseline of the user\'s waking blink rate. If the eyes remain shut for a timeframe exceeding the pre-set safety threshold (customizable via variable resistors), the system triggers an immediate cacophony of loud alerts alongside a physical vibrating motor, snapping the user back to full awareness before an accident can occur.'
));

// 3. Alcohol
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-alcohol.html'), generatePage(
    'ard-alcohol', 'Arduino Alcohol Detection System', 1999, '/images/products/alcohol.jpeg',
    [
        '<strong>MQ-3 Gas Sensor:</strong> Highly accurate alcohol vapor detection module with a rapid response envelope.',
        '<strong>Engine Immobilization Relay:</strong> A built-in physical relay capable of cutting structural power to an ignition circuit.',
        '<strong>LCD Printout:</strong> Provides a live feed (0-100 scale) of vapor saturation on a brightly backlit 16x2 digital interface.',
        '<strong>Calibration Ready:</strong> Includes an onboard potentiometer allowing for precise sensitivity adjustments.'
    ],
    'The Arduino Alcohol Detection System addresses the critical need for DUI prevention through active hardware intervention. The core of this system relies on the highly accurate MQ-3 alcohol and ethanol specialized sensor. When a subject breathes near the module, the sensor dynamically reads the ambient air resistance, shifting its analog voltage output. The Arduino interprets this analog shift, plots it against recognized BAC (Blood Alcohol Content) safety curves, and if the limit is breached, it deliberately fires a logic latch. This latch closes an industrial standard relay, which in real-world applications is wired to cut the ignition starter of a vehicle, physically preventing a dangerous individual from driving.'
));

// 4. Railway
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-railway.html'), generatePage(
    'ard-railway', 'Arduino Smart Railway Gate', 1699, '/images/products/rail.png',
    [
        '<strong>IR Proximity Dual Array:</strong> Calculates velocity and arrival times by tracking passing objects between two static points.',
        '<strong>Servo Motor Gates:</strong> High precision 180-degree servo actuation to drop barriers accurately.',
        '<strong>Warning Signals:</strong> Synchronized red caution LEDs and piezo-buzzers simulate a true railway crossing.',
        '<strong>Sturdy Wooden Track Prototype:</strong> Fully realized physical diorama to simulate train tracks and road crossings.'
    ],
    'A cornerstone layout to understand industrial rail network logistics. The Smart Railway Gate completely automates the traditional boom-barrier process. Utilizing paired infrared optical gates stationed far down the track, the Arduino records the precise millisecond a train passes the first sensor. When triggered, the central processor flashes high-visibility warning arrays and steadily drops the horizontal barricades using pulse-width modulated servos, halting traffic. Only once the train clears the absolute final IR sensor on the opposite end of the crossing does the system gracefully lift the barricades—guaranteeing 100% safety automation without human delay or error.'
));

// 5. Bluetooth Home Auto
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-bluetooth.html'), generatePage(
    'ard-bluetooth', 'Arduino Bluetooth Home Automation', 1999, '/images/products/bluetooth.jpg',
    [
        '<strong>HC-05 Bluetooth Module:</strong> Supports stable, low-latency pairing with any standard Android or iOS smartphone.',
        '<strong>Multi-Channel Block Relay:</strong> Controls up to 4 AC-mains appliances (lights, fans, chargers) with absolute electrical isolation.',
        '<strong>Custom Mobile App:</strong> Includes the source code file to install a custom controller app onto your mobile device.',
        '<strong>Expandable Logic:</strong> Plug and play architecture allowing for further sensor add-ons.'
    ],
    'Bridge the gap between your smartphone and the physical appliances in your house. The Bluetooth Home Automation cluster leverages the universally adopted HC-05 transceiver. A user can stand anywhere in an operational 10-meter radius, tap a button on their custom mobile application, and send a specific encrypted serial packet through the airwaves. The Arduino intercepts, decodes the syntax, and snaps a physical 250V AC relay closed, supplying grid power to the appliance. It’s the perfect, localized smart-home initiation point that operates entirely off-grid without needing external Wi-Fi routers or cloud subscriptions.'
));

// 6. Parking
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-parking.html'), generatePage(
    'ard-parking', 'Smart Parking System', 3899, '/images/products/park.png',
    [
        '<strong>IR Slot Monitoring:</strong> Individual infrared nodes strictly dedicated to logging the status of parking bays.',
        '<strong>Toll-gate Automation:</strong> Front-end entrance barrier operated by a fast-action servo loop.',
        '<strong>Digital Billboard Dashboard:</strong> An external 16x2 LCD matrix constantly updates incoming drivers of available slots.',
        '<strong>Over-Capacity Lock:</strong> Algorithms refuse entry and flash red signals if maximum threshold is met.'
    ],
    'The Smart Parking System simulates the advanced traffic control infrastructure seen in modern automated garages. A central Arduino logic board controls a sprawling web of dedicated infrared bay-sensors. When a vehicle claims a bay, the sensor trips, and the Arduino dynamically decrements its global tally. This live numerical data is piped straight to a high-contrast LCD screen at the entrance gate. It completely optimizes traffic logistics by ensuring the front barricade servo simply refuses to raise if the lot is full, thereby preventing gridlock inside the facility.'
));

// 7. Garbage
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-garbage.html'), generatePage(
    'ard-garbage', 'Smart Garbage Segregation System', 3699, '/images/products/garbage.jpg',
    [
        '<strong>Capacitive Moisture Matrix:</strong> Intelligently classifies waste items into "Wet" and "Dry" profiles based on their electrical resistance.',
        '<strong>Motorized Sorting Bin:</strong> A centrally suspended servo motor rotates a disposal lid to deposit trash mechanically into the correct partition.',
        '<strong>Ultrasonic Fill-level Checking:</strong> Emits sound waves to bounce off the trash layer, alerting sanitation workers when the bin volume is critical.',
        '<strong>Sanitary Operation:</strong> No physical touching required; entirely automated segregation mechanism.'
    ],
    'A revolutionary step toward civic cleanliness and automated recycling pipelines. The Smart Garbage Segregation System tackles the fundamentally difficult human task of waste sorting by taking it out of the public’s hands entirely. Users drop trash into a generalized top hatch; the system then utilizes a highly-sensitive capacitive plate mapping system to ascertain the ambient water density and composition of the item. Once the logic successfully identifies the waste signature as either Wet (organic/compostable) or Dry (plastics/paper), it triggers a mechanical sorting platter, angling the trash to slide directly into its designated long-term sub-bin.'
));

// 8. Traffic
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-traffic.html'), generatePage(
    'ard-traffic', 'Intelligent Traffic Light System', 1799, '/images/products/traffic.jpeg',
    [
        '<strong>Density-Based Logic:</strong> Shifts intersection dominance dynamically depending on which lane possesses greater vehicular density.',
        '<strong>4-Way Junction Layout:</strong> Uses an overlapping matrix of 12 distinct high-powered LEDs mapped to an integrated crossroad prototype track.',
        '<strong>Override Framework:</strong> Included RF receiver allowing an "emergency service override" to instantly swap lights to green for ambulances.',
        '<strong>Delay Adjustability:</strong> Easy integer adjustments within the code base allows for mimicking real-world traffic intersections.'
    ],
    'Standard timer-based traffic lights cause billions of hours of congestion globally. The Intelligent Traffic Light System solves this issue locally by upgrading intersection management to density-based logic. Outfitted with specialized proximity sensors spanning all four vectors of a crossroad, the Arduino consistently calculates lane backlog. If Lane A has 20 waiting cars while Lane B is totally empty, the overarching logic bypasses typical fixed timers, instantly shifting the long green phase to Lane A. Furthermore, the system includes an advanced RF-break protocol mimicking real urban emergency response networking, allowing simulated ambulances an uninterrupted lane.'
));


// 9. Time Box
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-timebox.html'), generatePage(
    'ard-timebox', 'Arduino Time Box', 3999, '/images/products/timeb.webp',
    [
        '<strong>Smart digital timekeeping display via synchronized RTC modules.</strong>',
        '<strong>Customizable LED Matrix for animations and alerts.</strong>',
        '<strong>Built-in temp/humidity sub-sensors for room environment tracking.</strong>',
        '<strong>Sturdy transparent acrylic enclosure.</strong>'
    ],
    'The Arduino Time Box is more than a clock; it is a personalized smart desk companion. Engineered with a highly accurate Real-Time Clock (RTC) and an expansive LED matrix grid, the system automatically synchronizes time data alongside live room temperature readouts. It serves as an excellent foundational prototype for those interested in building custom smart home dashboards or learning about multiplexed LED animations.'
));

// 10. Robotic Arm
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-robotarm.html'), generatePage(
    'ard-robotarm', 'Robotic Arm', 4499, '/images/products/arm.jpg',
    [
        '<strong>4-Degrees of Freedom via high-torque micro servos.</strong>',
        '<strong>Customizable claw grip mechanism for variable object transport.</strong>',
        '<strong>Pre-programmed kinematic sequences accessible over serial.</strong>',
        '<strong>Durable laser-cut acrylic structural chassis.</strong>'
    ],
    'Unlock the fundamentals of industrial manufacturing with the Arduino Robotic Arm. This scaled-down 4-axis manipulator is built from laser-cut acrylic and driven by four independent servo motors capable of holding complex coordinate positions. Ideal for demonstrating kinematics, the arm comes loaded with pre-programmed subroutines allowing you to instruct it to grab, lift, transport, and release objects autonomously.'
));

// 11. Game Controller
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-gamectrl.html'), generatePage(
    'ard-gamectrl', 'Video Game Controller', 3899, '/images/products/gamer.jpg',
    [
        '<strong>Dual-axis analog thumbsticks allowing for precise directional movement.</strong>',
        '<strong>Responsive tactile switches mapped to standard HID inputs.</strong>',
        '<strong>Native USB plug-and-play architecture (emulates keyboard/mouse on PC).</strong>',
        '<strong>Ergonomic breadboard-free PCB assembly for hardcore longevity.</strong>'
    ],
    'The Arduino Video Game Controller completely breaks the barrier between hardware engineering and software entertainment. Based on the ATmega32U4 architecture, this controller natively emulates a USB Human Interface Device (HID), meaning your PC will instantly recognize it as a gamepad. Equipped with dual analog sticks and clicky tactile switches, it is the absolute perfect prototype for demonstrating how commercial console controllers are electronically processed.'
));

console.log('11 Complete Detailed Pages Generated!');

// Update arduino.html to use these new files.
const htmlPath = path.join(__dirname, 'public', 'arduino.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Strip out existing generic placeholder links for these specific entries
// Note: Since I inserted them as <a href="#" class="product-card">, I can target them precisely by the titles.

const productsFileMap = [
    { title: 'Arduino Fire Fighting Robot', file: 'product-ard-fire.html' },
    { title: 'Arduino Anti Sleep Alarm', file: 'product-ard-sleep.html' },
    { title: 'Arduino Alcohol Detection System', file: 'product-ard-alcohol.html' },
    { title: 'Arduino Smart Railway Gate', file: 'product-ard-railway.html' },
    { title: 'Arduino Bluetooth Home Automation', file: 'product-ard-bluetooth.html' },
    { title: 'Smart Parking System', file: 'product-ard-parking.html' },
    { title: 'Smart Garbage Segregation System', file: 'product-ard-garbage.html' },
    { title: 'Intelligent Traffic Light System', file: 'product-ard-traffic.html' },
    { title: 'Arduino Time Box', file: 'product-ard-timebox.html' },
    { title: 'Robotic Arm', file: 'product-ard-robotarm.html' },
    { title: 'Video Game Controller', file: 'product-ard-gamectrl.html' }
];

productsFileMap.forEach(p => {
    // Regex matches the <a href="..."> directly preceding the product-title div 
    // This regex looks for `<a [anything] class="product-card">` before the `<img...` and Title.
    // It's safer to just replace `<a href="#" class="product-card">` that's directly attached to the image with the specific title.
    // We already have the full block layout so let's match the block.
    
    // Using string split-replace trick to safely isolate the anchor tag for this product.
    // the product html block structure looks like:
    // <a href="#" class="product-card">
    //     <div style="background: ..."><img src="..." alt="..."></div>
    //     <div class="product-title" style="...">TITLE</div>
    
    const parts = html.split(`<div class="product-title" style="color: var(--link-color);">${p.title}</div>`);
    if (parts.length > 1) {
        // Find the last '<a href="#" class="product-card">' in parts[0]
        let chunk = parts[0];
        const lastAnchorIndex = chunk.lastIndexOf('<a href="#" class="product-card">');
        if (lastAnchorIndex !== -1) {
            chunk = chunk.substring(0, lastAnchorIndex) + 
                    `<a href="${p.file}" class="product-card">` + 
                    chunk.substring(lastAnchorIndex + 33); // 33 is length of '<a href="#" class="product-card">'
            parts[0] = chunk;
        } else {
            // Check if it already has <a class="product-card"> or something generic
             const fallbackIndex = chunk.lastIndexOf('<a class="product-card">');
             if (fallbackIndex !== -1) {
                  chunk = chunk.substring(0, fallbackIndex) + 
                    `<a href="${p.file}" class="product-card">` + 
                    chunk.substring(fallbackIndex + 24);
                  parts[0] = chunk;
             }
        }
        html = parts.join(`<div class="product-title" style="color: var(--link-color);">${p.title}</div>`);
    }
});

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Main arduino page hrefs linked correctly.');
