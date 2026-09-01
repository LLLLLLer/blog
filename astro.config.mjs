// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkMermaid } from './src/lib/remark-mermaid.mjs';

// TODO: 换成真实域名（用户待补充）
export const SITE_URL = 'https://example.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwind()] },
  markdown: {
    remarkPlugins: [remarkMath, remarkMermaid],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
