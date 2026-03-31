import os
import requests
from duckduckgo_search import DDGS
import time

items = {
    "comp_leds_real.jpg": "assorted 5mm LED light diodes scattered electronic component",
    "comp_buzzers_real.jpg": "active piezo buzzer electronic component isolated white background",
    "comp_jumper_wires_real.jpg": "dupont jumper wires electronic ribbon cable isolated",
    "comp_esp32_real.jpg": "esp32 development board wifi bluetooth module top down",
    "comp_esp8266_real.jpg": "esp8266 nodemcu cp2102 development board isolated",
    "comp_esp32cam_real.jpg": "esp32-cam development board ov2640 module"
}

ddgs = DDGS()
output_dir = "public/images/products"
os.makedirs(output_dir, exist_ok=True)

for filename, query in items.items():
    filepath = os.path.join(output_dir, filename)
    print(f"Searching for: {query}")
    try:
        images = ddgs.images(keywords=query, max_results=1)
        if images:
            img_url = images[0]['image']
            print(f"Downloading from {img_url}")
            response = requests.get(img_url, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"Saved to {filepath}")
            else:
                print(f"Failed to download. Status: {response.status_code}")
        else:
            print("No images found.")
    except Exception as e:
        print(f"Error for {query}: {e}")
    time.sleep(2)
