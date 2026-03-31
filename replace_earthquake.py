import os
import shutil
import json
import re

# Base paths
PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
SS_DIR = r"C:\Users\DHFM Jagadeesh\Desktop\SS image"
DEST_IMAGES_DIR = os.path.join(PROJECT_DIR, 'public', 'images', 'products')

# Step 1: Copy image
src_img = os.path.join(SS_DIR, 'earth.webp')
dest_img = os.path.join(DEST_IMAGES_DIR, 'earth.webp')

if os.path.exists(src_img):
    shutil.copy2(src_img, dest_img)
    print("Copied earth.webp successfully.")
else:
    print(f"Error: Could not find {src_img}")

# Step 2: Update Database
db_path = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

for prod in db.get('products', []):
    if prod.get('name') == 'Fall Detection System' or prod.get('id') == 'ard-fall':
        prod['id'] = 'ard-earthquake'
        prod['name'] = 'Earthquake Detection System'
        prod['description'] = "An advanced early warning Arduino prototype designed to detect tectonic movements and structural vibrations. Leveraging a highly sensitive 6-axis MPU6050 accelerometer, the system filters out background noise and instantly triggers loud audio-visual alarms alongside a digital LCD readout when significant seismic thresholds are breached, ensuring critical early evacuation."
        prod['price'] = 2199
        prod['features'] = ["MPU6050 Accelerometer & Gyroscope", "High dB Piezo Buzzer Alarm", "16x2 I2C LCD Readout", "Visual Danger LED Indicators"]
        prod['image'] = '/images/products/earth.webp'
        print("Updated database entry to Earthquake Detection System.")

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)


# Step 3: Update arduino.html
arduino_html_path = os.path.join(PROJECT_DIR, 'public', 'arduino.html')
with open(arduino_html_path, 'r', encoding='utf-8') as f:
    arduino_html = f.read()

# Replace Fall Detection HTML block creatively without complex regex, just exact substring matches
arduino_html = arduino_html.replace('product-ard-fall.html', 'product-ard-earthquake.html')
arduino_html = arduino_html.replace('Fall Detection System', 'Earthquake Detection System')
arduino_html = arduino_html.replace('/images/products/fall_ai.png', '/images/products/earth.webp')
# Price was 1,999 or 1999, we need to locate it specifically in that block if possible.
# Wait, replacing 1,999.00 globally might hit the flood sensor or irrigation! Let's be careful.
# Instead, regex replace within the earthquake block bounds.

# Let's cleanly replace the exact card block since we know its components:
old_card = \
"""<a href="product-ard-earthquake.html" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/earth.webp" alt="Earthquake Detection System" style="width:100%; height:100%; object-fit:contain;">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">Earthquake Detection System</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 0</div>
                        <div class="product-price">₹ 1,999.00</div>"""

new_card = old_card.replace('1,999.00', '2,199.00')
arduino_html = arduino_html.replace(old_card, new_card)

with open(arduino_html_path, 'w', encoding='utf-8') as f:
    f.write(arduino_html)
print("Updated arduino.html.")

# Step 4: Delete old product-ard-fall.html and Create product-ard-earthquake.html
old_file = os.path.join(PROJECT_DIR, 'public', 'product-ard-fall.html')
new_file = os.path.join(PROJECT_DIR, 'public', 'product-ard-earthquake.html')

if os.path.exists(old_file):
    with open(old_file, 'r', encoding='utf-8') as f:
        file_html = f.read()
    
    # Text replacements globally
    file_html = file_html.replace('Fall Detection System', 'Earthquake Detection System')
    file_html = file_html.replace('ard-fall', 'ard-earthquake')
    file_html = file_html.replace('/images/products/fall_ai.png', '/images/products/earth.webp')
    file_html = file_html.replace('₹1,999.00', '₹2,199.00')
    file_html = file_html.replace('₹1,999', '₹2,199')
    file_html = file_html.replace('price: 1999', 'price: 2199')
    file_html = file_html.replace('1,999', '2,199') # for generic numeric displays
    
    # Update description block
    desc_start = file_html.find('<div class="product-description">')
    desc_end = file_html.find('</div>', desc_start)
    if desc_start != -1 and desc_end != -1:
        new_desc = '''<div class="product-description">
                    An advanced early warning Arduino prototype designed to detect tectonic movements and structural vibrations. Leveraging a highly sensitive 6-axis MPU6050 accelerometer, the system filters out background noise and instantly triggers loud audio-visual alarms alongside a digital LCD readout when significant seismic thresholds are breached, ensuring critical early evacuation.'''
        file_html = file_html[:desc_start] + new_desc + file_html[desc_end:]
        
    # Update bullet list
    bullet_start = file_html.find('<ul class="bullet-list">')
    bullet_end = file_html.find('</ul>', bullet_start)
    if bullet_start != -1 and bullet_end != -1:
        new_bullets = '''<ul class="bullet-list">
                    <li>MPU6050 Accelerometer & Gyroscope</li>
                    <li>High dB Piezo Buzzer Alarm</li>
                    <li>16x2 I2C LCD Readout</li>
                    <li>Visual Danger LED Indicators</li>
                '''
        file_html = file_html[:bullet_start] + new_bullets + file_html[bullet_end:]
    
    with open(new_file, 'w', encoding='utf-8') as f:
        f.write(file_html)
    print("Created product-ard-earthquake.html.")
    
    os.remove(old_file)
    print("Deleted old product-ard-fall.html.")
else:
    print(f"Error: {old_file} not found.")

