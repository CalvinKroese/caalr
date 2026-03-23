# Sprint 002: Visual Design Overhaul — Florida Artsy

## Summary

Transform CAALR from a corporate-feeling static site into a vibrant, warm, artsy community website that feels like walking into a sunny Florida art studio. This sprint changes only CSS, templates, and layout — no content structure or CMS changes.

---

## 1. Color Palette

The current palette (`#1a6847` dark forest green, `#b8960c` mustard gold) reads as "insurance company". The new palette draws from Florida's coast: teal water, coral reefs, golden sunshine, and sandy beaches.

### New Palette (exact hex values)

| Token                   | Hex       | Usage                                  | WCAG notes                                |
|-------------------------|-----------|----------------------------------------|-------------------------------------------|
| `--color-teal`          | `#0E9AA7` | Primary brand, buttons, nav accents    | 3.4:1 on white — large text only          |
| `--color-teal-dark`     | `#076E78` | Headings, link text, dark teal         | 5.9:1 on cream — passes AA normal text    |
| `--color-teal-deeper`   | `#054D55` | Header/footer backgrounds              | 8.7:1 on white — passes AAA              |
| `--color-coral`         | `#FF6F61` | Pop accent, decorative, badges         | Use with dark text only (4.7:1 w/ charcoal) |
| `--color-coral-dark`    | `#E8524A` | Coral hover states                     | 3.7:1 w/ white — large text only          |
| `--color-gold`          | `#F5A623` | Warm accent, highlights, CTA alternate | Use with dark text only                   |
| `--color-gold-light`    | `#FFF3D6` | Highlight wash, badge backgrounds      | —                                         |
| `--color-sand`          | `#FFFDF7` | Page background (warm cream)           | —                                         |
| `--color-seafoam`       | `#E8F6F1` | Alt section background                 | —                                         |
| `--color-driftwood`     | `#F7F1E8` | Warm alt background (for variety)      | —                                         |
| `--color-charcoal`      | `#2D3436` | Body text                              | 14:1+ on cream — passes AAA              |
| `--color-drift`         | `#636E72` | Muted text, metadata                   | 5.6:1 on cream — passes AA               |
| `--color-border`        | `#D5E0DC` | Borders, dividers                      | —                                         |
| `--color-focus`         | `#F5A623` | Focus rings (gold — visible on both light/dark) | —                              |

### CSS: New `tokens.css` color block

```css
:root {
  /* Florida Artsy palette */
  --color-teal:         #0E9AA7;
  --color-teal-dark:    #076E78;
  --color-teal-deeper:  #054D55;
  --color-coral:        #FF6F61;
  --color-coral-dark:   #E8524A;
  --color-gold:         #F5A623;
  --color-gold-light:   #FFF3D6;
  --color-sand:         #FFFDF7;
  --color-seafoam:      #E8F6F1;
  --color-driftwood:    #F7F1E8;
  --color-charcoal:     #2D3436;
  --color-drift:        #636E72;
  --color-border:       #D5E0DC;
  --color-focus:        #F5A623;

  /* Semantic mappings */
  --color-primary:       var(--color-teal);
  --color-primary-light: var(--color-teal);
  --color-primary-dark:  var(--color-teal-dark);
  --color-secondary:     var(--color-gold);
  --color-secondary-light: var(--color-gold-light);
  --color-bg:            var(--color-sand);
  --color-bg-alt:        var(--color-seafoam);
  --color-surface:       #ffffff;
  --color-text:          var(--color-charcoal);
  --color-text-muted:    var(--color-drift);
}
```

### Why these colors

- **Teal** (`#0E9AA7`): Pulled from the original caalr.com. Reads as Florida water/sky. Vibrant without being neon. Distinct from the corporate dark green.
- **Coral** (`#FF6F61`): Pantone's 2019 "Living Coral" — warm, approachable, Florida reefs. Works as a pop accent against teal (complementary). More fun than red, softer than orange.
- **Gold** (`#F5A623`): Florida sunshine. Warmer than the current mustard `#b8960c`. Works for highlights, CTAs, and focus rings.
- **Sand** (`#FFFDF7`): Warm cream replaces the cold `#fafdf7`. The slight yellow warmth makes the whole site feel sunny rather than clinical.
- **Seafoam** (`#E8F6F1`): Light minty green for alternating sections. Reads as "beach glass" and connects back to the teal.

