# Sprint 001 Intent: CAALR Website Rebuild

## Seed

Rebuild the CAALR (Creative Arts Association of Lakewood Ranch) website — currently hosted on GoDaddy/Weebly at caalr.com — as a modern, mobile-friendly, accessible static site hosted for free. The #1 priority is that a non-technical, elderly maintainer can update content (artists, events, gallery images) through a visual web interface with zero coding knowledge.

## Context

- **Greenfield project** — no website code exists yet in this repo; the current site lives on Weebly/GoDaddy
- **Current site** has 7 pages: Welcome, About Us, Artists (19 members), Shows, Gallery (60+ images), Resources, In the News. Built with Weebly, uses green/yellow color scheme, includes contact form, embedded Google Map, meeting schedules, board of directors info
- **Key stakeholders**: Art association board (President Carol Krah, VP Stacey Lipton, Secretary Susan Perry, Treasurer Benise Jones, At-Large: Barby Comins, Wilma Kroese, Elaine Vaughn). User's mother Wilma Kroese is on the board
- **Motivation**: Eliminate GoDaddy hosting fees while modernizing the outdated design. Domain (caalr.com) will be kept; only hosting moves to free tier
- **User demographic**: Older adults — both site visitors and the maintainer. Accessibility and simplicity are paramount

## Recent Sprint Context

No prior sprints. This is the first sprint for a greenfield project.

## Relevant Codebase Areas

No existing website code. The repo contains only sprint planning/execution skill definitions under `.agents/skills/`. All website code will be created from scratch.

Key external resources:
- Current live site: https://caalr.com/ (Weebly/GoDaddy) — source of all existing content and images
- 19 artist members with varying online presence — bios and additional images to be researched
- CAALR logo on current site (resolution unknown)

## Constraints

- **Zero hosting cost** — must use free-tier hosting (Netlify preferred for Decap CMS integration)
- **Non-technical maintainer** — the person updating the site will be elderly and not computer-savvy. Content updates must happen through a visual web UI (Decap CMS or equivalent), not through code/Git
- **Preserve existing content** — all current content must be migrated (artists, shows, gallery images, meeting info, news features)
- **Keep green/yellow color theme** — modernize it but retain the nature-inspired palette the group identifies with
- **Mobile-first** — many visitors will be on phones/tablets
- **Very accessible** — 16px+ body text, high contrast ratios (WCAG AA minimum), generous whitespace, clear navigation
- **Demo-first** — deploy to a free subdomain (e.g., caalr.netlify.app) for review before switching the real domain
- **No contact form needed** — simplifies hosting requirements
- **Social media integration** — Facebook and Instagram links/embeds

## Success Criteria

1. A fully functional static website deployed to a free Netlify subdomain with all current CAALR content migrated
2. Decap CMS (or equivalent) admin panel at `/admin` where a non-technical user can:
   - Add/edit/remove artist profiles (name, bio, medium, email, images)
   - Add/edit/remove shows/events (date, location, description, images)
   - Add/edit gallery images
   - Update meeting schedules and board info
   - Add news/achievement highlights
3. Mobile-responsive design that works well on phones, tablets, and desktops
4. WCAG AA accessibility compliance (contrast ratios, font sizes, keyboard navigation)
5. Each of the 19 artists has a mini-profile page with bio, medium, and artwork
6. Modern gallery with masonry/grid layout and lightbox enlargement
7. Page load under 3 seconds on mobile (optimized images)
8. Clear maintainer guide document that walks through every CMS operation with screenshots
9. Social media links (Facebook, Instagram) in header/footer

## Verification Strategy

- **Visual review**: Deploy to demo URL; user and mom review on desktop and mobile
- **Accessibility**: Run Lighthouse and axe-core audits; target 90+ accessibility score
- **Performance**: Lighthouse performance score 90+; test on throttled mobile connection
- **CMS usability**: Have the intended maintainer (or user acting as proxy) walk through adding an artist, creating an event, and uploading gallery images — all through the CMS UI
- **Content completeness**: Verify all 19 artists, all gallery images, all shows, all news items are migrated
- **Cross-browser**: Test on Chrome, Safari, Firefox on both desktop and mobile
- **Responsive**: Test at 320px, 768px, 1024px, 1440px breakpoints

## Uncertainty Assessment

- **Correctness uncertainty: Low** — well-understood domain (static website with CMS); established tools (Hugo/Eleventy + Decap CMS + Netlify) with extensive documentation
- **Scope uncertainty: Medium** — artist research (finding bios/images online for 19 artists) is open-ended; image quality varies; logo resolution unknown; exact page consolidation strategy needs design decisions
- **Architecture uncertainty: Low** — static site generator + headless CMS + Netlify is a well-trodden path with many reference implementations

## Open Questions

1. **Which static site generator?** Hugo vs Eleventy vs Astro — which has the best Decap CMS integration, image optimization pipeline, and learning curve for potential future maintenance?
2. **Page consolidation strategy** — how should 7 pages map to a new IA? Candidates: Home, Artists (with sub-profiles), Gallery, Events/Shows, About (absorbing Resources + In the News + meeting info)
3. **Artist research scope** — how much effort to invest in finding bios/images online for each of the 19 artists? What to do when nothing is found?
4. **Image pipeline** — how to handle varying image quality and sizes? Automated optimization/resizing at build time?
5. **Authentication for CMS** — Decap CMS typically uses Netlify Identity (free for 5 users) or GitHub OAuth. Which is simpler for a non-technical user?
6. **Gallery deduplication** — automated approach or manual curation during migration?
7. **Logo** — can we extract a usable version from the current site, or should we create a simple text-based logo as fallback?
