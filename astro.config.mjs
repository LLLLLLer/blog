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
 * 这是 Workers 的免费域名（<worker名>.<账号子域>.workers.dev）。
 * 以后换成自己的域名，改这一行然后重新部署即可。
 */
export const SITE_URL = 'https://linners-note.ll1506670756.workers.dev';

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