---

## 2. Typography

### Current state
- Headings: Merriweather — a news-magazine serif. Competent but serious.
- Body: Open Sans — the most generic sans-serif on the web.

### New fonts

| Role | Font | Weights | Why |
|------|------|---------|-----|
| **Headings** | **Playfair Display** | 400, 700 | Elegant editorial serif with high stroke contrast. Feels artistic and sophisticated without being stuffy. Works beautifully at large sizes. |
| **Body** | **Nunito** | 400, 600, 700 | Rounded terminals make it feel friendly and approachable. Excellent readability at 18px for the older audience. Warmer personality than Open Sans. |
| **Script accent** | **Caveat** | 400, 700 | Natural handwritten feel — like someone wrote it on a gallery card. Legible enough for short phrases (unlike Pacifico which gets unreadable). Used sparingly for "Welcome to", section decorators, and pull quotes. |

### Google Fonts link (replaces current)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Nunito:wght@400;600;700&family=Caveat:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

### CSS: Typography tokens

```css
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-script: 'Caveat', cursive;

  --font-size-base: 1.125rem;  /* 18px — keep for readability */
  --font-size-sm: 0.9375rem;   /* 15px */
  --font-size-lg: 1.25rem;     /* 20px */
  --font-size-xl: 1.5rem;      /* 24px */
  --font-size-2xl: 2rem;       /* 32px — bumped up from 30px */
  --font-size-3xl: 2.5rem;     /* 40px — bumped up from 36px */
  --font-size-4xl: 3.25rem;    /* 52px — bumped up from 44px */
  --font-size-script: 1.75rem; /* 28px — dedicated script size */
}
```

### Why Playfair Display over alternatives

Considered: Lora (too similar to Merriweather), Cormorant Garamond (too thin at small sizes), Libre Baskerville (too traditional). Playfair Display has **personality** — the high contrast between thick and thin strokes gives it an artistic, editorial quality that signals "this is a creative space" before you even read the words.

### Why Caveat over alternatives

Considered: Pacifico (too decorative, hard to read), Dancing Script (too formal/cursive), Kalam (a bit childish), Patrick Hand (too casual/blocky). Caveat strikes the right balance — it genuinely looks handwritten but remains legible. It says "personal, warm, creative" without saying "clip art."

---

## 3. Component Treatments

### 3a. Cards (ArtistCard, EventCard, gallery cards)

The current cards are corporate: 8px radius, minimal shadow, rectangular. The new treatment is softer, warmer, and more organic.

```css
:root {
  --radius-card: 16px;
  --shadow-card: 0 2px 12px rgba(14, 154, 167, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 8px 24px rgba(14, 154, 167, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  border: 1px solid rgba(14, 154, 167, 0.06);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-4px);
}

.card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card__image {
  transform: scale(1.03);
}

.card__body {
  padding: var(--space-md);
}

.card__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  color: var(--color-teal-dark);
  margin-bottom: var(--space-xs);
}
```

Key changes:
- **16px radius** — noticeably softer, reads as friendly
- **Teal-tinted shadow** — subtle warmth instead of neutral gray shadow
- **Hover lift** — `translateY(-4px)` gives a gentle "floating" effect
- **Image zoom on hover** — adds life and interactivity
- **Thin teal border** — barely visible but adds definition on white backgrounds

### 3b. Hero

The current hero is a flat dark green rectangle. The new hero is a warm, inviting gateway with gradient, texture, and personality.

```css
.hero {
  position: relative;
  background: linear-gradient(135deg, var(--color-teal-deeper) 0%, var(--color-teal-dark) 50%, var(--color-teal) 100%);
  color: white;
  padding-block: clamp(3rem, 10vw, 6rem);
  overflow: hidden;
}

/* Decorative wave divider at the bottom of the hero */
.hero::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--color-sand);
  clip-path: ellipse(55% 100% at 50% 100%);
}

.hero--home {
  padding-block: clamp(4rem, 14vw, 8rem);
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin-inline: auto;
}

.hero__eyebrow {
  font-family: var(--font-script);
  font-size: var(--font-size-script);
  color: var(--color-gold);
  margin-bottom: var(--space-xs);
  display: block;
}

.hero__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-4xl);
  color: white;
  margin-bottom: var(--space-sm);
  line-height: 1.15;
}

.hero__subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-md);
  line-height: 1.6;
}

.hero__cta-group {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
}
```

