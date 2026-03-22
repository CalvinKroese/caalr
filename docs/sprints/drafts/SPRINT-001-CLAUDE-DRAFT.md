# Sprint 001: CAALR Website Rebuild — Modern Static Site with Visual CMS

## Overview

The Creative Arts Association of Lakewood Ranch (CAALR) currently runs on a GoDaddy/Weebly site with fixed-position layouts, no mobile responsiveness, and ongoing hosting fees. This sprint rebuilds caalr.com as a modern, accessible, mobile-first static site deployed to Netlify's free tier, with Decap CMS providing a visual content management interface that a non-technical, elderly maintainer can operate without touching code or Git.

The approach uses **Hugo** as the static site generator, **Decap CMS** (formerly Netlify CMS) for content editing, and **Netlify** for hosting and identity. Hugo is chosen over Eleventy and Astro for three reasons: (1) it has the most mature Decap CMS integration with extensive community examples, (2) its built-in image processing pipeline handles responsive image generation and WebP conversion at build time without additional dependencies, and (3) its single-binary architecture means zero Node.js dependency management for the build. The site's templating needs are simple enough that Go templates are not a barrier.

All 19 artist profiles, 65+ gallery images, show/event history, board info, meeting schedules, and news features will be migrated from the current site. The existing green/yellow color palette will be refined into a modern nature-inspired theme with WCAG AA contrast compliance. The site will first deploy to `caalr.netlify.app` for stakeholder review before the real domain is pointed over.

## Use Cases

1. **Visitor browses artists**: A potential art buyer visits the site on their phone, browses the artist grid, taps into Wilma Kroese's profile, sees her bio, medium (pottery), and a gallery of her work, then finds her email to inquire about a piece.

2. **Maintainer adds a new artist**: The designated maintainer logs into `/admin`, clicks "Artists" → "New Artist", fills in name/bio/medium/email fields, uploads 3 photos via drag-and-drop, and clicks "Publish". The site rebuilds automatically within 2 minutes.

3. **Maintainer posts a new show**: The maintainer creates a new show entry with date, venue, description, and a flyer image. The show automatically appears in the "Upcoming" section on the Events page and on the homepage teaser.

4. **Maintainer updates meeting schedule**: Board meeting dates change for the year. The maintainer opens "Site Settings" → "Meeting Schedule" in the CMS, edits the dates, and publishes.

5. **Visitor discovers CAALR via search**: Google indexes the site with proper meta tags, structured data, and fast load times. A search for "Lakewood Ranch art group" surfaces the site with a rich snippet showing upcoming events.

6. **Visitor views gallery on tablet**: A visitor at a show scans a QR code, lands on the gallery page, sees a masonry grid of artwork, taps an image for a lightbox view with artist attribution, and swipes through the collection.

7. **Board member checks news coverage**: A board member shares a link to the "In the News" page on Facebook, where articles about Carol Krah, Elaine Vaughn, and Wilma Kroese are featured with excerpts and links to original sources.

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Netlify (Hosting)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Static Files  │  │ Netlify      │  │ Netlify Build │ │
│  │ (CDN)        │  │ Identity     │  │ (Hugo)        │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────┘
         ▲                    ▲                ▲
         │                    │                │
    Visitor requests     CMS login        Git push triggers
         │                    │              rebuild
         │              ┌─────┴──────┐         │
         │              │ Decap CMS  │         │
         │              │ (/admin)   │─────────┘
         │              └────────────┘
         │                commits to
         │                Git via
         │              Netlify Git Gateway
         │
┌────────┴────────────────────────────────────────────────┐
│                     Hugo (Build)                         │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐ │
│  │ Markdown  │  │ Templates │  │ Image Processing     │ │
│  │ Content   │  │ (layouts) │  │ (resize, WebP, LQIP) │ │
│  └──────────┘  └───────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Components

**Hugo Static Site Generator** — Reads Markdown content files and Go HTML templates, processes images, and outputs a static site to `public/`. Version: 0.145+ (extended edition for image processing).

**Decap CMS** — A single-page React app served from `static/admin/` that provides a visual editing interface. It authenticates via Netlify Identity, reads/writes content as Markdown files via Netlify's Git Gateway, and triggers rebuilds on publish. Configuration lives in `static/admin/config.yml`.

**Netlify Identity** — Free-tier identity service (up to 5 users) providing email/password login for CMS access. No GitHub account required — the maintainer logs in with an email and password, never sees Git.

**Netlify Git Gateway** — Server-side proxy that allows Decap CMS to commit to the Git repo on behalf of authenticated Netlify Identity users, without those users needing Git credentials.

