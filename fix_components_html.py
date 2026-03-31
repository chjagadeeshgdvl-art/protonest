import os
import re

PROJECT_DIR = r"C:\Users\DHFM Jagadeesh\.gemini\antigravity\scratch\protonest"
filepath = os.path.join(PROJECT_DIR, 'public', 'components.html')

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The error is that cards are currently inserted after:
#                 </div>
#             </div>
#                     <a href="product-comp-uno.html" class="product-card">
# So the cards are outside the grid.
# We need to extract all cards that are outside the grid, and put them inside the grid.

# Grids end where the `</div>` matches the `product-grid`
# Let's extract everything from the first displaced card `<a href="product-comp-uno.html"` down to the closing `        </div>\n    </main>`

card_match = re.search(r'(<a href="product-comp-uno\.html".*?)        </div>\s*</main>', content, re.DOTALL)
if card_match:
    displaced_cards = card_match.group(1)
    
    # Remove displaced cards from their current spot
    new_content = content.replace(displaced_cards, '')
    
    # Inject displaced cards inside the product-grid. 
    # The product-grid currently ends with:
    #                     <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
    #                 </a>
    #             </div>
    #         </div>
    # We want to insert just before that first `</div>`
    
    inject_point = re.search(r'(<button class="btn btn-primary"[^>]*>Add to Cart</button>\s*</a>\s*)(</div>)', new_content)
    
    if inject_point:
        new_content = new_content[:inject_point.end(1)] + displaced_cards + new_content[inject_point.end(1):]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed Grid Layout!")
else:
    print("Could not find displaced cards.")
