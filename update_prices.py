import os
import re
import json

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"

price_map = {
    'comp-uno': 650,
    'comp-nano': 350,
    'comp-mega': 2199,
    'comp-dht11': 110,
    'comp-ultrasonic': 100,
    'comp-ir': 70,
    'comp-mq': 100,
    'comp-soil': 70,
    'comp-gps': 450,
    'comp-gsm': 650,
    'comp-rfid': 350,
    'comp-l298n': 350,
    'comp-motors': 100,
    'comp-breadboard': 250,
    'comp-leds': 5,
    'comp-buzzers': 35,
    'comp-wires': 5
}

# 1. Update Database
db_path = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# The auto-generated names corresponding exactly to the components
name_to_id = {
    'Arduino UNO R3 Board': 'comp-uno',
    'Arduino Nano V3': 'comp-nano',
    'Arduino MEGA 2560': 'comp-mega',
    'DHT11 Temp & Humidity Sensor': 'comp-dht11',
    'HC-SR04 Ultrasonic Sensor': 'comp-ultrasonic',
    'IR Infrared Obstacle Sensor': 'comp-ir',
    'MQ Series Gas Sensor (Multi-type)': 'comp-mq',
    'Soil Moisture Sensor Probe': 'comp-soil',
    'Neo-6M GPS Module': 'comp-gps',
    'SIM800L GSM Module': 'comp-gsm',
    'RC522 RFID Reader Module': 'comp-rfid',
    'L298N Motor Driver Module': 'comp-l298n',
    'BO DC Gear Motors (Pair)': 'comp-motors',
    '830 Tie-Points Breadboard': 'comp-breadboard',
    'Assorted 5mm LEDs (Multi-color pac)': 'comp-leds',
    'Active Piezo Buzzers': 'comp-buzzers',
    'Dupont Jumper Wires (M-M, M-F, F-F)': 'comp-wires'
}

for i in range(len(db.get('products', []))):
    pname = db['products'][i]['name']
    if pname in name_to_id:
        p_id = name_to_id[pname]
        new_price = price_map[p_id]
        db['products'][i]['price'] = new_price

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Updated protonest-data.json pricing.")

# 2. Update individual product HTML files
for p_id, new_price in price_map.items():
    filepath = os.path.join(PROJECT_DIR, 'public', f'product-{p_id}.html')
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The template has fields like:
    # 1: <span class="price-current">₹550</span>
    # 2: <div class="buy-box-price">₹550.00</div>
    # 3: price: 550,
    
    price_str = f"{new_price:,}"
    
    # Replace price block
    content = re.sub(r'<span class="price-current">₹.*?</span>', f'<span class="price-current">₹{price_str}</span>', content)
    content = re.sub(r'<div class="buy-box-price">₹.*?\.00</div>', f'<div class="buy-box-price">₹{price_str}.00</div>', content)
    content = re.sub(r'price:\s*\d+,', f'price: {new_price},', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated 17 product pages.")

# 3. Update components.html grid prices
comp_html_path = os.path.join(PROJECT_DIR, 'public', 'components.html')
if os.path.exists(comp_html_path):
    with open(comp_html_path, 'r', encoding='utf-8') as f:
        comp_content = f.read()
        
    for pname, p_id in name_to_id.items():
        new_price = price_map[p_id]
        price_str = f"{new_price:,}.00"
        
        # In the grid, the format is roughly:
        # <div class="product-title"...>{pname}</div>
        # <div style="color: #ff9900...
        # <div class="product-price">₹ 550.00</div>
        
        # We can use regex to find the title, and then the next price div.
        # However, a simpler string replace might fail. Let's use re to replace the price immediately following the title.
        
        pattern = re.compile(f'(<div class="product-title"[^>]*>{re.escape(pname)}</div>\\s*<div[^>]*>.*?</div>\\s*<div class="product-price">₹\\s*).*?(</div>)', re.DOTALL)
        
        comp_content = pattern.sub(f'\\g<1>{price_str}\\g<2>', comp_content)

    with open(comp_html_path, 'w', encoding='utf-8') as f:
        f.write(comp_content)

print("Updated components.html grid prices.")
