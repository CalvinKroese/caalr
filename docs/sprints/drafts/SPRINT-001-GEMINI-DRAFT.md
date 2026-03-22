# Sprint 001 Draft: CAALR Website Rebuild
**Drafter:** Gemini (Independent Draft B)
**Date:** 2026-03-22
**Stack:** Astro + TinaCMS + Cloudflare Pages

---

## Overview

The Creative Arts Association of Lakewood Ranch needs to escape the GoDaddy/Weebly cost trap while gaining a modern, accessible website that an elderly non-technical volunteer can maintain without help. The most common recommendation for this problem — Eleventy or Hugo with Decap CMS on Netlify — is a reasonable default but not the best fit here. Decap CMS presents a form-based admin panel that is spatially disconnected from the website itself; a first-time CMS user must mentally map form fields to page layout. For a maintainer who may not use a computer daily, that cognitive gap creates abandonment risk and dependence on the developer for every update.

This draft proposes **Astro** as the static site generator, **TinaCMS** as the content management layer, and **Cloudflare Pages** as the host. TinaCMS's distinguishing feature is visual inline editing: the maintainer navigates to `/admin`, logs in, and sees the actual rendered website with editable overlay controls on every field. There is no separate "admin panel" to learn — the website itself becomes the editing interface. Astro brings a built-in Image component with automatic WebP conversion and resizing, a typed Content Collections API that validates content at build time, and zero JavaScript shipped by default (making pages faster without configuration). Cloudflare Pages has no bandwidth limits on its free tier (Netlify caps at 100 GB/month), includes free web analytics, and has a 280-node CDN versus Netlify's ~15 nodes — meaningful for image-heavy gallery pages.

