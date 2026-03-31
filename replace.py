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
    content = re.sub(r'<title>(.*?) - ProtoNest</title>', r'<title>\1 - ProtoNest</title>', content, flags=re.IGNORECASE)
    content = re.sub(r'<title>(.*?) - ProtoNest</title>', r'<title>\1 - ProtoNest</title>', content, flags=re.IGNORECASE)
    content = content.replace("<title>ProtoNest", "<title>ProtoNest")
    content = content.replace("<title>ProtoNest", "<title>ProtoNest")

    # 4. Footers and Text
    content = re.sub(r'&copy;\s*2026[,\s]*JK Labs(?:, Inc\.| Electronics|)\.?.*?(?:All rights reserved\.|or its affiliates)', r'&copy; 2026 ProtoNest by JK Labs. All rights reserved.', content, flags=re.IGNORECASE)
    content = re.sub(r'&copy;\s*2026(?:\s*ProtoNest(?:, Inc\.| Electronics|)\.?).*?(?:All rights reserved\.|or its affiliates)', r'&copy; 2026 ProtoNest by JK Labs. All rights reserved.', content, flags=re.IGNORECASE)

    # 5. Some stray "ProtoNest" instances in text
    # Exclude <title> or <logo> since those are handled, but general text like "Welcome to ProtoNest"
    content = re.sub(r'ProtoNest', 'ProtoNest', content)
    content = re.sub(r'protonest', 'protonest', content)

    # Note: Keep the creator as JK Labs in the app "just to make it visible"
    # E.g. "Sold by JK Labs Custom Builds" -> Keep. 
    # But for the header, "Visit the ProtoNest Store by JK Labs" -> "Visit the ProtoNest Store by JK Labs"
    content = content.replace("Visit the ProtoNest Store by JK Labs", "Visit the ProtoNest Store by JK Labs")
    content = content.replace("Welcome to ProtoNest", "Welcome to ProtoNest")
    
    # "Thank you for shopping with ProtoNest!" -> "Thank you for shopping with ProtoNest!"
    content = content.replace("shopping with ProtoNest", "shopping with ProtoNest")
    content = content.replace("ProtoNest Server is LIVE", "ProtoNest Server is LIVE")
    content = content.replace("NEW ORDER - ProtoNest", "NEW ORDER - ProtoNest")

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
