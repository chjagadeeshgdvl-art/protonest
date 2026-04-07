import os
import re
import base64

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"

# A premium SVG acting as a component schema illustration
SVG_CODE = """<svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f9fbb" />
  <g stroke="#00979C" stroke-width="2" fill="none" opacity="0.6">
    <rect x="40" y="40" width="120" height="120" rx="10" />
    <circle cx="50" cy="50" r="3" fill="#00979C"/>
    <circle cx="150" cy="50" r="3" fill="#00979C"/>
    <circle cx="50" cy="150" r="3" fill="#00979C"/>
    <circle cx="150" cy="150" r="3" fill="#00979C"/>
    <path d="M 100,20 L 100,40 M 160,100 L 180,100 M 100,160 L 100,180 M 40,100 L 20,100" stroke-width="4"/>
    <rect x="70" y="70" width="60" height="60" fill="#232F3E" stroke="none" />
  </g>
  <text x="100" y="105" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">ProtoGods by JK labs Module</text>
</svg>"""

b64_svg = "data:image/svg+xml;base64," + base64.b64encode(SVG_CODE.encode('utf-8')).decode('utf-8')

def replace_placeholders(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the src path directly
    # e.g. <img src="/images/products/placeholder-gsm.jpg" ...>
    # Note: we also want to remove their messy onerror blocks so they don't trigger.
    
    content = re.sub(r'src="/images/products/placeholder-[^"]+"', f'src="{b64_svg}"', content)
    content = re.sub(r'onerror="[^"]+"', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Process grid
replace_placeholders(os.path.join(PROJECT_DIR, 'public', 'components.html'))

# Process all 20 distinct product files
for c in ['gsm', 'rfid', 'l298n', 'motors', 'breadboard', 'leds', 'buzzers', 'wires', 'esp32', 'esp8266', 'esp32cam']:
    replace_placeholders(os.path.join(PROJECT_DIR, 'public', f'product-comp-{c}.html'))

print("Completed Image Fallback Repairs via SVG Encoding.")
