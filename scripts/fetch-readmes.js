import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GITHUB_API = 'https://api.github.com';
const ORG_NAME = process.env.GITHUB_ORG_NAME;
const OUTPUT_DIR = process.env.OUTPUT_DIR ? path.join(process.cwd(), process.env.OUTPUT_DIR) : path.join(__dirname, '../content/posts');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json'
};

async function fetchReadmeForRepo(repo) {
    const url = `${GITHUB_API}/repos/${ORG_NAME}/${repo}/readme`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error fetching README from ${repo}: ${response.statusText}`);
    }
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
}

async function fetchReposAndReadmes() {
    const url = `${GITHUB_API}/orgs/${ORG_NAME}/repos`;
    const response = await fetch(url, { headers });
    const repos = await response.json();
    if (!response.ok) {
        throw new Error(`Error fetching repos: ${response.statusText}`);
    }

    for (const repo of repos) {
        const readmeContent = await fetchReadmeForRepo(repo.name);
        const outputFile = path.join(OUTPUT_DIR, `${repo.name}.md`);
        await fs.writeFile(outputFile, readmeContent);
        console.log(`Fetched and saved README for ${repo.name}`);
    }
}

fetchReposAndReadmes().catch(console.error);
