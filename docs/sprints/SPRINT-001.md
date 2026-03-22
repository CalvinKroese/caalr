# Sprint 001: CAALR Website Rebuild

## Overview

The Creative Arts Association of Lakewood Ranch (CAALR) currently pays GoDaddy for hosting a dated Weebly site that isn't mobile-friendly and is difficult to update. This sprint rebuilds caalr.com as a modern, accessible, mobile-first static site deployed to Netlify's free tier, with Sveltia CMS providing a visual content management interface that a non-technical, elderly maintainer can operate through a web browser without touching code or Git.

The stack is **Astro** (static site generator) + **Sveltia CMS** (content editor) + **Netlify** (hosting). Astro was chosen for its built-in image optimization, typed content collections with Zod schema validation, and zero-JS output by default. Sveltia CMS is a drop-in replacement for Decap CMS that uses the same `config.yml` format but doesn't depend on the deprecated Netlify Git Gateway — it can work with Netlify Identity directly or its own auth layer, giving the project maximum longevity without developer intervention. Netlify provides free hosting, preview deploys, identity service (for CMS login), and automated builds triggered by content changes.

All 19 artist profiles, 60+ gallery images (deduplicated and attributed), show/event history, board info, meeting schedules, and news features will be migrated from the current site. The existing green/yellow color palette will be modernized with WCAG AA contrast compliance. The site deploys first to `caalr.netlify.app` for review before the real domain is pointed over.

## Use Cases

1. **Visitor browses artists on mobile**: A phone user taps through the artist grid, opens a profile, views artwork in a lightbox gallery, and finds the artist's email to inquire about a piece.

2. **Maintainer adds a new artist**: Logs into `/admin` with email/password → clicks "Artists" → "New" → fills in name, bio, medium, uploads photos → clicks "Publish". Site rebuilds automatically within 2-3 minutes. (Monthly frequency)

3. **Maintainer posts a new show**: Creates a new event with date, venue, description, and flyer image. The show automatically appears as "Upcoming" on the Events page and homepage. After the event date passes, it automatically moves to "Past". (6x/year)

4. **Maintainer updates meeting schedule**: Opens "Settings" → "Meetings" in the CMS, edits dates and location, publishes. (Quarterly)

5. **Visitor discovers CAALR via search**: Proper meta tags, structured data, fast load times, and a sitemap ensure the site appears in searches for "Lakewood Ranch art group".

6. **Visitor views gallery on tablet**: Taps through a masonry grid of artwork, opens a lightbox with artist attribution, navigates with swipe/arrows/keyboard.

7. **Board member shares news on Facebook**: Links to a news item with proper Open Graph meta tags producing a rich preview card.

8. **Stakeholders review demo before launch**: Full site available at `caalr.netlify.app` for review before DNS cutover.

## Architecture

### Technology Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **SSG** | Astro 5.x (static mode, TypeScript) | Built-in image optimization (WebP, srcset), content collections with Zod schemas, zero JS by default |
| **CMS** | Sveltia CMS (Decap-compatible) | Drop-in Decap replacement; doesn't need deprecated Git Gateway; same config.yml format; fully open-source |
| **Hosting** | Netlify (free tier) | Best CMS integration, preview deploys, Identity service, 100GB/month bandwidth |
| **Auth** | Netlify Identity (email/password) | No GitHub account needed; invite-only; up to 5 users on free tier |
| **Styling** | Plain CSS with custom properties | No framework overhead; maximum longevity; no build dependencies |
| **Fonts** | Merriweather (headings) + Open Sans (body) via Google Fonts | Readable, classic, well-supported |
| **Images** | Astro Image pipeline + organized uploads | Automatic WebP conversion, responsive srcset, lazy loading |

### Information Architecture

```
/                       → Home (hero, featured artists, upcoming events, gallery preview)
/about/                 → About (mission, board, meetings, membership, resources, Google Map)
/artists/               → Artist grid (cards with photo, name, medium)
/artists/[slug]/        → Artist profile (bio, medium, artwork gallery)
/events/                → Events (upcoming sorted ascending, past sorted descending)
/events/[slug]/         → Event detail (date, venue, description, photos)
/gallery/               → Gallery (masonry grid with lightbox)
/news/                  → News & achievements (cards with date, source, excerpt)
/news/[slug]/           → News detail (full article/excerpt with source link)
```

### Data Flow

```
Maintainer → /admin (Sveltia CMS)
          → Authenticates via Netlify Identity (email/password)
          → Edits content in visual form UI
          → Sveltia commits Markdown/JSON + uploaded images to GitHub repo
          → Netlify detects push → runs `astro build`
          → Static HTML/CSS/JS deployed to Netlify CDN
          → Visitor requests pages from CDN (pre-built, no server processing)
```

### Content Model

All content lives in `src/content/` as Markdown and JSON files, validated by Zod schemas in `src/content.config.ts`.

#### `artists` collection (`src/content/artists/*.md`)

