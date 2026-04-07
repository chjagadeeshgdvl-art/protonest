import os
import re

updates = {
    "Weather Monitoring": 3499,
    "Smart Dustbin": 3499,
    "Bluetooth": 4599,
    "Line Follower": 4599,
    "Sleep": 3299,
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
    "Health Monitoring": 4999,
    "Toll Gate": 3699
}

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
PUBLIC_DIR = os.path.join(PROJECT_DIR, 'public')

def fmt(p): return f"{p:,}" # e.g. 3,499

for root, dirs, files in os.walk(PUBLIC_DIR):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            orig = content

            for keyword, new_price in updates.items():
                np_fmt = fmt(new_price)
                
                # We want to find the keyword, and then the VERY NEXT price occurring.
                # If there are multiple prices for the same product in a page, we might want to replace all of them.
                # Instead of matching the VERY NEXT price, let's identify the product block.
                # In product-*.html, the keyword is likely in <title> or <h1>, so we can just replace ALL prices that match the old price ONLY IF we know the old price. But we don't know the old price without looking it up.
                
                # We can systematically replace `data-price="..."` for the button matching the keyword:
                # `data-name=".*?Keyword.*?" data-price="\d+"`
                pattern_btn = re.compile(rf'(data-name="[^"]*{keyword}[^"]*"\s*(?:id="[a-zA-Z0-9\-_]+" )?data-price=")(\d+)("?)', re.IGNORECASE)
                content = pattern_btn.sub(rf'\g<1>{new_price}\g<3>', content)

                # For the product block in arduino.html & index.html:
                # The structure is usually Name</div> ... <div class="product-price">₹ 1,799.00</div>
                # Or <div class="product-title">...Keyword...</div> ... ₹ 1,799 
                pattern_block = re.compile(rf'({keyword}.*?</div(?:>|\s+[^>]*>).*?(?:₹|&#8377;|\?)\s*)([\d,]+(?:[.]\d+)?)', re.DOTALL | re.IGNORECASE)
                
                def repl_block(m):
                    prefix = m.group(1)
                    old_val = m.group(2)
                    # We don't want to replace if the old_val is something like a random number, but if it has a comma or is > 100, it's a price.
                    # We will replace it with the new formatted price. If old_val ended in .00, we keep it.
                    suffix = ".00" if ".00" in old_val else ""
                    # Actually wait, if the regex is greedy it might jump to the next product.
                    # We MUST limit the distance.
                    if len(prefix) < 400: # Limit jump distance
                        return prefix + np_fmt + suffix
                    return m.group(0)
                
                for _ in range(3): # repeat just in case there are multiple
                    content = pattern_block.sub(repl_block, content)
                    
                # If we are strictly IN the product page (e.g. file contains the keyword in its title/h1):
                if keyword.lower() in orig.lower():
                    # For product page, we just replace the exact old price. But we don't know it! 
                    # We can use a general regex to replace whatever the main price is.
                    # Usually like: <span class="price-current">₹1,799</span>
                    # Or: <div class="buy-box-price">₹1,799.00</div>
                    content = re.sub(r'(<span class="price-current">₹)\s*[\d,]+', rf'\g<1>{np_fmt}', content)
                    content = re.sub(r'(<div class="buy-box-price">₹)\s*[\d,]+', rf'\g<1>{np_fmt}', content)
                    content = re.sub(r'(Buy Now – ₹)\s*[\d,]+', rf'\g<1>{np_fmt}', content)

            if content != orig:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed string prices in {file}")

# We should also update the generator scripts just in case someone re-runs them!
GEN_SCRIPTS = ['generate-arduino-pages.js', 'generate-esp-pages.js', 'add-new-arduino.js', 'add_17_components.py', 'add_esp_boards.py', 'build_esp.py']
for gs in GEN_SCRIPTS:
    p = os.path.join(PROJECT_DIR, gs)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f: c = f.read()
        oc = c
        for keyword, new_price in updates.items():
            # In JS: generatePage('...', '...Keyword...', 1799, ...)
            c = re.sub(rf"('{keyword}[^']*',\s*)(\d+)(,\s*')", r"\g<1>" + str(new_price) + r"\g<3>", c, flags=re.IGNORECASE)
            c = re.sub(rf"('{keyword}[^']*',\s*price:\s*)(\d+)(,)", r"\g<1>" + str(new_price) + r"\g<3>", c, flags=re.IGNORECASE)
        if c != oc:
            with open(p, 'w', encoding='utf-8') as f: f.write(c)
            print(f"Fixed generator {gs}")
