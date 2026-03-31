import os
import glob
import re
import shutil

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"

# 1. Global replace of 910000000000 to user's real admin number in all 68+ HTML files
html_files = glob.glob(os.path.join(PROJECT_DIR, 'public', '*.html'))

replacements = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '910000000000' in content:
        new_content = content.replace('910000000000', '916303228967')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        replacements += 1

print(f"Repaired HTML widget routing in {replacements} files.")

# 2. Fix the regex extraction in services/whatsapp.js
whatsapp_js_path = os.path.join(PROJECT_DIR, 'services', 'whatsapp.js')
if os.path.exists(whatsapp_js_path):
    with open(whatsapp_js_path, 'r', encoding='utf-8') as f:
        wa_content = f.read()
        
    # Replace:
    # const customerPhone = '91' + customer.phone.replace(/^(\+?91)/, '');
    # with:
    # const customerPhone = '91' + customer.phone;
    new_wa_content = re.sub(
        r"const customerPhone = '91' \+ customer\.phone\.replace\([^)]+\);",
        "const customerPhone = '91' + customer.phone;",
        wa_content
    )
    
    if new_wa_content != wa_content:
        with open(whatsapp_js_path, 'w', encoding='utf-8') as f:
            f.write(new_wa_content)
        print("Fixed destructive regex in services/whatsapp.js")
    else:
        print("Regex fix already applied or not found in whatsapp.js")

# 3. Purge the corrupted WhatsApp session to force a fresh QR Code pairing
auth_path = os.path.join(PROJECT_DIR, '.wwebjs_auth')
if os.path.exists(auth_path):
    shutil.rmtree(auth_path)
    print("Purged corrupted WhatsApp Web Session. Reboot necessary.")
else:
    print("No active cached WhatsApp session found.")