```yaml
---
name: "Wilma Kroese"
slug: "wilma-kroese"           # Auto-generated, hidden from CMS editor
mediums:                        # Array, not comma-separated string
  - "Pottery"
  - "Raku"
shortBio: "Lakewood Ranch pottery artist and CAALR board member."
email: "WKpottery@yahoo.com"
website: ""
instagram: ""
facebook: ""
featuredImage: "/uploads/artists/wilma-kroese/profile.jpg"
galleryImages:
  - src: "/uploads/artists/wilma-kroese/piece-1.jpg"
    caption: "Raku-fired vase"
  - src: "/uploads/artists/wilma-kroese/piece-2.jpg"
    caption: "Stoneware bowl"
isBoardMember: true
boardRole: "At Large"
sortOrder: 10
status: "active"                # active | alumni (alumni preserved but hidden from listings)
---

Full biography text in Markdown body. Rendered on the artist detail page.
```

#### `events` collection (`src/content/events/*.md`)

```yaml
---
title: "Annual Spring Art Show and Sale"
slug: "spring-show-2026"
startDate: 2026-03-14
endDate: 2026-03-14
venueName: "Lakewood Ranch Town Hall"
venueAddress: "8175 Lakewood Ranch Blvd, Lakewood Ranch, FL 34202"
featuredImage: "/uploads/events/spring-show-2026.jpg"
galleryImages: []
featured: true
---

Extended event description in Markdown body.
Free admission, free parking. Featuring watercolor, jewelry, pottery...
```

**Note:** Event status (upcoming/past) is **auto-derived from `startDate` at build time** — the maintainer never sets this manually.

#### `gallery` collection (`src/content/gallery/*.json`)

Each image is an individual JSON file (not a monolithic list):

```json
{
  "title": "Raku Pottery Collection",
  "image": "/uploads/gallery/raku-collection.jpg",
  "alt": "Three raku-fired pottery pieces with copper and turquoise glazes",
  "caption": "Raku pottery by Susan Kerr",
  "artistSlug": "susan-kerr",
  "medium": "Pottery",
  "year": 2025,
  "featured": false
}
```

#### `news` collection (`src/content/news/*.md`)

```yaml
---
title: "Carol Krah Featured in Local Press"
date: 2025-06-15
sourceName: "Lakewood Ranch Herald"
sourceUrl: "https://example.com/article"
featuredImage: "/uploads/news/carol-krah-feature.jpg"
featured: true
---

Summary or excerpt of the article...
```

#### `settings` collection (individual JSON files in `src/content/settings/`)

Split into separate files for smaller CMS forms and reduced blast radius:

- **`site.json`** — Site name, tagline, contact email, footer text
- **`board.json`** — Ordered array of `{ name, role, email?, artistSlug? }`
- **`meetings.json`** — Schedule summary, location, address, map embed URL, date list with types, seasonal exceptions
- **`social.json`** — Facebook URL, Instagram URL, newsletter URL (all optional)

#### `pages` collection (CMS-editable page content)

- **`home.md`** — Hero title, hero text, hero image, intro text, featured artist slugs, featured event slugs
- **`about.md`** — Mission title, mission body, membership body, resources list `{ label, url }`

### Component Architecture

```
src/
├── content.config.ts          # Zod schemas for all collections
├── layouts/
│   └── BaseLayout.astro       # HTML shell, meta, skip-nav, header, footer, SEO
├── components/
│   ├── Header.astro           # Logo, nav (5-7 items), mobile hamburger
│   ├── Footer.astro           # Social links, meeting summary, copyright, address
│   ├── Hero.astro             # Page hero with optional image and CTA
│   ├── ArtistCard.astro       # Profile image, name, medium — used in grids
│   ├── EventCard.astro        # Date, title, venue — used in listings
│   ├── GalleryGrid.astro      # CSS masonry grid with columns
│   ├── Lightbox.astro         # <dialog>-based lightbox, keyboard/swipe nav
│   └── SectionHeading.astro   # Consistent heading style
├── lib/
│   ├── content.ts             # Query helpers (active artists, upcoming events, etc.)
│   └── seo.ts                 # Meta tag defaults, OG image fallbacks
├── pages/
│   ├── index.astro            # Home
│   ├── about.astro            # About
│   ├── artists/
│   │   ├── index.astro        # Artist grid
│   │   └── [slug].astro       # Artist profile
│   ├── events/
│   │   ├── index.astro        # Events listing
│   │   └── [slug].astro       # Event detail
│   ├── gallery.astro          # Gallery
│   ├── news/
│   │   ├── index.astro        # News listing
│   │   └── [slug].astro       # News detail
│   └── 404.astro              # Custom 404 page
└── styles/
    ├── tokens.css             # Design tokens (colors, fonts, spacing)
    └── global.css             # Reset, base styles, components
```

### Design Tokens

```css
:root {
  /* Colors — modernized green/gold palette */
  --color-primary: #1a6847;        /* Deep forest green (headings, nav bg) */
  --color-primary-light: #2d8f65;  /* Medium green (links, accents) */
  --color-primary-dark: #0f3d2a;   /* Darkest green (header bg) */
  --color-secondary: #b8960c;      /* Warm gold (buttons, highlights) */
  --color-secondary-light: #f5ecc0;/* Pale gold (section backgrounds) */
  --color-bg: #fafdf7;             /* Off-white with green tint (body bg) */
  --color-bg-alt: #eef7e8;         /* Light green (alternating sections) */
  --color-surface: #ffffff;        /* Cards, panels */
  --color-text: #1a2e1a;          /* Near-black green (body text) — 12:1 on white */
  --color-text-muted: #4a6b4a;    /* Muted green (captions) — 4.8:1 on white */
  --color-border: #c8dcc0;        /* Soft green border */

  /* Typography */
  --font-heading: 'Merriweather', Georgia, serif;
  --font-body: 'Open Sans', -apple-system, sans-serif;
  --font-size-base: 18px;          /* Larger for older visitors */
  --line-height-base: 1.7;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 1.875rem;
  --font-size-3xl: 2.25rem;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;
  --space-section: clamp(3rem, 8vw, 6rem);

  /* Layout */
  --max-width: 1200px;
  --radius-card: 8px;
  --shadow-card: 0 2px 8px rgba(0,0,0,0.08);
}
```

