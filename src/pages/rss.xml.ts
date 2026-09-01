import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getAllWriting } from '../lib/content';
import { SITE } from '../config';

export const GET: APIRoute = async (context) => {
  const items = await getAllWriting();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    // TODO: 用户选定候选后，这里的 /a/ 前缀换成根路径
    items: items.map(({ section, entry }) => ({
      title: entry.data.title,
      description: entry.data.description ?? '',
      pubDate: entry.data.pubDate,
      link: `/a/${section}/${entry.id}/`,
      categories: entry.data.tags,
    })),
    customData: `<language>zh-CN</language>`,
  });
};