Key changes:
- **Gradient background** — flows from deep teal to bright teal, adds dimension
- **Wave divider** — CSS `clip-path` ellipse creates an organic wave transition into the page content (no hard horizontal line)
- **Script eyebrow** — Caveat font for "Welcome to" above the main title
- **Gold accent** — the eyebrow text in gold creates immediate warmth
- **Larger padding on home** — the homepage hero is bigger, more welcoming
- **CTA group** — supports multiple buttons side by side

### 3c. Navigation (Header)

The current header is a dark oppressive bar. The new header is lighter and more welcoming, while still being clearly navigational.

```css
.site-header {
  background-color: var(--color-surface);
  color: var(--color-charcoal);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 3px solid var(--color-teal);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-sm);
}

.site-header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  text-decoration: none;
}

.site-header__logo-img {
  height: 48px;
  width: auto;
}

.site-header__logo-text {
  font-family: var(--font-heading);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-teal-dark);
}

.site-nav__link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--color-charcoal);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-base);
  text-transform: lowercase;
  letter-spacing: 0.02em;
  border-radius: 8px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.site-nav__link:hover {
  background-color: var(--color-seafoam);
  color: var(--color-teal-dark);
}

.site-nav__link--active {
  background-color: var(--color-teal);
  color: white;
}
```

Key changes:
- **White background** instead of dark — opens up the page, feels airy
- **Teal bottom border** — 3px accent stripe gives color identity without heaviness
- **Lowercase nav** — matches original caalr.com, feels casual and artsy (not shouting)
- **Teal-dark logo text** — prominent but not overwhelming
- **Logo image slot** — the CAA logo JPEG sits next to the text
- **Seafoam hover** — gentle teal-tinted hover instead of white-on-dark
- **Active state** — solid teal pill with white text, clear and vibrant

### 3d. Footer

Warmer and more connected to the palette. Uses the deep teal instead of dark forest green.

```css
.site-footer {
  background: linear-gradient(180deg, var(--color-teal-deeper) 0%, #043A40 100%);
  color: rgba(255, 255, 255, 0.85);
  margin-top: var(--space-section);
  position: relative;
}

/* Wave divider at top of footer (mirrors hero bottom) */
.site-footer::before {
  content: '';
  position: absolute;
  top: -59px;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, var(--color-teal-deeper) 0%, #043A40 100%);
  clip-path: ellipse(55% 100% at 50% 0%);
}

.site-footer__heading {
  font-family: var(--font-script);
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  margin-bottom: var(--space-sm);
}

.site-footer__link {
  color: var(--color-gold-light);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(245, 166, 35, 0.4);
}

.site-footer__link:hover {
  color: var(--color-gold);
  text-decoration-color: var(--color-gold);
}

.site-footer__social-link {
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.15s ease, transform 0.15s ease;
}

.site-footer__social-link:hover {
  color: var(--color-coral);
  transform: scale(1.1);
}

.site-footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-block: var(--space-sm);
  text-align: center;
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.4);
}
```

Key changes:
- **Deep teal gradient** instead of flat dark green
- **Wave divider** at top (inverted ellipse) — organic transition that mirrors the hero wave
- **Script font headings** — Caveat for column headings adds personality
- **Gold accent links** — warm and visible against the dark background
- **Coral social hover** — pop of color on social icon hover
- **Social icon scale** — slight grow on hover adds playfulness

### 3e. Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 50px;  /* Pill shape — softer, more playful */
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

.btn--primary {
  background-color: var(--color-teal);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 154, 167, 0.3);
}

.btn--primary:hover {
  background-color: var(--color-teal-dark);
  color: white;
  box-shadow: 0 6px 16px rgba(14, 154, 167, 0.4);
}

.btn--secondary {
  background-color: var(--color-coral);
  color: var(--color-charcoal);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

.btn--secondary:hover {
  background-color: var(--color-coral-dark);
  color: white;
  box-shadow: 0 6px 16px rgba(255, 111, 97, 0.4);
}

.btn--outline {
  background-color: transparent;
  color: var(--color-teal-dark);
  border: 2px solid var(--color-teal);
  box-shadow: none;
}

.btn--outline:hover {
  background-color: var(--color-teal);
  color: white;
}
```

Key changes:
- **Pill shape** (`border-radius: 50px`) — organic, playful, art-world aesthetic
- **Colored shadows** — teal glow on primary, coral glow on secondary. More lively than gray shadows.
- **Hover lift** — buttons float up slightly on hover
- **Coral secondary** — instead of gold, coral is more fun and visible as a CTA
- **New outline variant** — useful for "View All" type secondary actions

### 3f. Section Headings

```css
.section-heading {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.section-heading__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-2xl);
  color: var(--color-teal-dark);
  margin-bottom: var(--space-xs);
  position: relative;
  display: inline-block;
}

