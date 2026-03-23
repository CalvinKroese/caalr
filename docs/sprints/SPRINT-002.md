# Sprint 002: Design Overhaul — Florida Beach Artsy

## Overview

Transform the CAALR website from a formal, corporate-feeling static site into a vibrant, warm, artsy community website that feels like a sunny Florida coastal art gallery. This sprint changes CSS, templates, fonts, and the homepage layout. No content structure or CMS changes.

**Direction chosen by user:**
- Florida Beach palette (teal, coral, gold on warm sand)
- Playfair Display + Nunito + Caveat typography
- Subtle artsy effects (rounded, warm, polished — not chaotic)
- CAA logo upscaled and integrated into header
- Homepage redesigned with more photos, story, welcoming feel

## Color Palette

```css
:root {
  --color-teal:         #0E9AA7;  /* Primary — ocean water */
  --color-teal-dark:    #076E78;  /* Headings, links */
  --color-teal-deeper:  #054D55;  /* Header/footer backgrounds */
  --color-coral:        #FF6F61;  /* Pop accent, badges, decorative */
  --color-coral-dark:   #E8524A;  /* Coral hover */
  --color-gold:         #F5A623;  /* Warm accent, CTAs, highlights */
  --color-gold-light:   #FFF3D6;  /* Highlight wash, badge bg */
  --color-sand:         #FFFDF7;  /* Page background (warm cream) */
  --color-seafoam:      #E8F6F1;  /* Alt section background */
  --color-driftwood:    #F7F1E8;  /* Warm alt background */
  --color-charcoal:     #2D3436;  /* Body text */
  --color-drift:        #636E72;  /* Muted text, metadata */
  --color-border:       #D5E0DC;  /* Borders, dividers */
  --color-focus:        #F5A623;  /* Focus rings */
}
```

## Typography

```css
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Nunito', -apple-system, sans-serif;
  --font-script: 'Caveat', cursive;
}
```

Google Fonts: `Playfair+Display:wght@400;700&family=Nunito:wght@400;600;700&family=Caveat:wght@400;700`

## Implementation

### Phase 1: Foundation (~30%)

**Files:**
- `src/styles/tokens.css` — Complete color and typography token replacement
- `src/styles/global.css` — Updated card styles, button styles, section styles, badge styles
- `src/layouts/BaseLayout.astro` — New Google Fonts import, update any structural markup

**Tasks:**
- [ ] Replace entire color system in tokens.css with Florida Beach palette
- [ ] Replace font-family tokens with Playfair Display / Nunito / Caveat
- [ ] Add `--font-script` token and `.script` utility class for Caveat usage
- [ ] Update card styles: increase border-radius to 16px, add teal-tinted shadows, subtle hover lift+scale
- [ ] Update button styles: rounded pill shape (24px radius), teal primary, coral secondary
- [ ] Update badge styles: coral/gold-light backgrounds, rounded
- [ ] Update section alternating backgrounds: seafoam and driftwood
- [ ] Update focus ring to gold
- [ ] Update link colors to teal-dark
- [ ] Replace Google Fonts link in BaseLayout.astro
- [ ] Verify build passes

### Phase 2: Logo & Header/Footer (~20%)

**Files:**
- `public/uploads/logo/caalr-logo.png` — Upscaled logo
- `src/components/Header.astro` — Logo integration, warmer nav styling
- `src/components/Footer.astro` — Match new palette, warmer feel

**Tasks:**
- [ ] Upscale CAA logo from 217x145 to ~600x400 using ImageMagick (or AI upscaler if available)
- [ ] Convert to clean PNG with transparent background if possible
- [ ] Place logo in header next to "CAALR" text (or replace text with logo)
- [ ] Restyle header: teal-deeper background, lowercase nav links, Nunito font, larger tap targets, rounded hover states with coral accent
- [ ] Add Caveat script tagline under logo: "create. connect. inspire." or similar
- [ ] Restyle footer: teal-deeper background, warm cream text, coral social icon hover states, gold accent links
- [ ] Verify responsive header/footer on mobile

### Phase 3: Homepage Redesign (~30%)

**Files:**
- `src/pages/index.astro` — Major layout rework
- `src/components/Hero.astro` — More visual, welcoming, with art photos

**Tasks:**
- [ ] Redesign Hero section:
  - Caveat "welcome to" above main heading
  - Playfair Display main heading: "Creative Arts Association of Lakewood Ranch"
  - Subtitle with founding story snippet
  - Background: collage of artwork images with teal overlay (semi-transparent)
  - CTA button: coral "Meet Our Artists" pill button
- [ ] Add "Our Story" section below hero:
  - Two-column: text left (founding story, mission, "humble beginnings in the park"), art photo(s) right
  - Caveat script accent for section label
  - Warm sand/driftwood background
- [ ] Redesign "Upcoming Events" section:
  - Section label in Caveat script
  - Coral accent line under heading
  - EventCards with new rounded styling
- [ ] Redesign "Featured Artists" section:
  - Seafoam background
  - ArtistCards with new styling (rounder, warmer shadows)
  - Caveat "meet our artists" label
