# CAALR Website — Technical Notes

Technical reference for developers or AI agents maintaining the CAALR website.

## Architecture

| Component | Technology | Version |
|-----------|-----------|---------|
| Static Site Generator | Astro | 5.x |
| Content Management | Sveltia CMS (Decap-compatible) | Latest via CDN |
| Hosting | Netlify | Free tier |
| Authentication | Netlify Identity | Email/password, invite-only |
| Image Processing | Sharp (via Astro) | 0.33.x |
| Styling | Plain CSS with custom properties | N/A |
| Fonts | Google Fonts (Merriweather + Open Sans) | N/A |

## Project Structure

```
├── astro.config.mjs          # Astro config (site URL, integrations)
├── netlify.toml               # Netlify build config
├── public/
│   ├── admin/
│   │   ├── index.html         # Sveltia CMS entry point
│   │   └── config.yml         # CMS collection definitions
│   ├── uploads/               # CMS-uploaded images
│   ├── _redirects             # Old URL redirects
│   ├── _headers               # Security headers
│   └── favicon.svg
├── src/
│   ├── content.config.ts      # Zod schemas for content collections
│   ├── content/
│   │   ├── artists/*.md       # Artist profiles (19 files)
│   │   ├── events/*.md        # Show/event entries
│   │   ├── gallery/*.json     # Gallery image metadata
│   │   ├── news/*.md          # News items
│   │   ├── pages/             # CMS-editable page content
│   │   └── settings/          # Site settings (JSON files)
│   ├── layouts/BaseLayout.astro
│   ├── components/            # Astro components
│   ├── lib/content.ts         # Content query helpers
│   ├── pages/                 # Route pages
│   └── styles/                # CSS (tokens + global)
└── docs/                      # Documentation
```

## Content Collections

| Collection | Type | Format | Location |
|-----------|------|--------|----------|
| artists | content | Markdown | src/content/artists/*.md |
| events | content | Markdown | src/content/events/*.md |
| gallery | data | JSON | src/content/gallery/*.json |
| news | content | Markdown | src/content/news/*.md |

Settings and pages are accessed directly via `readFileSync` (not as Astro collections) because they're single files managed by the CMS.

## Local Development

```bash
nvm use 22
npm install
npm run dev      # Start dev server at localhost:4321
npm run build    # Build static site to dist/
npm run preview  # Preview built site locally
```

## Deployment

Automated via Netlify:
1. Code is pushed to GitHub `main` branch
2. Netlify detects the push and runs `npm run build`
3. Built `dist/` directory is deployed to CDN
4. When CMS user publishes, Sveltia CMS commits to GitHub → triggers rebuild

## DNS Cutover (caalr.com)

When ready to switch from GoDaddy to Netlify:

1. **Pre-cutover** (24 hours before):
   - In GoDaddy DNS, lower the TTL on the A record to 300 seconds
   - Wait 24 hours for the low TTL to propagate

2. **Cutover**:
   - In Netlify: Site settings → Domain management → Add custom domain → `caalr.com`
   - In GoDaddy DNS: Change the A record to point to Netlify's load balancer IP (shown in Netlify dashboard)
   - OR: Add a CNAME record for `www.caalr.com` pointing to `caalr.netlify.app`
   - OR: Change nameservers to Netlify's nameservers (simplest, but moves all DNS to Netlify)

3. **Post-cutover**:
   - Update `astro.config.mjs` site URL from `caalr.netlify.app` to `https://caalr.com`
   - Remove the `noindex` meta tag condition in `BaseLayout.astro`
   - Verify HTTPS works on the custom domain
   - Test all redirects from old URLs

## Sveltia CMS Notes

- Sveltia CMS is a drop-in replacement for Decap CMS
- Same `config.yml` format — can switch back to Decap if needed
- Loaded from CDN in `public/admin/index.html`
- Uses Netlify Identity for auth (email/password, invite-only)
- If Netlify Identity is ever discontinued, Sveltia CMS supports alternative auth backends

## Key Design Decisions

- **Event status auto-derived from dates**: No manual "upcoming/past" toggle — computed at build time from `startDate`
- **Artist slug = filename**: Astro uses the `.md` filename as the content ID. The CMS generates slugs from the artist name.
- **Individual gallery files**: Each gallery image is a separate JSON file (not a monolithic list) for easier CMS editing
- **Settings split into 4 files**: site.json, board.json, meetings.json, social.json — smaller forms, less risk of accidental data loss
- **No JavaScript frameworks**: Plain CSS, minimal inline scripts. Maximum longevity.
- **No contact form**: Reduces attack surface and hosting complexity

## Dependency Updates

The site has minimal dependencies. To update:

```bash
npm update          # Update to latest compatible versions
npm run build       # Verify build passes
```

Major version upgrades (Astro 6, etc.) may require migration. Check Astro's migration guides.
