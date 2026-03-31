import os
import shutil
import json
import re

# Base paths
SS_DIR = r"C:\Users\DHFM Jagadeesh\Desktop\SS image"
FALL_AI_PATH = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\brain\be1dc906-4f24-44f4-9865-51339460015f\fall_alert_system_1774919361680.png"
PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
DEST_IMAGES_DIR = os.path.join(PROJECT_DIR, 'public', 'images', 'products')

# Ensure dest images folder exists
os.makedirs(DEST_IMAGES_DIR, exist_ok=True)

# Data mapping
# ID: (source_path, dest_filename, price_rs)
MAPPING = {
    'ard-flood': (os.path.join(SS_DIR, 'flood.png'), 'flood.png', 1999),
    'ard-irrigation': (os.path.join(SS_DIR, 'level.png'), 'level.png', 1999),
    'ard-gas': (os.path.join(SS_DIR, 'gas.jpg'), 'gas.jpg', 1899),
    'ard-medicine': (os.path.join(SS_DIR, 'medicine.jpg'), 'medicine.jpg', 2499),
    'ard-health': (os.path.join(SS_DIR, 'monitor.jpg'), 'monitor.jpg', 2699),
    'ard-toll': (os.path.join(SS_DIR, 'toll.webp'), 'toll.webp', 1799),
    'ard-fall': (FALL_AI_PATH, 'fall_ai.png', 0) # Price unspecified, we will leave as [Enter Price] or set to generic. The user said: "insert that pic only". So price stays 0
}

# 1. Copy Images
for prod_id, (src, dest_name, price) in MAPPING.items():
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(DEST_IMAGES_DIR, dest_name))
        print(f"Copied {dest_name}")
    else:
        print(f"Error: Could not find {src}")

# 2. Update protonest-data.json
db_path = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
with open(db_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for prod in data.get('products', []):
    prod_id = prod['id']
    # Check if this prod has an id like 'ard-XXX'. Wait, earlier I generated uuid for them.
    # Ah! In the javascript I used uuidv4() for the ID but I named the HTML templates using `id: 'ard-flood'`.
    # Let's match by name.
    
    mapping_by_name = {
        'Arduino Flood Alert System': MAPPING['ard-flood'],
        'Smart Irrigation Control': MAPPING['ard-irrigation'],
        'Gas Leakage Alert System': MAPPING['ard-gas'],
        'Fall Detection System': MAPPING['ard-fall'],
        'Smart Medicine Reminder': MAPPING['ard-medicine'],
        'Remote Health Monitoring IoT': MAPPING['ard-health'],
        'Smart Toll Gate Automation': MAPPING['ard-toll']
    }
    
    if prod['name'] in mapping_by_name:
        src, dest_name, price = mapping_by_name[prod['name']]
        prod['image'] = f"/images/products/{dest_name}"
        if price > 0:
            prod['price'] = price
        print(f"Updated DB for {prod['name']}")

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

# 3. Update public/arduino.html
arduino_html_path = os.path.join(PROJECT_DIR, 'public', 'arduino.html')
with open(arduino_html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

for prod_id, (src, dest_name, price) in MAPPING.items():
    # Replace in grids. The URL is 'product-{prod_id}.html'
    # The block has `<img src="/images/products/placeholder-...` and `₹ [Enter Price]`
    # Let's do string replacement strategically based on the block around product-XX.html
    
    marker = f'href="product-{prod_id}.html"'
    if marker in html_content:
        # Replace the placeholder img for this specific product
        # A bit tricky with regex, simpler way: split by marker and replace forward
        parts = html_content.split(marker)
        if len(parts) > 1:
            chunk = parts[1]
            
            # replace image src
            chunk = re.sub(r'src="[^"]+"', f'src="/images/products/{dest_name}"', chunk, count=1)
            # replace the error fallback placeholder to remove the [Insert Image]
            chunk = re.sub(r'onerror="this\.outerHTML=\'[^\']+\'"', "", chunk, count=1) 
            
            # replace price
            if price > 0:
                chunk = chunk.replace('₹ [Enter Price]', f'₹ {price}.00', 1)
                
            parts[1] = chunk
            html_content = marker.join(parts)

with open(arduino_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)
    print("Updated arduino.html")

# 4. Update individual product pages
for prod_id, (src, dest_name, price) in MAPPING.items():
    prod_html_path = os.path.join(PROJECT_DIR, 'public', f'product-{prod_id}.html')
    if os.path.exists(prod_html_path):
        with open(prod_html_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        content = re.sub(r'src="[^"]+"', f'src="/images/products/{dest_name}"', content, count=1)
        content = re.sub(r'onerror="this\.outerHTML=\'[^\']+\'"', "", content, count=1) 
        
        # We also need to update price in `const product = { ... image: '/img.png' }`
        content = re.sub(r"image:\s*'[^']+'", f"image: '/images/products/{dest_name}'", content)
        
        if price > 0:
            price_str = f"{price:,}" # comma separated
            content = content.replace('₹[Enter Price]', f'₹{price_str}')
            content = content.replace('[Enter Price]', f'{price_str}')
            # Update the JS object price
            content = re.sub(r'price:\s*0', f'price: {price}', content)
            
        with open(prod_html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated product-{prod_id}.html")
