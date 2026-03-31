import os
import glob

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest\public"
files = glob.glob(os.path.join(PROJECT_DIR, 'product-esp-*.html'))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We only have {{ and }} in the script tags at the bottom.
    # The safest way is to target the exact strings that are broken
    
    content = content.replace("const product = {{", "const product = {")
    content = content.replace("        }};", "        };")
    content = content.replace("addEventListener('click', () => {{", "addEventListener('click', () => {")
    content = content.replace("        }});", "        });")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Fixed Javascript syntax errors across ESP products.")
