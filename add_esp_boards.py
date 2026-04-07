import os
import json
import uuid
import re

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"

products = [
    {
        'id': 'comp-esp32',
        'name': 'ESP32 Wi-Fi & Bluetooth Dual-Core',
        'img': 'placeholder-esp32.jpg',
        'price': 300,
        'features': ['Tensilica Xtensa Dual-Core 32-bit LX6', 'Built-in Wi-Fi & Dual-mode Bluetooth', '520 KB SRAM', 'Ultra-Low Power Management'],
        'desc': 'The flagship IoT microcontroller. The ESP32 is a powerful, generic Wi-Fi+BT+BLE MCU module that targets a wide variety of applications, ranging from low-power sensor networks to the most demanding tasks, such as voice encoding and music streaming.'
    },
    {
        'id': 'comp-esp8266',
        'name': 'ESP8266 NodeMCU CP2102',
        'img': 'placeholder-esp8266.jpg',
        'price': 300,
        'features': ['802.11 b/g/n Wi-Fi Protocol', 'Integrated TCP/IP Protocol Stack', 'CP2102 USB to TTL Chip', '10 GPIO, every GPIO can be PWM/I2C/1-wire'],
        'desc': 'A highly integrated Wi-Fi SoC solution to meet users\' continuous demands for efficient power usage, compact design and reliable performance in the IoT industry. Ideal for smart home sensor bridges.'
    },
    {
        'id': 'comp-esp32cam',
        'name': 'ESP32-CAM Development Board with OV2640',
        'img': 'placeholder-esp32cam.jpg',
        'price': 600,
        'features': ['Ultra-small 802.11b/g/n Wi-Fi + BT/BLE SoC module', 'Includes OV2640 2MP Camera', 'Built-in TF Card Slot', 'Support Image WiFI Upload'],
        'desc': 'A small-size camera module. The ESP32-CAM can be widely used in various IoT applications. It is suitable for home smart devices, industrial wireless control, wireless monitoring, and IoT security solutions.'
    }
]

# 1. Update Database
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


# Generate HTML Pages
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
        .main-image { width: 100%; height: 400px; background: #f8f8f8; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; }
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
                    <img src="/images/products/{img}" alt="{name}" onerror="this.outerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#eaeaea;color:#999;font-weight:bold;\\'>[Pending Upload]</div>'">
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


# Inject into grid
components_path = os.path.join(PROJECT_DIR, 'public', 'components.html')

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
    if p['id'] not in content:
        addedCards += card

if addedCards:
    new_content = re.sub(r'(\n\s*</div>\s*</main>)', addedCards + r'\1', content)
    if new_content == content:
        new_content = re.sub(r'(</div>\s*</main>)', addedCards + r'\n\1', content)
    with open(components_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected into components.html")
else:
    print("Already in components.html")
