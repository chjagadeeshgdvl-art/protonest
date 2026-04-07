import os
import shutil
import json
import uuid
import re

# Paths
PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
SS_DIR = r"C:\Users\DHFM Jagadeesh\Desktop\SS image"
DEST_IMAGES_DIR = os.path.join(PROJECT_DIR, 'public', 'images', 'products')

# The 6 configurations
products = [
    {
        'id': 'esp-surveillance',
        'name': 'ESP32-CAM Live Surveillance Robot',
        'img': 'cam robot.png',
        'price': 3599,
        'features': ['ESP32-CAM Video Module', 'Dual Motor Drive Chassis', 'Wi-Fi Web UI Controls', 'Zero-latency MJPEG Stream'],
        'desc': 'A versatile remote surveillance rover logic build. Deploying the ESP32-CAM, this robot connects seamlessly to your local internet and pipes a live camera feed straight to a customized dashboard, allowing you to drive it manually via web buttons.'
    },
    {
        'id': 'esp-face',
        'name': 'Face Security System',
        'img': 'face2.jpg',
        'price': 2299,
        'features': ['ESP32-CAM Optics', 'Solenoid Door Lock Relay', 'Web-Socket Security Logs', 'TensorFlow CV Ready'],
        'desc': 'A smart home authorization module prototype. When a visitor approaches, the system snaps a high-res photograph and cross-references an internal database, automatically unlocking a 12V physical door deadbolt if a pre-approved face is matched.'
    },
    {
        'id': 'esp-fertilizer',
        'name': 'Smart Fertilizer Spraying System',
        'img': 'spray.jpeg',
        'price': 3299,
        'features': ['ESP8266 IoT Processing', '12V High-Pressure Pump Controller', 'Liquid Level Sensors', 'Blynk App Dashboard Integration'],
        'desc': 'Targeted agriculture automation relies on this node. Using precise timing algorithms and environmental sensors, this smart spraying tank selectively distributes fluid nutrients across soil beds only when optimally required, conserving resources.'
    },
    {
        'id': 'esp-livestock',
        'name': 'Livestock Monitoring System',
        'img': 'stock.avif',
        'price': 3299,
        'features': ['NodeMCU Secure Cloud Uplink', 'Neo-6M GPS Tracking', 'Ambient Temperature Sensing', 'Compact Wearable Neck Collar Form'],
        'desc': 'Track thousands of animals reliably through centralized IoT endpoints. This wearable collar prototype uploads vital telemetry arrays to the cloud via the nearest Wi-Fi node, giving farmers a bird\'s eye map of their entire flock\'s health and location.'
    },
    {
        'id': 'esp-farmbot',
        'name': 'Smart Farm Robot',
        'img': 'farm.jpeg',
        'price': 3599,
        'features': ['ESP32 Master Brain', 'Omni-directional Treads', 'Soil Moisture Penetration Probe', 'Automated Area Routing Code'],
        'desc': 'A mobile agricultural assistant built to traverse uneven terrain. The robot autonomously halts to analyze the soil chemical make-up and uploads the diagnostics, ensuring precision farm data can be processed on the backend server.'
    },
    {
        'id': 'esp-wheelchair',
        'name': 'Smart Wheel Chair',
        'img': 'wheel.jpg',
        'price': 3599,
        'features': ['Hand-gesture MPU6050 Triggers', 'Smartphone Network Steering', 'Collision Avoidance Ultrasonic Scanners', 'High-Torque Motor Drivers'],
        'desc': 'A mobility accessibility prototype giving control back to the patient. Utilizing smart network processing, the chair can be driven traditionally via joystick, remotely supervised by a nurse application, or natively run using intuitive head/hand tilts.'
    }
]

# 1. Copy Images
for p in products:
    src = os.path.join(SS_DIR, p['img'])
    dst = os.path.join(DEST_IMAGES_DIR, p['img'])
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {p['img']}")
    else:
        print(f"ERROR: Could not find {p['img']}")

# 2. Add to Data JSON
db_path = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

for p in products:
    # check if exists
    exists = False
    for ex in db.get('products', []):
        if ex['name'] == p['name']:
            exists = True
            break
    if not exists:
        db['products'].append({
            "id": str(uuid.uuid4()),
            "name": p['name'],
            "description": p['desc'],
            "price": p['price'],
            "original_price": None,
            "category": "prototypes",
            "sub_category": "esp",
            "platform": "esp",
            "rating": 5,
            "rating_count": 0,
            "stock": 10,
            "features": p['features'],
            "image": f"/images/products/{p['img']}"
        })

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)
print("Database expanded with ESP products.")