/* Decorative underline — hand-drawn feel */
.section-heading__title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--color-coral);
  margin: var(--space-xs) auto 0;
  border-radius: 2px;
}

.section-heading__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-drift);
  max-width: 600px;
  margin-inline: auto;
}
```

Key change: **Coral underline accent** beneath section titles — a small detail that adds color and the feeling of a hand-drawn underline. The 60px width keeps it compact and intentional.

### 3g. Badges

```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: var(--font-size-sm);
  background-color: var(--color-seafoam);
  color: var(--color-teal-dark);
  border-radius: 50px;  /* Pill badges */
  font-weight: 600;
}

.badge--upcoming {
  background-color: var(--color-gold-light);
  color: #8B6914;  /* Dark gold for contrast — 4.8:1 on gold-light */
}

.badge--coral {
  background-color: rgba(255, 111, 97, 0.15);
  color: #C4483D;  /* Dark coral for contrast */
}
```

### 3h. Gallery Grid

```css
.gallery-grid {
  columns: 2;
  column-gap: var(--space-sm);
}

@media (min-width: 768px) {
  .gallery-grid { columns: 3; }
}

@media (min-width: 1024px) {
  .gallery-grid { columns: 4; }
}

.gallery-grid__item {
  display: block;
  width: 100%;
  break-inside: avoid;
  margin-bottom: var(--space-sm);
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.gallery-grid__item:hover {
  box-shadow: 0 8px 24px rgba(14, 154, 167, 0.15);
  transform: translateY(-3px);
}

.gallery-grid__item:hover .gallery-grid__img {
  transform: scale(1.05);
}

.gallery-grid__img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.35s ease;
}

.gallery-grid__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-sm);
  background: linear-gradient(transparent, rgba(5, 77, 85, 0.85));
  color: white;
  font-size: var(--font-size-sm);
  font-family: var(--font-body);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.gallery-grid__item:hover .gallery-grid__caption {
  opacity: 1;
}
```

Key changes:
- **12px radius** on gallery items — softer than current
- **Hover lift + zoom** — art feels alive, interactive
- **Teal-tinted gradient overlay** — caption background matches brand instead of generic black
- **Caption fade-in on hover** — cleaner presentation, art is the star until you hover

---

## 4. Homepage Layout

The current homepage is a basic stack: hero → events → artists → gallery. It reads like a portal. The redesign makes it feel like a **welcome** — storytelling, warmth, art-forward.

### Section-by-section breakdown

#### Section 1: Hero ("Welcome")
- **Eyebrow**: "Welcome to" in Caveat script, gold color
- **Title**: "Creative Arts Association of Lakewood Ranch" in Playfair Display
- **Subtitle**: Warm one-liner about the community
- **Two CTAs**: "Meet Our Artists" (primary/teal) + "View Gallery" (outline)
- **Background**: Teal gradient with hero image at low opacity (if set via CMS)
- **Bottom**: Wave divider flowing into sand background

#### Section 2: Mission Strip (NEW)
- Narrow full-width band on `--color-driftwood` background
- Three words centered in large Playfair Display: **Create. Connect. Inspire.**
- Each word separated by a coral dot (`·`)
- Below: 1-2 sentence intro from `home.introText` in body font
- No cards, no images — just a typographic moment that sets the tone

```html
<section class="section mission-strip">
  <div class="container">
    <p class="mission-strip__words">
      Create <span class="mission-strip__dot">·</span>
      Connect <span class="mission-strip__dot">·</span>
      Inspire
    </p>
    <p class="mission-strip__text">{home.introText}</p>
  </div>
</section>
```

```css
.mission-strip {
  background-color: var(--color-driftwood);
  text-align: center;
  padding-block: var(--space-lg);
}

