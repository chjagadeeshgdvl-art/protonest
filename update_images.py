import os
import shutil
import json
import sqlite3
import re

# File paths
SRC_DIR = r"C:\Users\DHFM Jagadeesh\Desktop\SS image"
PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
DEST_IMAGES = os.path.join(PROJECT_DIR, 'public', 'images', 'products')

# Map of product to image
updates = {
    "Arduino Time Box": "timeb.webp",
    "Robotic Arm": "arm.jpg",
    "Video Game Controller": "gamer.jpg"
}

# 1. Copy images
for name, img in updates.items():
    src_path = os.path.join(SRC_DIR, img)
    dest_path = os.path.join(DEST_IMAGES, img)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Copied {img} to {DEST_IMAGES}")
    else:
        print(f"WARNING: Source image {src_path} not found.")

# 2. Update protonest-data.json
DB_JSON = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
with open(DB_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

for product in data.get('products', []):
    name = product.get('name', '')
    if name in updates:
        product['image'] = '/images/products/' + updates[name]

with open(DB_JSON, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)
print("Updated JSON image paths.")

# 3. Update SQLite
SQLITE_DB = os.path.join(PROJECT_DIR, 'database', 'protonest.db')
try:
    conn = sqlite3.connect(SQLITE_DB)
    cursor = conn.cursor()
    for name, img in updates.items():
        img_path = '/images/products/' + img
        cursor.execute("UPDATE products SET image_url = ? WHERE name = ?", (img_path, name))
    conn.commit()
    conn.close()
    print("Updated SQLite DB.")
except Exception as e:
    print("SQLite error:", e)

# 4. Update arduino.html
ARDUINO_HTML = os.path.join(PROJECT_DIR, 'public', 'arduino.html')
with open(ARDUINO_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

for name, img in updates.items():
    img_path = '/images/products/' + img
    # Match block exactly by name
    # We find the placeholder image tag that is associated with this name in the HTML
    # We can just replace the placeholder within the block that contains the specific product name.
    pattern = re.compile(rf'(<img src=")/images/products/placeholder.jpg(" alt="{name}")')
    html = pattern.sub(rf'\g<1>{img_path}\g<2>', html)

with open(ARDUINO_HTML, 'w', encoding='utf-8') as f:
    f.write(html)
print("Patched arduino.html")

# 5. Update generate-arduino-pages.js
GEN_JS = os.path.join(PROJECT_DIR, 'generate-arduino-pages.js')
with open(GEN_JS, 'r', encoding='utf-8') as f:
    js = f.read()

for name, img in updates.items():
    img_path = '/images/products/' + img
    # Match generatePage('...', 'Name', price, '/images/products/placeholder.jpg'
    pattern = re.compile(rf"('{name}',\s*\d+,\s*)'/images/products/placeholder.jpg'")
    js = pattern.sub(rf"\g<1>'{img_path}'", js)

with open(GEN_JS, 'w', encoding='utf-8') as f:
    f.write(js)
print("Patched generate-arduino-pages.js")