# 3. Create individual pages
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - ProtoGods by JK labs</title>
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
                <input type="text" placeholder="Search the ESP NodeMCU Library...">
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
                <li><a href="arduino.html">Arduino Prototypes</a></li>
                <li><a href="raspberry.html">Raspberry Pi</a></li>
                <li><a href="esp.html" style="color: #00E5FF; border-bottom: 2px solid #00E5FF;">ESP NodeMCU</a></li>
                <li><a href="components.html">Electronic Components</a></li>
            </ul>
        </div>
    </nav>
    <main class="container" style="margin-top: 20px; margin-bottom: 60px;">
        <div class="breadcrumb">
            <a href="index.html">Home</a> ›
            <a href="esp.html">ESP NodeMCU Library</a> ›
            <span style="color: #111; font-weight: 500;">{name}</span>
        </div>
        <div class="product-detail-layout">
            <div class="product-imagery">
                <div class="main-image">
                    <img src="/images/products/{img}" alt="{name}">
                </div>
            </div>
            <div class="product-info">
                <h1>{name}</h1>
                <a href="esp.html" class="brand-link">Explore more WiFi IoT Builds by JK Labs</a>
                <div class="ratings">⭐⭐⭐⭐⭐ <a href="#" class="ratings-count">190 Verified Reviews</a></div>
                <div class="price-block">
                    <div class="price-label">Official Prototype Kit</div>
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <span class="price-current">₹{price_str}</span>
                    </div>
                </div>
                
                <div class="about-item-title">Core Specifications & Hardware Overview</div>
                <ul class="bullet-list">
                    {features_bullets}
                </ul>
                
                <div class="about-item-title">Comprehensive Project Context</div>
                <div class="product-description">
                    {desc}
                </div>
            </div>
            <div>
                <div class="buy-box">
                    <div class="buy-box-price">₹{price_str}.00</div>
                    <div class="delivery-info"><span style="color: #007600;">FREE priority shipping</span> to your location <br><br>Estimated delivery: <span class="delivery-date">Within 2 to 4 business days</span></div>
                    <div class="stock-status">In stock and Ready to Ship</div>
                    <div style="font-size: 13px; margin-bottom: 25px; line-height: 1.5;">
                        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 5px;">
                            <span style="color: var(--text-secondary);">Dispatches from</span> <span>ProtoGods by JK labs Central Hub</span>
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
        const product = {{
            id: '{id}',
            name: '{name}',
            price: {price},
            image: '/images/products/{img}'
        }};
        document.getElementById('addToCartBtn').addEventListener('click', () => {{
            addToCart(product);
            const toast = document.getElementById('toast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }});
        document.getElementById('buyNowBtn').addEventListener('click', () => {{
            addToCart(product);
            window.location.href = 'cart.html';
        }});
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
    print(f"Generated product-{p['id']}.html")

# 4. Inject into esp.html
esp_path = os.path.join(PROJECT_DIR, 'public', 'esp.html')
with open(esp_path, 'r', encoding='utf-8') as f:
    content = f.read()

addedCards = ""
for p in products:
    price_str = f"{p['price']:,}.00"
    card = f'''
                    <a href="product-{p['id']}.html" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/{p['img']}" alt="{p['name']}" style="width:100%; height:100%; object-fit:contain;">
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
    # Safely insert before the closing Grid / Main in esp.html
    # In all typical files here like esp.html, they end with:
    #                 </div>
    #             </div>
    #         </div>
    #     </main>
    # Use re to match last closing </div> inside main
    new_content = re.sub(
        r'(\n\s*</div>\s*</div>\s*</div>\s*</main>)', 
        addedCards + r'\1', 
        content
    )
    # Fallback if esp.html ends differently
    if new_content == content:
        # Fallback to general `</div>\s*</div>\s*</main>`
        new_content = re.sub(
            r'(\n\s*</div>\s*</div>\s*</main>)', 
            addedCards + r'\1', 
            content
        )
    with open(esp_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected grids into esp.html")
else:
    print("Cards already exist in esp.html")
    
print("All ESP tasks completed.")