.mission-strip__words {
  font-family: var(--font-heading);
  font-size: var(--font-size-3xl);
  color: var(--color-teal-dark);
  letter-spacing: 0.04em;
  margin-bottom: var(--space-sm);
}

.mission-strip__dot {
  color: var(--color-coral);
  margin-inline: 0.3em;
}

.mission-strip__text {
  font-size: var(--font-size-lg);
  color: var(--color-drift);
  max-width: 700px;
  margin-inline: auto;
  line-height: 1.7;
}
```

#### Section 3: Featured Art (REDESIGNED)
- **Background**: `--color-sand` (default)
- **Section heading**: "Recent Works" with coral underline
- Masonry grid of 6 featured gallery images (already fetched via `getFeaturedGallery(6)`)
- Use the existing `GalleryGrid` component — the CSS changes above make it feel more immersive
- **Below grid**: "View Full Gallery" pill button (outline variant)

#### Section 4: Upcoming Events
- **Background**: `--color-seafoam`
- **Section heading**: "Upcoming Shows"
- 3-across card grid (same as current)
- Event cards with the new warm styling (rounded, hover lift)
- **Below grid**: "All Events" pill button

#### Section 5: Meet Our Artists
- **Background**: `--color-sand` (default)
- **Section heading**: "Our Artists"
- 4-across card grid
- Artist cards with new warm styling
- **Below grid**: "Meet Everyone" pill button

#### Section 6: Join/CTA Strip (NEW)
- Full-width teal gradient background (same as hero)
- Centered text: script eyebrow "Come create with us" in gold Caveat
- Heading: "Join Our Creative Community" in white Playfair Display
- Brief welcoming text about what membership means
- Two CTAs: "Get in Touch" (coral button) + "Learn More" (outline white)

```html
<section class="section cta-strip">
  <div class="container cta-strip__content">
    <span class="cta-strip__eyebrow">Come create with us</span>
    <h2 class="cta-strip__title">Join Our Creative Community</h2>
    <p class="cta-strip__text">
      Whether you're a seasoned artist or just picking up a brush, there's
      a place for you at CAALR. We meet, create, and inspire together.
    </p>
    <div class="cta-strip__actions">
      <a href="/about/" class="btn btn--secondary">Get in Touch</a>
      <a href="/about/" class="btn btn--outline-white">Learn More</a>
    </div>
  </div>
</section>
```

```css
.cta-strip {
  background: linear-gradient(135deg, var(--color-teal-deeper) 0%, var(--color-teal-dark) 50%, var(--color-teal) 100%);
  color: white;
  text-align: center;
  padding-block: var(--space-xl);
}

.cta-strip__content {
  max-width: 650px;
  margin-inline: auto;
}

.cta-strip__eyebrow {
  font-family: var(--font-script);
  font-size: var(--font-size-script);
  color: var(--color-gold);
  display: block;
  margin-bottom: var(--space-xs);
}

.cta-strip__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-3xl);
  color: white;
  margin-bottom: var(--space-sm);
}

.cta-strip__text {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-md);
  line-height: 1.7;
}

.cta-strip__actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.btn--outline-white {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.btn--outline-white:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  color: white;
}
```

### Homepage section order (final)

| # | Section | Background | Purpose |
|---|---------|------------|---------|
| 1 | Hero | Teal gradient | Welcome, identify, primary CTAs |
| 2 | Mission Strip | `--color-driftwood` | Set the tone, tagline |
| 3 | Featured Art | `--color-sand` | Art-forward, showcase work |
| 4 | Upcoming Events | `--color-seafoam` | Drive attendance |
| 5 | Our Artists | `--color-sand` | Introduce the community |
| 6 | Join CTA Strip | Teal gradient | Convert visitors, welcoming close |

The alternating warm-cream / seafoam / teal creates a natural visual rhythm and prevents the "wall of same-background" feeling.

---

## 5. Artsy Utility Classes

New utility classes added to `global.css` to support the artsy design language:

```css
/* Decorative dot separator (used between inline items) */
.dot-sep::before {
  content: '·';
  color: var(--color-coral);
  margin-inline: 0.4em;
}

/* Script font utility */
.font-script {
  font-family: var(--font-script);
}

/* Gold accent text */
.text-gold {
  color: var(--color-gold);
}

/* Coral accent text */
.text-coral {
  color: var(--color-coral);
}

/* Teal accent text */
.text-teal {
  color: var(--color-teal-dark);
}

