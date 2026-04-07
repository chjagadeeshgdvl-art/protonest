import json
import sqlite3
import os
import re

updates = {
    "Weather Monitoring": 3499,
    "Smart Dustbin": 3499,
    "Bluetooth": 4599,
    "Line Follower": 4599,
    "Sleep Alarm": 3299,
    "Fire Fighting": 4999,
    "Alcohol Detection": 3699,
    "Railway Gate": 3799,
    "Home Automation": 4599,
    "Smart Parking": 3899,
    "Smart Garbage": 3699,
    "Traffic Light": 3999,
    "Flood Alert": 4299,
    "Irrigation": 4699,
    "Gas Leakage": 3999,
    "Earthquake": 3999,
    "Medicine Rem": 4399,
    "Health Monitoring": 49999,
    "Toll Gate": 3699
}

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
DB_JSON = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
SQLITE_DB = os.path.join(PROJECT_DIR, 'database', 'protonest.db')
PUBLIC_DIR = os.path.join(PROJECT_DIR, 'public')

# 1. Update protonest-data.json
with open(DB_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

product_name_map = {}
price_changes = {}

for product in data.get('products', []):
    name = product.get('name', '')
    for keyword, new_price in updates.items():
        # Match intelligently (e.g. "Bluetooth" handles "Bluetooth RC Robot" and "Bluetooth Home Automation" if specific enough. Wait! Bluetooth RC and Bluetooth Home both have 4599. Let's just do keyword matching.)
        if keyword.lower() in name.lower():
            old_price = product.get('price')
            
            # Record mappings for HTML replacements
            product_name_map[product['id']] = name
            price_changes[name] = {"old": old_price, "new": new_price}
            
            product['price'] = new_price
            break

with open(DB_JSON, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Updated protonest-data.json:")
for n, c in price_changes.items():
    print(f" - {n}: {c['old']} -> {c['new']}")

# 2. Update SQLite
try:
    conn = sqlite3.connect(SQLITE_DB)
    cursor = conn.cursor()
    for name, c in price_changes.items():
        cursor.execute("UPDATE products SET price = ? WHERE name = ?", (c['new'], name))
    conn.commit()
    conn.close()
    print("Updated SQLite DB.")
except Exception as e:
    print("SQLite update error:", e)

# 3. Update HTML files (arduino.html, index.html, product-*.html)
# We will do a regex to find the price directly following the product name or id in data-attributes

def fmt(p): return f"{p:,}" # 1799 -> 1,799

for root, dirs, files in os.walk(PUBLIC_DIR):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            orig_content = content
            
            for name, c in price_changes.items():
                op_plain = str(c['old'])
                op_fmt = fmt(c['old'])
                np_plain = str(c['new'])
                np_fmt = fmt(c['new'])
                
                # Update attributes: data-price="1799" for specific name
                import re
                
                # Update data-price attribute where name matches
                # e.g. data-name="Weather Monitoring System" data-price="1799"
                # Using a generic approach: if we see the product name in a block, we replace its prices.
                # Actually, simpler: finding `<div class="product-title">Name</div>\n<div class="product-price">₹1,799`
                # Let's search and replace carefully.
                
                # We can replace the formatted price only if the product name appears nearby (within ~200 chars before)
                pattern = re.compile(rf'({re.escape(name)}.*?)(₹{op_plain}|₹{op_fmt}|data-price="{op_plain}")', re.DOTALL | re.IGNORECASE)
                
                def repl(m):
                    group1 = m.group(1)
                    match_str = m.group(2)
                    if 'data-price' in match_str:
                        return group1 + f'data-price="{np_plain}"'
                    elif ',' in match_str:
                        return group1 + f'₹{np_fmt}'
                    else:
                        return group1 + f'₹{np_plain}'
                
                # Run multiple times to catch multiple prices (e.g. main price + cart button)
                for _ in range(3):
                    content = pattern.sub(repl, content)
                    
                # Also handle product pages where name is in <title> or <h1>, and price is further down
                if name.lower() in content.lower() and ('product-' in file or file == 'index.html' or file == 'arduino.html'):
                    content = content.replace(f'₹{op_fmt}', f'₹{np_fmt}')
                    content = content.replace(f'₹{op_plain}', f'₹{np_plain}')
                    content = content.replace(f'data-price="{op_plain}"', f'data-price="{np_plain}"')
                    content = content.replace(f'Buy Now – ₹{op_fmt}', f'Buy Now – ₹{np_fmt}')

            if content != orig_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated HTML: {file}")
