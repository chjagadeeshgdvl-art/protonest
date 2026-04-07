const { execSync } = require('child_process');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const RENDER_TOKEN = process.env.RENDER_TOKEN;

function fetchApi(url, options, body = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data || '{}'));
                } else {
                    reject(new Error(`API Error ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function deploy() {
    try {
        console.log("1. Authenticating with GitHub...");
        const user = await fetchApi('https://api.github.com/user', {
            method: 'GET',
            headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'ProtoGods by JK labs-Deploy' }
        });
        console.log(`✅ Logged in to GitHub as ${user.login}`);

        console.log("2. Creating public repository 'protonest'...");
        let repoUrl = '';
        try {
            const repo = await fetchApi('https://api.github.com/user/repos', {
                method: 'POST',
                headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'ProtoGods by JK labs-Deploy', 'Content-Type': 'application/json' }
            }, { name: 'protonest', private: false });
            repoUrl = repo.clone_url;
            console.log(`✅ Repository created: ${repoUrl}`);
        } catch (e) {
            if (e.message.includes('name already exists')) {
                repoUrl = `https://github.com/${user.login}/protonest.git`;
                console.log(`✅ Repository already exists: ${repoUrl}`);
            } else {
                throw e;
            }
        }

        console.log("3. Pushing code to GitHub...");
        try {
            execSync(`git remote remove origin`, { stdio: 'ignore' });
        } catch (e) {} // ignore if origin doesn't exist
        
        // Push using auth in URL
        const authRepoUrl = `https://${user.login}:${GITHUB_TOKEN}@github.com/${user.login}/protonest.git`;
        execSync(`git branch -M main`);
        execSync(`git remote add origin ${authRepoUrl}`);
        execSync(`git push -u origin main`);
        console.log(`✅ Code pushed successfully!`);

        console.log("4. Fetching Render Owner ID...");
        const owners = await fetchApi('https://api.render.com/v1/owners', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${RENDER_TOKEN}`, 'Accept': 'application/json' }
        });
        const ownerId = owners[0].owner.id;
        console.log(`✅ Render Owner ID: ${ownerId}`);

        console.log("5. Creating Render Web Service...");
        const renderPayload = {
            ownerId: ownerId,
            type: "web_service",
            name: "protonest-shop",
            repo: `https://github.com/${user.login}/protonest`,
            autoDeploy: "yes",
            branch: "main",
            serviceDetails: {
                env: "node",
                plan: "free",
                region: "oregon",
                envSpecificDetails: {
                    buildCommand: "npm install",
                    startCommand: "node server.js"
                }
            }
        };

        const renderResponse = await fetchApi('https://api.render.com/v1/services', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RENDER_TOKEN}`, 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }, renderPayload);

        console.log(`\n🎉 Web Service successfully created on Render!`);
        console.log(`👉 Service URL: ${renderResponse.service.serviceDetails.url}`);
        
    } catch (err) {
        console.error("❌ Deployment failed:", err.message);
    }
}

deploy();
