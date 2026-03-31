import json
import time
from duckduckgo_search import DDGS

with open('database/protonest-data.json', 'r') as f:
    data = json.load(f)

ddgs = DDGS()
results = {}

for product in data['products']:
    query = product['name']
    
    # Specific adjustments for better image results
    if 'prototype' in product['category'].lower() or 'prototype' in query.lower() or 'station' in query.lower():
        if 'Arduino Uno' in product['name']:
            pass
        else:
            query = query + " realistic prototype electronics project -uno"
    else:
        query = query + " electronics component"

    print(f"Searching for: {query}")
    try:
        images = ddgs.images(query, max_results=2)
        if images and len(images) > 0:
            results[product['id']] = images[0]['image']
        else:
            results[product['id']] = product['image_placeholder']
    except Exception as e:
        print(f"Error for {query}: {e}")
        results[product['id']] = product['image_placeholder']
    
    # Be nice to DDG
    time.sleep(1)

with open('image_results.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Done finding images")
