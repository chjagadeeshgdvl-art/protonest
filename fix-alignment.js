const fs = require('fs');
const path = require('path');

const rpiPath = path.join(__dirname, 'public', 'raspberry.html');
let rpi = fs.readFileSync(rpiPath, 'utf8');

const rpiBlock = `                    <a href="#" class="product-card">
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
                    </a>`;

// 1. Remove from the incorrect spot
rpi = rpi.replace('\n' + rpiBlock + '\n                </div>', '\n                </div>');

// 2. Add to the correct spot
const rpiGridEnd = `                    </a>
                </div>
            </div>
        </div>
    </main>`;
const replaceRpiGridEnd = `                    </a>
${rpiBlock}
                </div>
            </div>
        </div>
    </main>`;

if (rpi.includes(rpiGridEnd) && !rpi.includes("Raspberry Pi Intruder Security System")) {
    rpi = rpi.replace(rpiGridEnd, replaceRpiGridEnd);
}
fs.writeFileSync(rpiPath, rpi, 'utf8');

const espPath = path.join(__dirname, 'public', 'esp.html');
let esp = fs.readFileSync(espPath, 'utf8');

const espBlock = `                    <a href="#" class="product-card">
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
                    </a>`;

esp = esp.replace('\n' + espBlock + '\n                </div>', '\n                </div>');

const espGridEnd = `                    </a>
                </div>
            </div>
        </div>
    </main>`;
const replaceEspGridEnd = `                    </a>
${espBlock}
                </div>
            </div>
        </div>
    </main>`;

if (esp.includes(espGridEnd) && !esp.includes("ESP Home Automation System")) {
    esp = esp.replace(espGridEnd, replaceEspGridEnd);
}
fs.writeFileSync(espPath, esp, 'utf8');

console.log('Fixed alignment layout!');
