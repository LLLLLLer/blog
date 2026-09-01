import { getCollection, type CollectionEntry } from 'astro:content';

export type WritingSection = 'posts' | 'notes' | 'lab';
export type AnyEntry = CollectionEntry<'posts' | 'notes' | 'lab'>;

// dev 默认显示草稿；生产构建加 SHOW_DRAFTS=1 也可以显示，
// 用于拿真实构建产物做视觉评审（比 dev 模式稳，不依赖 Vite 客户端）
const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';

const visible = <T extends { data: { draft?: boolean } }>(entries: T[]) =>
  entries.filter((e) => showDrafts || !e.data.draft);

const byDateDesc = (a: AnyEntry, b: AnyEntry) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** 某个写作分区的全部条目，按时间倒序 */
export async function getSection(section: WritingSection) {
  return visible(await getCollection(section)).sort(byDateDesc);
}

/** 三个写作分区合并，用于首页「最新文章」和搜索索引 */
export async function getAllWriting() {
  const groups = await Promise.all(
    (['posts', 'notes', 'lab'] as const).map(async (section) =>
      (await getSection(section)).map((entry) => ({ section, entry })),
    ),
  );
  return groups.flat().sort((a, b) => byDateDesc(a.entry, b.entry));
}

/** 作品：featured 优先，然后按 order、年份 */
export async function getWorks() {
  return visible(await getCollection('works')).sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      b.data.year - a.data.year,
  );
}

export const isWritingSection = (s: string): s is WritingSection =>
  s === 'posts' || s === 'notes' || s === 'lab';

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(d);
