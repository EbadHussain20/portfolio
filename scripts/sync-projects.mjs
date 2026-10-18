// Fetches public repos for GH_USER and writes site/data/projects.json.
// Config via env: GH_USER, INCLUDE_FORKS=true|false, GITHUB_TOKEN (optional, raises rate limit)
import { writeFile } from 'node:fs/promises';
const user = process.env.GH_USER || 'EbadHussain20';
const forks = process.env.INCLUDE_FORKS === 'true';
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-sync' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const repos = [];
for (let page = 1; page < 11; page++) {
  const res = await fetch(`https://api.github.com/users/${user}/repos?type=owner&per_page=100&page=${page}`, { headers });
  if (!res.ok) { console.error(`GitHub API ${res.status}: ${await res.text()}`); process.exit(1); } // keep old file on failure
  const batch = await res.json();
  repos.push(...batch);
  if (batch.length < 100) break;
}
const out = repos.filter(r => !r.private && !r.archived && (forks || !r.fork)).map(r => ({
  name: r.name, url: r.html_url, description: r.description, language: r.language, topics: r.topics || [],
  stars: r.stargazers_count, forks: r.forks_count, fork: r.fork, homepage: r.homepage || null, updated: r.pushed_at,
}));
await writeFile(new URL('../site/data/projects.json', import.meta.url), JSON.stringify({ generatedAt: new Date().toISOString(), user, repos: out }, null, 1));
console.log(`Wrote ${out.length} repos for ${user}`);
