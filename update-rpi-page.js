const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const rootDir = __dirname;
const srcDir = 'C:\\Users\\DHFM Jagadeesh\\Desktop\\SS image';
const destImg = path.join(rootDir, 'public', 'images', 'products', 'door.jpg');

// 1. Copy Image
fs.copyFileSync(path.join(srcDir, 'door.jpg'), destImg);
console.log('Copied door.jpg');

// 2. Update Database
const dbPath = path.join(rootDir, 'database', 'protonest-data.json');
let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Delete AI Vision Bot
data.products = data.products.filter(p => !p.name.includes("Advanced AI Vision Bot"));

// Add Smart Door Lock
data.products.push({
    id: uuidv4(), 
    name: 'Raspberry Pi Smart Door Lock System',
    description: 'Advanced facial recognition and RFID door lock system with remote monitoring capabilities.',
    price: 14999, original_price: 18000, category: 'prototypes', sub_category: 'ai-projects', platform: 'raspberry-pi',
    rating: 4.8, rating_count: 35, stock: 10,
    features: ['Raspberry Pi 4', 'Pi Camera Module v2', 'RFID Reader', 'Electronic Strike Lock', 'Python codebase included']
});

// Update prices for existing products
data.products.forEach(p => {
    if (p.name.includes("Intruder Security System")) {
        p.price = 17999;
    }
    if (p.name.includes("Smart Agricultural System")) {
        p.price = 19999;
    }
    if (p.name.includes("Obstacle Avoiding Robot")) {
        p.price = 25999;
    }
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated protonest-data.json');

// 3. Update raspberry.html
let rpiPath = path.join(rootDir, 'public', 'raspberry.html');
let rpi = fs.readFileSync(rpiPath, 'utf8');

// Replace the AI Vision bot HTML card with Smart Door HTML card
const visionBotHTML = `                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/rasp-pi4.jpg" alt="Product Image" style="width:100%; height:100%; object-fit:contain;"></div>
                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi 4 (8GB) Advanced AI Vision Bot</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 42</div>
                        <div class="product-price">₹ 12,999.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #C51A4A; color: white;">Add to Cart</button>
                    </a>`;

const doorLockHTML = `                    <a href="product-rp-door.html" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/door.jpg" alt="Door Lock" style="width:100%; height:100%; object-fit:contain;"></div>
                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Smart Door Lock System</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 35</div>
                        <div class="product-price">₹ 14,999.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #C51A4A; color: white;">Add to Cart</button>
                    </a>`;

if (rpi.includes("Raspberry Pi 4 (8GB) Advanced AI Vision Bot")) {
    rpi = rpi.replace(visionBotHTML, doorLockHTML);
} else {
    console.log("Could not find Vision Bot in raspberry.html");
}

rpi = rpi.replace(/ href="#" /g, ' '); // Strip default # hrefs to rebuild them cleanly

rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/secure.jpg"',
    '<a href="product-rp-secure.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/secure.jpg"'
);
rpi = rpi.replace(
    'Raspberry Pi Intruder Security System</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 55</div>\n                        <div class="product-price">₹ 4,500.00</div>',
    'Raspberry Pi Intruder Security System</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 55</div>\n                        <div class="product-price">₹ 17,999.00</div>'
);

rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/avoid.jpg"',
    '<a href="product-rp-avoid.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/avoid.jpg"'
);
rpi = rpi.replace(
    'Raspberry Pi Obstacle Avoiding Robot</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 89</div>\n                        <div class="product-price">₹ 6,000.00</div>',
    'Raspberry Pi Obstacle Avoiding Robot</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 89</div>\n                        <div class="product-price">₹ 25,999.00</div>'
);

rpi = rpi.replace(
    '<a class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/agri.png"',
    '<a href="product-rp-agri.html" class="product-card">\n                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="/images/products/agri.png"'
);
rpi = rpi.replace(
    'Raspberry Pi Smart Agricultural System</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 41</div>\n                        <div class="product-price">₹ 5,500.00</div>',
    'Raspberry Pi Smart Agricultural System</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 41</div>\n                        <div class="product-price">₹ 19,999.00</div>'
);

// Fallback regex if whitespace differs
rpi = rpi.replace(/₹ 4,500\.00/g, '₹ 17,999.00');
rpi = rpi.replace(/₹ 6,000\.00/g, '₹ 25,999.00');
rpi = rpi.replace(/₹ 5,500\.00/g, '₹ 19,999.00');

fs.writeFileSync(rpiPath, rpi, 'utf8');
console.log('Updated raspberry.html');

// 4. Update index.html
let idxPath = path.join(rootDir, 'public', 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');

idx = idx.replace(/₹ 4,500\.00/g, '₹ 17,999.00');
idx = idx.replace(/₹ 6,000\.00/g, '₹ 25,999.00');
idx = idx.replace(/₹ 5,500\.00/g, '₹ 19,999.00');
idx = idx.replace(/href="#" class="product-card"/g, 'class="product-card"'); // clear hrefs
idx = idx.replace('Raspberry Pi Intruder Security System</div>', 'Raspberry Pi Intruder Security System</div>').replace('class="product-card" style="text-decoration: none; color: inherit;">\n                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/secure.jpg"', 'href="product-rp-secure.html" class="product-card" style="text-decoration: none; color: inherit;">\n                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/secure.jpg"');
idx = idx.replace('class="product-card" style="text-decoration: none; color: inherit;">\n                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/avoid.jpg"', 'href="product-rp-avoid.html" class="product-card" style="text-decoration: none; color: inherit;">\n                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/avoid.jpg"');
idx = idx.replace('class="product-card" style="text-decoration: none; color: inherit;">\n                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/agri.png"', 'href="product-rp-agri.html" class="product-card" style="text-decoration: none; color: inherit;">\n                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/agri.png"');

fs.writeFileSync(idxPath, idx, 'utf8');
console.log('Updated index.html');
