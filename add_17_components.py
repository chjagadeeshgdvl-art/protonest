import os
import shutil
import json
import uuid
import re

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
DEST_IMAGES_DIR = os.path.join(PROJECT_DIR, 'public', 'images', 'products')
BRAIN_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\brain\be1dc906-4f24-44f4-9865-51339460015f"

os.makedirs(DEST_IMAGES_DIR, exist_ok=True)

# Find the specific AI images
import glob
generated_images = {
    'uno': glob.glob(os.path.join(BRAIN_DIR, 'comp_uno_*.png')),
    'nano': glob.glob(os.path.join(BRAIN_DIR, 'comp_nano_*.png')),
    'mega': glob.glob(os.path.join(BRAIN_DIR, 'comp_mega_*.png')),
    'dht11': glob.glob(os.path.join(BRAIN_DIR, 'comp_dht11_*.png')),
    'ultrasonic': glob.glob(os.path.join(BRAIN_DIR, 'comp_ultrasonic_*.png')),
    'ir': glob.glob(os.path.join(BRAIN_DIR, 'comp_ir_*.png')),
    'mq': glob.glob(os.path.join(BRAIN_DIR, 'comp_mq_*.png')),
    'soil': glob.glob(os.path.join(BRAIN_DIR, 'comp_soil_*.png')),
    'gps': glob.glob(os.path.join(BRAIN_DIR, 'comp_gps_*.png'))
}

d = []
for k, paths in generated_images.items():
    if paths:
        d.append(paths[0])
        # copy to dest as simple name
        shutil.copy2(paths[0], os.path.join(DEST_IMAGES_DIR, f"comp_{k}.png"))