### Sveltia CMS Configuration

CMS config at `public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "artists"
    label: "Artists"
    folder: "src/content/artists"
    create: true
    slug: "{{fields.slug}}"
    identifier_field: "name"
    format: "frontmatter"
    fields:
      - { label: "Name", name: "name", widget: "string", hint: "Full name of the artist" }
      - { label: "URL Slug", name: "slug", widget: "string", hint: "Auto-filled. Do not change after creation." }
      - { label: "Art Medium(s)", name: "mediums", widget: "list", field: { label: "Medium", name: "medium", widget: "string" }, hint: "e.g. Pottery, Watercolor, Mixed Media" }
      - { label: "Short Bio", name: "shortBio", widget: "text", hint: "One sentence shown on the Artists page card" }
      - { label: "Email", name: "email", widget: "string", required: false }
      - { label: "Website", name: "website", widget: "string", required: false }
      - { label: "Instagram", name: "instagram", widget: "string", required: false }
      - { label: "Facebook", name: "facebook", widget: "string", required: false }
      - { label: "Profile Photo", name: "featuredImage", widget: "image" }
      - { label: "Artwork Photos", name: "galleryImages", widget: "list", fields:
          - { label: "Image", name: "src", widget: "image" }
          - { label: "Caption", name: "caption", widget: "string", required: false }
        }
      - { label: "Board Member?", name: "isBoardMember", widget: "boolean", default: false }
      - { label: "Board Role", name: "boardRole", widget: "string", required: false, hint: "e.g. President, At Large" }
      - { label: "Display Order", name: "sortOrder", widget: "number", value_type: "int", default: 100, hint: "Lower numbers appear first" }
      - { label: "Status", name: "status", widget: "select", options: ["active", "alumni"], default: "active", hint: "Alumni are preserved but hidden from the main listing" }

  - name: "events"
    label: "Shows & Events"
    folder: "src/content/events"
    create: true
    slug: "{{slug}}"
    format: "frontmatter"
    fields:
      - { label: "Show / Event Name", name: "title", widget: "string" }
      - { label: "Start Date", name: "startDate", widget: "datetime" }
      - { label: "End Date", name: "endDate", widget: "datetime", required: false }
      - { label: "Venue Name", name: "venueName", widget: "string" }
      - { label: "Street Address", name: "venueAddress", widget: "string", hint: "Used to create a Google Maps link" }
      - { label: "Flyer / Event Photo", name: "featuredImage", widget: "image", required: false }
      - { label: "Event Photos", name: "galleryImages", widget: "list", field: { label: "Image", name: "image", widget: "image" }, required: false }
      - { label: "Featured on Homepage?", name: "featured", widget: "boolean", default: false }
      - { label: "body", name: "body", widget: "markdown" }

  - name: "gallery"
    label: "Gallery"
    folder: "src/content/gallery"
    create: true
    format: "json"
    fields:
      - { label: "Image Title", name: "title", widget: "string" }
      - { label: "Photo", name: "image", widget: "image" }
      - { label: "Description for Screen Readers", name: "alt", widget: "string", hint: "Describe what's in the photo for visually impaired visitors" }
      - { label: "Caption", name: "caption", widget: "string", required: false }
      - { label: "Artist (optional)", name: "artistSlug", widget: "string", required: false, hint: "Enter the artist's URL name, e.g. wilma-kroese" }
      - { label: "Medium", name: "medium", widget: "string", required: false }
      - { label: "Year", name: "year", widget: "number", required: false }
      - { label: "Featured on Homepage?", name: "featured", widget: "boolean", default: false }

  - name: "news"
    label: "News & Highlights"
    folder: "src/content/news"
    create: true
    slug: "{{slug}}"
    format: "frontmatter"
    fields:
      - { label: "Headline", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Publication / Source", name: "sourceName", widget: "string", required: false }
      - { label: "Link to Article", name: "sourceUrl", widget: "string", required: false }
      - { label: "Photo", name: "featuredImage", widget: "image", required: false }
      - { label: "Featured?", name: "featured", widget: "boolean", default: false }
      - { label: "body", name: "body", widget: "markdown" }

  - name: "pages"
    label: "Pages"
    files:
      - label: "Home Page"
        name: "home"
        file: "src/content/pages/home.md"
        fields:
          - { label: "Hero Title", name: "heroTitle", widget: "string" }
          - { label: "Hero Text", name: "heroText", widget: "text" }
          - { label: "Hero Image", name: "heroImage", widget: "image" }
          - { label: "Welcome Text", name: "introText", widget: "markdown" }
      - label: "About Page"
        name: "about"
        file: "src/content/pages/about.md"
        fields:
          - { label: "Mission Title", name: "missionTitle", widget: "string" }
          - { label: "Mission Text", name: "missionBody", widget: "markdown" }
          - { label: "Membership Info", name: "membershipBody", widget: "markdown" }
          - { label: "Resource Links", name: "resources", widget: "list", fields:
              - { label: "Name", name: "label", widget: "string" }
              - { label: "Website URL", name: "url", widget: "string" }
            }

  - name: "settings"
    label: "Site Settings"
    files:
      - label: "General Settings"
        name: "site"
        file: "src/content/settings/site.json"
        fields:
          - { label: "Site Name", name: "siteName", widget: "string" }
          - { label: "Tagline", name: "tagline", widget: "string" }
          - { label: "Contact Email", name: "contactEmail", widget: "string" }
          - { label: "Footer Text", name: "footerText", widget: "text" }
      - label: "Board of Directors"
        name: "board"
        file: "src/content/settings/board.json"
        fields:
          - { label: "Board Members", name: "members", widget: "list", fields:
              - { label: "Name", name: "name", widget: "string" }
              - { label: "Role", name: "role", widget: "string" }
              - { label: "Email", name: "email", widget: "string", required: false }
              - { label: "Artist Page", name: "artistSlug", widget: "string", required: false, hint: "If this person is also an artist member" }
            }
      - label: "Meeting Schedule"
        name: "meetings"
        file: "src/content/settings/meetings.json"
        fields:
          - { label: "Schedule Summary", name: "scheduleSummary", widget: "text", hint: "e.g. Second Monday of each month" }
          - { label: "Location Name", name: "locationName", widget: "string" }
          - { label: "Location Address", name: "locationAddress", widget: "string" }
          - { label: "Google Maps Embed URL", name: "mapEmbedUrl", widget: "string", required: false }
          - { label: "Board Meeting Time", name: "boardTime", widget: "string" }
          - { label: "Networking Time", name: "networkingTime", widget: "string" }
          - { label: "General Meeting Time", name: "generalTime", widget: "string" }
          - { label: "Meeting Dates", name: "dates", widget: "list", fields:
              - { label: "Date", name: "date", widget: "datetime" }
              - { label: "Type", name: "type", widget: "string", hint: "e.g. Board and Membership, Setup for Spring Show" }
            }
          - { label: "Notes", name: "notes", widget: "text", required: false, hint: "e.g. No meetings in July and August" }
      - label: "Social Media"
        name: "social"
        file: "src/content/settings/social.json"
        fields:
          - { label: "Facebook URL", name: "facebookUrl", widget: "string", required: false }
          - { label: "Instagram URL", name: "instagramUrl", widget: "string", required: false }
```

