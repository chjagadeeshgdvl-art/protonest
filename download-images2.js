const fs = require('fs');
const https = require('https');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

const queries = [
    { name: 'nodemcu.jpg', search: 'NodeMCU' },
    { name: 'esp32.jpg', search: 'ESP32' },
    { name: 'arduino-mega.jpg', search: 'Arduino Mega 2560' },
    { name: 'sensor.jpg', search: 'Ultrasonic sensor' }
];

async function fetchImageUrl(query) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}`;
        https.get(url, { headers: { 'User-Agent': 'JK Labs-Bot/1.0' } }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const pages = data.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1' && pages[pageId].original) {
                        resolve(pages[pageId].original.source);
                    } else {
                        reject(new Error('No image found'));
                    }
                } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'JK Labs-Bot/1.0' } }, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(dest)).on('finish', resolve);
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                downloadImage(res.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    for (const q of queries) {
        try {
            console.log(`Searching for ${q.search}...`);
            const url = await fetchImageUrl(q.search);
            console.log(`Found image: ${url}. Downloading...`);
            await downloadImage(url, path.join(IMAGES_DIR, q.name));
            console.log(`✅ Downloaded ${q.name}`);
        } catch (e) {
            console.error(`❌ Failed ${q.name}: ${e.message}`);
            // Fallback to copying arduino-uno.jpg if it exists
            const fallbackSrc = path.join(IMAGES_DIR, 'arduino-uno.jpg');
            if (fs.existsSync(fallbackSrc)) {
                fs.copyFileSync(fallbackSrc, path.join(IMAGES_DIR, q.name));
                console.log(`⚠️ Used fallback for ${q.name}`);
            }
        }
    }
}
run();
