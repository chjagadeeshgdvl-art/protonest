const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const newHeader = `    <!-- Advanced Glassmorphic Header -->
    <header class="glass-header">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0;">
            <div style="display: flex; align-items: center; gap: 30px;">
                <a href="index.html" class="logo" style="margin-right: 10px;">Proto<span>Nest</span></a>
                <nav class="main-nav">
                    <ul style="display: flex; gap: 20px; margin: 0; padding: 0;">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="arduino.html">Arduino</a></li>
                        <li><a href="raspberry.html">Raspberry</a></li>
                        <li><a href="esp.html">ESP / IoT</a></li>
                        <li><a href="components.html">Components</a></li>
                    </ul>
                </nav>
            </div>
            
            <div class="search-bar" style="max-width: 350px;">
                <input type="text" placeholder="Search components, kits...">
                <button type="button">🔍</button>
            </div>
            
            <div class="header-actions" style="display: flex; gap: 15px; align-items: center;">
                <a href="login.html" style="color: white; font-weight: 500; font-size: 15px; letter-spacing: 0.5px; transition: 0.2s;" onmouseover="this.style.color='var(--primary-color)'" onmouseout="this.style.color='white'">Sign In</a>
                <a href="cart.html" style="background: rgba(255,255,255,0.08); padding: 10px 20px; border-radius: 50px; color: white; font-weight: 600; display: flex; align-items: center; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.15); transition: 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)'">
                    Cart <span class="cart-count" style="background: var(--primary-color); color: #0F172A; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 800; margin-left: 8px;">(0)</span>
                </a>
            </div>
        </div>
    </header>`;

function updateHeaders(dir) {
    const files = fs.readdirSync(dir);
    let count = 0;
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            count += updateHeaders(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Check if it has the original header layout
            if (content.includes('<!-- Header Section -->')) {
                // Regex to replace everything from <!-- Header Section --> up to and including </nav>
                const regex = /<!-- Header Section -->[\s\S]*?<\/nav>/i;
                const newContent = content.replace(regex, newHeader);
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    count++;
                }
            } else if (content.includes('<!-- Advanced Glassmorphic Header -->')) {
                 // Already updated, skip or re-update if needed
            } else {
                 // Try purely for <header> and <nav> replace
                 const regex2 = /<header>[\s\S]*?<\/nav>/i;
                 if (regex2.test(content)) {
                     const newContent = content.replace(regex2, newHeader);
                     fs.writeFileSync(fullPath, newContent, 'utf8');
                     count++;
                 }
            }
        }
    }
    return count;
}

const count = updateHeaders(publicDir);
console.log(`Updated ${count} files with new header.`);

// Also append the new header CSS class to style.css
const cssFile = path.join(publicDir, 'css', 'style.css');
let css = fs.readFileSync(cssFile, 'utf8');
if (!css.includes('.glass-header')) {
    css += `\n/* Glassmorphic Unified Header */\n.glass-header {\n    background: rgba(15, 23, 42, 0.85);\n    backdrop-filter: blur(16px);\n    -webkit-backdrop-filter: blur(16px);\n    border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n    position: sticky;\n    top: 0;\n    z-index: 1000;\n    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\n}\n`;
    fs.writeFileSync(cssFile, css, 'utf8');
    console.log('Appended .glass-header to style.css');
}