The implementation plan migrates all seven existing Weebly pages into six cleaner sections, creates individual profile pages for all 19 artist members, and produces a one-page visual maintainer guide with annotated screenshots. Artist images and gallery photos are stored directly in the Git repository under `public/images/` (optimized to ≤300 KB each at build time by Astro's Image pipeline), keeping the architecture simple and the cost zero. TinaCloud's free tier supports up to two users — sufficient for the primary maintainer plus one board backup.

---

## Use Cases

| # | Actor | Goal | Frequency |
|---|-------|------|-----------|
| UC-1 | Site visitor (desktop) | Browse artist profiles and view artwork | Daily |
| UC-2 | Site visitor (mobile) | Check upcoming show dates and locations | Weekly |
| UC-3 | Site visitor | Navigate to CAALR's Facebook/Instagram pages | Weekly |
| UC-4 | Maintainer (non-technical) | Add a new artist member with bio, photo, and artwork images | Monthly |
| UC-5 | Maintainer | Update the meeting schedule for the new season | Quarterly |
| UC-6 | Maintainer | Post a new show/event with date, location, and image | 6x/year |
| UC-7 | Maintainer | Upload a new gallery image from a recent show | After each show |
| UC-8 | Maintainer | Add a news item when a member wins an award or is featured in press | As needed |
| UC-9 | Maintainer | Edit or remove an artist who has left the association | Occasionally |
| UC-10 | Board member | Review the site on a phone before the quarterly meeting | Quarterly |

---

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Repository (caalr)                                       │
│  ├── src/content/         ← Markdown + JSON content files        │
│  ├── public/images/       ← Optimized source images              │
│  ├── src/pages/           ← Astro page templates                 │
│  ├── src/components/      ← Astro UI components                  │
│  └── tina/config.ts       ← TinaCMS schema definitions           │
└───────────────┬─────────────────────────┬───────────────────────┘
                │ git push (auto)          │ git push (auto)
                │                          │
    ┌───────────▼──────────┐   ┌───────────▼──────────────────────┐
    │  TinaCloud           │   │  Cloudflare Pages                 │
    │  (CMS auth + API)    │   │  (build: astro build)             │
    │  Free tier: 2 users  │   │  Output: static HTML/CSS/JS       │
    └───────────┬──────────┘   └──────────────┬────────────────────┘
                │ OAuth login                  │ serves
                │                              │
    ┌───────────▼──────────┐   ┌──────────────▼────────────────────┐
    │  Maintainer          │   │  caalr.pages.dev (preview)        │
    │  visits /admin       │   │  caalr.com (production)           │
    │  sees live website   │   │  Cloudflare CDN (280 PoPs)        │
    │  with edit overlays  │   └───────────────────────────────────┘
    └──────────────────────┘
```

### Components

**Astro (Static Site Generator)**
Renders all pages to static HTML at build time. Content is read from `src/content/` via the Content Collections API. The `astro:assets` Image component resizes and converts images to WebP/AVIF at build time, outputting multiple sizes for responsive `srcset` attributes. Pages ship zero JavaScript by default; interactive components (gallery lightbox) are loaded as Astro Islands with `client:visible` hydration so they only load when scrolled into view.

**TinaCMS + TinaCloud**
Provides the `/admin` editing interface. The `tina/config.ts` file defines content schemas that mirror Astro's Content Collections config. When a maintainer saves a change through the CMS, TinaCloud commits the change to GitHub, triggering a Cloudflare Pages build (typically 60–90 seconds to live). TinaCloud handles authentication via OAuth — the maintainer logs in with an email/password account created at tina.io, no GitHub account required on their part.

**Cloudflare Pages**
Runs `astro build` on every push to `main`. Serves the built `dist/` directory globally. Preview deployments are created automatically for every pull request (useful for the developer to review changes before they go live). Free tier includes unlimited bandwidth, 500 builds/month, and built-in Web Analytics.

**Content Files (`src/content/`)**
Markdown files with YAML frontmatter for artists, events, and news. JSON files for gallery metadata. All content lives in the Git repository — there is no external database or API. This means content is version-controlled, can be rolled back, and the site works indefinitely without any third-party service remaining active (except Cloudflare for serving).

### Data Flow: Content Edit (UC-4, Add Artist)

```
1. Maintainer visits caalr.com/admin
2. TinaCMS redirects to TinaCloud login (email/password)
3. Maintainer is returned to caalr.com/admin, sees live site with edit controls
4. Maintainer clicks "Artists" in left sidebar → "Add New Artist"
5. Form overlay appears with labeled fields (Name, Medium, Bio, Photo, Artwork)
6. Maintainer fills fields, uploads photo via drag-and-drop
7. Clicks "Save" → TinaCloud commits new .md file to GitHub
8. Cloudflare Pages detects push → runs `astro build` (~90s)
9. New artist appears live on site within 2 minutes
```

### Data Flow: Page Request (Visitor)

```
Visitor → Cloudflare CDN (edge node near visitor)
        → Serves pre-built HTML file from edge cache
        → HTML references /images/artists/[name]-profile.webp (480w, 960w variants)
        → Browser selects appropriate srcset based on device
        → Zero server-side processing, zero database queries
```

---

## Implementation

### Phase 0 — Project Scaffolding (Day 1)

**Goal:** Working Astro site deploying to Cloudflare Pages, TinaCMS admin accessible.

| Task | Files | Notes |
|------|-------|-------|
| Initialize Astro project | `package.json`, `astro.config.mjs`, `tsconfig.json` | `npm create astro@latest` with TypeScript strict |
| Add TinaCMS | `tina/config.ts`, `tina/__generated__/` | `npx @tinacms/cli@latest init` |
| Configure Cloudflare Pages | `wrangler.toml` (optional), CF dashboard | Connect GitHub repo in Cloudflare dashboard; build command: `npm run build`; output dir: `dist` |
| Create TinaCloud project | — | Register at tina.io, create project, copy `TINA_CLIENT_ID` + `TINA_TOKEN` to Cloudflare env vars |
| Add `.gitignore` | `.gitignore` | Exclude `tina/__generated__/`, `dist/`, `node_modules/`, `.env` |
| Set up `.env.example` | `.env.example` | Document required env vars for future contributors |

**Deliverable:** `https://caalr.pages.dev` shows Astro default page. `/admin` redirects to TinaCloud login.

---

### Phase 1 — Design System (Days 1–2)

**Goal:** Visual identity established — colors, typography, spacing, base layout.

| Task | Files | Notes |
|------|-------|-------|
| CSS custom properties | `src/styles/tokens.css` | See Design Tokens section below |
| Base layout | `src/layouts/BaseLayout.astro` | `<html>`, meta tags, skip-nav link, font imports |
| Navigation component | `src/components/Navigation.astro` | Mobile hamburger menu, active state highlighting |
| Footer component | `src/components/Footer.astro` | Social links, meeting info summary, copyright |
| Social links component | `src/components/SocialLinks.astro` | Facebook + Instagram icons with accessible labels |
| Global styles | `src/styles/global.css` | Reset, base typography, focus styles, utility classes |
| Google Fonts | `src/layouts/BaseLayout.astro` | Playfair Display (headings) + Source Serif 4 (body) |
| Favicon + logo | `public/favicon.ico`, `public/logo.svg` | Extract from current site or create text-based fallback |

**Design Tokens (`src/styles/tokens.css`):**
```css
:root {
  /* Colors — modernized green/gold palette */
  --color-forest:       #2c6b2f;   /* Primary green — navigation, headings */
  --color-forest-dark:  #1e4d21;   /* Hover states */
  --color-forest-light: #eef6ee;   /* Tinted backgrounds */
  --color-gold:         #b8960c;   /* Accent — buttons, highlights */
  --color-gold-light:   #f5ecc0;   /* Warm tinted sections */
  --color-bg:           #fafaf8;   /* Warm off-white body */
  --color-surface:      #ffffff;   /* Cards, panels */
  --color-text:         #1c1c1c;   /* Body copy — high contrast */
  --color-text-muted:   #595959;   /* Secondary text (4.5:1 on white) */
  --color-border:       #d6d6ce;

  /* Typography */
  --font-display:  'Playfair Display', Georgia, serif;
  --font-body:     'Source Serif 4', Georgia, serif;
  --text-base:     1.125rem;       /* 18px — larger for older visitors */
  --text-lg:       1.25rem;
  --text-xl:       1.5rem;
  --text-2xl:      1.875rem;
  --text-3xl:      2.25rem;
  --leading-body:  1.75;

  /* Spacing */
  --space-xs:      0.5rem;
  --space-sm:      1rem;
  --space-md:      1.5rem;
  --space-lg:      2.5rem;
  --space-xl:      4rem;
  --space-section: clamp(3rem, 8vw, 6rem);

  /* Layout */
  --max-width:     1200px;
  --radius-card:   8px;
  --shadow-card:   0 2px 8px rgba(0,0,0,0.08);
}
```

---

### Phase 2 — Content Architecture (Day 2)

**Goal:** Astro Content Collections and TinaCMS schemas defined; content structure committed to repo.

#### Astro Content Collections (`src/content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

const artists = defineCollection({
  type: 'content',
  schema: z.object({
    name:          z.string(),
    medium:        z.string(),                    // e.g., "Oil Painting, Watercolor"
    email:         z.string().email().optional(),
    website:       z.string().url().optional(),
    featured:      z.boolean().default(false),    // Show on homepage carousel
    profileImage:  z.string(),                    // Path relative to public/
    artworkImages: z.array(z.object({
      src:     z.string(),
      caption: z.string().optional(),
    })).default([]),
    sortOrder:     z.number().optional(),         // Manual ordering if needed
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title:           z.string(),
    date:            z.date(),
    endDate:         z.date().optional(),
    location:        z.string(),
    locationAddress: z.string().optional(),       // For Google Maps link
    status:          z.enum(['upcoming', 'past']).default('upcoming'),
    images:          z.array(z.string()).default([]),
    registrationUrl: z.string().url().optional(),
  }),
});

const gallery = defineCollection({
  type: 'data',          // JSON files, no markdown body needed
  schema: z.object({
    title:     z.string(),
    src:       z.string(),
    caption:   z.string().optional(),
    artistSlug: z.string().optional(),            // Links to artists/[slug]
    featured:  z.boolean().default(false),
    year:      z.number().optional(),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    headline:    z.string(),
    date:        z.date(),
    publication: z.string().optional(),
    url:         z.string().url().optional(),
    image:       z.string().optional(),
  }),
});

// Site-wide settings stored as a single JSON file
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    boardMembers: z.array(z.object({
      name:  z.string(),
      title: z.string(),
      email: z.string().email().optional(),
    })),
    meetingSchedule: z.object({
      dayOfMonth:  z.string(),   // e.g., "Second Thursday"
      time:        z.string(),   // e.g., "10:00 AM"
      location:    z.string(),
      exceptions:  z.array(z.string()).default([]),  // Months with no meeting
    }),
    contactEmail:   z.string().email(),
    facebookUrl:    z.string().url(),
    instagramUrl:   z.string().url(),
    foundedYear:    z.number(),
  }),
});

