const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'protonest.db');
let dbInstance = null;

function initializeDatabase() {
    if (!dbInstance) {
        try {
            dbInstance = new Database(DB_PATH);
            // Enable WAL mode for better concurrency performance
            dbInstance.pragma('journal_mode = WAL');
            console.log(`✅ SQLite Database connected and WAL mode enabled.`);

            // ── Auto-create tables if they don't exist ──────────────────
            dbInstance.exec(`
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
                    features TEXT,
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
                    items TEXT,
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
            console.log('✅ All database tables verified/created.');

            // ── Seed products from JSON if table is empty ───────────────
            const productCount = dbInstance.prepare('SELECT COUNT(*) as count FROM products').get();
            if (productCount.count === 0) {
                const fs = require('fs');
                const jsonPath = path.join(__dirname, 'protonest-data.json');
                if (fs.existsSync(jsonPath)) {
                    console.log('📦 Products table is empty — seeding from protonest-data.json...');
                    const rawData = fs.readFileSync(jsonPath, 'utf8');
                    const data = JSON.parse(rawData);

                    if (data.products && data.products.length > 0) {
                        const insertProduct = dbInstance.prepare(`
                            INSERT OR IGNORE INTO products (id, name, description, price, original_price, category, sub_category, platform, rating, rating_count, stock, features, image_url, created_at)
                            VALUES (@id, @name, @description, @price, @original_price, @category, @sub_category, @platform, @rating, @rating_count, @stock, @features, @image_url, @created_at)
                        `);

                        const seedTransaction = dbInstance.transaction((products) => {
                            for (const p of products) {
                                insertProduct.run({
                                    id: p.id, name: p.name, description: p.description || '',
                                    price: p.price, original_price: p.original_price || null,
                                    category: p.category || '', sub_category: p.sub_category || '',
                                    platform: p.platform || null,
                                    rating: p.rating || 0, rating_count: p.rating_count || 0,
                                    stock: p.stock || 0,
                                    image_url: p.image || p.image_url || null,
                                    features: JSON.stringify(p.features || []),
                                    created_at: p.created_at || new Date().toISOString()
                                });
                            }
                        });

                        seedTransaction(data.products);
                        console.log(`✅ Seeded ${data.products.length} products into database.`);
                    }
                } else {
                    console.warn('⚠️ No protonest-data.json found to seed products.');
                }
            }

        } catch (err) {
            console.error('❌ Failed to connect to SQLite DB:', err.message);
            process.exit(1);
        }
    }
    return dbInstance;
}

function getDb() {
    if (!dbInstance) {
        return initializeDatabase();
    }
    return dbInstance;
}

module.exports = { initializeDatabase, getDb };
