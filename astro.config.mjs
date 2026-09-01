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
 * !! 首次部署后必须改这一行 !!
 * Workers 的免费域名是 <worker名>.<你的账号子域>.workers.dev，
 * 那个账号子域只有部署过一次才知道。第一次 wrangler deploy 完，
 * 终端会打印真实地址，把它填到这里再重新部署一次，RSS 和 sitemap 才是对的。
 * 以后换成自己的域名，同样改这一行。
 */
export const SITE_URL = 'https://linners-note.workers.dev';

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
