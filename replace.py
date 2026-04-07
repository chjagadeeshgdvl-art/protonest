import os
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath} due to read error: {e}")
        return

    original_content = content

    # 1. Database name and other lowercase general
    content = content.replace("protonest-data.json", "protonest-data.json")
    content = content.replace("protonest_user", "protonest_user")
    content = content.replace("protonest_cart", "protonest_cart")
    content = content.replace("protonest_last_order", "protonest_last_order")
    # In package.json
    content = content.replace('"name": "protonest"', '"name": "protonest"')

    # 2. Logos
    content = re.sub(r'Electro<span\s*>Mart</span>', r'Proto<span>Nest</span>', content, flags=re.IGNORECASE)
    content = re.sub(r'JK<span\s*>Labs</span>', r'Proto<span>Nest</span>', content, flags=re.IGNORECASE)

    # 3. Titles
    content = re.sub(r'<title>(.*?) - ProtoGods by JK labs</title>', r'<title>\1 - ProtoGods by JK labs</title>', content, flags=re.IGNORECASE)
    content = re.sub(r'<title>(.*?) - ProtoGods by JK labs</title>', r'<title>\1 - ProtoGods by JK labs</title>', content, flags=re.IGNORECASE)
    content = content.replace("<title>ProtoGods by JK labs", "<title>ProtoGods by JK labs")
    content = content.replace("<title>ProtoGods by JK labs", "<title>ProtoGods by JK labs")

    # 4. Footers and Text
    content = re.sub(r'&copy;\s*2026[,\s]*JK Labs(?:, Inc\.| Electronics|)\.?.*?(?:All rights reserved\.|or its affiliates)', r'&copy; 2026 ProtoGods by JK labs. All rights reserved.', content, flags=re.IGNORECASE)
    content = re.sub(r'&copy;\s*2026(?:\s*ProtoGods by JK labs(?:, Inc\.| Electronics|)\.?).*?(?:All rights reserved\.|or its affiliates)', r'&copy; 2026 ProtoGods by JK labs. All rights reserved.', content, flags=re.IGNORECASE)

    # 5. Some stray "ProtoGods by JK labs" instances in text
    # Exclude <title> or <logo> since those are handled, but general text like "Welcome to ProtoGods by JK labs"
    content = re.sub(r'ProtoGods by JK labs', 'ProtoGods by JK labs', content)
    content = re.sub(r'protonest', 'protonest', content)

    # Note: Keep the creator as JK Labs in the app "just to make it visible"
    # E.g. "Sold by JK Labs Custom Builds" -> Keep. 
    # But for the header, "Visit the ProtoGods by JK labs Store by JK Labs" -> "Visit the ProtoGods by JK labs Store by JK Labs"
    content = content.replace("Visit the ProtoGods by JK labs Store by JK Labs", "Visit the ProtoGods by JK labs Store by JK Labs")
    content = content.replace("Welcome to ProtoGods by JK labs", "Welcome to ProtoGods by JK labs")
    
    # "Thank you for shopping with ProtoGods by JK labs!" -> "Thank you for shopping with ProtoGods by JK labs!"
    content = content.replace("shopping with ProtoGods by JK labs", "shopping with ProtoGods by JK labs")
    content = content.replace("ProtoGods by JK labs Server is LIVE", "ProtoGods by JK labs Server is LIVE")
    content = content.replace("NEW ORDER - ProtoGods by JK labs", "NEW ORDER - ProtoGods by JK labs")

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    skip_dirs = ['node_modules', '.wwebjs_auth', '.wwebjs_cache', '.git']
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            if file.endswith(('.html', '.js', '.json', '.py', '.css', '.md')):
                filepath = os.path.join(root, file)
                process_file(filepath)

if __name__ == '__main__':
    main()
