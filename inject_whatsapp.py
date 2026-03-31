import os
import glob
import re

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
css_path = os.path.join(PROJECT_DIR, 'public', 'css', 'style.css')

WA_CSS = """
/* WhatsApp Floating Action Button */
.whatsapp-float {
    position: fixed;
    width: auto;
    height: 55px;
    bottom: 30px;
    right: 30px;
    background-color: #25D366;
    color: #FFF;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    z-index: 10000;
    display: flex;
    align-items: center;
    padding: 0 25px 0 15px;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.whatsapp-float:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6);
    color: white;
}

.wa-icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    fill: white;
}

.wa-text {
    white-space: nowrap;
}
"""

WA_HTML = """
    <!-- WhatsApp Floating Action Button -->
    <a href="https://wa.me/910000000000?text=Hello%20ProtoNest!%20I%20want%20to%20develop%20a%20custom%20idea." target="_blank" class="whatsapp-float">
        <svg viewBox="0 0 32 32" class="wa-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.61 4.43 1.66 6.3L3.15 28.18l6.05-1.55A12.92 12.92 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.82a10.84 10.84 0 0 1-5.54-1.52l-.4-.24-4.13 1.06 1.09-4.04-.26-.42A10.87 10.87 0 0 1 5.18 16c0-5.96 4.86-10.82 10.82-10.82 5.96 0 10.82 4.86 10.82 10.82 0 5.96-4.86 10.82-10.82 10.82zm5.95-8.03c-.33-.16-1.92-.95-2.22-1.06-.3-.11-.53-.16-.76.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.25-.71.08-.33-.16-1.37-.51-2.61-1.61-.96-.86-1.61-1.92-1.8-2.25-.19-.33-.02-.51.15-.67.15-.15.33-.38.49-.58.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.16-.76-1.84-1.04-2.52-.27-.66-.54-.57-.76-.58-.22-.01-.46-.01-.71-.01-.25 0-.66.09-1 .44-.33.36-1.28 1.25-1.28 3.05 0 1.8 1.31 3.54 1.49 3.78.19.25 2.58 3.93 6.25 5.51 2.39 1.03 3.32 1.11 4.46 .94 1.3-.2 3.44-1.4 3.93-2.75.49-1.36.49-2.52.34-2.75-.14-.24-.52-.37-.85-.54z" fill="white"/>
        </svg>
        <span class="wa-text">Develop Custom Idea</span>
    </a>
"""

# Append to style.css if needed
if os.path.exists(css_path):
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    if '.whatsapp-float' not in css_content:
        with open(css_path, 'a', encoding='utf-8') as f:
            f.write(WA_CSS)
        print("Injected WhatsApp CSS rules.")
else:
    print("Could not find style.css.")

# Inject HTML into all html files
html_files = glob.glob(os.path.join(PROJECT_DIR, 'public', '*.html'))

injections = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'class="whatsapp-float"' not in content:
        # Inject right before </body>
        new_content = re.sub(r'(</body>)', WA_HTML + r'\n\1', content, flags=re.IGNORECASE)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        injections += 1

print(f"Injected global WhatsApp module into {injections} files.")
