# Syed Ebad Hussain — Portfolio
Static site (HTML/CSS/JS, no build step) + a Node script that snapshots your public GitHub repos.

## How auto-discovery works
`.github/workflows/deploy.yml` runs **every 6 hours** (edit the `cron` line), on every push to `main`, and on demand. Each run executes `scripts/sync-projects.mjs`, which writes `site/data/projects.json`, then deploys `site/` to GitHub Pages. New public repos therefore appear within ~6 hours (not instantly). Trigger **Actions → Sync projects and deploy → Run workflow** for an immediate refresh.
- Forks are excluded; set `INCLUDE_FORKS: 'true'` in the workflow to include them.
- Ordering (`SORT` in `index.html`): stars and recency. Categories are keyword-matched from name, description, topics, language.
- Featured projects are not repeated: a featured entry with `r:` set to its repo URL is removed from the grid.
- The workflow uses the built-in `GITHUB_TOKEN` (higher rate limit). No secrets to add. If the API fails, the old `projects.json` is kept.

## One-time setup
1. Create a GitHub repo (e.g. `portfolio`), push this folder to `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Run the workflow once. Site goes live at `https://ebadhussain20.github.io/portfolio/`.

## Local preview
`node scripts/sync-projects.mjs && npx serve site`

## Adding repo links to featured projects
Only PCB and FIFA have verified repo URLs. For others, add `r:"https://github.com/EbadHussain20/<repo>"` in the `FEATURED` array.
