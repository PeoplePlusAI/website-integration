import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const GITHUB_API = 'https://api.github.com';
const ORG_NAME = process.env.ORG_NAME;
const OUTPUT_DIR = process.env.OUTPUT_DIR ? path.join(process.cwd(), process.env.OUTPUT_DIR) : path.join(process.cwd(), 'content/posts');
const TOKEN = process.env.TOKEN;

const headers = {
    'Authorization': `token ${TOKEN}`,
    'Accept': 'application/vnd.github+json'
};

async function fetchReadmeForRepo(repo) {
    const url = `${GITHUB_API}/repos/${ORG_NAME}/${repo.name}/readme`;
    const response = await fetch(url, { headers });
    const data = await response.json();
    if (response.status >= 400) {
        throw new Error(`Error fetching README for ${repo.name}: ${response.statusText}`);
    }
    return Buffer.from(data.content, 'base64').toString('utf-8');
}

async function fetchAllRepos(orgName) {
    let allRepos = [];
    let page = 1;
    let fetchMore = true;

    while (fetchMore) {
        const url = `${GITHUB_API}/orgs/${orgName}/repos?type=public&per_page=100&page=${page}`;
        const response = await fetch(url, { headers });
        const repos = await response.json();

        if (repos.length > 0) {
            allRepos = allRepos.concat(repos);
            page++;
        } else {
            fetchMore = false;
        }
    }

    return allRepos;
}

async function fetchReposAndReadmes() {
    try {
        const repos = await fetchAllRepos(ORG_NAME);
        console.log(`Found ${repos.length} repositories.`);

        for (const repo of repos) {
            try {
                const readmeContent = await fetchReadmeForRepo(repo);
                const outputFile = path.join(OUTPUT_DIR, `${repo.name}-README.md`);
                fs.writeFileSync(outputFile, readmeContent);
                console.log(`Fetched and saved README for ${repo.name}`);
            } catch (error) {
                console.error(`Error processing ${repo.name}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`Error fetching repositories: ${error.message}`);
    }
}

fetchReposAndReadmes().catch(console.error);
