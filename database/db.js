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