- [ ] Redesign "Gallery Preview" section:
  - Larger images, slight variation in sizes (not perfectly uniform grid)
  - Gold accent "View Full Gallery" CTA
- [ ] Add an "About CAALR" teaser strip:
  - Quick stats: "Founded 2001 · 20 Artists · 50+ Supporters"
  - Teal background with white text
  - Link to About page

### Phase 4: Page & Component Polish (~20%)

**Files:**
- `src/components/ArtistCard.astro` — Softer, warmer
- `src/components/EventCard.astro` — Match new style
- `src/components/GalleryGrid.astro` — Slightly more organic feel
- `src/components/SectionHeading.astro` — Caveat accent + coral underline
- `src/pages/artists/[slug].astro` — Warmer profile
- `src/pages/artists/index.astro` — Updated hero
- `src/pages/events/index.astro` — Updated hero
- `src/pages/gallery.astro` — Updated hero
- `src/pages/news/index.astro` — Updated hero
- `src/pages/about.astro` — Updated hero and sidebar cards
- `src/pages/404.astro` — Fun 404 with artsy personality

**Tasks:**
- [ ] Update SectionHeading: Caveat script label above Playfair title, coral accent underline
- [ ] Update ArtistCard: 16px radius, warm shadows, medium badges in teal, coral hover accent
- [ ] Update EventCard: Coral "Upcoming" badge, gold "Past" badge, warm card style
- [ ] Update GalleryGrid: slightly varied image sizes via CSS (every 3rd image larger), warm shadow on lightbox
- [ ] Update artist profile page: teal accent on name, coral medium badges, warmer layout
- [ ] Update all page Heroes: teal-deeper background, Caveat + Playfair combo, coral CTA buttons
- [ ] Update About page sidebar cards: seafoam backgrounds, teal headings, gold accents
- [ ] Fun 404 page with Caveat script "oops!" and coral accent
- [ ] Verify all pages on mobile breakpoints
- [ ] Verify WCAG AA contrast on all text/background combos

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/styles/tokens.css` | Modify | Complete color + typography token replacement |
| `src/styles/global.css` | Modify | Updated component, card, button, section styles |
| `src/layouts/BaseLayout.astro` | Modify | New Google Fonts link |
| `src/components/Header.astro` | Modify | Logo, lowercase nav, teal-deeper bg |
| `src/components/Footer.astro` | Modify | Warm footer matching new palette |
| `src/components/Hero.astro` | Modify | Caveat + Playfair, art-forward, warmer |
| `src/components/ArtistCard.astro` | Modify | Rounded, warm shadows, teal badges |
| `src/components/EventCard.astro` | Modify | Coral/gold badges, warm style |
| `src/components/GalleryGrid.astro` | Modify | Slightly varied sizes, warm lightbox |
| `src/components/SectionHeading.astro` | Modify | Caveat label + coral underline |
| `src/pages/index.astro` | Modify | Major homepage redesign |
| `src/pages/artists/[slug].astro` | Modify | Warmer profile layout |
| `src/pages/artists/index.astro` | Modify | Updated hero |
| `src/pages/events/index.astro` | Modify | Updated hero |
| `src/pages/gallery.astro` | Modify | Updated hero |
| `src/pages/news/index.astro` | Modify | Updated hero |
| `src/pages/about.astro` | Modify | Updated hero + sidebar |
| `src/pages/404.astro` | Modify | Fun artsy 404 |
| `public/uploads/logo/caalr-logo-upscaled.png` | Create | Upscaled CAA logo |

## Definition of Done

- [ ] Color palette is Florida Beach (teal/coral/gold/sand) — no dark forest green remaining
- [ ] Typography is Playfair Display + Nunito + Caveat — no Merriweather/Open Sans remaining
- [ ] Caveat script used for section labels, taglines, and decorative accents
- [ ] CAA logo displayed in header, crisp at all sizes
- [ ] Homepage has: welcoming hero with art, founding story section, upcoming events, featured artists, gallery preview, stats strip
- [ ] All cards have 16px border-radius and warm teal-tinted shadows
- [ ] Buttons are pill-shaped with teal primary and coral accent variants
- [ ] Section headings have Caveat label + coral accent underline
- [ ] Header is teal-deeper with lowercase nav and logo
- [ ] Footer is warm teal-deeper with coral social icon hovers
- [ ] Gallery feels immersive with slightly varied image sizes
- [ ] 404 page has artsy personality
- [ ] All text/background combos pass WCAG AA contrast (4.5:1 body, 3:1 large)
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] Build passes with no errors
- [ ] Deployed to caalr.netlify.app for review

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Coral text on light background fails WCAG | High | Medium | Use coral only for decorative elements, badges with dark text, and large headings. Never for body text on light bg. |
| Logo upscaling produces blurry result | Medium | Low | Use CSS max-width to constrain display size. The logo is simple shapes — even at moderate upscale it will look fine. |
| Caveat font overused, site looks unprofessional | Medium | Medium | Limit Caveat to: section labels, tagline, hero accent, 404 page. Never for body text, nav, or buttons. |
| New palette clashes with some gallery artwork | Low | Low | Sand/cream/white backgrounds are neutral enough to showcase any art style. |
