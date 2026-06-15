import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

// Robustly read a markdown page's frontmatter (handles folded `>` / literal `|`
// scalars and lists). Single source of truth so pages don't hand-roll parsers.
export function loadFrontmatter(path: string): Record<string, any> {
  try {
    const m = readFileSync(path, 'utf-8').match(/^---\n([\s\S]*?)\n---/);
    return m ? ((yaml.load(m[1]) as Record<string, any>) ?? {}) : {};
  } catch {
    return {};
  }
}

// Split a folded/literal markdown body into paragraphs (blank-line separated).
export function paragraphs(text: unknown): string[] {
  return String(text ?? '').split(/\n{1,}/).map((p) => p.trim()).filter(Boolean);
}

export async function getActiveArtists() {
  const artists = await getCollection('artists');
  return artists
    .filter((a) => a.data.status === 'active')
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export async function getAllArtists() {
  const artists = await getCollection('artists');
  return artists.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

export async function getUpcomingEvents() {
  const events = await getCollection('events');
  const now = new Date();
  return events
    .filter((e) => new Date(e.data.startDate) >= now)
    .sort((a, b) => new Date(a.data.startDate).getTime() - new Date(b.data.startDate).getTime());
}

export async function getPastEvents() {
  const events = await getCollection('events');
  const now = new Date();
  return events
    .filter((e) => new Date(e.data.startDate) < now)
    .sort((a, b) => new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime());
}

export async function getAllEvents() {
  const events = await getCollection('events');
  return events.sort((a, b) => new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime());
}

export async function getGalleryItems() {
  const gallery = await getCollection('gallery');
  return gallery.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return (b.data.year ?? 0) - (a.data.year ?? 0);
  });
}

export async function getFeaturedGallery(limit = 6) {
  const gallery = await getCollection('gallery');
  return gallery
    .filter((g) => g.data.featured)
    .sort((a, b) => (b.data.year ?? 0) - (a.data.year ?? 0))
    .slice(0, limit);
}

// Returns a random selection of gallery items. Runs at build time, so the
// set reshuffles on each publish. Skips items whose image is missing a path.
export async function getRandomGallery(limit = 8) {
  const gallery = (await getCollection('gallery')).filter((g) => g.data.image);
  const arr = [...gallery];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, limit);
}

export async function getNewsItems() {
  const news = await getCollection('news');
  return news.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function isUpcoming(date: Date): boolean {
  return new Date(date) >= new Date();
}