products = [
    {'id': 'comp-uno', 'name': 'Arduino UNO R3 Board', 'img': 'comp_uno.png', 'price': 550, 'features': ['ATmega328P Microcontroller', '14 Digital I/O Pins', '6 Analog Inputs', 'USB Connection'], 'desc': 'The flagship Arduino board. Perfectly suited for diving into electronics and coding. If this is your first experience tinkering with the platform, the UNO is the most robust board you can start playing with.'},
    {'id': 'comp-nano', 'name': 'Arduino Nano V3', 'img': 'comp_nano.png', 'price': 250, 'features': ['ATmega328P Chip', 'Breadboard Friendly', 'Mini-B USB', 'Ultra-compact Design'], 'desc': 'A small, complete, and breadboard-friendly board based on the ATmega328. It has more or less the same functionality of the Arduino DUEMILANOVE, but in a different package. It lacks only a DC power jack.'},
    {'id': 'comp-mega', 'name': 'Arduino MEGA 2560', 'img': 'comp_mega.png', 'price': 850, 'features': ['ATmega2560 Chip', '54 Digital I/O Pins', '16 Analog Inputs', 'Larger Memory Space'], 'desc': 'Designed for highly complex projects. With 54 digital input/output pins, 16 analog inputs, and a larger space for your sketch, it is the recommended board for 3D printers and robotics projects.'},
    {'id': 'comp-dht11', 'name': 'DHT11 Temp & Humidity Sensor', 'img': 'comp_dht11.png', 'price': 120, 'features': ['Digital Signal Output', 'High Reliability', 'Excellent Long-term Stability', 'Low Power Consumption'], 'desc': 'A basic, ultra low-cost digital temperature and humidity sensor. It uses a capacitive humidity sensor and a thermistor to measure the surrounding air, spitting out a digital signal on the data pin.'},
    {'id': 'comp-ultrasonic', 'name': 'HC-SR04 Ultrasonic Sensor', 'img': 'comp_ultrasonic.png', 'price': 100, 'features': ['2cm to 400cm Range', '3mm Ranging Accuracy', 'Effectual Angle: <15°', '5V DC Power'], 'desc': 'Provides 2cm to 400cm of non-contact measurement functionality with a ranging accuracy that can reach up to 3mm. Essential for obstacle-avoiding robots and distance calculation.'},
    {'id': 'comp-ir', 'name': 'IR Infrared Obstacle Sensor', 'img': 'comp_ir.png', 'price': 50, 'features': ['Adjustable Detection Range', 'Built-in Potentiometer', 'Digital Output (0 or 1)', 'Low Power Consumption'], 'desc': 'An infrared obstacle avoidance sensor module widely used in robot obstacle avoidance, obstacle avoidance car, line count, and black and white line tracking.'},
    {'id': 'comp-mq', 'name': 'MQ Series Gas Sensor (Multi-type)', 'img': 'comp_mq.png', 'price': 150, 'features': ['High Sensitivity', 'Fast Response Time', 'Adjustable Sensitivity', 'Analog and Digital Output'], 'desc': 'Ideal for detecting LPG, i-butane, propane, methane, alcohol, Hydrogen, smoke. These sensors are widely utilized in domestic gas leakage alarms and industrial combustible gas detectors.'},
    {'id': 'comp-soil', 'name': 'Soil Moisture Sensor Probe', 'img': 'comp_soil.png', 'price': 80, 'features': ['Dual Sensing Probes', 'LM393 Comparator Chip', 'Adjustable Threshold', 'Anti-corrosion Coating'], 'desc': 'A simple water sensor that can be used to detect soil moisture. Perfect for automatic plant watering systems. When the soil moisture deficit, the sensor outputs a HIGH signal.'},
    {'id': 'comp-gps', 'name': 'Neo-6M GPS Module', 'img': 'comp_gps.png', 'price': 450, 'features': ['U-blox NEO-6M Core', 'Built-in Ceramic Antenna', 'EEPROM Support', 'UART Interface'], 'desc': 'A versatile GPS module providing highly accurate location tracking data. Integrating perfectly with microcontrollers over serial, it\'s the foundational core for drone navigation and asset tracking.'},
    {'id': 'comp-gsm', 'name': 'SIM800L GSM Module', 'img': 'placeholder-gsm.jpg', 'price': 350, 'features': ['Quad-band 850/900/1800/1900MHz', 'Send and Receive SMS', 'Micro SIM Slot', 'TTL Serial Interface'], 'desc': 'A miniature cellular module allowing your microcontrollers to connect to mobile networks. Send SMS texts, execute phone calls, or transfer lightweight GPRS data packages.'},
    {'id': 'comp-rfid', 'name': 'RC522 RFID Reader Module', 'img': 'placeholder-rfid.jpg', 'price': 180, 'features': ['MFRC522 Chip', '13.56MHz Activity', 'SPI Interface', 'Includes Blank Cards/Tags'], 'desc': 'A highly integrated reader/writer IC for contactless communication. Utilize this module to build intelligent digital locks, attendance systems, and ID scanners.'},
    {'id': 'comp-l298n', 'name': 'L298N Motor Driver Module', 'img': 'placeholder-l298n.jpg', 'price': 150, 'features': ['Dual H-Bridge Motor Driver', 'Drives Two DC Motors', 'High Operating Voltage', 'Built-in 5V Regulator'], 'desc': 'The beating heart of robotic movement. The L298N module can control the speed and direction of two DC motors simultaneously, comfortably handling higher voltage draws from external batteries.'},
    {'id': 'comp-motors', 'name': 'BO DC Gear Motors (Pair)', 'img': 'placeholder-motors.jpg', 'price': 160, 'features': ['Lightweight Plastic Gearbox', 'Operating Voltage: 3V to 6V', 'Various RPM Options', 'Easy Wheel Mounting'], 'desc': 'Battery Operated (BO) DC Motors provide solid torque at low speeds. Essential for hobbyist 2WD and 4WD robotic automobile chassis builds.'},
    {'id': 'comp-breadboard', 'name': '830 Tie-Points Breadboard', 'img': 'placeholder-breadboard.jpg', 'price': 120, 'features': ['830 Solderless Points', 'Dual Power Rails', 'Standard 2.54mm Pitch', 'Adhesive Backing'], 'desc': 'The foundational canvas for electronics prototyping. Build and test robust circuits safely without messy soldering. Features standard dual power rails for clean voltage distribution.'},
    {'id': 'comp-leds', 'name': 'Assorted 5mm LEDs (Multi-color pac)', 'img': 'placeholder-leds.jpg', 'price': 50, 'features': ['Multi-color Mix (Red, Green, Blue)', 'Standard 5mm Lens', 'Low Power Rating', 'Clear & Diffused Options'], 'desc': 'Illuminate your prototypes with visual status signals. A standard pack of highly reliable, long-lasting 5mm Light Emitting Diodes perfect for learning basic circuit resistance.'},
    {'id': 'comp-buzzers', 'name': 'Active Piezo Buzzers', 'img': 'placeholder-buzzer.jpg', 'price': 30, 'features': ['Active Drive Type', 'Loud 85dB Tone', '3V to 5V Operation', 'PCB Mountable'], 'desc': 'Integrate auditory alerts into your systems. Because these are active buzzers, simply supplying them with standard 5V DC power will immediately generate a loud, continuous frequency tone.'},
    {'id': 'comp-wires', 'name': 'Dupont Jumper Wires (M-M, M-F, F-F)', 'img': 'placeholder-jumpers.jpg', 'price': 80, 'features': ['40-Pin Ribbon Form', 'Male & Female Headers', 'Standard 20cm Length', 'Multi-colored Separation'], 'desc': 'High quality standardized jumper wires for breadboarding and module interfacing. Essential connectors available as Male-to-Male, Male-to-Female, and Female-to-Female to bridge any gap.'}
]

