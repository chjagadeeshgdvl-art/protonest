import os

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
html_path = os.path.join(PROJECT_DIR, 'public', 'arduino.html')

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

products = [
    { 'id': 'ard-flood', 'name': 'Arduino Flood Alert System', 'price': '1,999.00', 'img': 'flood.png' },
    { 'id': 'ard-irrigation', 'name': 'Smart Irrigation Control', 'price': '1,999.00', 'img': 'level.png' },
    { 'id': 'ard-gas', 'name': 'Gas Leakage Alert System', 'price': '1,899.00', 'img': 'gas.jpg' },
    { 'id': 'ard-fall', 'name': 'Fall Detection System', 'price': '1,999.00', 'img': 'fall_ai.png' },
    { 'id': 'ard-medicine', 'name': 'Smart Medicine Reminder', 'price': '2,499.00', 'img': 'medicine.jpg' },
    { 'id': 'ard-health', 'name': 'Remote Health Monitoring IoT', 'price': '2,699.00', 'img': 'monitor.jpg' },
    { 'id': 'ard-toll', 'name': 'Smart Toll Gate Automation', 'price': '1,799.00', 'img': 'toll.webp' }
]

addedCards = ""
for p in products:
    addedCards += f'''
                    <a href="product-{p['id']}.html" class="product-card">
                        <div style="background: #eaeaea; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow:hidden;">
                             <img src="/images/products/{p['img']}" alt="{p['name']}" style="width:100%; height:100%; object-fit:contain;">
                        </div>
                        <div class="product-title" style="color: var(--link-color);">{p['name']}</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 0</div>
                        <div class="product-price">₹ {p['price']}</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>
'''

# We know the specific HTML structure marking the end of the grid:
#                 </div>
#             </div>
#         </div>
#     </main>
# So we can replace the last instance of `</div>\n            </div>\n        </div>\n    </main>`
# Windows could use \r\n, so we normalize the string by removing \r first, doing replace, and we can just blindly replace.

normalized_content = content.replace('\\r\\n', '\\n')
target = '                </div>\\n            </div>\\n        </div>\\n    </main>'
target_win = '                </div>\n            </div>\n        </div>\n    </main>'

if 'product-ard-flood.html' not in content:
    # safe replace using rfind
    target_idx = content.rfind('</div>\\n            </div>\\n        </div>\\n    </main>')
    if target_idx == -1:
        # try without \n specifics
        parts = content.rsplit('</div>', 3)
        # Reconstruct safely
        pass
    
    # Just use regex to capture the end of the main tag
    import re
    # We want to insert right before the last closing </div> that is inside the <main> block.
    # Actually just split around `</main>`, count back 3 `</div>` 
    
    # A totally robust way:
    # Find the string exactly as it is shown in the Tail output
    # `                </div>\n            </div>\n        </div>\n    </main>` 
    # Let's clean up Windows whitespace using regex snippet
    
    new_content = re.sub(
        r'(\n\s*</div>\s*</div>\s*</div>\s*</main>)', 
        addedCards + r'\1', 
        content
    )
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed arduino.html grid.")
else:
    print("Already inserted.")