export const collections = { artists, events, gallery, news, settings };
```

#### TinaCMS Schema (`tina/config.ts`)

```typescript
import { defineConfig } from 'tinacms';

export default defineConfig({
  branch:   process.env.GITHUB_BRANCH ?? 'main',
  clientId: process.env.TINA_CLIENT_ID,
  token:    process.env.TINA_TOKEN,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name:   'artist',
        label:  'Artists',
        path:   'src/content/artists',
        format: 'md',
        ui: {
          filename: {
            slugify: (v) => v.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ?? '',
          },
          defaultItem: { featured: false, artworkImages: [] },
        },
        fields: [
          { name: 'name',         label: 'Full Name',                           type: 'string',   required: true },
          { name: 'medium',       label: 'Art Medium(s)',                        type: 'string',   required: true,
            ui: { description: 'e.g., "Oil Painting, Watercolor, Mixed Media"' } },
          { name: 'email',        label: 'Email Address (optional)',             type: 'string' },
          { name: 'website',      label: 'Personal Website (optional)',          type: 'string' },
          { name: 'profileImage', label: 'Profile Photo',                        type: 'image',    required: true },
          { name: 'artworkImages',label: 'Artwork Photos',                       type: 'object',   list: true,
            fields: [
              { name: 'src',     label: 'Image',   type: 'image' },
              { name: 'caption', label: 'Caption', type: 'string' },
            ],
          },
          { name: 'featured',     label: 'Show on Homepage',                    type: 'boolean' },
          { name: 'body',         label: 'Bio / Artist Statement',              type: 'rich-text' },
        ],
      },
      {
        name:   'event',
        label:  'Shows & Events',
        path:   'src/content/events',
        format: 'md',
        defaultItem: { status: 'upcoming', images: [] },
        fields: [
          { name: 'title',           label: 'Show / Event Name',    type: 'string',   required: true },
          { name: 'date',            label: 'Start Date',           type: 'datetime', required: true },
          { name: 'endDate',         label: 'End Date (optional)',  type: 'datetime' },
          { name: 'location',        label: 'Venue Name',           type: 'string',   required: true },
          { name: 'locationAddress', label: 'Street Address',       type: 'string',
            ui: { description: 'Used to generate a Google Maps link' } },
          { name: 'status',          label: 'Status',               type: 'string',
            options: [
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past',     label: 'Past' },
            ],
          },
          { name: 'images',          label: 'Photos',               type: 'image',    list: true },
          { name: 'registrationUrl', label: 'Registration Link',    type: 'string' },
          { name: 'body',            label: 'Description',          type: 'rich-text' },
        ],
      },
      {
        name:   'galleryImage',
        label:  'Gallery',
        path:   'src/content/gallery',
        format: 'json',
        fields: [
          { name: 'title',      label: 'Image Title',          type: 'string',  required: true },
          { name: 'src',        label: 'Photo',                type: 'image',   required: true },
          { name: 'caption',    label: 'Caption',              type: 'string' },
          { name: 'artistSlug', label: 'Artist (optional)',    type: 'string',
            ui: { description: 'Enter the artist\'s URL slug, e.g., "wilma-kroese"' } },
          { name: 'featured',   label: 'Featured on Homepage', type: 'boolean' },
          { name: 'year',       label: 'Year',                 type: 'number' },
        ],
      },
      {
        name:   'newsItem',
        label:  'News & Highlights',
        path:   'src/content/news',
        format: 'md',
        fields: [
          { name: 'headline',    label: 'Headline',              type: 'string',   required: true },
          { name: 'date',        label: 'Date',                  type: 'datetime', required: true },
          { name: 'publication', label: 'Publication or Source', type: 'string' },
          { name: 'url',         label: 'Link to Article',       type: 'string' },
          { name: 'image',       label: 'Photo',                 type: 'image' },
          { name: 'body',        label: 'Description',           type: 'rich-text' },
        ],
      },
      {
        name:   'settings',
        label:  'Site Settings',
        path:   'src/content/settings',
        format: 'json',
        match:  { include: 'site' },
        ui:     { allowedActions: { create: false, delete: false } },
        fields: [
          { name: 'contactEmail',   label: 'Contact Email',    type: 'string' },
          { name: 'facebookUrl',    label: 'Facebook URL',     type: 'string' },
          { name: 'instagramUrl',   label: 'Instagram URL',    type: 'string' },
          { name: 'meetingSchedule', label: 'Meeting Schedule', type: 'object',
            fields: [
              { name: 'dayOfMonth', label: 'Day of Month',     type: 'string',
                ui: { description: 'e.g., "Second Thursday"' } },
              { name: 'time',       label: 'Time',             type: 'string',
                ui: { description: 'e.g., "10:00 AM"' } },
              { name: 'location',   label: 'Meeting Location', type: 'string' },
            ],
          },
          { name: 'boardMembers',   label: 'Board Members',    type: 'object', list: true,
            fields: [
              { name: 'name',  label: 'Name',  type: 'string' },
              { name: 'title', label: 'Title', type: 'string' },
              { name: 'email', label: 'Email', type: 'string' },
            ],
          },
        ],
      },
    ],
  },
});
```

---

### Phase 3 — Core Page Templates (Days 2–4)

**Goal:** All six pages render with correct layout and placeholder content.

#### Page Architecture

| Route | File | Content Sources |
|-------|------|----------------|
| `/` | `src/pages/index.astro` | Featured artists (4), upcoming events (3), featured gallery images (6) |
| `/artists` | `src/pages/artists/index.astro` | All artist entries, sorted by `sortOrder` then name |
| `/artists/[slug]` | `src/pages/artists/[slug].astro` | Single artist entry + related gallery images |
| `/gallery` | `src/pages/gallery.astro` | All gallery entries, sorted by `featured` desc then year desc |
| `/events` | `src/pages/events.astro` | All events, split into upcoming/past sections |
| `/about` | `src/pages/about.astro` | Settings collection (board, meetings), static about text |
| `/news` | `src/pages/news.astro` | All news entries sorted by date desc |

#### Key Component Details

**`src/components/ArtistCard.astro`**
Displays: profile image thumbnail (200×200 cropped circle), name, medium, "View Profile" link. Used in the artists grid and homepage featured section.

**`src/components/GalleryGrid.astro`**
CSS Masonry grid using `columns: 2` (mobile), `columns: 3` (tablet), `columns: 4` (desktop). Each image wrapped in a `<button>` that triggers the lightbox. Uses Astro's `<Image>` component for automatic WebP conversion and `srcset` generation.

**`src/components/GalleryLightbox.astro`**
Astro Island (`client:visible`). Uses the native browser `<dialog>` element (no library dependency) with `backdrop-filter: blur`. Keyboard navigable (left/right arrows, Escape to close). Passes image array as a JSON prop from the parent page.

**`src/components/Navigation.astro`**
Mobile hamburger toggled via a minimal inline `<script>` (toggles a `data-open` attribute, styled by CSS). No JavaScript framework. Items: Home, Artists, Gallery, Events, About, News.

**`src/layouts/BaseLayout.astro`**
```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}
const { title, description = 'Creative Arts Association of Lakewood Ranch', ogImage } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content={description} />
  <title>{title} | CAALR</title>
  <!-- Open Graph for Facebook link previews -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {ogImage && <meta property="og:image" content={ogImage} />}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="/styles/tokens.css" />
  <link rel="stylesheet" href="/styles/global.css" />