# Write DB
db_path = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

for p in products:
    exists = any(ex['name'] == p['name'] for ex in db.get('products', []))
    if not exists:
        db['products'].append({
            "id": str(uuid.uuid4()),
            "name": p['name'], "description": p['desc'], "price": p['price'],
            "original_price": None, "category": "components", "sub_category": "components",
            "platform": "none", "rating": 5, "rating_count": 0, "stock": 50,
            "features": p['features'], "image": f"/images/products/{p['img']}"
        })

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

# Generate HTML
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - ProtoNest</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .breadcrumb { margin: 15px 0; font-size: 13px; color: var(--text-secondary); }
        .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .product-detail-layout { display: grid; grid-template-columns: 40% 35% 25%; gap: 30px; background: white; padding: 30px; border-radius: var(--border-radius); box-shadow: var(--box-shadow); }
        .main-image { width: 100%; height: 400px; background: #f8f8f8; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .main-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .product-info h1 { font-size: 24px; line-height: 1.3; margin-bottom: 20px; font-weight: 500; }
        .price-block { padding: 15px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 20px; }
        .price-current { font-size: 28px; color: var(--danger); font-weight: 500; }
        .about-item-title { font-weight: bold; margin-bottom: 15px; font-size: 18px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .bullet-list { margin-left: 20px; line-height: 1.7; font-size: 15px; margin-bottom: 20px; }
        .product-description { font-size: 15px; color: #333; line-height: 1.8; text-align: justify; padding: 20px; background-color: #fcfcfc; border-left: 4px solid #00979C; border-radius: 4px; }
        .buy-box { border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 25px; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .buy-box-price { font-size: 28px; font-weight: 600; color: #111; margin-bottom: 15px; }
        .btn-add-cart { background-color: #FFD814; color: #111; width: 100%; border-radius: 50px; padding: 14px; font-size: 15px; font-weight: 500; margin-bottom: 10px; border: 1px solid #FCD200; cursor: pointer; transition: background 0.2s; }
        .btn-add-cart:hover { background-color: #F7CA00; }
        .btn-buy-now { background-color: #FFA41C; color: #111; width: 100%; border-radius: 50px; padding: 14px; font-size: 15px; font-weight: 500; border: 1px solid #FF8F00; cursor: pointer; transition: background 0.2s; }
        .btn-buy-now:hover { background-color: #FA8900; }
        .toast { position: fixed; top: 20px; right: 20px; background: #067D62; color: white; padding: 15px 25px; border-radius: 8px; font-weight: 500; z-index: 9999; transform: translateX(120%); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .toast.show { transform: translateX(0); }
    </style>
</head>
<body style="background-color: #f2f2f2;">
    <div class="toast" id="toast">✓ Item successfully added to Cart!</div>
    <header>
        <div class="container header-top">
            <a href="index.html" class="logo">Proto<span>Nest</span></a>
            <div class="header-actions">
                <a href="cart.html" style="color: white; font-weight: bold; font-size: 16px;">Cart <span class="cart-count">0</span></a>
            </div>
        </div>
    </header>
    <nav style="background-color: #006064;">
        <div class="container">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="arduino.html">Arduino Prototypes</a></li>
                <li><a href="components.html" style="color: #00E5FF; border-bottom: 2px solid #00E5FF;">Electronic Components</a></li>
            </ul>
        </div>
    </nav>
    <main class="container" style="margin-top: 20px; margin-bottom: 60px;">
        <div class="breadcrumb">
            <a href="index.html">Home</a> › <a href="components.html">Electronic Components</a> › <span style="color: #111; font-weight: 500;">{name}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-imagery">
                <div class="main-image">
                    <img src="/images/products/{img}" alt="{name}" onerror="this.outerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#eaeaea;color:#999;font-weight:bold;\\'>[Image Generation Exhausted - Add File Later]</div>'">
                </div>
            </div>
            <div class="product-info">
                <h1>{name}</h1>
                <div class="price-block">
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <span class="price-current">₹{price_str}</span>
                    </div>
                </div>
                <div class="about-item-title">Hardware Specifications</div>
                <ul class="bullet-list">{features_bullets}</ul>
                <div class="about-item-title">Component Description</div>
                <div class="product-description">{desc}</div>
            </div>
            <div>
                <div class="buy-box">
                    <div class="buy-box-price">₹{price_str}.00</div>
                    <div style="color: #007600; font-size: 18px; margin-bottom: 15px; font-weight: 500;">In stock and Ready to Ship</div>
                    <button class="btn-add-cart" id="addToCartBtn">🛒 Add to Cart</button>
                    <button class="btn-buy-now" id="buyNowBtn">⚡ Buy Now</button>
                </div>
            </div>
        </div>
    </main>
    <script src="js/cart.js"></script>
    <script>
        const product = {
            id: '{id}', name: '{name}', price: {price}, image: '/images/products/{img}'
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
</html>"""

for p in products:
    filepath = os.path.join(PROJECT_DIR, 'public', f'product-{p["id"]}.html')
    price_str = f"{p['price']:,}"
    bullets = "\n                    ".join([f"<li>{f}</li>" for f in p['features']])
    
    html = TEMPLATE
    html = html.replace('{id}', str(p['id']))
    html = html.replace('{name}', str(p['name']))
    html = html.replace('{price}', str(p['price']))
    html = html.replace('{price_str}', str(price_str))
    html = html.replace('{img}', str(p['img']))
    html = html.replace('{features_bullets}', str(bullets))
    html = html.replace('{desc}', str(p['desc']))
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
        
# 4. Inject into components.html
components_path = os.path.join(PROJECT_DIR, 'public', 'components.html')

if not os.path.exists(components_path):
    print("Warning: components.html doesn't exist, I should create it.")
    components_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Electronic Components - ProtoNest</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body style="background-color: #f2f2f2;">
    <header><div class="container header-top"><a href="index.html" class="logo">Proto<span>Nest</span></a></div></header>
    <nav style="background-color: #006064;">
        <div class="container">
            <ul><li><a href="index.html">Home</a></li><li><a href="arduino.html">Arduino Prototypes</a></li><li><a href="components.html" style="color: #00E5FF; border-bottom: 2px solid #00E5FF;">Electronic Components</a></li></ul>
        </div>
    </nav>
    <main class="container" style="margin-top: 30px; margin-bottom: 60px;">
        <h2>Electronic Components Catalog</h2>
        <div class="product-grid">
        </div>
    </main>
</body>
</html>"""
    with open(components_path, 'w', encoding='utf-8') as f:
        f.write(components_html)

with open(components_path, 'r', encoding='utf-8') as f:
    content = f.read()

addedCards = ""
for p in products:
    price_str = f"{p['price']:,}.00"
    card = f'''
                    <a href="product-{p['id']}.html" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/{p['img']}" alt="{p['name']}" style="width:100%; height:100%; object-fit:contain;" onerror="this.outerHTML='<div style=\\'color:#999;font-weight:bold;font-size:12px;text-align:center;padding:10px;\\'>[Pending Upload]</div>'">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">{p['name']}</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 0</div>
                        <div class="product-price">₹ {price_str}</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>'''
    if p['name'] not in content:
        addedCards += card

if addedCards:
    # Safely insert before the closing Grid.
    new_content = re.sub(
        r'(\n\s*</div>\s*</main>)', 
        addedCards + r'\1', 
        content
    )
    if new_content == content:
        # try slightly different endings
        new_content = re.sub(r'(</div>\s*</main>)', addedCards + r'\n\1', content)

    with open(components_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected grids into components.html")
else:
    print("Cards already exist in components.html")

print("Generated 17 component pages.")
