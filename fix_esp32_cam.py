import json
import sqlite3
import os
import re

updates = {
    "ESP32-CAM Live Surveillance": 6499
}

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
DB_JSON = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
SQLITE_DB = os.path.join(PROJECT_DIR, 'database', 'protonest.db')
PUBLIC_DIR = os.path.join(PROJECT_DIR, 'public')

def fmt(p): return f"{p:,}"

# 1. Update protonest-data.json
with open(DB_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

product_name_map = {}
price_changes = {}

for product in data.get('products', []):
    name = product.get('name', '')
    for keyword, new_price in updates.items():
        if keyword.lower() in name.lower():
            old_price = product.get('price')
            product_name_map[product['id']] = name
            price_changes[name] = {'old': old_price, 'new': new_price, 'keyword': keyword}
            product['price'] = new_price
            break

with open(DB_JSON, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print('Updated JSON')
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
    print('Updated SQLite')
except Exception as e:
    print('SQLite error:', e)

# 3. Update HTML files
for root, dirs, files in os.walk(PUBLIC_DIR):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            orig_content = content

            for name, c in price_changes.items():
                np_fmt = fmt(c['new'])
                keyword = c['keyword']
                
                # We specifically look for the block wrapping this keyword
                pattern_block = re.compile(rf'({re.escape(keyword)}.*?</div(?:>|\s+[^>]*>).*?(?:₹|&#8377;|\?)\s*)([\d,]+(?:[.]\d+)?)', re.DOTALL | re.IGNORECASE)
                
                def repl_block(m):
                    prefix = m.group(1)
                    old_val = m.group(2)
                    suffix = '.00' if '.00' in old_val else ''
                    if len(prefix) < 400:
                        return prefix + np_fmt + suffix
                    return m.group(0)
                
                for _ in range(3):
                    content = pattern_block.sub(repl_block, content)

                # Update data-price
                pattern_btn = re.compile(rf'(data-name="[^"]*{keyword}[^"]*"\s*(?:id="[^"]+"\s*)?data-price=")(\d+)(")', re.IGNORECASE)
                content = pattern_btn.sub(rf'\g<1>{c["new"]}\g<3>', content)

                if keyword.lower() in orig_content.lower() and ('product-' in file or file in ['esp.html', 'index.html']):
                     content = re.sub(r'(<span class="price-current">₹)\s*[\d,]+', rf'\g<1>{np_fmt}', content)
                     content = re.sub(r'(<div class="buy-box-price">₹)\s*[\d,]+', rf'\g<1>{np_fmt}', content)
                     content = re.sub(r'(Buy Now – ₹)\s*[\d,]+', rf'\g<1>{np_fmt}', content)

            if content != orig_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated HTML: {file}')

# 4. Update generators
GEN_SCRIPTS = ['generate-esp-pages.js', 'add_esp_boards.py', 'build_esp.py']
for gs in GEN_SCRIPTS:
    p = os.path.join(PROJECT_DIR, gs)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f: c = f.read()
        oc = c
        for name, c_dict in price_changes.items():
            new_price = c_dict['new']
            keyword = c_dict['keyword']
            # Match generatePage('...', '...', old_price, ...)
            c = re.sub(rf"('{keyword}[^']*',\s*)(\d+)(,\s*')", r"\g<1>" + str(new_price) + r"\g<3>", c, flags=re.IGNORECASE)
            c = re.sub(rf"('{keyword}[^']*',\s*price:\s*)(\d+)(,)", r"\g<1>" + str(new_price) + r"\g<3>", c, flags=re.IGNORECASE)
        if c != oc:
            with open(p, 'w', encoding='utf-8') as f: f.write(c)
            print(f'Fixed generator {gs}')
