const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Environment variables
const GITHUB_API = 'https://api.github.com';
const ORG_NAME = process.env.GITHUB_ORG_NAME;
const OUTPUT_DIR = path.join(__dirname, '../content/posts');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`, // Using the GitHub token from environment variable
    'Accept': 'application/vnd.github+json'
};

async function fetchReadmeForRepo(repo) {
    const url = `${GITHUB_API}/repos/${ORG_NAME}/${repo}/readme`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
}

async function fetchReposAndReadmes() {
    const url = `${GITHUB_API}/orgs/${ORG_NAME}/repos`;
    const response = await fetch(url, { headers });
    const repos = await response.json();

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const repo of repos) {
        const readmeContent = await fetchReadmeForRepo(repo.name);
        const outputFile = path.join(OUTPUT_DIR, `${repo.name}.md`);
        fs.writeFileSync(outputFile, readmeContent);
        console.log(`Fetched and saved README for ${repo.name}`);
    }
}

// Only execute the function if the script is run directly
if (require.main === module) {
    fetchReposAndReadmes().catch(console.error);
}

