import os
import re

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
ARDUINO_HTML = os.path.join(PROJECT_DIR, 'public', 'arduino.html')
GEN_JS = os.path.join(PROJECT_DIR, 'generate-arduino-pages.js')

new_cards_html = """
                    <a href="#" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/placeholder.jpg" alt="Arduino Time Box" style="width:100%; height:100%; object-fit:contain;">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">Arduino Time Box</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 124</div>
                        <div class="product-price">₹ 3,999.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>

                    <a href="#" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/placeholder.jpg" alt="Robotic Arm" style="width:100%; height:100%; object-fit:contain;">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">Robotic Arm</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 89</div>
                        <div class="product-price">₹ 4,499.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>

                    <a href="#" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/placeholder.jpg" alt="Video Game Controller" style="width:100%; height:100%; object-fit:contain;">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">Video Game Controller</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 210</div>
                        <div class="product-price">₹ 3,899.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>
                </div>"""

# 1. Patch arduino.html
with open(ARDUINO_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the closing div of product-grid
if "Arduino Time Box" not in html:
    html = html.replace('                </div>\n            </div>\n        </div>\n    </main>', new_cards_html + '\n            </div>\n        </div>\n    </main>')
    with open(ARDUINO_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Patched arduino.html")
else:
    print("arduino.html already patched.")

# 2. Patch generate-arduino-pages.js
with open(GEN_JS, 'r', encoding='utf-8') as f:
    js = f.read()

new_js_blocks = """
// 9. Time Box
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-timebox.html'), generatePage(
    'ard-timebox', 'Arduino Time Box', 3999, '/images/products/placeholder.jpg',
    [
        '<strong>Smart digital timekeeping display via synchronized RTC modules.</strong>',
        '<strong>Customizable LED Matrix for animations and alerts.</strong>',
        '<strong>Built-in temp/humidity sub-sensors for room environment tracking.</strong>',
        '<strong>Sturdy transparent acrylic enclosure.</strong>'
    ],
    'The Arduino Time Box is more than a clock; it is a personalized smart desk companion. Engineered with a highly accurate Real-Time Clock (RTC) and an expansive LED matrix grid, the system automatically synchronizes time data alongside live room temperature readouts. It serves as an excellent foundational prototype for those interested in building custom smart home dashboards or learning about multiplexed LED animations.'
));

// 10. Robotic Arm
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-robotarm.html'), generatePage(
    'ard-robotarm', 'Robotic Arm', 4499, '/images/products/placeholder.jpg',
    [
        '<strong>4-Degrees of Freedom via high-torque micro servos.</strong>',
        '<strong>Customizable claw grip mechanism for variable object transport.</strong>',
        '<strong>Pre-programmed kinematic sequences accessible over serial.</strong>',
        '<strong>Durable laser-cut acrylic structural chassis.</strong>'
    ],
    'Unlock the fundamentals of industrial manufacturing with the Arduino Robotic Arm. This scaled-down 4-axis manipulator is built from laser-cut acrylic and driven by four independent servo motors capable of holding complex coordinate positions. Ideal for demonstrating kinematics, the arm comes loaded with pre-programmed subroutines allowing you to instruct it to grab, lift, transport, and release objects autonomously.'
));

// 11. Game Controller
fs.writeFileSync(path.join(__dirname, 'public', 'product-ard-gamectrl.html'), generatePage(
    'ard-gamectrl', 'Video Game Controller', 3899, '/images/products/placeholder.jpg',
    [
        '<strong>Dual-axis analog thumbsticks allowing for precise directional movement.</strong>',
        '<strong>Responsive tactile switches mapped to standard HID inputs.</strong>',
        '<strong>Native USB plug-and-play architecture (emulates keyboard/mouse on PC).</strong>',
        '<strong>Ergonomic breadboard-free PCB assembly for hardcore longevity.</strong>'
    ],
    'The Arduino Video Game Controller completely breaks the barrier between hardware engineering and software entertainment. Based on the ATmega32U4 architecture, this controller natively emulates a USB Human Interface Device (HID), meaning your PC will instantly recognize it as a gamepad. Equipped with dual analog sticks and clicky tactile switches, it is the absolute perfect prototype for demonstrating how commercial console controllers are electronically processed.'
));

console.log"""

new_map_entries = """    { title: 'Intelligent Traffic Light System', file: 'product-ard-traffic.html' },
    { title: 'Arduino Time Box', file: 'product-ard-timebox.html' },
    { title: 'Robotic Arm', file: 'product-ard-robotarm.html' },
    { title: 'Video Game Controller', file: 'product-ard-gamectrl.html' }
];"""

if "Arduino Time Box" not in js:
    # We replace the closing of scripts with the new scripts
    js = js.replace("console.log('8 Complete Detailed Pages Generated!');", new_js_blocks + "('11 Complete Detailed Pages Generated!');")
    js = js.replace("    { title: 'Intelligent Traffic Light System', file: 'product-ard-traffic.html' }\n];", new_map_entries)
    
    with open(GEN_JS, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Patched generate-arduino-pages.js")
else:
    print("generate-arduino-pages.js already patched.")