**Hugo Image Processing** — At build time, Hugo resizes images to multiple breakpoints (400w, 800w, 1200w), converts to WebP with JPEG fallback, and generates low-quality image placeholders (LQIP) for progressive loading. This keeps the source images at full resolution in the repo while serving optimized versions.

### Data Flow

1. **Content editing**: Maintainer logs into `/admin` → edits content in visual UI → Decap CMS commits Markdown + uploaded images to Git via Git Gateway → Netlify detects push → Hugo rebuilds → new static files deployed to CDN (typically < 2 minutes end-to-end).

2. **Visitor request**: Browser requests page → Netlify CDN serves pre-built HTML/CSS/JS → browser lazy-loads images as they enter viewport → lightbox JS loads on demand when gallery image is clicked.

### Content Model

```
content/
├── _index.md                    # Homepage content
├── about/
│   └── _index.md                # About page (history, mission, membership)
├── artists/
│   ├── _index.md                # Artists listing page intro text
│   ├── barby-cummings.md        # Individual artist profile
│   ├── wilma-kroese.md
│   └── ...                      # (19 total artist files)
├── events/
│   ├── _index.md                # Events listing page intro text
│   ├── spring-show-2026.md      # Individual event
│   └── ...
├── gallery/
│   └── _index.md                # Gallery page (images defined in front matter)
└── news/
    ├── _index.md                # News listing page intro text
    ├── carol-krah-feature.md    # Individual news item
    └── ...
```

### CMS Content Type Schemas

**Artist** (`content/artists/*.md`):
```yaml
---
title: "Wilma Kroese"
medium: "Pottery"
email: "WKpottery@yahoo.com"
bio: "Multi-paragraph biography text..."
profile_image: "/images/artists/wilma-kroese/profile.jpg"
gallery:
  - image: "/images/artists/wilma-kroese/piece-1.jpg"
    caption: "Raku-fired vase, 2024"
  - image: "/images/artists/wilma-kroese/piece-2.jpg"
    caption: "Stoneware bowl"
weight: 10  # Sort order
draft: false
---
```

**Event** (`content/events/*.md`):
```yaml
---
title: "Annual Spring Art Show and Sale"
date: 2026-03-14
end_date: 2026-03-14
location: "Lakewood Ranch Town Hall"
address: "8175 Lakewood Ranch Blvd, Lakewood Ranch, FL 34202"
description: "Free admission, free parking. Featuring watercolor, jewelry, pottery, ceramic, stained glass, mixed media, and more."
flyer_image: "/images/events/spring-show-2026.jpg"
featured: true
draft: false
---

Extended event description in Markdown body...
```

**Gallery Image** (`content/gallery/_index.md` front matter):
```yaml
---
title: "Gallery"
description: "Artwork by CAALR members"
images:
  - src: "/images/gallery/image-001.jpg"
    caption: "Raku pottery by Susan Kerr"
    artist: "Susan Kerr"
    medium: "Pottery"
  - src: "/images/gallery/image-002.jpg"
    caption: ""
    artist: ""
    medium: ""
# ... 65+ entries
---
```

**News Item** (`content/news/*.md`):
```yaml
---
title: "Carol Krah Featured in Local Press"
date: 2025-06-15
member: "Carol Krah"
source_name: "Lakewood Ranch Herald"
source_url: "https://example.com/article"
thumbnail: "/images/news/carol-krah-feature.jpg"
draft: false
---

Excerpt or summary of the article...
```

**Site Settings** (`data/settings.yaml`):
```yaml
board:
  - role: "President"
    name: "Carol Krah"
  - role: "Vice President"
    name: "Stacey Lipton"
  - role: "Secretary"
    name: "Susan Perry"
  - role: "Treasurer"
    name: "Benise Jones"
  - role: "At Large"
    name: "Barby Comins"
  - role: "At Large"
    name: "Wilma Kroese"
  - role: "At Large"
    name: "Elaine Vaughn"

meetings:
  location: "Lakewood Ranch Town Hall"
  board_time: "6:15 PM"
  networking_time: "6:30 PM"
  general_time: "7:00 PM"
  dates:
    - date: 2026-01-12
      type: "Board and Membership"
    - date: 2026-02-09
      type: "Board and Membership"
    - date: 2026-03-13
      type: "Setup for Spring Show"
    - date: 2026-03-14
      type: "Spring Show"
    - date: 2026-09-14
      type: "Board and Membership"
    - date: 2026-10-19
      type: "Board and Membership"
    - date: 2026-11-13
      type: "Setup for Fall Show"
    - date: 2026-11-14
      type: "Fall Show"

membership:
  artist_fee: "$25"
  artist_contact: "Carol Krah"
  artist_contact_email: "CarolRKrah@gmail.com"
  supporter_fee: "Free"

social:
  facebook: "https://www.facebook.com/CreativeArtsofLakewoodRanch"
  instagram: ""

address:
  street: "8175 Lakewood Ranch Blvd"
  city: "Lakewood Ranch"
  state: "FL"
  zip: "34202"
```

