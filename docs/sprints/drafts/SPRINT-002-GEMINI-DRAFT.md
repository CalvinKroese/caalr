# Sprint 002 Design Draft: The Studio Wall — A Contrarian Art-Forward Direction

**Role:** Contrarian Drafter — this draft deliberately diverges from what a typical designer would propose.

---

## The Problem With the "Safe" Direction

The INTENT document is already converging on a predictable Florida-artsy answer:
teal + coral + bright green + Caveat script + rounded cards + subtle hover animations.
That's the design equivalent of buying art at a hotel lobby. It's pretty. It's tasteful. It communicates nothing.

A real community art group doesn't feel like a boutique resort. It feels like walking into someone's studio — worn cork boards covered in pinned sketches, thick art books stacked crooked, paint tubes without their caps, strong afternoon light through jalousie windows, the smell of turpentine and coffee.

**This draft proposes: The Studio Wall.** Every design decision serves the metaphor of a working artist's studio — textured, analog, a little chaotic, gloriously human.

---

## Palette: Painter's Pigments, Not Beach House

Reject the safe Florida palette (teal/coral/bright green). Real Florida artists work in oils, acrylics, and watercolor — their colors come from pigment names, not Pantone swatches.

```css
:root {
  /* Base surfaces — aged canvas and hot press paper */
  --color-canvas:       #FAF3E0;  /* linen canvas — the page itself */
  --color-paper:        #FDF8EE;  /* hot press paper — cards/surfaces */
  --color-canvas-dark:  #F0E6C8;  /* aged section alt background */

  /* Ink and shadow — warm, never cold gray */
  --color-ink:          #2C1810;  /* burnt umber ink — body text */
  --color-ink-soft:     #6B4E3D;  /* sepia — muted/secondary text */

  /* Pigments — the bold palette */
  --color-cobalt:       #1D4E8F;  /* cobalt blue — primary actions, links */
  --color-cobalt-deep:  #0F2B4F;  /* prussian blue — dark surfaces, header */
  --color-magenta:      #C41E5A;  /* quinacridone magenta — the pop color */
  --color-gold:         #D4891A;  /* raw sienna / yellow ochre */
  --color-gold-light:   #F5C96A;  /* Naples yellow — light accent */
  --color-sage:         #556B55;  /* sap green — supporting accent */

  /* Functional */
  --color-focus:        #C41E5A;  /* magenta focus ring — visible, artsy */
  --color-border:       rgba(44, 24, 16, 0.15);  /* warm, not gray */

  /* Shadows — warm tinted drop shadows, not neutral gray */
  --shadow-warm:        4px 4px 0 rgba(44, 24, 16, 0.12);
  --shadow-warm-lg:     6px 8px 0 rgba(44, 24, 16, 0.16);
  --shadow-pin:         2px 4px 12px rgba(44, 24, 16, 0.3);
}
```

**Why this works:** Cobalt blue + quinacridone magenta + raw sienna is literally the three-pigment foundation of classical oil painting. It's unexpected for a website, completely expected for an art group. The linen/paper background instead of white is the single biggest upgrade — it reads immediately as "art world."

