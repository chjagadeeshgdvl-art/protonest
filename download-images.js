const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const imagesToDownload = [
    { name: 'arduino-mega.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arduino_Mega_2560_Front.jpg?width=800' },
    { name: 'arduino-uno.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arduino_Uno_-_R3.jpg?width=800' },
    { name: 'rasp-pi4.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Raspberry_Pi_4_Model_B_-_Top.jpg?width=800' },
    { name: 'nodemcu.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/NodeMCU_v3.jpg?width=800' },
    { name: 'resistors.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Resistors.jpg?width=800' },
    { name: 'sensor.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/HC-SR04_Ultrasonic_sensor_front.jpg?width=800' },
    { name: 'esp32.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/ESP32_DevKit_.jpg?width=800' }
];

async function run() {
    for (const img of imagesToDownload) {
        try {
            const res = await fetch(img.url, {
                headers: { 'User-Agent': 'JK Labs-Data-Seeder/1.0 (https://github.com/example/protonest)' },
                redirect: 'follow'
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buffer = await res.arrayBuffer();
            fs.writeFileSync(path.join(IMAGES_DIR, img.name), Buffer.from(buffer));
            console.log(`✅ Downloaded ${img.name}`);
        } catch (e) {
            console.error(`❌ Failed ${img.name}: ${e.message}`);
        }
    }
}
run();
