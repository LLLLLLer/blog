import { defineCollection } from 'astro:content';
// z 从 astro/zod 导入：astro:content 的 z 再导出已废弃，Astro 8 会移除。
// 是同一个 zod 实例，行为不变。
import { z } from 'astro/zod';
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
    link: z.url().optional(),
    repo: z.url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, notes, lab, works };
