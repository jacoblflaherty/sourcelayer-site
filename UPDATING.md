# How to update sourcelayer.co

The site's source of truth is GitHub: github.com/jacoblflaherty/sourcelayer-site
The server (DigitalOcean droplet, 192.241.137.109) serves a copy of the repo's `site/` folder.

## The update loop

1. **Edit the files** — locally in `Consulting Website/site/` (with Claude), or directly on GitHub (pencil icon).
2. **Commit to GitHub** — if edited locally: repo → `site` folder → Add file → Upload files → drag the changed file(s) → Commit changes. (Uploading a file with the same name replaces it.)
3. **Pull on the server** — from Mac Terminal:

   ```
   ssh root@192.241.137.109 "cd /var/www/sourcelayer-site && git pull"
   ```

   Enter the droplet root password. Site updates instantly.

## Rules of thumb

- Never edit files on the server directly — changes there get overwritten by the next `git pull` and aren't backed up.
- GitHub keeps full history: any commit can be viewed or reverted from the repo's "Commits" page.
- HTTPS certificate renews itself (certbot). Nothing to do.
- Nothing needs restarting for content changes.

## Key facts

- Server: DigitalOcean droplet "sourcelayer", Ubuntu 24.04, $4/mo, Toronto
- Web server: nginx, serving /var/www/sourcelayer-site/site
- Domain: sourcelayer.co (registered at GoDaddy, DNS at Cloudflare)
- Email: jacob@sourcelayer.co → forwards to gmail via Cloudflare Email Routing
- SSL: Let's Encrypt via certbot, auto-renews