**Contrast verification:**
- `--color-ink` (#2C1810) on `--color-canvas` (#FAF3E0): 14.5:1 — exceeds WCAG AAA
- `--color-cobalt` (#1D4E8F) on `--color-canvas` (#FAF3E0): 7.8:1 — exceeds WCAG AA
- `--color-magenta` (#C41E5A) on white (#FDF8EE): 5.1:1 — passes WCAG AA (large text: 3:1 easily met)
- `--color-gold` (#D4891A) on `--color-cobalt-deep` (#0F2B4F): 4.9:1 — passes AA

---

## Typography: The Art Poster Stack

Typical designers reach for Caveat (pleasant, safe, predictable). Reject it.

### Proposed font stack:

| Role | Font | Why |
|------|------|-----|
| **Display / Hero** | `Abril Fatface` | Ultra-high contrast strokes — looks like letterpress or woodblock print. Zero hotel-lobby energy. |
| **Handwritten accent** | `Reenie Beanie` | Raw, scrawled, looks like notes on a sketch. Not polished calligraphy — actual handwriting. |
| **Body** | `Libre Baskerville` | Classical fine-arts book typography. Elegant, readable, signals "serious about art" without being stiff. |

```css
/* Google Fonts import — add to BaseLayout.astro <head> */
@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Reenie+Beanie&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --font-display:    'Abril Fatface', Georgia, serif;
  --font-script:     'Reenie Beanie', cursive;
  --font-body:       'Libre Baskerville', Georgia, serif;

  /* Type scale — generous for older audience, classical proportions */
  --font-size-base:   1.125rem;   /* 18px */
  --font-size-sm:     0.9375rem;  /* 15px — metadata only */
  --font-size-lg:     1.25rem;
  --font-size-xl:     1.5rem;
  --font-size-2xl:    2rem;
  --font-size-3xl:    2.75rem;
  --font-size-4xl:    3.5rem;
  --font-size-5xl:    clamp(3rem, 8vw, 5.5rem);  /* hero display size */
  --line-height-base: 1.75;  /* Baskerville needs a bit more air */
  --line-height-heading: 1.15;
}
```

**Usage rules:**
- `Abril Fatface`: page titles, hero heading, section display numbers. Never body copy.
- `Reenie Beanie`: section labels ("our artists", "upcoming shows"), pull quotes, tagline. Size 1.4–1.8× the surrounding text so it registers as a different voice.
- `Libre Baskerville`: everything else. Body, nav, card titles, buttons, captions.

---

## Key Design 1: Canvas Texture Background

No stock watercolor JPG needed. Pure CSS:

```css
/* In global.css — applied to body */
body {
  background-color: var(--color-canvas);
  background-image:
    /* Fine canvas weave via repeating-linear-gradient */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(44, 24, 16, 0.018) 2px,
      rgba(44, 24, 16, 0.018) 3px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(44, 24, 16, 0.018) 2px,
      rgba(44, 24, 16, 0.018) 3px
    );
}

/* Watercolor wash effect on section--alt backgrounds */
.section--alt {
  background-color: var(--color-canvas-dark);
  background-image:
    radial-gradient(ellipse 80% 60% at 15% 40%, rgba(212, 137, 26, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 85% 70%, rgba(29, 78, 143, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 100% 40% at 50% 0%,  rgba(196, 30, 90, 0.04) 0%, transparent 60%);
}
```

This creates a subtle material texture with zero performance cost and no external assets.

---

## Key Design 2: Torn Paper Section Dividers

Instead of flat horizontal rules between sections, use SVG clip-paths to create a ragged torn-paper edge at the bottom of every colored section.

```css
/* Attach to any section that needs a torn bottom edge */
.section--torn-bottom {
  position: relative;
  padding-bottom: calc(var(--space-section) + 3rem);
}

.section--torn-bottom::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3rem;
  background: var(--color-canvas);  /* the color of the NEXT section */
  clip-path: polygon(
    0% 100%,
     3% 20%,
     7% 80%,
    12%  5%,
    17% 65%,
    22% 25%,
    28% 90%,
    33% 15%,
    38% 70%,
    43% 30%,
    48% 85%,
    53% 10%,
    58% 60%,
    63% 20%,
    68% 75%,
    73% 35%,
    78% 80%,
    83% 15%,
    88% 55%,
    93% 25%,
    97% 70%,
   100% 40%,
   100% 100%
  );
}
```

This is zero-JavaScript, zero-image, pure CSS. It immediately makes every section break feel hand-torn rather than machine-cut.

---

## Key Design 3: Corkboard Artist Cards

This is the single biggest departure from typical design. Artist cards look like they've been pinned to a corkboard — slight random tilt, thick white border like a printed photo, a "pushpin" pseudo-element, warm drop shadow.

```css
/* In ArtistCard.astro <style> — replace current .card styling */

.artist-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--color-paper);
  padding: 0.75rem 0.75rem 1.25rem;  /* thick bottom like a photo print */
  border: 1px solid rgba(44, 24, 16, 0.08);
  box-shadow: var(--shadow-pin);
  transform: rotate(var(--card-tilt, -1.2deg));
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease;
  position: relative;
}

.artist-card:hover {
  transform: rotate(0deg) scale(1.04);
  box-shadow: 8px 12px 24px rgba(44, 24, 16, 0.25);
  z-index: 2;
}

/* Pushpin at the top */
.artist-card::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #E84040 0%, #8B0000 60%, #3D0000 100%);
  box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.3);
  z-index: 1;
}

/* Assign alternating tilts in the grid parent */
.artists-grid .artist-card:nth-child(3n+1) { --card-tilt: -1.8deg; }
.artists-grid .artist-card:nth-child(3n+2) { --card-tilt: 1.2deg; }
.artists-grid .artist-card:nth-child(3n+3) { --card-tilt: -0.6deg; }
.artists-grid .artist-card:nth-child(4n+4) { --card-tilt: 2.1deg; }
```

The grid itself should not use a uniform gap — use a slightly uneven layout:

```css
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem);
  padding: 2rem 1rem;  /* extra space for tilted cards to breathe */
}
```

---

## Key Design 4: Gallery as Studio Wall

The current masonry grid is fine technically but visually neutral. The contrarian version: images look like they're pinned or taped to a wall, with thick white "print" mats, subtle rotations, and mixed scales.

```css
/* In GalleryGrid.astro — replace gallery-grid styles */

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  padding: 2rem;
  background:
    /* Subtle horizontal wood grain for the "wall" */
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 28px,
      rgba(44, 24, 16, 0.015) 28px,
      rgba(44, 24, 16, 0.015) 30px
    ),
    #EDE3D4;  /* warm gallery wall color */
}

.gallery-grid__item {
  flex: 1 1 auto;
  min-width: 180px;
  max-width: 380px;
  margin: 1.25rem;
  padding: 0.75rem 0.75rem 2rem;  /* photo-print mat */
  background: white;
  box-shadow: 3px 5px 16px rgba(44, 24, 16, 0.25);
  transform: rotate(var(--img-tilt, 0deg));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  cursor: pointer;
}

.gallery-grid__item:hover {
  transform: rotate(0deg) scale(1.06);
  box-shadow: 6px 10px 30px rgba(44, 24, 16, 0.4);
  z-index: 5;
}

.gallery-grid__item:nth-child(5n+1) { --img-tilt: -2.1deg; }
.gallery-grid__item:nth-child(5n+2) { --img-tilt:  1.4deg; }
.gallery-grid__item:nth-child(5n+3) { --img-tilt: -0.8deg; }
.gallery-grid__item:nth-child(5n+4) { --img-tilt:  2.5deg; }
.gallery-grid__item:nth-child(5n+5) { --img-tilt: -1.7deg; }

/* Make every ~4th image landscape-wide to break the rhythm */
.gallery-grid__item:nth-child(4n) {
  flex-grow: 2;
  max-width: 520px;
}
```

---

## Key Design 5: Header — Stamp, Not Banner

Instead of a rectangular sticky bar, the header works like a rubber stamp — a dark rectangular mark that defines the top, with the logo as a large overprinted "CAA" in the signature red/black.

```css
/* In Header.astro */
.site-header {
  background-color: var(--color-cobalt-deep);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  /* Brushstroke bottom edge via box-shadow + clip-path trick */
  box-shadow:
    0 3px 0 rgba(212, 137, 26, 0.6),   /* gold underline stripe */
    0 6px 20px rgba(15, 43, 79, 0.35);
}

/* Logo area — large and prominent, not squeezed */
.site-header__logo-image {
  height: 52px;   /* was too small before */
  width: auto;
  filter: brightness(0) invert(1);  /* make the JPG white-on-transparent */
}

/* Nav links — lowercase, Libre Baskerville, painted underline on hover */
.site-nav__link {
  font-family: var(--font-body);
  font-size: 1rem;
  text-transform: lowercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.4rem 0.6rem;
  position: relative;
  transition: color 0.15s;
}

/* Brushstroke hover underline — SVG inline as data URI */
.site-nav__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8'%3E%3Cpath d='M2 6 Q10 2 20 5 Q35 8 50 4 Q65 1 80 5 Q90 7 98 3' stroke='%23D4891A' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") center/100% 100% no-repeat;
  opacity: 0;
  transform: scaleX(0.6);
  transition: opacity 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.site-nav__link:hover {
  color: white;
}

.site-nav__link:hover::after,
.site-nav__link--active::after {
  opacity: 1;
  transform: scaleX(1);
}

.site-nav__link--active {
  color: var(--color-gold-light);
}
```

---

## Key Design 6: Hero — The Big Statement

The typical version: centered text on a photo with an overlay. The contrarian version: a typographic hero with no photo, using oversized `Abril Fatface` text, where "Welcome" is written in `Reenie Beanie` at a 30px size in cobalt crossing over the display text.

```css
/* Hero — typographic, not photographic */
.hero {
  background-color: var(--color-cobalt-deep);
  color: white;
  min-height: 55vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  overflow: hidden;
  position: relative;
  padding-block: 0;  /* let the grid handle spacing */
}

/* Giant decorative background letter — a single "A" for Art */
.hero::before {
  content: 'A';
  position: absolute;
  font-family: var(--font-display);
  font-size: clamp(20rem, 40vw, 38rem);
  color: rgba(255, 255, 255, 0.04);
  line-height: 1;
  right: -0.1em;
  bottom: -0.15em;
  pointer-events: none;
  user-select: none;
}

/* Paint blobs in hero corners */
.hero::after {
  content: '';
  position: absolute;
  top: -4rem;
  left: -4rem;
  width: 28rem;
  height: 28rem;
  border-radius: 40% 60% 70% 30% / 30% 50% 50% 70%;
  background: radial-gradient(ellipse, rgba(196, 30, 90, 0.25) 0%, transparent 65%);
  pointer-events: none;
}

.hero__text-block {
  padding: var(--space-xl) var(--content-padding) var(--space-xl) clamp(1.5rem, 5vw, 4rem);
  z-index: 1;
}

/* "Welcome" in Reenie Beanie — appears ABOVE the main headline */
.hero__welcome {
  font-family: var(--font-script);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: var(--color-gold-light);
  display: block;
  margin-bottom: -0.5rem;  /* overlaps with headline for layered effect */
  transform: rotate(-2deg);
  transform-origin: left;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 6vw, 5rem);
  line-height: 1.05;
  color: white;
  margin-bottom: var(--space-md);
}

/* Right column: collage of photos at angles — not a single hero image */
.hero__collage {
  position: relative;
  height: 100%;
  min-height: 55vh;
  overflow: hidden;
}

.hero__collage-img {
  position: absolute;
  object-fit: cover;
  box-shadow: 4px 6px 20px rgba(0, 0, 0, 0.4);
}

/* Stack 3 images in the right column at different positions/rotations */
.hero__collage-img:nth-child(1) { width: 60%; top: 10%; left: 15%; rotate: 3deg; }
.hero__collage-img:nth-child(2) { width: 55%; top: 30%; left: 30%; rotate: -4deg; z-index: 2; }
.hero__collage-img:nth-child(3) { width: 50%; top: 50%; left: 5%;  rotate: 2deg; z-index: 1; }

/* Mobile: stack vertically */
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero__collage { min-height: 45vw; }
}
```

---

## Key Design 7: Section Headings — Layered Type

The typical version: centered h2 with a subtitle. The contrarian: left-aligned with a massive low-opacity section number behind, and the title split across two type styles.

```css
/* In SectionHeading.astro — add a count prop or CSS counter */

.section-heading {
  text-align: left;
  margin-bottom: var(--space-lg);
  position: relative;
  padding-left: 0;
}

/* Big background number via CSS counter or data-attribute */
.section-heading[data-num]::before {
  content: attr(data-num);
  font-family: var(--font-display);
  font-size: clamp(6rem, 15vw, 12rem);
  color: rgba(29, 78, 143, 0.07);  /* cobalt, very faint */
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
  pointer-events: none;
  z-index: 0;
}

/* The "label" in Reenie Beanie — appears first, smaller, angled */
.section-heading__label {
  font-family: var(--font-script);
  font-size: 1.4rem;
  color: var(--color-magenta);
  display: block;
  transform: rotate(-1.5deg);
  transform-origin: left;
  margin-bottom: 0.25rem;
  position: relative;
  z-index: 1;
}

/* Main title in Abril Fatface — bold, left-aligned, no underline */
.section-heading__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  color: var(--color-ink);
  position: relative;
  z-index: 1;
  margin-bottom: 0;
}

/* Subtitle in normal body text */
.section-heading__subtitle {
  font-family: var(--font-body);
  font-style: italic;
  font-size: var(--font-size-base);
  color: var(--color-ink-soft);
  margin-top: var(--space-xs);
  max-width: 55ch;
  position: relative;
  z-index: 1;
}
```

In the Astro component, add a `label` and `num` prop:

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  label?: string;   // e.g. "our members"
  num?: string;     // e.g. "01"
}
const { title, subtitle, label, num } = Astro.props;
---
<div class="section-heading" data-num={num}>
  {label && <span class="section-heading__label">{label}</span>}
  <h2 class="section-heading__title">{title}</h2>
  {subtitle && <p class="section-heading__subtitle">{subtitle}</p>}
</div>
```

---

## Key Design 8: Footer — Palette of Colors

The typical direction: warm dark background matching the header. The contrarian: the footer is `--color-ink` (near-black warm brown) with paint-blob accents that look like a palette being cleaned, and the columns of text float on this dark surface like labels on paint tubes.

```css
.site-footer {
  background-color: var(--color-ink);
  color: rgba(253, 248, 238, 0.82);
  position: relative;
  overflow: hidden;
  margin-top: 0;  /* torn paper divider handles the transition above */
}

/* Paint blobs decorating the footer — cobalt, magenta, gold */
.site-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle 200px at 5% 80%,   rgba(29, 78, 143, 0.25) 0%, transparent 70%),
    radial-gradient(circle 160px at 90% 20%,  rgba(196, 30, 90, 0.2) 0%, transparent 70%),
    radial-gradient(circle 240px at 55% 110%, rgba(212, 137, 26, 0.15) 0%, transparent 60%),
    radial-gradient(circle 100px at 20% 10%,  rgba(85, 107, 85, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.site-footer__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: var(--space-lg);
  padding-block: var(--space-xl);
}

.site-footer__heading {
  font-family: var(--font-script);  /* Reenie Beanie — handwritten labels */
  font-size: 1.6rem;
  color: var(--color-gold-light);
  transform: rotate(-1deg);
  display: inline-block;
  margin-bottom: var(--space-sm);
}

.site-footer__text {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: rgba(253, 248, 238, 0.75);
}
```

---

## Key Design 9: Scroll Reveal — Ink Bleed, Not Slide

The typical designer uses `translate-y` fade-in. The contrarian: cards and sections reveal with an ink-bleed clip-path animation, growing from a point like ink soaking into paper.

```css
/* Add to global.css */
@media (prefers-reduced-motion: no-preference) {

  /* Items that reveal via clip-path circle expand */
  .reveal-ink {
    clip-path: circle(0% at 50% 50%);
    animation: inkBleed 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-play-state: paused;
  }

  .reveal-ink.is-visible {
    animation-play-state: running;
  }

  @keyframes inkBleed {
    to { clip-path: circle(150% at 50% 50%); }
  }

  /* Cards drop in from above like being pinned */
  .reveal-pin {
    opacity: 0;
    transform: translateY(-20px) rotate(var(--card-tilt, 0deg)) scale(0.95);
    transition:
      opacity 0.4s ease,
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .reveal-pin.is-visible {
    opacity: 1;
    transform: translateY(0) rotate(var(--card-tilt, 0deg)) scale(1);
  }
}
```

```javascript
// Intersection observer — add to BaseLayout.astro <script>
const revealEls = document.querySelectorAll('.reveal-ink, .reveal-pin');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.15 }
);
revealEls.forEach(el => observer.observe(el));
```

---

## Key Design 10: Event Cards — Torn Ticket Stubs

Instead of the current plain card, events look like vintage ticket stubs — a perforated left edge, date as a large Abril Fatface number, and a torn right edge.

```css
/* In EventCard.astro */
.event-card {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  align-items: stretch;
  background: var(--color-paper);
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-warm-lg);
  border-radius: 0 4px 4px 0;
  overflow: visible;
  position: relative;
}

/* Left stub: colored date block */
.event-card__date-block {
  background: var(--color-cobalt);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  border-radius: 4px 0 0 4px;
}

.event-card__day {
  font-family: var(--font-display);
  font-size: 2.2rem;
  line-height: 1;
  display: block;
}

.event-card__month {
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

/* Perforation dots between stub and body */
.event-card::after {
  content: '';
  position: absolute;
  left: 5.5rem;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 3px dotted rgba(44, 24, 16, 0.2);
  pointer-events: none;
}
```

---

## Implementation Plan

### Phase 1 — Tokens and Base (tokens.css + global.css)
1. Replace entire `tokens.css` with new pigment palette + font variables
2. Update `global.css` body background (canvas texture via CSS)
3. Add `.section--torn-bottom` utility to global.css
4. Add `.reveal-ink` / `.reveal-pin` scroll animation utilities
5. Update `.card` base styles (warm shadow, paper background)
6. Update `.badge` (cobalt on canvas-dark)
7. Update `.btn--primary` (cobalt) and `.btn--secondary` (magenta)

### Phase 2 — Layout Components (Header + Footer)
8. `Header.astro`: Add Google Fonts import to BaseLayout head (note: modify BaseLayout, not Header)
9. `Header.astro`: Cobalt-deep background, gold underline stripe, brushstroke nav hover, lowercase nav
10. `Header.astro`: Display actual logo image (replace text placeholder)
11. `Footer.astro`: Dark ink background, paint blob pseudo-elements, Reenie Beanie headings

### Phase 3 — Hero and Section Headings
12. `Hero.astro`: Add `welcome` and `collage` props/slots; typographic hero with giant background "A"
13. `Hero.astro`: Right-column collage layout (3 stacked photos)
14. `SectionHeading.astro`: Add `label` and `num` props; layered type with background number

### Phase 4 — Cards
15. `ArtistCard.astro`: Corkboard style — photo-print padding, pushpin pseudo-element, tilt variable
16. `EventCard.astro`: Ticket stub layout — date block left column, perforation dots
17. `GalleryGrid.astro`: Studio wall layout — flex wrap with rotations, warm wall background

### Phase 5 — Homepage
18. `src/pages/index.astro`: Restructure hero to use new collage variant
19. `src/pages/index.astro`: Add `data-num` and `label` props to all SectionHeadings
20. `src/pages/index.astro`: Apply `reveal-pin` class to artist card grid items

### Phase 6 — Polish
21. Verify all contrast ratios (body text, link text, badge text)
22. Test mobile: torn edges, corkboard tilts, ticket stubs all need mobile audit
23. Test `prefers-reduced-motion: reduce` — all CSS animations must be gated
24. Check fallback for missing artist profile images (placeholder color from palette)

---

## Open Questions (Contrarian Framing)

1. **Rotations on mobile**: corkboard tilts at ±2° look great at 1200px, may feel cramped at 390px. Safest bet: reduce max tilt to ±1° on `max-width: 600px`.

2. **Libre Baskerville vs. user's older audience**: Serif body text is actually *better* for older readers in print-size ranges (18px+), but confirm with user before committing.

3. **Event card date block**: Requires the `EventCard` component to receive a pre-parsed `day`/`month` split — minor prop addition to the existing interface.

4. **Hero collage**: The index.astro hero would need to pass 3 images. If images aren't available, a fallback of colored blobs should be used rather than broken layouts.

5. **Logo treatment**: Current logo is a JPEG with a white background. It needs either CSS `mix-blend-mode: multiply` on the linen background (which will composite cleanly) or an SVG recreation to work on dark (header) backgrounds. The `filter: brightness(0) invert(1)` trick in the header CSS above works but loses the red swoosh color — consider using two logo variants.

---

## Why This Direction Wins

The INTENT direction risks producing a website that looks like it was designed for a Florida resort gift shop. Bold but accessible. Safe but not memorable.

The Studio Wall direction produces a website that looks like it was designed BY artists, FOR artists. The linen texture, the Abril Fatface headers, the pinned corkboard cards, the torn paper edges — none of these require more code than the safe direction. They just require conviction.

The audience (art-loving retirees in Florida) has seen beautiful things. They've been to museums, galleries, art fairs. They can tell the difference between a website someone made with a template and one made with intentionality. Give them the latter.
