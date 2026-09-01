/**
 * 构建期字体子集化。
 *
 * 得意黑完整 WOFF2 是 1.1MB —— 直接上等于把「轻量」这条要求作废。
 * 但标题用到的字其实很少，所以这里扫描所有会用到标题字体的文案，
 * 只为实际出现过的字符生成子集。典型体积在几十 KB 量级。
 *
 * 新增文章会带来新字符，所以这一步必须跟着每次 build 跑（见 package.json 的 prebuild）。
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import subsetFont from 'subset-font';

const SRC = 'assets/fonts/SmileySans-Oblique.woff2';
const OUT_DIR = 'public/fonts';
const OUT = join(OUT_DIR, 'smiley-sans-subset.woff2');
const CONTENT_DIR = 'src/content';

/** 标题字体还会用在这些地方，一并计入 */
const ALWAYS_INCLUDE = [
  '我的博客',
  '技术笔记、交互实验与随笔。',
  '写点技术，做点实验，偶尔胡思乱想。',
  '技术 实验 随笔 作品',
  '首页 关于 归档 标签 搜索 目录 评论 上一篇 下一篇 阅读更多 全部',
  '暂无内容 加载中 出错了 重置 复制 已复制',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  '，。、；：？！“”‘’（）《》—…·「」【】',
  ' .,:;?!\'"()[]{}<>/\\|-_=+*&^%$#@~`',
];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (['.md', '.mdx'].includes(extname(e.name))) yield p;
  }
}

/** 从 frontmatter 里抠出 title / description / tagline 这类会用标题字体的字段 */
function extractFrontmatterText(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return '';
  const out = [];
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(title|description|role)\s*:\s*(.+)$/);
    if (kv) out.push(kv[2].replace(/^['"]|['"]$/g, ''));
    // tags 的行内数组形式: tags: [a, b]
    const tags = line.match(/^tags\s*:\s*\[(.*)\]\s*$/);
    if (tags) out.push(tags[1].replace(/['"]/g, ' '));
  }
  return out.join(' ');
}

async function main() {
  const chars = new Set(ALWAYS_INCLUDE.join('').split(''));

  let fileCount = 0;
  for await (const file of walk(CONTENT_DIR)) {
    fileCount++;
    const text = extractFrontmatterText(await readFile(file, 'utf8'));
    for (const ch of text) chars.add(ch);
  }

  // 去掉控制字符和空白，harfbuzz 不需要它们
  const subsetChars = [...chars].filter((c) => c.trim().length > 0).sort().join('');

  const source = await readFile(SRC);
  const buffer = await subsetFont(source, subsetChars, { targetFormat: 'woff2' });

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT, buffer);

  const original = (await stat(SRC)).size;
  const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
  console.log(
    `[font] ${fileCount} 篇内容 → ${subsetChars.length} 字符  ` +
      `${kb(original)} → ${kb(buffer.length)}  ` +
      `(${((1 - buffer.length / original) * 100).toFixed(1)}% 省掉)`,
  );
}

main().catch((err) => {
  console.error('[font] 子集化失败:', err);
  process.exit(1);
});
