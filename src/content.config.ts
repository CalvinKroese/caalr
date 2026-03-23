import { defineCollection, z } from 'astro:content';

const artists = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    mediums: z.array(z.string()).default([]),
    shortBio: z.string().default(''),
    email: z.string().optional().default(''),
    website: z.string().optional().default(''),
    instagram: z.string().optional().default(''),
    facebook: z.string().optional().default(''),
    featuredImage: z.string(),
    photoIsTemp: z.boolean().default(false),
    galleryImages: z.array(z.object({
      src: z.string(),
      caption: z.string().optional().default(''),
    })).default([]),
    isBoardMember: z.boolean().default(false),
    boardRole: z.string().optional().default(''),
    status: z.enum(['active', 'alumni']).default('active'),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    venueName: z.string(),
    venueAddress: z.string().optional().default(''),
    featuredImage: z.string().optional().default(''),
    galleryImages: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    alt: z.string(),
    artistSlug: z.string().optional().default(''),
    year: z.number().optional(),
    featured: z.boolean().default(false),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sourceName: z.string().optional().default(''),
    sourceUrl: z.string().optional().default(''),
    featuredImage: z.string().optional().default(''),
    featured: z.boolean().default(false),
  }),
});

export const collections = { artists, events, gallery, news };
