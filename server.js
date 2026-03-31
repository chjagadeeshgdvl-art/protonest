const express = require('express');
const path = require('path');
const cors = require('cors');
const { initializeDatabase } = require('./database/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ==================== API Routes ====================
app.use('/api', apiRoutes);

// ==================== Fallback to index.html ====================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== Initialize DB & Start Server ====================
initializeDatabase();

// Initialize WhatsApp background client
const { initWhatsApp } = require('./services/whatsapp');
initWhatsApp();

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║   ⚡ ProtoNest Server is LIVE!             ║
    ║                                              ║
    ║   🌐 http://localhost:${PORT}                  ║
    ║   📦 Database: SQLite (better-sqlite3)       ║
    ║   🛒 API: http://localhost:${PORT}/api          ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
    `);
});
