/**
 * 构建期字体子集化。
 *
 * 得意黑完整 WOFF2 是 1.1MB —— 直接上等于把「轻量」这条要求作废。
 * 但用标题字体渲染的字其实很少，所以这里扫描所有会用到它的文案，只为实际出现过的字符生成子集。
 *
 * 扫描范围必须覆盖 base.css 里所有 font-family: var(--font-display) 的地方，否则会出现
 * 「同一个标题里一半得意黑一半系统字体」的混排。目前那包括：
 *   - h1~h4（含文章正文里的小标题）
 *   - 站名、条目标题、区块小标题、demo 标题等组件里的写死文案
 * 所以扫描分两路：内容文件取 frontmatter + 正文标题行 + 组件属性；
 * 源码文件剥掉注释后取中文（注释里的中文不该进字体）。
 *
 * 新文章会带来新字符，所以这一步必须跟着每次 build 跑（见 package.json 的 prebuild）。
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import subsetFont from 'subset-font';

const SRC = 'assets/fonts/SmileySans-Oblique.woff2';
const OUT_DIR = 'public/fonts';
const OUT = join(OUT_DIR, 'smiley-sans-subset.woff2');

const CONTENT_DIRS = ['src/content'];
const SOURCE_DIRS = ['src/components', 'src/layouts', 'src/pages', 'src/lib'];
const SOURCE_FILES = ['src/config.ts'];

/** 兜底字符：数字、拉丁、标点，以及运行时才产生的少量文案 */
const ALWAYS_INCLUDE = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  '，。、；：？！“”‘’（）《》—…·「」【】',
  ' .,:;?!\'"()[]{}<>/\\|-_=+*&^%$#@~`',
];

const CJK = /[㐀-䶿一-鿿豈-﫿]/;

async function* walk(dir, exts) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p, exts);
    else if (exts.includes(extname(e.name))) yield p;
  }
}

/** 内容文件：frontmatter 里会显示的字段 + 正文标题行 + 组件属性 */
function textFromContent(source) {
  const out = [];

  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = fm ? source.slice(fm[0].length) : source;

  if (fm) {
    for (const line of fm[1].split(/\r?\n/)) {
      const kv = line.match(/^(title|description|role)\s*:\s*(.+)$/);
      if (kv) out.push(kv[2].replace(/^['"]|['"]$/g, ''));
      const tags = line.match(/^tags\s*:\s*\[(.*)\]\s*$/);
      if (tags) out.push(tags[1].replace(/['"]/g, ' '));
    }
  }

  // 正文里的 ATX 标题 —— 之前漏的就是这一批
  for (const m of body.matchAll(/^#{1,6}\s+(.+)$/gm)) out.push(m[1]);

  // MDX 组件上会显示出来的属性，例如 <DemoCanvas title="…" note="…" />
  for (const m of body.matchAll(/\b(?:title|note|label|alt)\s*=\s*"([^"]*)"/g)) out.push(m[1]);

  return out.join(' ');
}

/** 源码文件：剥掉注释后取中文。注释里的中文不该占字体体积 */
function textFromSource(source) {
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // JS/CSS 块注释
    .replace(/<!--[\s\S]*?-->/g, ' ') // HTML 注释
    .replace(/(^|[^:])\/\/.*$/gm, '$1'); // 行注释（避开 https:// ）

  return (stripped.match(new RegExp(CJK.source, 'g')) ?? []).join('');
}

async function main() {
  const chars = new Set(ALWAYS_INCLUDE.join(''));
  let contentFiles = 0;
  let sourceFiles = 0;

  for (const dir of CONTENT_DIRS) {
    for await (const file of walk(dir, ['.md', '.mdx'])) {
      contentFiles++;
      for (const ch of textFromContent(await readFile(file, 'utf8'))) chars.add(ch);
    }
  }

  const sources = [...SOURCE_FILES];
  for (const dir of SOURCE_DIRS) {
    for await (const file of walk(dir, ['.astro', '.ts'])) sources.push(file);
  }
  for (const file of sources) {
    sourceFiles++;
    for (const ch of textFromSource(await readFile(file, 'utf8'))) chars.add(ch);
  }

  const subsetChars = [...chars].filter((c) => c.trim().length > 0).sort().join('');

  const source = await readFile(SRC);
  const buffer = await subsetFont(source, subsetChars, { targetFormat: 'woff2' });

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT, buffer);

  const original = (await stat(SRC)).size;
  const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
  console.log(
    `[font] ${contentFiles} 篇内容 + ${sourceFiles} 个源码文件 → ${subsetChars.length} 字符  ` +
      `${kb(original)} → ${kb(buffer.length)}  ` +
      `(${((1 - buffer.length / original) * 100).toFixed(1)}% 省掉)`,
  );
}

main().catch((err) => {
  console.error('[font] 子集化失败:', err);
  process.exit(1);
});