## Implementation

### Phase 1: Project Scaffolding & Hugo Setup (~15% of effort)

**Files:**
- `hugo.toml` — Hugo site configuration (base URL, title, theme settings, image processing defaults, markup config)
- `go.mod` — Hugo module definition (if using module-based theme)
- `netlify.toml` — Netlify build configuration (Hugo version, build command, publish directory, redirects)
- `static/admin/index.html` — Decap CMS entry point (loads CMS React app from CDN)
- `static/admin/config.yml` — Decap CMS collection/field definitions mapping to content model
- `.gitignore` — Ignore public/, resources/, .hugo_build.lock
- `package.json` — Minimal; only for optional PostCSS/Tailwind build if used (Hugo can inline this)

**Tasks:**
- [ ] Initialize Hugo site with `hugo new site . --force` (force because directory isn't empty)
- [ ] Configure `hugo.toml` with site metadata, base URL (`https://caalr.netlify.app`), image processing defaults (quality 85, WebP, resize filter Lanczos), and markup settings (unsafe HTML allowed for embeds)
- [ ] Create `netlify.toml` specifying Hugo extended 0.145+, build command `hugo --minify`, publish dir `public`, and `[[redirects]]` for SPA admin route
- [ ] Create `.gitignore` for `public/`, `resources/`, `.hugo_build.lock`, `node_modules/`
- [ ] Set up Decap CMS `static/admin/index.html` loading from `unpkg.com/decap-cms@^3.0/dist/decap-cms.js`
- [ ] Write `static/admin/config.yml` with all collection definitions (artists, events, gallery, news, settings) matching the content model schemas above
- [ ] Verify Hugo builds with empty content and Decap CMS admin page loads locally

### Phase 2: Design System & Templates (~25% of effort)

**Files:**
- `assets/css/main.css` — Core stylesheet: CSS custom properties for colors/typography/spacing, reset, layout utilities, responsive breakpoints
- `layouts/_default/baseof.html` — Base template: HTML head (meta, fonts, CSS), skip-to-content link, header, main, footer
- `layouts/_default/list.html` — Default list template
- `layouts/_default/single.html` — Default single-page template
- `layouts/partials/head.html` — `<head>` partial: meta tags, Open Graph, structured data (JSON-LD), preloaded fonts, CSS
- `layouts/partials/header.html` — Site header: logo, navigation (mobile hamburger + desktop horizontal), skip nav
- `layouts/partials/footer.html` — Site footer: copyright, social links, address, "Powered by" attribution
- `layouts/partials/nav.html` — Navigation component with mobile toggle (CSS-only or minimal JS)
- `layouts/partials/image.html` — Responsive image partial: takes a resource, outputs `<picture>` with WebP + JPEG srcset at 400/800/1200w breakpoints, LQIP placeholder, lazy loading
- `layouts/shortcodes/google-map.html` — Embedded Google Map shortcode for the About page
- `static/images/logo.png` — CAALR logo (extracted from current site or recreated)
- `static/favicon.ico` — Favicon generated from logo

**Tasks:**
- [ ] Define CSS custom properties for the modernized color palette:
  ```css
  :root {
    --color-primary: #1a6847;      /* Deep forest green (text, headings) */
    --color-primary-light: #2d8f65; /* Medium green (links, accents) */
    --color-primary-dark: #0f3d2a;  /* Darkest green (header bg) */
    --color-secondary: #f5e66b;     /* Warm yellow (CTAs, highlights) */
    --color-secondary-light: #fdf8d4; /* Pale yellow (section backgrounds) */
    --color-bg: #fafdf7;            /* Off-white with green tint */
    --color-bg-alt: #eef7e8;        /* Light green for alternating sections */
    --color-text: #1a2e1a;          /* Near-black green for body text */
    --color-text-muted: #4a6b4a;    /* Muted green for captions */
    --color-border: #c8dcc0;        /* Soft green border */
    --font-heading: 'Merriweather', Georgia, serif;
    --font-body: 'Open Sans', -apple-system, sans-serif;
    --font-size-base: 18px;         /* ≥16px for accessibility */
    --line-height-base: 1.7;        /* Generous for readability */
    --max-width: 1200px;
    --spacing-unit: 0.5rem;
  }
  ```
- [ ] Write CSS reset and base typography (18px base, 1.7 line height, Merriweather headings, Open Sans body)
- [ ] Implement responsive layout system: single-column mobile, 2-column tablet, 3-column desktop grid
- [ ] Create `baseof.html` with semantic HTML5 structure, skip-to-content link, and `<noscript>` fallback
- [ ] Build header/nav with mobile hamburger menu (CSS `:target` or `<details>` for zero-JS mobile nav)
- [ ] Build footer with social icons (inline SVG for Facebook/Instagram), copyright, mailing address
- [ ] Create responsive image partial with Hugo's image processing: `{{ $img.Resize "800x webp" }}` pipeline generating srcset with 400w/800w/1200w and LQIP via `{{ $img.Resize "20x webp" }}`
- [ ] Extract logo from current site at highest available resolution; create SVG text fallback if resolution is insufficient (text: "CAALR" in Merriweather with leaf accent)
- [ ] Test all templates at 320px, 768px, 1024px, 1440px breakpoints
- [ ] Verify WCAG AA contrast ratios for all color combinations (use WebAIM contrast checker)

### Phase 3: Content Pages & Layouts (~25% of effort)

**Files:**
- `layouts/index.html` — Homepage: hero section, mission statement, upcoming events teaser (3 max), featured artists carousel, CTA to gallery
- `layouts/about/single.html` — About page: history, mission, board of directors table, meeting schedule table, membership info, embedded Google Map, resource links
- `layouts/artists/list.html` — Artists listing: responsive grid of cards (photo, name, medium) linking to profiles
- `layouts/artists/single.html` — Artist profile: hero image, bio, medium, contact email (obfuscated), mini-gallery of their work
- `layouts/events/list.html` — Events listing: upcoming events (sorted by date, future first) + past events archive
- `layouts/events/single.html` — Event detail page: date, location, description, flyer image, Google Maps link
- `layouts/gallery/single.html` — Gallery page: filterable masonry grid with lightbox overlay
- `layouts/news/list.html` — News listing: card grid with thumbnails, member name, source, date
- `layouts/news/single.html` — News detail: article excerpt with link to original source
- `layouts/partials/artist-card.html` — Reusable artist card component for grid and homepage
- `layouts/partials/event-card.html` — Reusable event card component
- `layouts/partials/lightbox.html` — Lightbox overlay component (minimal JS, keyboard navigable, swipe support)
- `assets/js/lightbox.js` — Lightweight lightbox (~2KB): keyboard navigation (Esc, arrows), swipe gestures, focus trap for accessibility
- `assets/js/gallery-filter.js` — Optional: filter gallery by artist/medium (progressive enhancement)
- `assets/js/nav.js` — Mobile nav toggle (~0.5KB, only if CSS-only approach is insufficient)

**Tasks:**
- [ ] Build homepage layout: hero with tagline "Creative Arts Association of Lakewood Ranch — Inspiring visual artists since 2001", auto-populated upcoming events section (Hugo query: `where .Date.After now | first 3`), featured artist spotlight
- [ ] Build About page with board of directors rendered from `data/settings.yaml`, meeting schedule table (auto-highlights next upcoming meeting), membership info section, embedded Google Map via shortcode, and links to Art Center Manatee and Art Center Sarasota
- [ ] Build artist listing page with responsive card grid (3 across desktop, 2 tablet, 1 mobile); each card shows profile image, name, and medium
- [ ] Build artist single template with large profile/hero image, bio text, medium badge, obfuscated email link (`mailto:` with CSS/JS obfuscation to reduce spam), and mini-gallery of their work pieces
- [ ] Build events listing with automatic upcoming/past split based on current date; upcoming events sorted ascending, past events sorted descending with year grouping
- [ ] Build gallery page with CSS Grid masonry layout (`grid-template-rows: masonry` with fallback to fixed-ratio grid for unsupported browsers), lightbox on click with keyboard/swipe navigation
- [ ] Build news listing and detail pages
- [ ] Write lightbox JS: `<dialog>` element for native modal behavior, arrow key navigation, Escape to close, swipe detection for mobile, focus trap, preload adjacent images
- [ ] Ensure all templates include proper Open Graph meta tags for social sharing (og:image, og:title, og:description)

### Phase 4: Content Migration (~20% of effort)

**Files:**
- `content/_index.md` — Homepage content
- `content/about/_index.md` — About page content (history from current site, mission statement)
- `content/artists/*.md` — 19 artist profile files with bios, mediums, emails
- `content/events/*.md` — Show/event entries migrated from current site
- `content/gallery/_index.md` — Gallery page with image entries in front matter
- `content/news/*.md` — News feature entries for Carol Krah, Elaine Vaughn, Wilma Kroese
- `data/settings.yaml` — Board, meetings, membership, social links, address
- `static/images/artists/` — Artist profile photos and artwork (downloaded + optimized)
- `static/images/gallery/` — All 65+ gallery images (downloaded + optimized)
- `static/images/events/` — Event flyer images
- `static/images/news/` — News article thumbnails
- `scripts/download-images.sh` — Helper script to batch-download images from current site's CDN (nebula.wsimg.com)
- `scripts/optimize-images.sh` — Batch optimize downloaded images (strip metadata, resize max 2400px wide, compress JPEG to 85% quality) using ImageMagick before adding to repo

**Tasks:**
- [ ] Write and run `scripts/download-images.sh` to download all images from the current Weebly site (gallery images from nebula.wsimg.com CDN, artist photos, event images)
- [ ] Write and run `scripts/optimize-images.sh` to batch-process downloaded images: strip EXIF, resize to max 2400px on longest edge, JPEG quality 85%, output to appropriate `static/images/` subdirectories
- [ ] Create all 19 artist Markdown files with name, medium, and email from the known artist table. For the 4 artists with existing profile pages (Elaine Vaughn, Wilma Kroese, Barbara Kaplan, Sue Kerr), extract bio content from their current pages
- [ ] For the remaining 15 artists without bios: write a brief placeholder bio noting their medium and CAALR membership, flagged with a `<!-- TODO: bio needed -->` comment for the maintainer to update via CMS
- [ ] Create event entries for Spring Show 2026, Fall Show 2026, and the documented past "East Meets West" show
- [ ] Create news entries for Carol Krah, Elaine Vaughn, and Wilma Kroese with links to their articles
- [ ] Populate `data/settings.yaml` with all board, meeting, membership, social, and address data from the current site
- [ ] Write homepage content: welcome message, mission statement (adapted from current site's founding story), and association description
- [ ] Write About page content: full history (founded 2001 as "Creativity Group", first show 2002), mission, membership details
- [ ] Catalog all 65+ gallery images with available captions and artist attributions; assign filenames based on artist-medium pattern where identifiable
- [ ] Verify content completeness: all 19 artists, all gallery images, all events, all news items, all board members, full meeting schedule

### Phase 5: Decap CMS Configuration & Identity (~10% of effort)

**Files:**
- `static/admin/config.yml` — (update from Phase 1) Finalize all widget types, validation rules, preview templates
- `static/admin/preview-templates.js` — Optional: custom preview rendering for CMS editor to match site styling
- `static/admin/config.yml` includes editorial workflow configuration

**Tasks:**
- [ ] Finalize `config.yml` collections with proper widget types:
  - Artists: `string` (title), `text` (bio with multiline), `string` (medium, email), `image` (profile_image), `list` with `object` widget for gallery items (image + caption)
  - Events: `string` (title), `datetime` (date, end_date), `string` (location, address), `text` (description), `image` (flyer_image), `boolean` (featured)
  - Gallery: `list` widget with `object` (src as `image`, caption/artist/medium as `string`)
  - News: `string` (title, member, source_name, source_url), `datetime` (date), `image` (thumbnail), `markdown` (body)
  - Settings: `data_files` backend for `data/settings.yaml` with nested `list` and `object` widgets for board, meetings, social links
- [ ] Configure Decap CMS `media_folder` and `public_folder` paths for image uploads (`static/images` and `/images`)
- [ ] Enable editorial workflow (`publish_mode: editorial_workflow`) so the maintainer can save drafts before publishing
- [ ] Set up Netlify Identity service on the Netlify site (invite-only registration to prevent unauthorized access)
- [ ] Create the maintainer's account via Netlify Identity invite email
- [ ] Test full CMS workflow: log in → create draft artist → add images → publish → verify site rebuild includes new artist

### Phase 6: Accessibility, Performance & SEO (~5% of effort)

**Files:**
- `layouts/partials/structured-data.html` — JSON-LD structured data for Organization, Event, and Person schemas
- `layouts/robots.txt` — Robots.txt template
- `layouts/_default/sitemap.xml` — Sitemap override (Hugo generates by default, may need customization)
- `static/manifest.json` — Web app manifest for PWA basics (app name, theme color, icons)

**Tasks:**
- [ ] Add JSON-LD structured data: `Organization` on homepage (name, address, logo, social links), `Event` on event pages (date, location, description), `Person` on artist pages (name, jobTitle as medium)
- [ ] Audit all pages with Lighthouse: target 90+ on Performance, Accessibility, Best Practices, SEO
- [ ] Audit with axe-core browser extension for WCAG AA compliance
- [ ] Verify all images have descriptive `alt` text
- [ ] Verify keyboard navigation works end-to-end: Tab through nav, Enter to open lightbox, Escape to close, arrow keys to navigate
- [ ] Test focus indicators are visible on all interactive elements
- [ ] Verify color contrast ratios meet WCAG AA (4.5:1 for body text, 3:1 for large text)
- [ ] Add `<meta name="description">` to all pages with unique, descriptive content
- [ ] Configure Hugo's built-in sitemap generation; verify it includes all pages
- [ ] Test page load performance on throttled 3G connection: target < 3 seconds for first contentful paint
- [ ] Verify responsive images are served correctly: small images on mobile, large on desktop (check network tab)

### Phase 7: Documentation & Handoff (~5% of effort — but critical)

**Files:**
- `docs/MAINTAINER-GUIDE.md` — Step-by-step CMS usage guide written for a non-technical audience, with screenshots
- `docs/TECHNICAL-NOTES.md` — Developer reference for future technical maintenance (Hugo version, build process, deployment, DNS)

**Tasks:**
- [ ] Write `MAINTAINER-GUIDE.md` covering every CMS operation with clear, numbered steps:
  1. How to log in to the admin panel
  2. How to add a new artist (with screenshots of each field)
  3. How to edit an existing artist
  4. How to remove an artist
  5. How to add a new event/show
  6. How to add images to the gallery
  7. How to add a news item
  8. How to update meeting dates and board members
  9. How to save a draft vs. publish immediately
  10. How to upload and manage images
  11. Common troubleshooting (can't log in, image too large, changes not appearing)
- [ ] Write `docs/TECHNICAL-NOTES.md` covering: Hugo version requirements, local development setup (`hugo server`), Netlify deployment pipeline, DNS configuration for pointing caalr.com, Decap CMS architecture, and how to add new content types
- [ ] Deploy to `caalr.netlify.app` and conduct final review walkthrough with user

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `hugo.toml` | Create | Hugo site configuration |
| `netlify.toml` | Create | Netlify build settings, redirects, Hugo version |
| `.gitignore` | Create | Ignore build artifacts |
| `static/admin/index.html` | Create | Decap CMS entry point |
| `static/admin/config.yml` | Create | CMS collections, fields, widgets, editorial workflow |
| `assets/css/main.css` | Create | Design system: colors, typography, layout, responsive |
| `layouts/_default/baseof.html` | Create | Base HTML template with head, header, footer |
| `layouts/_default/list.html` | Create | Default list page template |
| `layouts/_default/single.html` | Create | Default single page template |
| `layouts/index.html` | Create | Homepage layout |
| `layouts/about/single.html` | Create | About page layout |
| `layouts/artists/list.html` | Create | Artist grid listing |
| `layouts/artists/single.html` | Create | Individual artist profile |
| `layouts/events/list.html` | Create | Events listing (upcoming + past) |
| `layouts/events/single.html` | Create | Event detail page |
| `layouts/gallery/single.html` | Create | Masonry gallery with lightbox |
| `layouts/news/list.html` | Create | News listing |
| `layouts/news/single.html` | Create | News detail page |
| `layouts/partials/head.html` | Create | HTML head with meta, OG tags, fonts, CSS |
| `layouts/partials/header.html` | Create | Site header with logo and nav |
| `layouts/partials/footer.html` | Create | Site footer with social, copyright, address |
| `layouts/partials/nav.html` | Create | Responsive navigation component |
| `layouts/partials/image.html` | Create | Responsive image partial (srcset, WebP, LQIP) |
| `layouts/partials/artist-card.html` | Create | Reusable artist card component |
| `layouts/partials/event-card.html` | Create | Reusable event card component |
| `layouts/partials/lightbox.html` | Create | Accessible lightbox overlay component |
| `layouts/partials/structured-data.html` | Create | JSON-LD structured data |
| `layouts/shortcodes/google-map.html` | Create | Google Maps embed shortcode |
| `assets/js/lightbox.js` | Create | Lightweight accessible lightbox |
| `assets/js/nav.js` | Create | Mobile nav toggle (if needed) |
| `content/_index.md` | Create | Homepage content |
| `content/about/_index.md` | Create | About page content |
| `content/artists/_index.md` | Create | Artists listing intro |
| `content/artists/*.md` (×19) | Create | Individual artist profiles |
| `content/events/_index.md` | Create | Events listing intro |
| `content/events/*.md` (×3+) | Create | Individual event entries |
| `content/gallery/_index.md` | Create | Gallery page with image list |
| `content/news/_index.md` | Create | News listing intro |
| `content/news/*.md` (×3) | Create | Individual news items |
| `data/settings.yaml` | Create | Board, meetings, membership, social, address |
| `static/images/logo.png` | Create | Site logo |
| `static/images/artists/**` | Create | Artist photos and artwork |
| `static/images/gallery/**` | Create | Gallery images (65+) |
| `static/images/events/**` | Create | Event flyers |
| `static/images/news/**` | Create | News thumbnails |
| `static/favicon.ico` | Create | Favicon |
| `static/manifest.json` | Create | Web app manifest |
| `scripts/download-images.sh` | Create | Batch download images from current site |
| `scripts/optimize-images.sh` | Create | Batch optimize images with ImageMagick |
| `docs/MAINTAINER-GUIDE.md` | Create | Non-technical CMS usage guide with screenshots |
| `docs/TECHNICAL-NOTES.md` | Create | Developer reference for maintenance |

## Definition of Done

- [ ] Hugo site builds without errors via `hugo --minify`
- [ ] Site deployed to `caalr.netlify.app` and accessible publicly
- [ ] All 19 artists have profile pages with name, medium, email, and at least one image
- [ ] All 65+ gallery images migrated and displayed in masonry grid with lightbox
- [ ] All events (Spring Show 2026, Fall Show 2026, past shows) present and correctly dated
- [ ] All 3 news features (Carol Krah, Elaine Vaughn, Wilma Kroese) migrated with source links
- [ ] Board of directors, meeting schedule, membership info, and address all accurate on About page
- [ ] Facebook link present in header/footer (Instagram placeholder if no account exists)
- [ ] Decap CMS accessible at `/admin` with Netlify Identity login
- [ ] CMS walkthrough completed: add artist, create event, upload gallery image, edit meeting dates — all through visual UI without touching code
- [ ] Mobile responsive at 320px, 768px, 1024px, 1440px breakpoints — no horizontal scroll, no overlapping elements
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse SEO score ≥ 90
- [ ] WCAG AA contrast ratios verified for all text/background combinations
- [ ] Keyboard navigation works: Tab through all interactive elements, Enter activates, Escape closes modals
- [ ] All images have descriptive alt text
- [ ] Page load < 3 seconds on simulated 3G throttling (first contentful paint)
- [ ] Responsive images served (WebP with JPEG fallback, multiple sizes via srcset)
- [ ] MAINTAINER-GUIDE.md written with step-by-step instructions for every CMS operation
- [ ] TECHNICAL-NOTES.md written with developer maintenance reference
- [ ] Tested in Chrome, Safari, and Firefox on desktop and mobile
- [ ] Open Graph meta tags produce correct previews when shared on Facebook
- [ ] Site renders acceptably with JavaScript disabled (progressive enhancement — gallery works without lightbox, nav works without JS)

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Logo image from current site is too low resolution (98×35px) | High | Medium | Create an SVG text-based logo as fallback: "CAALR" in Merriweather with a simple leaf/palette accent. Ask the association if they have a higher-resolution version. |
| Gallery images from Weebly CDN are low quality or inconsistent sizes | Medium | Medium | Batch-optimize at download time; Hugo's image processing normalizes sizes at build. Accept that source quality may vary — focus on consistent presentation rather than pixel perfection. |
| 15 of 19 artists have no bio content available on current site | High | Low | Create dignified placeholder bios ("Barby Cummings is a wire art artist and member of CAALR.") with CMS-editable fields so members can submit their own bios over time. Flag with TODO comments. |
| Decap CMS editorial workflow confuses non-technical maintainer | Medium | High | Configure `publish_mode: simple` initially (bypass draft review), upgrade to editorial workflow only if maintainer requests it. Write MAINTAINER-GUIDE.md with abundant screenshots. |
| Netlify Identity email delivery issues (invite/password reset) | Low | High | Test invite flow early in Phase 5. Have a backup plan: maintainer can use GitHub OAuth if email flow is unreliable (requires creating a GitHub account). |
| Weebly CDN image URLs expire or change during migration | Medium | Medium | Run download script early (Phase 4) and store all images locally. Do not rely on CDN URLs for the new site. |
| Hugo extended edition not available in Netlify build image | Low | High | Pin Hugo version in `netlify.toml` (`HUGO_VERSION = "0.145.0"`). Netlify supports Hugo extended by default. Verify in first deployment. |
| Free Netlify tier limits (bandwidth 100GB/month, builds 300min/month) | Low | Low | Static site with optimized images will use minimal bandwidth. Builds are fast (< 30 seconds for Hugo). Well within free tier limits for a small art group site. |
| News article external links are broken/expired | Medium | Low | Verify all external URLs during migration. For broken links, note the article title and source name without a clickable link, and add a `<!-- link broken as of YYYY-MM-DD -->` comment. |
| Google Map embed requires API key and may incur costs | Low | Medium | Use a simple Google Maps link (`maps.google.com/?q=address`) with a static map image or iframe embed (free tier allows basic embeds without API key). |

## Security Considerations

- **Netlify Identity**: Configured as invite-only — no open registration. Only explicitly invited email addresses can create CMS accounts. This prevents unauthorized content editing.
- **Email obfuscation**: Artist email addresses displayed on the site should use basic obfuscation (CSS `direction: rtl` with `unicode-bidi` or JS-based assembly) to reduce automated scraping. Emails are already public on the current site, so this is harm reduction, not prevention.
- **No contact form**: Eliminates the entire class of form-abuse vulnerabilities (spam, injection, CSRF). Visitors contact artists directly via their listed (obfuscated) emails.
- **No server-side code**: Static site has zero server-side attack surface. No databases, no server processes, no API endpoints to exploit.
- **Content Security Policy**: Add CSP headers in `netlify.toml` allowing only self-hosted assets, Google Maps embeds, and the Decap CMS CDN scripts. Prevents XSS via injected scripts.
- **Image uploads**: Decap CMS commits images to Git, which are then processed by Hugo at build time. No user-uploaded content is served directly without going through the build pipeline, reducing risk of malicious file uploads.
- **HTTPS**: Enforced by default on Netlify. All traffic redirected to HTTPS via `netlify.toml` configuration.
- **Dependencies**: Minimal attack surface — Hugo is a single Go binary, Decap CMS is loaded from a versioned CDN with SRI hash. No npm packages in the runtime bundle.

## Dependencies

- **Hugo Extended v0.145+** — Required for image processing (WebP, resize). Must be the "extended" edition which includes libwebp and libsass. Netlify provides this in its build image.
- **Netlify Account** — Free tier. Required for hosting, Identity service, Git Gateway, and automated builds.
- **Git Repository** — GitHub (free) for source code hosting. Netlify connects to this for CI/CD. The maintainer never interacts with Git directly.
- **ImageMagick** — Development dependency only, used by `scripts/optimize-images.sh` for batch image processing before commit. Not needed at build/runtime.
- **Current CAALR site** — Must remain accessible during migration to download images and verify content completeness. No dependency after migration is complete.
- **Google Fonts CDN** — Runtime dependency for Merriweather and Open Sans typefaces. Fallback system fonts specified in CSS ensure the site remains readable if the CDN is unavailable.
- **Decap CMS CDN (unpkg.com)** — Runtime dependency for `/admin` panel only. The public-facing site has zero CDN dependencies. Pin to specific version with SRI hash.

## Open Questions

1. **Logo resolution**: The current logo renders at 98×35px with an opaque CDN URL. Can the association provide a high-resolution version or the original design file? If not, should we create a clean SVG text logo, or attempt to upscale/recreate the current design?

2. **Artist bio sourcing**: 15 of 19 artists have no bio on the current site. Should we (a) research each artist online and draft bios for review, (b) write minimal placeholder bios and let artists submit their own, or (c) leave bio fields empty with a "Bio coming soon" message?

3. **Gallery organization**: The current 65+ images have almost no captions or artist attribution. Should we (a) attempt to identify and attribute each image to an artist during migration, (b) migrate as-is with blank attribution and let the maintainer fill in over time, or (c) organize by medium/type rather than artist?

4. **CMS publish mode**: Should we start with `simple` publish mode (changes go live immediately on save) or `editorial_workflow` (draft → review → publish)? Simple is easier for the maintainer but has no undo/review safety net.

5. **Instagram presence**: The current site only links to Facebook. Does CAALR have an Instagram account? If so, what's the URL? If not, should we include an Instagram icon as a placeholder for future use, or omit it?

6. **Google Map embed approach**: Should we use a full interactive Google Maps iframe embed (free but adds ~200KB to page weight), a static map image with link to Google Maps (lighter), or just a text address with a "View on Google Maps" link (lightest)?

7. **Domain transition timing**: After stakeholder approval of the demo site at `caalr.netlify.app`, what is the process for pointing `caalr.com` to Netlify? Is the domain registered through GoDaddy separately from hosting, and does the user have DNS access to update nameservers or add a CNAME record?

8. **"Resources" page content**: The current Resources page has only two links (Art Center Manatee, Art Center Sarasota) and three images. Is this page worth preserving as a standalone section, or should these links be folded into the About page?
