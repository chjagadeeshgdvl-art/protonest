const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = 'C:\\Users\\DHFM Jagadeesh\\Desktop\\SS image';
const destDir = path.join(rootDir, 'public', 'images', 'products');

// Ensure public directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 1. Copy Images
const fileMap = {
    'relay.jpg': 'relay.jpg',
    'home.webp': 'home.webp',
    'industry.jpg': 'industry.jpg',
    'wifi car.jpg': 'wifi_car.jpg' // renaming to avoid spaces in URLs
};

for (const [src, dest] of Object.entries(fileMap)) {
    fs.copyFileSync(path.join(srcDir, src), path.join(destDir, dest));
    console.log(`Copied ${src} to ${dest}`);
}

// 2. Update Database
const dbPath = path.join(rootDir, 'database', 'protonest-data.json');
let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

data.products.forEach(p => {
    if (p.name.includes("4-Channel WiFi Relay Module") || p.name.includes("4 Channel WiFi Relay")) {
        p.price = 399;
    }
    if (p.name.includes("ESP Home Automation System")) {
        p.price = 1499;
    }
    if (p.name.includes("ESP Industrial Security System")) {
        p.price = 1899;
    }
    if (p.name.includes("ESP WiFi RC Car")) {
        p.price = 2499;
    }
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated protonest-data.json');


// 3. Update HTML files for references
const filesToUpdate = ['public/esp.html', 'public/index.html', 'public/components.html', 'public/arduino.html']; 

filesToUpdate.forEach(fileRel => {
    const filePath = path.join(rootDir, fileRel);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // 4 Channel Relay
    html = html.replace(/<div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><img src="\/images\/nodemcu.jpg"[^>]*><\/div>\s*<div class="product-title" style="color: var\(--link-color\);">4-Channel WiFi Relay Module \(NodeMCU v3\)<\/div>/g, 
        '<div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/relay.jpg" alt="Relay" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">4-Channel WiFi Relay Module (NodeMCU v3)</div>');

    // Prices and generic No Image string replacements
    // ESP Home Automation System
    html = html.replace(/<div style="color:#999;font-weight:bold;">No Image<\/div><\/div>\s*<div class="product-title"[^>]*>ESP Home Automation System<\/div>/g,
        '<img src="/images/products/home.webp" alt="Home Auto" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">ESP Home Automation System</div>');
    html = html.replace(/<div class="product-title"[^>]*>ESP Home Automation System<\/div>([\s\S]*?)<div class="product-price">₹ [0-9,.]+<\/div>/g, 
        '<div class="product-title" style="color: var(--link-color);">ESP Home Automation System</div>$1<div class="product-price">₹ 1,499.00</div>');

    // ESP Industrial Security System
    html = html.replace(/<div style="color:#999;font-weight:bold;">No Image<\/div><\/div>\s*<div class="product-title"[^>]*>ESP Industrial Security System<\/div>/g,
        '<img src="/images/products/industry.jpg" alt="Industry" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">ESP Industrial Security System</div>');
    html = html.replace(/<div class="product-title"[^>]*>ESP Industrial Security System<\/div>([\s\S]*?)<div class="product-price">₹ [0-9,.]+<\/div>/g, 
        '<div class="product-title" style="color: var(--link-color);">ESP Industrial Security System</div>$1<div class="product-price">₹ 1,899.00</div>');

    // ESP WiFi RC Car
    html = html.replace(/<div style="color:#999;font-weight:bold;">No Image<\/div><\/div>\s*<div class="product-title"[^>]*>ESP WiFi RC Car<\/div>/g,
        '<img src="/images/products/wifi_car.jpg" alt="RC Car" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">ESP WiFi RC Car</div>');
    html = html.replace(/<div class="product-title"[^>]*>ESP WiFi RC Car<\/div>([\s\S]*?)<div class="product-price">₹ [0-9,.]+<\/div>/g, 
        '<div class="product-title" style="color: var(--link-color);">ESP WiFi RC Car</div>$1<div class="product-price">₹ 2,499.00</div>');

    // Hardcode fallback for 4-Channel WiFi Relay Module pricing
    html = html.replace(/<div class="product-title"[^>]*>4-Channel WiFi Relay Module \(NodeMCU v3\)<\/div>([\s\S]*?)<div class="product-price">₹ [0-9,.]+<\/div>/g, 
        '<div class="product-title" style="color: var(--link-color);">4-Channel WiFi Relay Module (NodeMCU v3)</div>$1<div class="product-price">₹ 399.00</div>');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated ${fileRel}`);
});

console.log('Finished updating ESP references.');