</head>
<body>
  <a href="#main-content" class="skip-nav">Skip to main content</a>
  <Navigation />
  <main id="main-content">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

#### Home Page Sections (`src/pages/index.astro`)
1. **Hero** — full-width image with overlay text: association name, tagline, CTA "Meet Our Artists"
2. **Welcome** — 2-column: left text block (pulled from a CMS-editable markdown file), right: embedded Facebook page widget
3. **Upcoming Shows** — 3-card row showing next 3 events from `events` collection with `status: upcoming`
4. **Featured Artists** — 4-card row showing artists with `featured: true`
5. **Gallery Preview** — 6-image grid showing `featured: true` gallery images, links to `/gallery`
6. **About Teaser** — narrow strip: founded year, member count, meeting schedule summary

---

### Phase 4 — Content Migration (Days 4–6)

**Goal:** All current Weebly content migrated into content files.

| Task | Files Created | Notes |
|------|---------------|-------|
| Scrape artist list from caalr.com/artists | — | Record names, mediums, bios as shown on Weebly |
| Download all artist images | `public/images/artists/*.jpg` | Use original filenames, will be optimized at build |
| Create artist .md files (19 files) | `src/content/artists/*.md` | One per artist, filename = slug |
| Research missing bios | — | Search artist names + "Lakewood Ranch" + medium; use placeholder if nothing found |
| Download gallery images | `public/images/gallery/*.jpg` | Target <300KB each; crop/resize if oversized |
| Create gallery .json files | `src/content/gallery/*.json` | Batch-create from image filenames |
| Create events from Shows page | `src/content/events/*.md` | Mark past shows as `status: past` |
| Create news items | `src/content/news/*.md` | Pull from "In the News" Weebly page |
| Create settings file | `src/content/settings/site.json` | Board members, meeting schedule, social URLs |
| Optimize images at build | — | Verify Astro Image output sizes; check that no source image >2MB |

