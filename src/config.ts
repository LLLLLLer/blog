/** 站点身份信息 */
export const SITE = {
  title: "Linner's Note",
  description: '技术笔记、交互实验与随笔。',
  author: 'Linner',
  // 首页名片区那句话，决定第一眼别人怎么记住你
  tagline: '写点技术，做点实验，偶尔胡思乱想。',
  lang: 'zh-CN',
  postsPerPage: 10,
} as const;

/** 页脚社交链接。href 留空的不会渲染，想加就补一行 */
export const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/LLLLLLer', icon: 'github' },
  { name: 'X', href: '', icon: 'x' },
  { name: 'Email', href: '', icon: 'mail' },
].filter((s) => s.href);

/**
 * Giscus 评论。需要：仓库公开 + 打开 Discussions + 装 giscus app，
 * 然后去 https://giscus.app 生成下面四个值。详见 README 的部署章节。
 */
export const GISCUS = {
  enabled: true,
  repo: 'LLLLLLer/blog',
  repoId: 'R_kgDOUK3n8g',
  category: 'Announcements',
  categoryId: 'DIC_kwDOUK3n8s4DEq4g',
} as const;

/** Cloudflare Web Analytics。在 CF 面板 → Web Analytics 拿 token 后填入 */
export const ANALYTICS = { cfBeaconToken: '' } as const;

/** 四个内容分区 */
export const SECTIONS = [
  { id: 'posts', name: '技术', desc: '教程、笔记、踩坑记录' },
  { id: 'lab', name: '实验', desc: '可交互的小玩意儿' },
  { id: 'notes', name: '随笔', desc: '不那么技术的那些' },
  { id: 'works', name: '作品', desc: '做过的东西' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