/* Warm section divider */
.wave-divider {
  height: 60px;
  background: var(--color-sand);
  clip-path: ellipse(55% 100% at 50% 100%);
}
```

---

## 6. Open Question Decisions

Answers to the open questions from the intent document:

| Question | Decision | Rationale |
|----------|----------|-----------|
| Pop color | **Coral `#FF6F61`** | Warmer and more Florida than hot pink. Complementary to teal. Friendly, not aggressive. |
| Script font | **Caveat** | Most legible of the options. Natural hand-written feel without being cutesy. |
| Artsy collage approach | **Subtle** — hover lifts, rounded corners, wave dividers, masonry gallery. No rotations or overlapping elements. | The audience is older; too much visual chaos hurts usability. Keep it warm and soft, not chaotic. Rotated cards and overlapping elements also create mobile layout headaches. |
| Logo approach | **Use at current size with `<img>` tag, constrained to 48px height via CSS.** If the JPEG looks pixelated at 48px, re-export from original source or use `image-rendering: auto` and test. AI upscaling is a fallback if source is lost. | The logo only appears at nav-bar size. 48px height from a 145px-tall source means we're always downscaling, so the JPEG is sufficient. |
| Mission tagline | **"Create. Connect. Inspire."** | Clean, memorable, three-word rhythm. "Create" is the core identity, "Connect" is the community aspect, "Inspire" is the aspiration. |

---

## 7. Phased Implementation Plan

### Phase 1: Foundation (tokens + fonts + layout scaffolding)
**Files:** `tokens.css`, `BaseLayout.astro`

1. Replace all color tokens in `tokens.css` with the new palette (keeping semantic variable names intact so every component gets the new colors immediately)
2. Add `--font-script` and `--font-size-script` tokens
3. Update font-family tokens to Playfair Display, Nunito, Caveat
4. Update `--radius-card` to `16px`, update shadow tokens
5. Update Google Fonts `<link>` in `BaseLayout.astro`

**Verification:** Build the site. Every page should already look different — new colors, new fonts, rounder cards. Nothing should be broken because we preserved the semantic variable names.

### Phase 2: Navigation + Footer
**Files:** `Header.astro`, `Footer.astro`

1. Restyle `Header.astro`: white background, teal bottom border, lowercase nav, logo image slot, seafoam hover states, teal active pill
2. Add the CAA logo `<img>` to the header alongside the text mark
3. Restyle `Footer.astro`: deep teal gradient, gold accents, script font headings, wave divider at top, coral social hover
4. Update mobile nav: white background, teal accents (instead of dark green dropdown)

**Verification:** Check header/footer on desktop and mobile. Verify sticky header shadow. Check contrast on all nav link states.

### Phase 3: Hero + Section Headings
**Files:** `Hero.astro`, `SectionHeading.astro`, `global.css`

1. Add teal gradient, wave divider, and `hero--home` variant to `Hero.astro`
2. Add `eyebrow` prop to Hero for the Caveat script text
3. Add `cta-group` support (array of CTAs instead of single)
4. Add coral underline `::after` to `SectionHeading` component
5. Add utility classes to `global.css`

**Verification:** Check hero on homepage and subpages (compact variant). Verify wave divider renders cleanly at all viewport widths.

### Phase 4: Cards + Buttons + Badges
**Files:** `global.css`, `ArtistCard.astro`, `EventCard.astro`

1. Update `.card` styles: 16px radius, teal-tinted shadow, hover lift + image zoom
2. Update `.btn` styles: pill shape, colored shadows, hover lift, new secondary (coral) and outline variants
3. Update `.badge` styles: pill shape, seafoam default, gold-light for upcoming
4. Touch up ArtistCard and EventCard component styles if needed (most changes flow through global `.card` class)

**Verification:** Check all card types across pages. Verify hover animations are smooth. Test buttons in all variants.

### Phase 5: Homepage Redesign
**Files:** `src/pages/index.astro`

1. Update Hero call: add eyebrow "Welcome to", add second CTA ("View Gallery"), use `hero--home` class
2. Add Mission Strip section after hero
3. Reorder sections: art → events → artists (art first = more visual impact)
4. Add Join CTA Strip section before footer
5. Adjust section backgrounds for the alternating rhythm

**Verification:** Full homepage review on desktop and mobile. Check section flow and visual rhythm. Verify all CTA links work.