**Artist stub template** (for artists where no bio is found):
```markdown
---
name: "[Artist Name]"
medium: "[Known Medium]"
profileImage: "/images/artists/[slug].jpg"
featured: false
artworkImages: []
---

[Artist Name] is a member of the Creative Arts Association of Lakewood Ranch.
```

**Artist file naming convention:** `src/content/artists/[firstname-lastname].md` — all lowercase, hyphens for spaces.

---

### Phase 5 — Accessibility & Performance (Days 6–7)

**Goal:** Lighthouse scores ≥90 for Performance and Accessibility on both mobile and desktop.

| Task | Implementation |
|------|---------------|
| Skip navigation link | Already in `BaseLayout.astro`; style with `position: absolute; left: -9999px` until focused |
| Color contrast audit | Verify all text/background pairs meet 4.5:1 (AA) using tokens defined above |
| Image alt text | All `<Image>` and `<img>` elements have meaningful `alt`; decorative images use `alt=""` |
| Focus styles | Custom focus ring: `outline: 3px solid var(--color-gold); outline-offset: 2px;` |
| Heading hierarchy | Each page has exactly one `<h1>`; sections use `<h2>/<h3>` correctly |
| ARIA on lightbox | `role="dialog"`, `aria-label="Image viewer"`, `aria-modal="true"`, focus trap |
| ARIA on navigation | `<nav aria-label="Main navigation">`, hamburger button has `aria-expanded` and `aria-controls` |
| Font size floor | No text below 16px anywhere; body is 18px (set via `--text-base`) |
| Link underlines | All body-copy links underlined by default (not just on hover) |
| Image optimization | Astro `<Image>` outputs WebP with width 480/960/1440 variants; `loading="lazy"` on below-fold images |
| Preload hero image | `<link rel="preload" as="image">` for hero in BaseLayout when `heroImage` prop set |

