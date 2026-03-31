const fs = require('fs');
const path = require('path');

const desktopImgPath = 'C:\\Users\\DHFM Jagadeesh\\Desktop\\SS image';
const publicImgPath = path.join(__dirname, 'public', 'images', 'products');

if (!fs.existsSync(publicImgPath)) {
    fs.mkdirSync(publicImgPath, { recursive: true });
}

const copyMap = [
    { src: 'line.jpg', dest: 'line.jpg', productIdContains: "Line Follower Robot", newName: "line follower robot car" },
    { src: 'dht11.webp', dest: 'dht11.webp', productIdContains: "Weather Station", newName: "weather monitoring station" },
    { src: 'wifi home.jpg', dest: 'wifi home.jpg', productIdContains: "4-Channel WiFi Relay", newName: "wifi home automation" },
    { src: 'dustbin.blob', dest: 'dustbin.jpg', productIdContains: "Smart Dustbin", newName: "smart dustbin system" },
    { src: 'bt rc car.blob', dest: 'bt_rc_car.jpg', productIdContains: "Bluetooth Controlled RC", newName: "bluetooth controlled car" },
    { src: 'desktop.jpg', dest: 'desktop.jpg', productIdContains: "Raspberry Pi 4", newName: "raspberry pi4 desktop kit" }
];

// Copy files
copyMap.forEach(item => {
    const srcFile = path.join(desktopImgPath, item.src);
    const destFile = path.join(publicImgPath, item.dest);
    if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied ${item.src} to ${item.dest}`);
    } else {
        console.log(`❌ Missing source image ${item.src}`);
    }
});

// Update JSON
const dbPath = path.join(__dirname, 'database', 'protonest-data.json');
let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

copyMap.forEach(item => {
    let product;
    if (item.src === 'desktop.jpg') {
        product = data.products.find(p => p.name.includes("Raspberry Pi 4 (8GB) Advanced AI Vision Bot") || p.name === "raspberry pi4 desktop kit");
    } else {
        product = data.products.find(p => p.name.toLowerCase().includes(item.productIdContains.toLowerCase()) || p.name === item.newName);
    }
    
    if (product) {
        product.name = item.newName;
        product.image_placeholder = `/images/products/${item.dest}`;
        console.log(`✅ Updated product to "${item.newName}" with image "/images/products/${item.dest}"`);
    } else {
        console.log(`❌ Product not found for ${item.src}`);
    }
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log('✅ Database updated successfully.');
