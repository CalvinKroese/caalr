# Sprint 001 Merge Notes

## Draft Strengths Adopted

### From Claude Draft (Hugo + Decap + Netlify Identity)
- Realistic content migration plan with concrete scripts and per-artist analysis
- Email/password auth insight (correct UX for elderly user)
- Auto-derive event upcoming/past status from dates (not manual)
- Progressive enhancement (no-JS fallbacks for gallery, nav)
- Thorough security section (CSP, invite-only registration)
- Editorial workflow: start with `simple` publish mode

### From Codex Draft (Astro + Decap + GitHub Backend)
- **Content architecture adopted as the base**: individual gallery files (not monolithic YAML), Zod schemas, shortBio/fullBio split, array-based mediums, active/alumni artist status, separated settings JSON files
- Component responsibility separation and data flow diagrams
- Account recovery and governance concerns surfaced
- CMS field hints for non-technical users

### From Gemini Draft (Astro + TinaCMS + Cloudflare Pages)
- **Design system adopted**: specific color tokens, typography (modernized), spacing scale, card styling
- Use case frequency estimates (helps prioritize CMS workflows)
- Redirect strategy for old Weebly URLs
- Practical UX touches: field descriptions in plain English, settings locked against accidental create/delete
- Day-by-day timeline structure

## Valid Critiques Accepted

1. **Gallery as single YAML file is a CMS disaster** (all three critiques) → Adopted individual files per gallery image from Codex draft
2. **Git Gateway is deprecated** (all three critiques) → Switching to Sveltia CMS which doesn't require Git Gateway
3. **GitHub OAuth is wrong for elderly users** (Claude + Gemini critiques of Codex) → Using Sveltia CMS with Netlify Identity (email/password) initially, with Sveltia's own auth as future option
4. **Manual event status is a maintenance burden** (Gemini critique of Codex) → Auto-derive from dates at build time
5. **Slug field exposed to editors is dangerous** (Gemini critique) → Auto-generate slugs, hide from CMS editors
6. **Content migration effort underestimated** (Claude critique of Codex) → Reallocated to 25% of effort
7. **Build failure invisible to maintainer** (all three critiques) → Added Netlify email notifications + troubleshooting section in maintainer guide
8. **Missing DoD items** (all critiques) → Added: 404 page, sitemap, empty states, CMS-on-tablet test, redirect verification, maintainer guide validated by proxy user
9. **TinaCloud vendor dependency risk** → Avoided entirely by choosing Sveltia CMS (fully open-source)
10. **PWA manifest is scope creep** (Gemini critique) → Removed

## Critiques Rejected (with reasoning)

1. **"Hugo Go templates are a maintenance liability"** → Rejected because all dev is agentic (AI). Template language doesn't matter when AI writes/maintains the code. Chose Astro anyway for other reasons (image pipeline, content collections).
2. **"Reduce sprint scope"** (Codex critique) → Partially rejected. The scope is appropriate for agentic development. Deferred only gallery filtering to sprint 2.
3. **"Email obfuscation is inaccessible"** (Gemini critique) → Accepted. Will use plain mailto links. Emails are already public.

## Interview Refinements Applied

- **Stack finalized**: Astro + Sveltia CMS + Netlify
- **CMS choice reasoning**: Sveltia CMS is a drop-in Decap replacement (same config.yml format) that doesn't depend on deprecated Git Gateway. Longest longevity without intervention.
- **Development model**: All development is agentic (AI-driven). Only content maintenance is manual. Optimize for longevity over DX.
- **Artist bios**: Placeholder bios for sprint 1; maintainer fills in via CMS later
- **Gallery migration**: Full deduplication and artist attribution during migration
- **Hosting**: Netlify (best CMS integration, simpler setup)
