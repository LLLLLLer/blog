/**
 * 站点身份信息。带 TODO 的都是占位符，等用户补充后替换。
 */
export const SITE = {
  title: '我的博客', // TODO: 站名
  description: '技术笔记、交互实验与随笔。', // TODO
  author: 'Your Name', // TODO: 对外用的名字/ID
  // 首页名片区那句话，决定第一眼别人怎么记住你
  tagline: '写点技术，做点实验，偶尔胡思乱想。', // TODO
  lang: 'zh-CN',
  postsPerPage: 10,
} as const;

/** TODO: 补充真实链接；留空的不会渲染 */
export const SOCIALS = [
  { name: 'GitHub', href: '', icon: 'github' },
  { name: 'X', href: '', icon: 'x' },
  { name: 'Email', href: '', icon: 'mail' },
].filter((s) => s.href);

/** Giscus 评论配置。TODO: 在 https://giscus.app 生成后填入 */
export const GISCUS = {
  enabled: false, // 填好下面的字段后改成 true
  repo: '', // 例: 'user/blog'
  repoId: '',
  category: 'Announcements',
  categoryId: '',
} as const;

/** Cloudflare Web Analytics。TODO: 在 CF 面板拿 token */
export const ANALYTICS = { cfBeaconToken: '' } as const;

/** 四个内容分区 */
export const SECTIONS = [
  { id: 'posts', name: '技术', desc: '教程、笔记、踩坑记录' },
  { id: 'lab', name: '实验', desc: '可交互的小玩意儿' },
  { id: 'notes', name: '随笔', desc: '不那么技术的那些' },
  { id: 'works', name: '作品', desc: '做过的东西' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
