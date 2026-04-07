import json
import sqlite3
import os
from datetime import datetime

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
DB_JSON = os.path.join(PROJECT_DIR, 'database', 'protonest-data.json')
SQLITE_DB = os.path.join(PROJECT_DIR, 'database', 'protonest.db')

new_products = [
    {
        "id": "ard-timebox",
        "name": "Arduino Time Box",
        "category": "Arduino",
        "sub_category": "Displays & Clocks",
        "price": 3999,
        "original_price": 5499,
        "features": [
            "Smart digital timekeeping display via synchronized RTC modules.",
            "Customizable LED Matrix for animations and alerts.",
            "Built-in temp/humidity sub-sensors for room environment tracking.",
            "Sturdy transparent acrylic enclosure."
        ],
        "image": "",
        "platform": "Arduino",
        "rating": 4.8,
        "rating_count": 124,
        "stock": 15,
        "description": "The Arduino Time Box is more than a clock; it is a personalized smart desk companion. Engineered with a highly accurate Real-Time Clock (RTC) and an expansive LED matrix grid, the system automatically synchronizes time data alongside live room temperature readouts. It serves as an excellent foundational prototype for those interested in building custom smart home dashboards or learning about multiplexed LED animations."
    },
    {
        "id": "ard-robotarm",
        "name": "Robotic Arm",
        "category": "Arduino",
        "sub_category": "Robotics",
        "price": 4499,
        "original_price": 5999,
        "features": [
            "4-Degrees of Freedom via high-torque micro servos.",
            "Customizable claw grip mechanism for variable object transport.",
            "Pre-programmed kinematic sequences accessible over serial.",
            "Durable laser-cut acrylic structural chassis."
        ],
        "image": "",
        "platform": "Arduino",
        "rating": 4.9,
        "rating_count": 89,
        "stock": 8,
        "description": "Unlock the fundamentals of industrial manufacturing with the Arduino Robotic Arm. This scaled-down 4-axis manipulator is built from laser-cut acrylic and driven by four independent servo motors capable of holding complex coordinate positions. Ideal for demonstrating kinematics, the arm comes loaded with pre-programmed subroutines allowing you to instruct it to grab, lift, transport, and release objects autonomously."
    },
    {
        "id": "ard-gamectrl",
        "name": "Video Game Controller",
        "category": "Arduino",
        "sub_category": "Gaming & HDI",
        "price": 3899,
        "original_price": 4999,
        "features": [
            "Dual-axis analog thumbsticks allowing for precise directional movement.",
            "Responsive tactile switches mapped to standard HID inputs.",
            "Native USB plug-and-play architecture (emulates keyboard/mouse on PC).",
            "Ergonomic breadboard-free PCB assembly for hardcore longevity."
        ],
        "image": "",
        "platform": "Arduino",
        "rating": 4.7,
        "rating_count": 210,
        "stock": 25,
        "description": "The Arduino Video Game Controller completely breaks the barrier between hardware engineering and software entertainment. Based on the ATmega32U4 architecture, this controller natively emulates a USB Human Interface Device (HID), meaning your PC will instantly recognize it as a gamepad. Equipped with dual analog sticks and clicky tactile switches, it is the absolute perfect prototype for demonstrating how commercial console controllers are electronically processed."
    }
]

# Update JSON
with open(DB_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Ensure ID doesn't already exist
existing_ids = {p['id'] for p in data.get('products', [])}
added = 0
for np in new_products:
    if np['id'] not in existing_ids:
        np['created_at'] = datetime.now().isoformat()
        data['products'].append(np)
        added += 1

if added > 0:
    with open(DB_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Added {added} products to JSON.")
else:
    print("Products already in JSON.")

# Update SQLite
try:
    conn = sqlite3.connect(SQLITE_DB)
    cursor = conn.cursor()
    for p in new_products:
        cursor.execute("SELECT id FROM products WHERE id = ?", (p['id'],))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO products (id, name, description, price, original_price, category, sub_category, platform, rating, rating_count, stock, features, image_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p['id'], p['name'], p['description'], p['price'], p.get('original_price'), 
                p.get('category'), p.get('sub_category'), p.get('platform'), 
                p.get('rating',0), p.get('rating_count',0), p.get('stock',0), 
                json.dumps(p.get('features', [])), p.get('image', ''), datetime.now().isoformat()
            ))
    conn.commit()
    conn.close()
    print("Updated SQLite Database.")
except Exception as e:
    print("SQLite error:", e)

