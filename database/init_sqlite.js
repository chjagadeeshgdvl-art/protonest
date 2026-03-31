const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const JSON_DB_PATH = path.join(__dirname, 'protonest-data.json');
const SQLITE_DB_PATH = path.join(__dirname, 'protonest.db');

console.log('🔄 Starting migration from JSON to SQLite...');

if (!fs.existsSync(JSON_DB_PATH)) {
    console.error('❌ JSON database not found. Cannot run migration.');
    process.exit(1);
}

// 1. Load the JSON data
const rawData = fs.readFileSync(JSON_DB_PATH, 'utf8');
const data = JSON.parse(rawData);
console.log(`✅ Loaded JSON data: ${data.products ? data.products.length : 0} products, ${data.users ? data.users.length : 0} users.`);

// 2. Initialize SQLite Database
// Remove existing DB file to start fresh if you are migrating for the first time
if (fs.existsSync(SQLITE_DB_PATH)) {
    console.log('🗑️ Removing existing SQLite database...');
    fs.unlinkSync(SQLITE_DB_PATH);
}
const db = new Database(SQLITE_DB_PATH);

// 3. Create Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        verified INTEGER DEFAULT 0,
        coins INTEGER DEFAULT 0,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        price REAL,
        original_price REAL,
        category TEXT,
        sub_category TEXT,
        platform TEXT,
        rating REAL,
        rating_count INTEGER,
        stock INTEGER,
        features TEXT, -- Stored as JSON string
        image_url TEXT,
        created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS cart (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        product_id TEXT,
        quantity INTEGER,
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        product_id TEXT,
        added_at TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        items TEXT, -- Stored as JSON string
        total REAL,
        status TEXT,
        delivery_address TEXT,
        payment_method TEXT,
        coins_earned INTEGER,
        estimated_delivery TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        customer_notes TEXT,
        date TEXT,
        created_at TEXT
    );
`);
console.log('✅ Created SQLite tables.');

// 4. Insert Data (Users)
if (data.users && data.users.length > 0) {
    const insertUser = db.prepare(`
        INSERT INTO users (id, name, email, phone, password, address, city, state, pincode, verified, coins, created_at)
        VALUES (@id, @name, @email, @phone, @password, @address, @city, @state, @pincode, @verified, @coins, @created_at)
    `);
    
    db.transaction(() => {
        for (const u of data.users) {
            insertUser.run({
                id: u.id, name: u.name, email: u.email, phone: u.phone, password: u.password,
                address: u.address || null, city: u.city || null, state: u.state || null, pincode: u.pincode || null,
                verified: u.verified ? 1 : 0, coins: u.coins || 0, created_at: u.created_at || new Date().toISOString()
            });
        }
    })();
    console.log(`✅ Migrated ${data.users.length} users.`);
}

// 5. Insert Data (Products)
if (data.products && data.products.length > 0) {
    const insertProduct = db.prepare(`
        INSERT INTO products (id, name, description, price, original_price, category, sub_category, platform, rating, rating_count, stock, features, image_url, created_at)
        VALUES (@id, @name, @description, @price, @original_price, @category, @sub_category, @platform, @rating, @rating_count, @stock, @features, @image_url, @created_at)
    `);

    db.transaction(() => {
        for (const p of data.products) {
            insertProduct.run({
                id: p.id, name: p.name, description: p.description || '', price: p.price, original_price: p.original_price || null,
                category: p.category || '', sub_category: p.sub_category || '', platform: p.platform || null,
                rating: p.rating || 0, rating_count: p.rating_count || 0, stock: p.stock || 0,
                image_url: p.image || p.image_url || null,
                features: JSON.stringify(p.features || []), created_at: p.created_at || new Date().toISOString()
            });
        }
    })();
    console.log(`✅ Migrated ${data.products.length} products.`);
}

// 6. Insert Data (Cart)
if (data.cart && data.cart.length > 0) {
    const insertCart = db.prepare(`
        INSERT INTO cart (id, user_id, product_id, quantity)
        VALUES (@id, @user_id, @product_id, @quantity)
    `);
    
    db.transaction(() => {
        for (const c of data.cart) {
            insertCart.run({
                id: c.id, user_id: c.user_id, product_id: c.product_id, quantity: c.quantity || 1
            });
        }
    })();
    console.log(`✅ Migrated ${data.cart.length} cart items.`);
}

// 7. Insert Data (Wishlist)
if (data.wishlist && data.wishlist.length > 0) {
    const insertWishlist = db.prepare(`
        INSERT INTO wishlist (id, user_id, product_id, added_at)
        VALUES (@id, @user_id, @product_id, @added_at)
    `);
    
    db.transaction(() => {
        for (const w of data.wishlist) {
            insertWishlist.run({
                id: w.id, user_id: w.user_id, product_id: w.product_id, added_at: w.added_at || new Date().toISOString()
            });
        }
    })();
    console.log(`✅ Migrated ${data.wishlist.length} wishlist items.`);
}

// 8. Insert Data (Orders)
if (data.orders && data.orders.length > 0) {
    const insertOrder = db.prepare(`
        INSERT INTO orders (id, user_id, items, total, status, delivery_address, payment_method, coins_earned, estimated_delivery, customer_name, customer_phone, customer_email, customer_notes, date, created_at)
        VALUES (@id, @user_id, @items, @total, @status, @delivery_address, @payment_method, @coins_earned, @estimated_delivery, @customer_name, @customer_phone, @customer_email, @customer_notes, @date, @created_at)
    `);
    
    db.transaction(() => {
        for (const o of data.orders) {
            insertOrder.run({
                id: o.id, user_id: o.user_id, items: JSON.stringify(o.items || []), total: o.total, status: o.status || 'Order Placed',
                delivery_address: o.delivery_address || null, payment_method: o.payment_method || null, coins_earned: o.coins_earned || 0,
                estimated_delivery: o.estimated_delivery || o.estimatedDelivery || null, customer_name: o.customer_name || o.customer?.name || null,
                customer_phone: o.customer_phone || o.customer?.phone || null, customer_email: o.customer_email || o.customer?.email || null,
                customer_notes: o.customer_notes || o.customer?.notes || null, date: o.date || null, created_at: o.created_at || new Date().toISOString()
            });
        }
    })();
    console.log(`✅ Migrated ${data.orders.length} orders.`);
}

console.log('🎉 Migration completed successfully!');
db.close();
