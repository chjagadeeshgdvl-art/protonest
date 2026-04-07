const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const BASE_URL = 'https://protonest.northflank.app';

// Find all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getHtmlFiles(PUBLIC_DIR);
const sitemapUrls = [];

console.log(`Starting SEO optimizations on ${htmlFiles.length} files...`);

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(PUBLIC_DIR, file).replace(/\\/g, '/');
    const pageUrl = relativePath === 'index.html' ? BASE_URL : `${BASE_URL}/${relativePath}`;
    
    // Add to sitemap
    sitemapUrls.push(pageUrl);

    // Extract title
    let title = 'ProtoGods by JK labs';
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
    }

    const description = `Shop ${title}. Premium assembled prototypes and components engineered at JK Labs. Quick dispatch and cash on delivery available.`;

    // Remove old SEO tags if they exist so we don't multiply them
    content = content.replace(/<meta name="description".*?>/gi, '');
    content = content.replace(/<link rel="canonical".*?>/gi, '');
    content = content.replace(/<meta property="og:.*?>/gi, '');
    content = content.replace(/<meta name="twitter:.*?>/gi, '');

    // Prepare new SEO block
    const seoBlock = `
  <meta name="description" content="${description}">
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">`;

    // Insert after <title>
    if (content.includes('<title>')) {
        content = content.replace(/(<title>.*?<\/title>)/i, `$1\n${seoBlock}`);
    } else {
        // Fallback to inserting before </head> if no title
        content = content.replace('</head>', `${seoBlock}\n</head>`);
    }

    fs.writeFileSync(file, content, 'utf-8');
}

console.log(`✅ Successfully injected SEO tags into ${htmlFiles.length} files.`);

// Generate Sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${url === BASE_URL ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`✅ Generated sitemap.xml with ${sitemapUrls.length} entries.`);

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log(`✅ Generated robots.txt.`);

console.log("SEO and Site mapping completely successfully!");
