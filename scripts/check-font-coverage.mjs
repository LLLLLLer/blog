/**
 * 校验字体子集是否覆盖了所有会用标题字体渲染的字符。
 *
 * 漏掉任何一个，页面上就会出现「同一个标题里一半得意黑一半系统字体」的混排。
 * 跑法：npm run build 之后 node scripts/check-font-coverage.mjs
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import * as fontkit from 'fontkit';

const SUBSET = 'public/fonts/smiley-sans-subset.woff2';
const FULL = 'assets/fonts/SmileySans-Oblique.woff2';
const DIST = 'dist';

/** 这些选择器对应 CSS 里 font-family: var(--font-display) 的元素 */
const SELECTORS = [
  [/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g, '标题 h1-h4'],
  [/class="brand"[^>]*>([\s\S]*?)</g, '站名'],
  [/class="demo__title"[^>]*>([\s\S]*?)</g, 'demo 标题'],
  [/class="block__title"[^>]*>([\s\S]*?)</g, '区块小标题'],
  [/class="entry-card__title"[^>]*>([\s\S]*?)</g, '条目标题'],
  [/class="entry-row__title"[^>]*>([\s\S]*?)</g, '条目标题'],
  [/class="picks__title"[^>]*>([\s\S]*?)</g, '精选项目标题'],
  [/class="work__title"[^>]*>([\s\S]*?)</g, '作品标题'],
  [/class="picker__name"[^>]*>([\s\S]*?)</g, '候选名'],
  [/class="toc__title"[^>]*>([\s\S]*?)</g, '目录标题'],
  [/class="entry-row__index"[^>]*>([\s\S]*?)</g, '序号'],
];

const CJK = /[㐀-鿿豈-﫿]/;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (extname(e.name) === '.html') yield p;
  }
}

const subset = new Set(fontkit.openSync(SUBSET).characterSet.map((c) => String.fromCodePoint(c)));
const full = new Set(fontkit.openSync(FULL).characterSet.map((c) => String.fromCodePoint(c)));

const missing = new Map();
let pages = 0;

for await (const file of walk(DIST)) {
  pages++;
  const html = await readFile(file, 'utf8');
  for (const [pattern, label] of SELECTORS) {
    for (const m of html.matchAll(pattern)) {
      const text = m[1].replace(/<[^>]+>/g, '');
      for (const ch of text) {
        if (!CJK.test(ch) || subset.has(ch)) continue;
        if (!missing.has(ch)) missing.set(ch, { labels: new Set(), inFont: full.has(ch) });
        missing.get(ch).labels.add(label);
      }
    }
  }
}

console.log(`子集 ${subset.size} 字符 / 完整字体 ${full.size} 字符 / 扫描 ${pages} 个页面`);

if (missing.size === 0) {
  console.log('✓ 所有用标题字体渲染的中文都在子集内，不会出现混排');
  process.exit(0);
}

const gaps = [...missing].filter(([, v]) => v.inFont);
const rare = [...missing].filter(([, v]) => !v.inFont);

if (gaps.length) {
  console.error(`\n✗ 扫描遗漏 ${gaps.length} 字（字体里有，但没进子集 —— 这是 subset-font.mjs 的 bug）:`);
  for (const [ch, v] of gaps) console.error(`    ${ch}  ← ${[...v.labels].join('/')}`);
}
if (rare.length) {
  console.warn(`\n! ${rare.length} 字超出得意黑覆盖范围，会 fallback 到系统字体（改文案或换字体才能解决）:`);
  for (const [ch, v] of rare) console.warn(`    ${ch}  ← ${[...v.labels].join('/')}`);
}
process.exit(gaps.length ? 1 : 0);
