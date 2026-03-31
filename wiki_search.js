const fs = require('fs');

async function searchWikimedia(query) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=File:${encodeURIComponent(query)}&srnamespace=6&format=json`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'JK Labs-Bot/1.0' } });
        const data = await res.json();
        if (data.query.search.length > 0) {
            const title = data.query.search[0].title;
            const imgUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
            const res2 = await fetch(imgUrl);
            const data2 = await res2.json();
            const pages = data2.query.pages;
            for (let id in pages) {
                return pages[id].imageinfo[0].url;
            }
        }
    } catch (e) {
        console.error(`Error searching ${query}:`, e);
    }
    return null;
}

const search_terms = {
    "Arduino Mega Advanced Weather Station with 20x4 LCD & DHT22": "Arduino weather station prototype",
    "Bluetooth Controlled RC Robot Car (Arduino Uno)": "Arduino robot car",
    "Smart Dustbin Prototype with Ultrasonic Sensor": "Ultrasonic sensor arduino",
    "Line Follower Robot Kit with Arduino Nano": "Line follower robot",
    "WiFi Controlled RC Robot Car (Arduino + ESP8266)": "Robot WiFi ESP8266",
    "Arduino OLED Digital Clock with DS3231 RTC": "Arduino digital clock",
    
    "Raspberry Pi 4 (8GB) Advanced AI Vision Bot": "Raspberry pi robot camera",
    "Raspberry Pi Retro Gaming Console (RetroPie)": "RetroPie console",
    "Raspberry Pi Home Media Center (LibreELEC)": "Raspberry Pi media center",
    "Raspberry Pi NAS Server (OpenMediaVault)": "Raspberry Pi NAS",
    "Raspberry Pi Smart Mirror": "Smart mirror raspberry pi",

    "4-Channel WiFi Relay Module (NodeMCU v3)": "Relay board 4 channel",
    "ESP32-CAM WiFi Security Camera": "ESP32-CAM module",
    "WiFi Smart Plug Socket (ESP8266)": "Smart plug teardown",
    "NodeMCU IoT Weather Station with ThingSpeak": "NodeMCU weather station",
    "ESP32 Bluetooth + WiFi Controlled RC Car": "ESP32 robot car",

    "10K Ohm 1/4W Metal Film Resistor (Pack of 100)": "Resistor",
    "Breadboard 830 Points Solderless (Full Size)": "Breadboard solderless",
    "DHT11 Temperature & Humidity Sensor Module": "DHT11 sensor",
    "HC-SR04 Ultrasonic Distance Sensor": "HC-SR04",
    "Arduino Uno R3 Clone (CH340 USB)": "Arduino Uno R3",
    "SG90 Micro Servo Motor 9g": "SG90 servo",
    "Jumper Wires Male-to-Male (40 pcs, 20cm)": "Jumper wires"
};

async function main() {
    const raw = fs.readFileSync('database/protonest-data.json', 'utf8');
    const db = JSON.parse(raw);
    const results = {};

    for (let product of db.products) {
        let term = search_terms[product.name] || product.name;
        // Don't search for Uno if we shouldn't
        if (product.category === 'prototypes' && !term.includes('Uno')) {
            term += " -Uno";
        }
        
        console.log(`Searching: ${term}`);
        const url = await searchWikimedia(term);
        if (url) {
            results[product.id] = url;
        } else {
            console.log(`Fallback for ${term}`);
            results[product.id] = null;
        }
        await new Promise(r => setTimeout(r, 500));
    }

    fs.writeFileSync('image_results_wiki.json', JSON.stringify(results, null, 2));
    console.log("Done");
}

main();