---

### Phase 6 — CMS Polish & Maintainer Guide (Days 7–8)

**Goal:** TinaCMS field labels are clear enough for a non-technical user with no help. A printed/PDF guide covers every common task.

**TinaCMS UX improvements:**
- All field `description` props written in plain English, not technical jargon
- Section labels use "Shows & Events" not "events", "News & Highlights" not "news"
- Settings collection cannot be accidentally created or deleted (`allowedActions: { create: false, delete: false }`)
- Required fields explicitly marked (TinaCMS shows red asterisk automatically)

**Maintainer Guide outline** (`docs/maintainer-guide/README.md`):
1. How to log in to the website editor
2. Adding a new artist (step by step with screenshots)
3. Editing an existing artist's bio or photo
4. Removing an artist who has left
5. Adding a new show or event
6. Marking a show as "past" after it ends
7. Adding a gallery photo
8. Adding a news item
9. Updating the meeting schedule
10. Updating a board member's name or title
11. What to do if something looks wrong (contact developer)

Each section: numbered steps, full-page annotated screenshots, "What you'll see after saving" note.

---

### Phase 7 — Testing & Launch Prep (Days 8–9)

| Task | Tools/Method |
|------|-------------|
| Lighthouse audit (mobile) | Chrome DevTools → Lighthouse, throttled 4G, targets: Performance ≥90, Accessibility ≥90 |
| axe-core accessibility scan | Browser extension; fix all critical and serious issues |
| Responsive testing | Chrome DevTools at 320px, 375px, 768px, 1024px, 1440px |
| Cross-browser testing | Chrome, Safari, Firefox on desktop; Chrome and Safari on mobile |
| CMS usability test | User acts as maintainer: add a test artist, create a test event, upload a gallery image, then delete them |
| Content completeness | Verify all 19 artists listed, all gallery images present, shows and news migrated |
| Performance: image sizes | Verify no page loads >2MB of images on first viewport |
| DNS cutover plan | Document exact GoDaddy nameserver change to Cloudflare nameservers; note ~24h propagation |
| Preview deployment | Confirm production build at `caalr.pages.dev` before DNS change |
| 301 redirects | Configure `_redirects` file if page URLs change (e.g., Weebly `/shows` → `/events`) |

**`public/_redirects`** (Cloudflare Pages redirect format):
```
/shows    /events    301
/news     /news      200
/gallery  /gallery   200
```

---

## Files Summary

| File | Purpose | Phase |
|------|---------|-------|
| `astro.config.mjs` | Astro configuration (integrations, image settings) | 0 |
| `package.json` | Dependencies: `astro`, `tinacms`, `@tinacms/cli` | 0 |
| `tsconfig.json` | TypeScript strict config | 0 |
| `wrangler.toml` | Cloudflare Pages config (optional) | 0 |
| `.env.example` | Documents `TINA_CLIENT_ID`, `TINA_TOKEN` | 0 |
| `tina/config.ts` | TinaCMS schema: all 5 collections | 2 |
| `src/content/config.ts` | Astro Content Collections: all 5 collections | 2 |
| `src/styles/tokens.css` | Design tokens: colors, fonts, spacing | 1 |
| `src/styles/global.css` | Base reset, typography, focus styles | 1 |
| `src/layouts/BaseLayout.astro` | HTML shell, meta tags, skip nav, font links | 1 |
| `src/layouts/ArtistLayout.astro` | Artist profile page layout | 3 |
| `src/components/Navigation.astro` | Responsive nav with hamburger menu | 1 |
| `src/components/Footer.astro` | Social links, meeting summary, copyright | 1 |
| `src/components/SocialLinks.astro` | Facebook + Instagram icon links | 1 |
| `src/components/ArtistCard.astro` | Artist thumbnail card for grids | 3 |
| `src/components/ArtistGrid.astro` | Responsive grid of ArtistCard components | 3 |
| `src/components/EventCard.astro` | Event summary card | 3 |
| `src/components/GalleryGrid.astro` | Masonry image grid | 3 |
| `src/components/GalleryLightbox.astro` | Astro Island: dialog-based lightbox | 3 |
| `src/components/MeetingSchedule.astro` | Renders meeting schedule from settings | 3 |
| `src/components/BoardList.astro` | Renders board members from settings | 3 |
| `src/pages/index.astro` | Home page | 3 |
| `src/pages/artists/index.astro` | Artists grid page | 3 |
| `src/pages/artists/[slug].astro` | Individual artist profile page | 3 |
| `src/pages/gallery.astro` | Full gallery page | 3 |
| `src/pages/events.astro` | Shows & Events page | 3 |
| `src/pages/about.astro` | About, board, meetings page | 3 |
| `src/pages/news.astro` | News & Highlights page | 3 |
| `src/content/settings/site.json` | Board members, meeting schedule, social URLs | 4 |
| `src/content/artists/*.md` | 19 artist profiles (one file each) | 4 |
| `src/content/events/*.md` | Show/event entries | 4 |
| `src/content/gallery/*.json` | Gallery image metadata | 4 |
| `src/content/news/*.md` | News and achievement items | 4 |
| `public/images/artists/*.jpg` | Artist profile photos | 4 |
| `public/images/gallery/*.jpg` | Gallery images | 4 |
| `public/images/events/*.jpg` | Event photos | 4 |
| `public/logo.svg` | CAALR logo (extracted or recreated) | 1 |
| `public/_redirects` | 301 redirects from old Weebly URLs | 7 |
| `docs/maintainer-guide/README.md` | Step-by-step CMS guide with screenshots | 6 |