## Implementation

### Phase 1: Project Bootstrap & Foundation (~15% of effort)

**Goal:** Working Astro project deploying to Netlify with Sveltia CMS admin accessible.

**Files:**
- `package.json` — Astro + TypeScript dependencies
- `astro.config.mjs` — Static mode, site URL, image optimization settings
- `tsconfig.json` — TypeScript strict config
- `netlify.toml` — Build command (`astro build`), publish dir (`dist`), Netlify Identity redirect for CMS
- `.gitignore` — `dist/`, `node_modules/`, `.astro/`, `.env`
- `public/admin/index.html` — Sveltia CMS entry point (loads from CDN with pinned version)
- `public/admin/config.yml` — Full CMS configuration (as specified above)
- `public/favicon.svg` — Initial favicon
- `src/env.d.ts` — Astro type declarations

**Tasks:**
- [ ] Initialize Git repo and Astro project in static mode with TypeScript
- [ ] Create `netlify.toml` with build config and Identity redirect (`/admin/* 200!`)
- [ ] Create Sveltia CMS entry point (`public/admin/index.html`) loading from CDN with pinned version
- [ ] Write complete `public/admin/config.yml` with all collection/field definitions
- [ ] Create Netlify site, connect GitHub repo, verify deploy to `caalr.netlify.app`
- [ ] Enable Netlify Identity (invite-only) and create maintainer's account
- [ ] Verify CMS admin loads and authenticates at `caalr.netlify.app/admin`

### Phase 2: Content Architecture & Schemas (~10% of effort)

**Goal:** All content collections defined with Zod schemas, seeded with placeholder content.

**Files:**
- `src/content.config.ts` — All collection schemas
- `src/content/artists/.gitkeep`
- `src/content/events/.gitkeep`
- `src/content/gallery/.gitkeep`
- `src/content/news/.gitkeep`
- `src/content/pages/home.md` — Placeholder home content
- `src/content/pages/about.md` — Placeholder about content
- `src/content/settings/site.json`
- `src/content/settings/board.json`
- `src/content/settings/meetings.json`
- `src/content/settings/social.json`

**Tasks:**
- [ ] Define Zod schemas matching CMS config exactly — enforce required fields, validate URLs, type dates
- [ ] Create settings JSON files with all current CAALR data (board, meetings, social)
- [ ] Create placeholder page content files
- [ ] Verify Astro builds with empty collections (graceful empty states)
- [ ] Verify CMS can create/edit entries and they match schema expectations

