// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkMermaid } from './src/lib/remark-mermaid.mjs';

/**
 * 站点绝对地址。影响 RSS 和 sitemap 里的链接，必须和线上实际地址一致。
 *
 * 自定义域名，zone 托管在 Cloudflare。
 * workers.dev 的地址（linners-note.ll1506670756.workers.dev）仍然可用，
 * 但 canonical / RSS / sitemap 一律以这里为准。
 */
export const SITE_URL = 'https://linner.top';

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