---

## Definition of Done

- [ ] Site deploys successfully to `caalr.pages.dev` via Cloudflare Pages on every push to `main`
- [ ] All 6 pages render correctly on Chrome, Safari, Firefox (desktop and mobile)
- [ ] All 19 artist profiles have name, medium, at least one image, and a bio (even if placeholder)
- [ ] Individual artist pages exist at `/artists/[slug]` for all 19 artists
- [ ] Gallery page displays all migrated images in masonry grid with working lightbox
- [ ] Lightbox is keyboard-navigable (arrow keys, Escape closes)
- [ ] Events page shows upcoming and past shows with dates and locations
- [ ] About page shows current board members and meeting schedule
- [ ] News page shows all migrated press/achievement items
- [ ] TinaCMS admin accessible at `/admin` — maintainer can log in with TinaCloud email/password (no GitHub account required)
- [ ] Maintainer can add a new artist through the CMS without developer help
- [ ] Maintainer can upload a gallery image through the CMS without developer help
- [ ] Maintainer can add a new event through the CMS without developer help
- [ ] CMS save triggers a Cloudflare Pages build; change appears live within 3 minutes
- [ ] Lighthouse Accessibility score ≥90 on homepage, artists page, and gallery page
- [ ] Lighthouse Performance score ≥90 on mobile (throttled 4G)
- [ ] No axe-core critical or serious accessibility violations
- [ ] All body text ≥16px; primary body text is 18px
- [ ] All text/background color combinations pass WCAG AA (4.5:1 minimum)
- [ ] Responsive at 320px, 768px, 1024px, 1440px — no horizontal scrollbar, no content overflow
- [ ] Social media links (Facebook, Instagram) present in header or footer with accessible labels
- [ ] Green/gold color scheme preserved and visually modernized
- [ ] No source image >2MB in `public/images/`; build outputs WebP variants
- [ ] `docs/maintainer-guide/README.md` covers all 10 CMS operations with screenshots
- [ ] DNS cutover plan documented; domain transfer from GoDaddy mapped out

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| TinaCloud free tier changes pricing | Low | High | TinaCMS is also fully self-hostable; migration path exists. Document self-hosted option in RISKS.md. |
| Weebly images are low resolution (<400px wide) | High | Medium | Accept and use as-is; add `[low resolution — better image welcome]` note in CMS for maintainer to replace later |
| Artist research turns up no bio for some members | Medium | Low | Use placeholder bio; field is not required in CMS; maintainer can fill in over time |
| CAALR logo is only available at screen resolution | Medium | Medium | Recreate as SVG text logo using association name and a simple leaf/palette icon (SVG scales infinitely) |
| TinaCloud OAuth redirect confuses elderly maintainer | Medium | Medium | Create a laminated "How to Log In" quick-start card with screenshots of the 3-step login flow |
| Cloudflare Pages build fails silently | Low | Medium | Enable email build notifications in Cloudflare dashboard; document how to check build status |
| Gallery masonry layout breaks on older Safari | Low | Low | CSS `columns` property has 95%+ browser support including Safari 9+; acceptable risk |
| Content migration misses items from Weebly | Medium | Medium | Use a structured checklist per content type; do final side-by-side comparison of old vs new site |
| TinaCMS visual editing overlay is disorienting on mobile | Low | Low | Maintainer workflow is desktop-only; document this in guide |
| Repository grows large from images (>500MB) | Low | Medium | Enforce max source image size of 2MB in PR checklist; consider git-lfs if repo exceeds 1GB |