### Phase 3: Design System & Site Shell (~15% of effort)

**Goal:** Visual identity established, base layout responsive, all shared components built.

**Files:**
- `src/styles/tokens.css` — Design tokens (colors, typography, spacing)
- `src/styles/global.css` — Reset, base typography, focus styles, utility classes, responsive layout
- `src/layouts/BaseLayout.astro` — HTML shell, meta tags, skip-nav, font imports, header, footer
- `src/components/Header.astro` — Logo, nav (Home, Artists, Gallery, Events, About, News), mobile hamburger
- `src/components/Footer.astro` — Social links (Facebook/Instagram inline SVG icons), meeting summary, copyright, address
- `src/components/Hero.astro` — Full-width hero with optional image and overlay text
- `src/components/SectionHeading.astro` — Consistent heading rhythm

**Tasks:**
- [ ] Implement CSS custom properties from design tokens spec
- [ ] Write CSS reset and base typography (18px base, 1.7 line height)
- [ ] Build responsive layout system: 1-column mobile, 2-column tablet, 3-column desktop
- [ ] Build accessible header with mobile hamburger menu (CSS `:target` or minimal JS toggle)
- [ ] Build footer with inline SVG social icons and accessible labels
- [ ] Build BaseLayout with semantic HTML5, skip-to-content link, OG meta tags
- [ ] Extract CAALR logo from current site; create SVG text fallback if resolution is insufficient
- [ ] Test at 320px, 768px, 1024px, 1440px breakpoints
- [ ] Verify WCAG AA contrast ratios for all color combinations

### Phase 4: Page Templates & Content Rendering (~15% of effort)

**Goal:** All page routes render correctly with collection data.

**Files:**
- `src/lib/content.ts` — Query helpers (active artists sorted by sortOrder, upcoming/past events by date, featured items)
- `src/lib/seo.ts` — Meta tag defaults, canonical URLs, OG image fallbacks
- `src/pages/index.astro` — Home: hero, upcoming events (3 max), featured artists (4), gallery preview (6 images)
- `src/pages/about.astro` — Mission, board (from settings), meetings (from settings), membership, resources, Google Map link
- `src/pages/artists/index.astro` — Responsive card grid of active artists
- `src/pages/artists/[slug].astro` — Profile: photo, bio, medium badges, email (plain mailto), artwork gallery
- `src/pages/events/index.astro` — Upcoming (ascending by date) + Past (descending), auto-derived from dates
- `src/pages/events/[slug].astro` — Event detail: date, venue, Google Maps link, description, photos
- `src/pages/gallery.astro` — Masonry grid with lightbox
- `src/pages/news/index.astro` — Card grid with date, source, excerpt
- `src/pages/news/[slug].astro` — Full article/excerpt with source link
- `src/pages/404.astro` — Friendly 404 page
- `src/components/ArtistCard.astro` — Photo, name, medium, "View Profile" link
- `src/components/EventCard.astro` — Date, title, venue
- `src/components/GalleryGrid.astro` — CSS `columns` masonry with `break-inside: avoid`
- `src/components/Lightbox.astro` — `<dialog>` element, keyboard nav (Esc/arrows), swipe support, focus trap

**Tasks:**
- [ ] Build content query helpers: `getActiveArtists()`, `getUpcomingEvents()`, `getPastEvents()`, `getFeaturedGallery()`
- [ ] Auto-derive event upcoming/past from `startDate` vs current date at build time
- [ ] Build all page routes from collection data
- [ ] Build homepage sections: hero, upcoming events (hide section if none), featured artists, gallery preview
- [ ] Build About page with board members and meeting schedule from settings files
- [ ] Build artist grid and profile pages with mini artwork gallery
- [ ] Build events listing with automatic upcoming/past split
- [ ] Build gallery with CSS masonry and `<dialog>` lightbox (keyboard nav, Esc to close, arrow keys)
- [ ] Build news listing and detail pages
- [ ] Build 404 page
- [ ] Ensure graceful empty states: no upcoming events hides section, no gallery hides section, etc.
- [ ] Add OG meta tags to all pages for social sharing previews
- [ ] Ensure all templates work without JavaScript (progressive enhancement)

### Phase 5: Content Migration (~25% of effort)

**Goal:** All current CAALR content migrated, images deduplicated and attributed, placeholder bios created.

**Files:**
- `scripts/download-images.sh` — Batch download all images from current Weebly site (nebula.wsimg.com CDN)
- `scripts/optimize-images.sh` — Resize (max 2400px long edge), compress (JPEG 85%), strip EXIF
- `src/content/artists/*.md` — 19 artist profile files
- `src/content/events/*.md` — Event entries (Spring Show 2026, Fall Show 2026, past shows)
- `src/content/gallery/*.json` — Individual gallery image files (deduplicated, attributed)
- `src/content/news/*.md` — News entries (Carol Krah, Elaine Vaughn, Wilma Kroese)
- `src/content/pages/home.md` — Real home page content
- `src/content/pages/about.md` — Real about page content (history, mission, membership)
- `public/uploads/artists/` — Artist photos and artwork, organized by slug
- `public/uploads/gallery/` — Gallery images
- `public/uploads/events/` — Event photos
- `public/uploads/news/` — News thumbnails
- `docs/content-migration-checklist.md` — Track migration completeness

