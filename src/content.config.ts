import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** 四个分区共用的基础字段 */
const base = {
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({ ...base, cover: z.string().optional() }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object(base),
});

const lab = defineCollection({
  loader: glob({ base: './src/content/lab', pattern: '**/*.{md,mdx}' }),
  // hasDemo 只用来在列表页打标，真正的 demo 由文章内的 <DemoCanvas> 决定
  schema: z.object({ ...base, hasDemo: z.boolean().default(false) }),
});

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number(),
    role: z.string().optional(),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, notes, lab, works };
