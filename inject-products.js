const fs = require('fs');
const path = require('path');

// 1. Update raspberry.html
const rpiPath = path.join(__dirname, 'public', 'raspberry.html');
let rpiHtml = fs.readFileSync(rpiPath, 'utf8');

const rpiAdditions = `
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Intruder Security System</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 55</div>
                        <div class="product-price">₹ 4,500.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #C51A4A; color: white;">Add to Cart</button>
                    </a>
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Obstacle Avoiding Robot</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 89</div>
                        <div class="product-price">₹ 6,000.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #C51A4A; color: white;">Add to Cart</button>
                    </a>
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Smart Agricultural System</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 41</div>
                        <div class="product-price">₹ 5,500.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #C51A4A; color: white;">Add to Cart</button>
                    </a>
                </div>`;

if (!rpiHtml.includes("Raspberry Pi Intruder Security System")) {
    rpiHtml = rpiHtml.replace('                </div>', rpiAdditions);
    fs.writeFileSync(rpiPath, rpiHtml);
    console.log('Updated raspberry.html');
}

// 2. Update esp.html
const espPath = path.join(__dirname, 'public', 'esp.html');
let espHtml = fs.readFileSync(espPath, 'utf8');

const espAdditions = `
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">ESP Home Automation System</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 120</div>
                        <div class="product-price">₹ 1,800.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #E7352C; color: white;">Add to Cart</button>
                    </a>
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">ESP Industrial Security System</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 76</div>
                        <div class="product-price">₹ 2,200.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #E7352C; color: white;">Add to Cart</button>
                    </a>
                    <a href="#" class="product-card">
                        <div style="background: #f8f8f8; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;"><div style="color:#999;font-weight:bold;">No Image</div></div>
                        <div class="product-title" style="color: var(--link-color);">ESP WiFi RC Car</div>
                        <div style="color: #ff9900; font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐ 210</div>
                        <div class="product-price">₹ 1,500.00</div>
                        <div style="font-size: 12px; color: var(--success); margin-bottom: 10px;">In Stock</div>
                        <button class="btn btn-primary" style="width: 100%; border-radius: 20px; background-color: #E7352C; color: white;">Add to Cart</button>
                    </a>
                </div>`;

if (!espHtml.includes("ESP Home Automation System")) {
    espHtml = espHtml.replace('                </div>', espAdditions);
    fs.writeFileSync(espPath, espHtml);
    console.log('Updated esp.html');
}

console.log('Done mapping static products to UI.');