**Tasks:**
- [ ] Run image download script to capture all images from current Weebly site
- [ ] Run optimization script: strip EXIF, resize to max 2400px, JPEG quality 85%
- [ ] Deduplicate gallery images (remove exact and near-duplicates)
- [ ] Attribute gallery images to artists where identifiable
- [ ] Create all 19 artist Markdown files:
  - 4 artists with existing bios (Elaine Vaughn, Wilma Kroese, Barbara Kaplan, Sue Kerr): extract from current profile pages
  - 15 artists without bios: create dignified placeholder ("Jane Doe is a [medium] artist and member of CAALR.")
- [ ] Organize images into `public/uploads/artists/[slug]/`, `public/uploads/gallery/`, etc.
- [ ] Create event entries for Spring Show 2026, Fall Show 2026, and documented past shows
- [ ] Create news entries for Carol Krah, Elaine Vaughn, Wilma Kroese with source links
- [ ] Populate home page content: welcome message, mission statement, founding story
- [ ] Populate about page content: full history, mission, membership details, Art Center Manatee/Sarasota links
- [ ] Create content migration checklist and verify: all 19 artists, all gallery images, all events, all news items
- [ ] Side-by-side comparison of old site vs new site for completeness

### Phase 6: Accessibility, Performance & SEO (~10% of effort)

**Goal:** Lighthouse 90+ on all metrics, WCAG AA compliance, proper SEO.

**Files:**
- `public/_redirects` — Redirects from old Weebly URLs to new paths
- `public/_headers` — Security headers (CSP, X-Frame-Options, Referrer-Policy)

**Tasks:**
- [ ] Run Lighthouse audit on all page types; target 90+ on Performance, Accessibility, SEO
- [ ] Run axe-core accessibility scan; fix all critical and serious issues
- [ ] Verify all text/background color combinations pass WCAG AA (4.5:1 body, 3:1 large text)
- [ ] Verify all images have descriptive `alt` text
- [ ] Verify keyboard navigation works end-to-end: Tab through nav, Enter activates, Escape closes lightbox
- [ ] Verify focus indicators are visible on all interactive elements
- [ ] Verify no text below 16px anywhere; body text at 18px
- [ ] Verify responsive images served (WebP with fallback, multiple srcset sizes)
- [ ] Test page load on throttled 3G: target < 3 seconds first contentful paint
- [ ] Add `_redirects` file for old Weebly URLs: `/shows.html → /events/`, `/gallery.html → /gallery/`, etc.
- [ ] Add security headers in `_headers` file
- [ ] Verify sitemap generated at `/sitemap-index.xml` (Astro built-in)
- [ ] Add `<meta name="robots" content="noindex">` to Netlify subdomain until domain cutover
- [ ] Test in Chrome, Safari, Firefox on desktop and mobile

### Phase 7: Documentation & Handoff (~10% of effort)

**Goal:** Maintainer can operate the CMS independently. Technical notes for future AI-assisted development.

**Files:**
- `docs/MAINTAINER-GUIDE.md` — Step-by-step CMS usage guide with screenshots for every operation
- `docs/TECHNICAL-NOTES.md` — Architecture, build process, deployment, DNS, dependency versions
- `docs/LAUNCH-CHECKLIST.md` — Pre-launch and DNS cutover steps

**Tasks:**
- [ ] Write MAINTAINER-GUIDE.md covering:
  1. How to log in to the website editor (with screenshots)
  2. How to add a new artist (step by step)
  3. How to edit or remove an existing artist
  4. How to add a new show/event
  5. How to add gallery photos
  6. How to add a news item
  7. How to update meeting dates and board members
  8. How to upload and manage images (file size guidance: keep under 2MB)
  9. **Troubleshooting**: "My changes aren't showing up" (wait 3 min, check login, contact developer), "I can't log in" (password reset steps), "Something looks wrong" (contact developer)
