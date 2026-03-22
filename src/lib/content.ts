import { getCollection } from 'astro:content';

export async function getActiveArtists() {
  const artists = await getCollection('artists');
  return artists
    .filter((a) => a.data.status === 'active')
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder || a.data.name.localeCompare(b.data.name));
}

export async function getAllArtists() {
  const artists = await getCollection('artists');
  return artists.sort((a, b) => a.data.sortOrder - b.data.sortOrder || a.data.name.localeCompare(b.data.name));
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