### Phase 6: Gallery Enhancement
**Files:** `GalleryGrid.astro`

1. Update gallery item styles: 12px radius, teal-tinted shadows, hover lift
2. Add caption fade-in on hover (teal gradient overlay)
3. Update lightbox to use teal-deeper backdrop tint instead of pure black

**Verification:** Test gallery page and homepage gallery preview. Verify lightbox still works. Test on mobile (hover effects should degrade gracefully).

### Phase 7: Polish + Accessibility Audit
**Files:** all modified files

1. Run Lighthouse accessibility audit — target 90+
2. Verify all text/background combinations meet WCAG AA (4.5:1 body, 3:1 large)
3. Test focus ring visibility (gold `--color-focus`) on all interactive elements
4. Verify mobile responsive behavior at 320px, 768px, 1024px, 1440px
5. Test with system dark mode (ensure no unintended overrides — this site does not have dark mode)
6. Cross-browser check: Chrome, Firefox, Safari
7. Verify no content/CMS/collection changes leaked in

**Verification:** Lighthouse report screenshot. Manual contrast spot-checks. Mobile screenshot comparison.

---

## 8. Files Modified (complete list)

| File | Changes |
|------|---------|
| `src/styles/tokens.css` | Complete color + typography + card token overhaul |
| `src/styles/global.css` | Updated card, button, badge, section-heading styles; new utility classes; new CTA strip + mission strip styles |
| `src/layouts/BaseLayout.astro` | Updated Google Fonts link (3 families) |
| `src/components/Header.astro` | White bg, teal border, lowercase nav, logo image, new hover/active states, updated mobile menu |
| `src/components/Footer.astro` | Deep teal gradient, gold accents, script headings, wave divider, coral social hover |
| `src/components/Hero.astro` | Teal gradient, wave divider, eyebrow prop, CTA group, home variant |
| `src/components/SectionHeading.astro` | Coral underline `::after` (CSS only) |
| `src/components/ArtistCard.astro` | Minor style adjustments (most via global `.card`) |
| `src/components/EventCard.astro` | Minor style adjustments (most via global `.card`) |
| `src/components/GalleryGrid.astro` | Rounded items, caption fade-in, teal shadows, updated lightbox |
| `src/pages/index.astro` | New section order, mission strip, CTA strip, hero eyebrow, dual CTAs |

**Not modified:** Content collections, CMS config, content `.md` files, Astro config, `astro.config.mjs`, any page other than `index.astro`.

---

## 9. Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Coral/teal contrast fails on some combo | Medium | Pre-calculated all pairings in Section 1 table. Coral used only as accent (large text or decorative), never for body text on white. |
| Wave divider `clip-path` glitches on some browsers | Low | `clip-path: ellipse()` has 97%+ browser support. Fallback: the wave is decorative, so if it doesn't render the site still works — just a flat edge. |
| Font load causes layout shift | Low | Using `display=swap` in Google Fonts link. Fallback stacks are close in metrics (Georgia for Playfair, system sans for Nunito). |
| Card hover animations janky on low-end devices | Low | Using only `transform` and `box-shadow` — both are GPU-composited. No layout-triggering properties animated. |
| Pill buttons look odd at certain text lengths | Low | Pill radius (`50px`) scales well with padding. Test with longest CTA text ("Meet Our Artists"). |
| Older audience finds the design too "young" | Low | We're going warm and organic, not trendy/edgy. No parallax, no animations beyond gentle hovers, no dark mode, generous font sizes. The vibe is "friendly art studio" not "startup landing page." |

---

## 10. What This Sprint Does NOT Do

- No dark mode
- No animation library (all CSS transitions)
- No new pages or routes
- No content changes
- No CMS schema changes
- No JavaScript changes (except mobile menu if needed)
- No image optimization pipeline (separate concern)
- No logo recreation/upscaling (uses existing JPEG)
- No print stylesheet

---

## 11. Definition of Done

1. All 7 phases implemented and individually verified
2. Lighthouse accessibility score >= 90 on homepage and one subpage
3. All text/background combos pass WCAG AA contrast (verified with browser devtools or axe)
4. Site builds without errors (`npm run build`)
5. Mobile responsive at 320px, 768px, 1024px, 1440px viewports
6. Visual side-by-side with original caalr.com confirms "soul" is preserved (warm, welcoming, artsy)
7. User + mom review and approve the feel