- [ ] Write TECHNICAL-NOTES.md: architecture overview, dependency versions, local dev setup, Netlify config, DNS cutover steps, Sveltia CMS migration notes
- [ ] Write LAUNCH-CHECKLIST.md: pre-launch verification, DNS change steps (GoDaddy CNAME/nameserver change), TTL pre-reduction, post-cutover verification
- [ ] Enable Netlify email notifications for failed builds (so developer is alerted)
- [ ] Deploy final version to `caalr.netlify.app`
- [ ] Conduct review walkthrough with user (acting as maintainer proxy)

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Create | Astro project dependencies |
| `astro.config.mjs` | Create | Static build, image optimization config |
| `tsconfig.json` | Create | TypeScript configuration |
| `netlify.toml` | Create | Build settings, Identity redirect |
| `.gitignore` | Create | Ignore build artifacts |
| `src/content.config.ts` | Create | Zod schemas for all content collections |
| `src/content/artists/*.md` (×19) | Create | Artist profiles |
| `src/content/events/*.md` (×5+) | Create | Show/event entries |
| `src/content/gallery/*.json` (×60+) | Create | Gallery image metadata |
| `src/content/news/*.md` (×3+) | Create | News/achievement items |
| `src/content/pages/home.md` | Create | Editable home page content |
| `src/content/pages/about.md` | Create | Editable about page content |
| `src/content/settings/site.json` | Create | Site metadata |
| `src/content/settings/board.json` | Create | Board of directors |
| `src/content/settings/meetings.json` | Create | Meeting schedule |
| `src/content/settings/social.json` | Create | Social media links |
| `public/admin/index.html` | Create | Sveltia CMS entry point |
| `public/admin/config.yml` | Create | CMS collection/field definitions |
| `public/uploads/**` | Create | All uploaded images (organized by type) |
| `public/favicon.svg` | Create | Site favicon |
| `public/_redirects` | Create | Old URL redirects |
| `public/_headers` | Create | Security headers |
| `src/layouts/BaseLayout.astro` | Create | Global HTML shell |
| `src/components/Header.astro` | Create | Navigation and logo |
| `src/components/Footer.astro` | Create | Footer with social/meeting info |
| `src/components/Hero.astro` | Create | Page hero component |
| `src/components/ArtistCard.astro` | Create | Artist listing card |
| `src/components/EventCard.astro` | Create | Event listing card |
| `src/components/GalleryGrid.astro` | Create | Masonry gallery grid |
| `src/components/Lightbox.astro` | Create | Image viewer dialog |
| `src/components/SectionHeading.astro` | Create | Heading component |
| `src/lib/content.ts` | Create | Collection query helpers |
| `src/lib/seo.ts` | Create | SEO/meta helpers |
| `src/pages/index.astro` | Create | Home page |
| `src/pages/about.astro` | Create | About page |
| `src/pages/artists/index.astro` | Create | Artist grid |
| `src/pages/artists/[slug].astro` | Create | Artist profile |
| `src/pages/events/index.astro` | Create | Events listing |
| `src/pages/events/[slug].astro` | Create | Event detail |
| `src/pages/gallery.astro` | Create | Gallery page |
| `src/pages/news/index.astro` | Create | News listing |
| `src/pages/news/[slug].astro` | Create | News detail |
| `src/pages/404.astro` | Create | Custom 404 |
| `src/styles/tokens.css` | Create | Design tokens |
| `src/styles/global.css` | Create | Global styles |
| `scripts/download-images.sh` | Create | Batch image download from Weebly |
| `scripts/optimize-images.sh` | Create | Batch image optimization |
| `docs/MAINTAINER-GUIDE.md` | Create | Non-technical CMS guide |
| `docs/TECHNICAL-NOTES.md` | Create | Developer/AI reference |
| `docs/LAUNCH-CHECKLIST.md` | Create | DNS cutover steps |
| `docs/content-migration-checklist.md` | Create | Migration tracking |

## Definition of Done

### Site Functionality
- [ ] Astro builds without errors via `astro build`
- [ ] Site deployed to `caalr.netlify.app` and accessible publicly
- [ ] All 6 main sections render correctly: Home, Artists, Gallery, Events, About, News
- [ ] All 19 artists have profile pages with name, medium, at least one image, and bio (placeholder OK)
- [ ] All gallery images migrated, deduplicated, and displayed in masonry grid with lightbox
- [ ] All events present with correct dates; upcoming/past auto-derived from date
- [ ] All 3 news features migrated with source links
- [ ] Board of directors, meeting schedule, and membership info accurate on About page
- [ ] Facebook link present in footer (Instagram added when/if account exists)
- [ ] Custom 404 page exists and is styled
- [ ] Sitemap generated at `/sitemap-index.xml`
- [ ] Old Weebly URLs redirect correctly (`/shows.html` → `/events/`, etc.)
- [ ] Netlify subdomain has `noindex` meta tag until domain cutover

### CMS & Maintainer Experience
- [ ] Sveltia CMS accessible at `/admin` with Netlify Identity email/password login
- [ ] Maintainer can add a new artist through CMS without developer help
- [ ] Maintainer can upload gallery images through CMS without developer help
- [ ] Maintainer can create a new event through CMS without developer help
- [ ] Maintainer can update meeting schedule and board info through CMS
- [ ] CMS save triggers Netlify rebuild; changes appear live within 3 minutes
- [ ] CMS tested on tablet/iPad viewport (admin panel usable, not just public site)
- [ ] MAINTAINER-GUIDE.md covers all CMS operations with step-by-step instructions
- [ ] MAINTAINER-GUIDE.md includes troubleshooting section
- [ ] Maintainer guide validated by user (acting as non-technical proxy)

### Accessibility & Performance
- [ ] Lighthouse Accessibility score ≥ 90 on homepage, artists, and gallery
- [ ] Lighthouse Performance score ≥ 90 on mobile (throttled 4G)
- [ ] Lighthouse SEO score ≥ 90
- [ ] All text/background combinations pass WCAG AA (4.5:1 minimum)
- [ ] All body text ≥ 16px; primary body text is 18px
- [ ] Keyboard navigation works: Tab through all interactive elements, Enter activates, Escape closes modals
- [ ] All images have descriptive alt text
- [ ] Page load < 3 seconds on simulated 3G (first contentful paint)
- [ ] Responsive at 320px, 768px, 1024px, 1440px — no horizontal scrollbar, no overflow
- [ ] Tested in Chrome, Safari, Firefox on desktop and mobile
- [ ] Site renders acceptably with JavaScript disabled (progressive enhancement)
- [ ] OG meta tags produce correct previews when shared on Facebook

