const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\DHFM Jagadeesh\\Desktop\\SS image';
const destDir = path.join(__dirname, 'public', 'images', 'products');

// Create products folder if not exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 1. Copy images
['avoid.jpg', 'agri.png', 'secure.jpg'].forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log('Copied ' + file);
});

// 2. Update raspberry.html
let rpiPath = path.join(__dirname, 'public', 'raspberry.html');
let rpi = fs.readFileSync(rpiPath, 'utf8');

// replace secure
rpi = rpi.replace(
    '<div style="color:#999;font-weight:bold;">No Image</div></div>\n                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Intruder Security System</div>',
    '<img src="/images/products/secure.jpg" alt="Security System" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Intruder Security System</div>'
);

// replace avoid
rpi = rpi.replace(
    '<div style="color:#999;font-weight:bold;">No Image</div></div>\n                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Obstacle Avoiding Robot</div>',
    '<img src="/images/products/avoid.jpg" alt="Avoid Robot" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Obstacle Avoiding Robot</div>'
);

// replace agri
rpi = rpi.replace(
    '<div style="color:#999;font-weight:bold;">No Image</div></div>\n                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Smart Agricultural System</div>',
    '<img src="/images/products/agri.png" alt="Smart Agri" style="width:100%; height:100%; object-fit:contain;"></div>\n                        <div class="product-title" style="color: var(--link-color);">Raspberry Pi Smart Agricultural System</div>'
);

fs.writeFileSync(rpiPath, rpi, 'utf8');


// 3. Update index.html
let idxPath = path.join(__dirname, 'public', 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');

const newBestSellers = `                <!-- New Recommendations -->
                <a href="#" class="product-card" style="text-decoration: none; color: inherit;">
                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/secure.jpg" alt="Kit" style="width:100%; height:100%; object-fit:contain;"></div>
                    <div class="product-title" style="color: var(--link-color);">Raspberry Pi Intruder Security System</div>
                    <div class="product-price">₹ 4,500.00</div>
                    <button class="btn btn-primary" style="width: 100%;">Add to Cart</button>
                </a>
                <a href="#" class="product-card" style="text-decoration: none; color: inherit;">
                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/avoid.jpg" alt="Kit" style="width:100%; height:100%; object-fit:contain;"></div>
                    <div class="product-title" style="color: var(--link-color);">Raspberry Pi Obstacle Avoiding Robot</div>
                    <div class="product-price">₹ 6,000.00</div>
                    <button class="btn btn-primary" style="width: 100%;">Add to Cart</button>
                </a>
                <a href="#" class="product-card" style="text-decoration: none; color: inherit;">
                    <div style="background: #f8f8f8; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; border-radius: 4px;"><img src="/images/products/agri.png" alt="Kit" style="width:100%; height:100%; object-fit:contain;"></div>
                    <div class="product-title" style="color: var(--link-color);">Raspberry Pi Smart Agricultural System</div>
                    <div class="product-price">₹ 5,500.00</div>
                    <button class="btn btn-primary" style="width: 100%;">Add to Cart</button>
                </a>
            </div>`;

// append it where line-follower ends if it does not exist already
if (!idx.includes('Raspberry Pi Obstacle Avoiding Robot')) {
    idx = idx.replace('<!-- Product 4 -->', 'A_B_C_D_E_F');
    idx = idx.replace('            </div>\n        </section>', newBestSellers + '\n        </section>');
    idx = idx.replace('A_B_C_D_E_F', '<!-- Product 4 -->');
    fs.writeFileSync(idxPath, idx, 'utf8');
    console.log('Appended to index.html bestsellers');
}

// if it exists but No image is there, let's update it. Wait, the above script injects the image right away.

console.log('Images attached successfully!');
