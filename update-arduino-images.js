const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = 'C:\\Users\\DHFM Jagadeesh\\Desktop\\SS image';
const destDir = path.join(rootDir, 'public', 'images', 'products');

const filesToCopy = {
    'fire.webp': 'fire.webp',
    'sleep.jpg': 'sleep.jpg',
    'alcohol.jpeg': 'alcohol.jpeg',
    'rail.png': 'rail.png',
    'bluetooth.jpg': 'bluetooth.jpg',
    'park.png': 'park.png',
    'garbage.jpg': 'garbage.jpg',
    'traffic.jpeg': 'traffic.jpeg'
};

for (const [src, dest] of Object.entries(filesToCopy)) {
    fs.copyFileSync(path.join(srcDir, src), path.join(destDir, dest));
    console.log(`Copied ${src}`);
}

// 1. Update Database
const dbPath = path.join(rootDir, 'database', 'protonest-data.json');
let dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

dbData.products.forEach(p => {
    switch(p.name) {
        case 'Arduino Fire Fighting Robot': p.price = 2999; break;
        case 'Arduino Anti Sleep Alarm': p.price = 1899; break;
        case 'Arduino Alcohol Detection System': p.price = 1999; break;
        case 'Arduino Smart Railway Gate': p.price = 1699; break;
        case 'Arduino Bluetooth Home Automation': p.price = 1999; break;
        case 'Smart Parking System': p.price = 1699; break;
        case 'Smart Garbage Segregation System': p.price = 1599; break;
        case 'Intelligent Traffic Light System': p.price = 1799; break;
    }
});
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');

// 2. Update arduino.html
const htmlPath = path.join(rootDir, 'public', 'arduino.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const updates = [
    { title: 'Arduino Fire Fighting Robot', img: 'fire.webp', oldPrice: 3499, newPrice: 2999 },
    { title: 'Arduino Anti Sleep Alarm', img: 'sleep.jpg', oldPrice: 1299, newPrice: 1899 },
    { title: 'Arduino Alcohol Detection System', img: 'alcohol.jpeg', oldPrice: 1599, newPrice: 1999 },
    { title: 'Arduino Smart Railway Gate', img: 'rail.png', oldPrice: 2199, newPrice: 1699 },
    { title: 'Arduino Bluetooth Home Automation', img: 'bluetooth.jpg', oldPrice: 1899, newPrice: 1999 },
    { title: 'Smart Parking System', img: 'park.png', oldPrice: 2899, newPrice: 1699 },
    { title: 'Smart Garbage Segregation System', img: 'garbage.jpg', oldPrice: 2499, newPrice: 1599 },
    { title: 'Intelligent Traffic Light System', img: 'traffic.jpeg', oldPrice: 2299, newPrice: 1799 }
];

updates.forEach(u => {
    // Replace No Image
    const searchNoImg = `<div style="color:#999;font-weight:bold;">No Image</div></div>\n                        <div class="product-title" style="color: var(--link-color);">${u.title}</div>`;
    const replaceImg = `<img src="/images/products/${u.img}" alt="${u.title}" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">${u.title}</div>`;
    html = html.replace(searchNoImg, replaceImg);
    
    // Replace Price. Remember old prices were injected as ₹ X.00
    const searchPrice = `<div class="product-title" style="color: var(--link-color);">${u.title}</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 0</div>\n                        <div class="product-price">₹ ${u.oldPrice.toLocaleString()}.00</div>`;
    const replacePrice = `<div class="product-title" style="color: var(--link-color);">${u.title}</div>\n                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ ${Math.floor(Math.random()*150 + 20)}</div>\n                        <div class="product-price">₹ ${u.newPrice.toLocaleString()}.00</div>`;
    html = html.replace(searchPrice, replacePrice);
});

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Updated arduino.html with images and exact prices.');