### Documentation
- [ ] MAINTAINER-GUIDE.md complete
- [ ] TECHNICAL-NOTES.md complete (architecture, dependencies, DNS)
- [ ] LAUNCH-CHECKLIST.md complete (DNS cutover steps)
- [ ] Netlify email notifications enabled for failed builds

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Netlify Identity enters end-of-life | Medium | High | Sveltia CMS is a drop-in Decap replacement; can switch auth backends (GitHub OAuth proxy, Sveltia's own auth) without changing CMS config. Document migration path in TECHNICAL-NOTES.md. |
| Gallery images from Weebly are low quality or inconsistently sized | High | Medium | Batch-optimize at download time. Astro's image pipeline normalizes sizes at build. CSS handles mixed dimensions gracefully (object-fit, aspect-ratio). Accept that source quality varies. |
| 15 of 19 artists have no bio content | High | Low | Create dignified placeholder bios with CMS-editable fields. Maintainer updates over time. |
| CAALR logo is only available at low resolution (98×35px) | Medium | Medium | Create SVG text-based logo as fallback ("CAALR" in Merriweather). Ask board if higher-res version exists. |
| Build failure after CMS publish is invisible to maintainer | High | Medium | Enable Netlify email notifications for failed deploys. Add "My changes aren't showing up" troubleshooting section to maintainer guide. |
| Developer (AI agent) unavailable when build breaks | Medium | High | Document all architecture in TECHNICAL-NOTES.md so any AI agent can pick up maintenance. Keep dependencies minimal and well-documented. |
| Maintainer forgets CMS password | Medium | Medium | Document password reset flow with screenshots in maintainer guide. Ensure a second board member has CMS access as backup. |
| Weebly CDN image URLs expire during migration | Medium | Medium | Download all images early (Phase 5, first task). Store locally. No runtime dependency on Weebly. |
| Git repository grows large from images over years | Low | Medium | Set upload guidance in maintainer docs (keep images under 2MB). If repo exceeds 1GB, migrate media to Cloudinary free tier or Netlify Large Media. |
| Netlify free tier bandwidth (100GB/month) exceeded | Low | Low | Image-heavy but optimized static site with ~20 active members. Well within free tier. Monitor after launch; upgrade to Cloudflare Pages if needed. |
| Content migration misses items from current site | Medium | Medium | Use structured checklist by content type. Final side-by-side comparison of old vs new site before declaring migration complete. |

## Security Considerations

- **Netlify Identity**: Invite-only registration — only explicitly invited email addresses can create CMS accounts. No open registration.
- **No server-side code**: Static site has zero server-side attack surface. No databases, no API endpoints.
- **HTTPS**: Enforced by default on Netlify. All traffic redirected to HTTPS.
- **Security headers**: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` via `_headers` file.
- **No sensitive data**: No contact form, no user accounts beyond CMS editors. Only public-facing info (names, emails already published on current site).
- **Email display**: Plain `mailto:` links (no obfuscation — emails are already public on current site, and obfuscation harms accessibility).
- **CMS CDN script**: Pin Sveltia CMS to specific version to prevent silent breaking changes.
- **Image uploads**: Committed to Git via CMS, processed by Astro at build time. No user-uploaded content served without going through the build pipeline.
- **Account recovery**: Document password reset steps. Ensure 2+ people have CMS access. Document who controls the Netlify and GitHub accounts.

## Dependencies

| Dependency | Purpose | Notes |
|-----------|---------|-------|
| Astro 5.x | Static site generator | Includes image optimization, content collections |
| TypeScript | Type safety | Build-time only |
| Sveltia CMS | Content management UI | CDN-loaded, Decap-compatible, fully open-source |
| Netlify (free tier) | Hosting + Identity | 100GB bandwidth, 300 build min/month, 5 Identity users |
| GitHub (free) | Source code + CMS backend | Maintainer never interacts with Git directly |
| Google Fonts | Merriweather + Open Sans | Runtime CDN dependency; system font fallbacks specified |
| ImageMagick | Image optimization scripts | Development-only; not needed at build/runtime |
| Current CAALR site | Content source for migration | Must remain up during migration phase |

## Open Questions (Resolved)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Which SSG? | Astro | Best image pipeline, typed content collections, zero-JS output |
| Which CMS? | Sveltia CMS | Drop-in Decap replacement, no deprecated dependencies, open-source, longest longevity |
| Which hosting? | Netlify | Best CMS integration, easiest setup, sufficient free tier |
| Artist bios? | Placeholder for sprint 1 | Maintainer fills in via CMS over time |
| Gallery filtering? | **Deferred to Sprint 2** | Keep sprint 1 simple; add artist/medium filtering later |
| Facebook embed vs link? | Link button, not embed | Embed loads 400KB JS + cookie warnings. Styled link button is lighter and more accessible. |
| Logo? | Extract from site; SVG text fallback if low-res | Ask board for higher-res version |
| Resources page? | Folded into About page | Only 2 links; doesn't justify a standalone page |
| Google Map? | Text address with "View on Google Maps" link | Lightest option; no API key or embed needed |
| CMS publish mode? | Simple (direct publish) | No draft/review complexity for this audience |
| Event status? | Auto-derived from dates | Never requires manual maintainer action |
