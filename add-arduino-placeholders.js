const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const rootDir = __dirname;
let htmlPath = path.join(rootDir, 'public', 'arduino.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const productsInfo = [
    { name: 'Arduino Fire Fighting Robot', pPrice: 3499 },
    { name: 'Arduino Anti Sleep Alarm', pPrice: 1299 },
    { name: 'Arduino Alcohol Detection System', pPrice: 1599 },
    { name: 'Arduino Smart Railway Gate', pPrice: 2199 },
    { name: 'Arduino Bluetooth Home Automation', pPrice: 1899 },
    { name: 'Smart Parking System', pPrice: 2899 },
    { name: 'Smart Garbage Segregation System', pPrice: 2499 },
    { name: 'Intelligent Traffic Light System', pPrice: 2299 }
];

let addedHTML = '';

productsInfo.forEach((prod, index) => {
    addedHTML += `
                    <!-- New Placeholder ${index+5} -->
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">${prod.name}</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 0</div>
                        <div class="product-price">₹ ${prod.pPrice.toLocaleString()}.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px;">Add to Cart</button>
                    </a>\n`;
});

// find insertion point in arduino.html
const injectionTerm = '                </div>\n            </div>\n        </div>\n    </main>';
html = html.replace(injectionTerm, addedHTML + injectionTerm);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Appended items to arduino.html');

// Append to DB
const dbPath = path.join(rootDir, 'database', 'protonest-data.json');
let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

productsInfo.forEach(prod => {
    data.products.push({
        id: uuidv4(),
        name: prod.name,
        description: 'New prototype placeholder',
        price: prod.pPrice,
        category: 'prototypes',
        sub_category: 'arduino',
        platform: 'arduino',
        rating: 5,
        rating_count: 0,
        stock: 10,
        features: ['Arduino Uno R3', 'Breadboard included', 'Source Code provided']
    });
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Appended items to protonest-data.json');
