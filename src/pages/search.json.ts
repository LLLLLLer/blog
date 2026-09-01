import type { APIRoute } from 'astro';
import { getAllWriting } from '../lib/content';

/** 搜索索引。只放标题/摘要/标签，不放正文——正文进索引会让这个文件迅速变几百 KB。 */
export const GET: APIRoute = async () => {
  const items = (await getAllWriting()).map(({ section, entry }) => ({
    section,
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description ?? '',
    tags: entry.data.tags,
    date: entry.data.pubDate.toISOString(),
  }));

  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
