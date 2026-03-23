# Sprint 002 Intent: Design Overhaul — Vibrant, Fun, Florida-Artsy

## Seed

Redesign the CAALR website to feel vibrant, fun, artsy, and Florida-inspired. The current build (Sprint 001) is functional but too formal/corporate. It needs the warm, welcoming spirit of the original caalr.com but modernized — like walking into a colorful community art studio on a sunny Florida day.

## Context

- Sprint 001 delivered a working Astro 5 static site with 32 pages, 19 artists, 65+ gallery images, events, news, CMS
- The site builds and deploys but the design is generic: dark forest green header, corporate card grid, formal typography
- User wants: brighter greens (not dark forest), teal (from original site), a bright pop color, yellow/gold, Florida beach vibes
- User specifically said: "This needs to look like an artsy website and be fun, the new layout is just a bit too formal"
- The CAA logo (217x145px JPEG — black monogram with red swoosh) must be incorporated prominently
- Original site analysis revealed: garden palette, collage-like photo layouts, handwritten fonts, rounded corners, gradient washes, lowercase nav, personal storytelling voice, "Welcome" as homepage concept

## Relevant Codebase Areas

Files to modify (design/CSS/template only — no content structure changes):
- `src/styles/tokens.css` — Complete color and typography overhaul
- `src/styles/global.css` — Updated component styles, new artsy utilities
- `src/layouts/BaseLayout.astro` — Font imports, any structural changes
- `src/components/Header.astro` — Logo integration, nav restyling (lowercase, warmer)
- `src/components/Footer.astro` — Warmer design matching new palette
- `src/components/Hero.astro` — More visual, art-forward, welcoming
- `src/components/ArtistCard.astro` — Softer, more organic cards
- `src/components/EventCard.astro` — Match new style
- `src/components/GalleryGrid.astro` — More immersive, varied sizes
- `src/components/SectionHeading.astro` — Handwritten font treatment
- `src/pages/index.astro` — Major homepage redesign (more photos, story, welcome feel)
- `src/pages/artists/[slug].astro` — Warmer profile layout
- `public/uploads/logo/` — Upscaled logo

## Constraints

- WCAG AA contrast ratios (4.5:1 body text, 3:1 large text) — bright colors must still be accessible
- 16px+ minimum body text, generous spacing for older audience
- Mobile responsive
- Don't change content collections, CMS config, or content files
- Keep Astro component architecture — restyle, don't restructure
- All development is agentic (AI-driven)
- Must look good even with placeholder/missing profile images (not all artists have photos yet)

## Success Criteria

1. Site feels vibrant, fun, and artsy — not corporate or formal
2. Florida beach/sunshine vibes in the color palette (bright green, teal, yellow/gold, coral/pop color)
3. CAA logo prominently displayed in header, upscaled cleanly
4. At least one handwritten/script font used for headings or accents
5. Homepage tells the CAALR story with lots of art/people photos, feels like "Welcome"
6. Gallery feels immersive — art is the star, not the grid
7. Cards and UI elements feel organic (rounded, soft shadows, slight playfulness)
8. Footer feels warm and matches the vibrant palette
9. Passes WCAG AA contrast checks
10. Works well on mobile

## Verification Strategy

- Visual review on desktop and mobile
- Side-by-side comparison with original caalr.com for "soul" preservation
- Lighthouse accessibility score 90+
- User (and mom) review of the demo site
- Contrast ratio verification on all text/background combos

## Uncertainty Assessment

- **Correctness uncertainty: Low** — CSS/design changes with clear direction
- **Scope uncertainty: Low** — Bounded to styling and templates, no new features
- **Architecture uncertainty: Low** — Restyling existing components, no structural changes

## Open Questions

1. Exact bright pop color — coral (#FF6B6B)? Salmon (#FA8072)? Hot pink? Bright orange?
2. Handwritten font choice — Caveat? Kalam? Pacifico? Patrick Hand? Dancing Script?
3. How far to push the "artsy collage" layout — subtle card rotations? Overlapping elements? Or keep it clean with just softer styling?
4. Logo upscaling approach — AI upscale, SVG recreation, or use at current size with CSS scaling?
5. Should the three-word mission tagline be "Create. Connect. Inspire." or something else?