---

## Security Considerations

**Minimal attack surface:** The entire site is pre-built static HTML. There is no server-side code, no database, no PHP/Node process running on the host. The categories of vulnerability (SQL injection, server-side template injection, SSRF) that affect dynamic sites do not apply.

**Authentication:** TinaCloud handles all authentication. The maintainer's credentials are never stored in the repository or the site code. TinaCloud uses industry-standard OAuth 2.0. The `TINA_CLIENT_ID` and `TINA_TOKEN` environment variables are stored in Cloudflare Pages environment settings (not in the repository).

**No secrets in repository:** The `.env.example` file documents required variables but contains no real values. The `.gitignore` excludes `.env`. This should be verified before first commit.

**Content Security Policy:** A `_headers` file in `public/` should set a reasonable CSP. The TinaCMS admin UI requires `frame-ancestors 'self'` for inline editing. The Facebook widget on the homepage requires allowing `connect-src *.facebook.com`. Start with a permissive policy and tighten after testing:
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Image uploads via CMS:** TinaCMS with `tina.media` configuration stores images in the Git repository. The Git repository is private. Uploaded files are committed as binary assets — there is no execution path. Cloudflare Pages serves them as static assets with correct MIME types.

**Dependency supply chain:** Astro and TinaCMS are widely-used, actively maintained open source projects with public CVE tracking. Run `npm audit` before launch and pin major versions in `package.json`.

---

## Dependencies

| Dependency | Version | Purpose | License |
|-----------|---------|---------|--------|
| `astro` | `^4.x` | Static site generator | MIT |
| `@astrojs/image` | built-in | Image optimization pipeline | MIT |
| `tinacms` | `^2.x` | CMS visual editing runtime | Apache 2.0 |
| `@tinacms/cli` | `^1.x` | TinaCMS build tooling | Apache 2.0 |
| TinaCloud (service) | Free tier | CMS auth + content sync | Proprietary / Free tier |
| Cloudflare Pages (service) | Free tier | Static hosting + CDN | Proprietary / Free tier |
| Google Fonts: Playfair Display | — | Display/heading typeface | OFL |
| Google Fonts: Source Serif 4 | — | Body typeface | OFL |

**No runtime JavaScript libraries required.** The gallery lightbox uses the native `<dialog>` element. The navigation hamburger uses a small inline `<script>` (~10 lines). No jQuery, no Bootstrap, no React.

---

## Open Questions

1. **TinaCloud user setup:** Should the primary maintainer use their personal email for TinaCloud, or should a shared `caalr.webmaster@gmail.com` account be created? A shared account is more resilient (board member turnover) but shared credentials are a security tradeoff. Recommendation: shared account with a strong password stored in a notes app.

2. **Logo situation:** Can a sufficiently high-resolution version of the CAALR logo be extracted from the current Weebly site, or is there a source file held by a board member? If not, should the SVG fallback use a palette icon, a leaf/nature motif, or just styled text? This needs a decision before Phase 1 is complete.

3. **Artist research scope:** For artists where no online presence is found (no website, no Facebook, no local news mentions), the placeholder bio ("...is a member of CAALR") is honest but thin. Should the developer email the board asking members to submit short bios? This could delay migration but improve quality. Alternative: launch with placeholders; add a note in the maintainer guide.

4. **Meeting location:** The current site shows a specific venue for member meetings. Has this changed recently? The settings schema stores a single location string — if CAALR rotates meeting locations, the schema might need an `exceptions` array extended to support per-meeting location overrides.

5. **Facebook embed vs. link:** The intent document mentions "social media embeds." A Facebook page embed (using Facebook's embedded page widget) loads ~400KB of third-party JavaScript and requires accepting Facebook's cookie policy, which may trigger GDPR-style browser warnings even in Florida. A simpler alternative is a styled Facebook/Instagram link button with the follower count displayed as static text. Which does the board prefer?

6. **`/admin` access control for Cloudflare Pages:** By default, anyone can visit `caalr.com/admin` and see the TinaCloud login page. This is fine (the login itself is protected), but it reveals that the site uses TinaCMS. If the board prefers obscurity, Cloudflare Access can gate the `/admin` path to specific email addresses at zero cost.

7. **Page URL strategy for SEO:** If the existing Weebly site has inbound links or any search engine ranking (even modest), the redirect strategy in `public/_redirects` becomes important. Should a pre-migration SEO audit be run to catalog which Weebly URLs have external inbound links?
