# 个人博客

Astro 7 + Cloudflare Pages。纯中文，本地 Markdown + git push 自动部署。

**当前状态：三个视觉候选并存，等待挑选。** 打开 `/` 是候选选择页。

## 命令

```bash
npm run dev      # 本地开发（含字体子集化）
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
npm run font     # 只跑字体子集化
npx astro check  # 类型检查
```

`npm run dev` 会显示草稿（`draft: true`），构建到线上则会过滤掉。
所以要看「有作品时首页长什么样」，用 `dev` 而不是 `preview`。

## 三个候选

| 路径 | 候选 | 气质 |
| --- | --- | --- |
| `/a` | 极简亮色阅读向 | 留白、衬线正文、动效克制。有明暗切换 |
| `/b` | 暗色科技感 | 深色底、辉光、毛玻璃、光标跟随。暗色原生，无明暗切换 |
| `/c` | 杂志编辑感 | 超大标题、序号栅格、强排版。有明暗切换 |

三个**共用同一套内容和同一套能力**，只在视觉与动效强度上分叉。
定下来之后：删掉 `src/themes/` 里另外两个和对应的 `Home.astro`，
把选中的路由从 `/[theme]/...` 提到根路径，删掉 `src/pages/index.astro` 选择页。

## 写文章

```
src/content/posts/   技术  —— 教程、笔记、踩坑
src/content/lab/     实验  —— 可交互的小玩意儿
src/content/notes/   随笔
src/content/works/   作品
```

放 `.md` 即可。要在正文里嵌交互 demo 就用 `.mdx`：

```mdx
import DemoCanvas from '../../components/demo/DemoCanvas.astro';

<DemoCanvas demo="orbit" title="双体轨道" note="拖动中心的点" height={340} />
```

demo 本体写在 `src/demos/<name>.ts`，默认导出 `DemoSetup`。
DPR 缩放、resize、滚出视口暂停 rAF、降级、卸载全在容器里，不用重复写。

## 动效与降级

所有动效时长都走 CSS 变量（`--motion-fast/base/slow`、`--reveal-shift`），
降级开关只有一处 —— `src/styles/base.css`：

- `prefers-reduced-motion: reduce` → 全部时长归零，View Transitions 动画取消
- 窄屏（≤767px）→ 位移进场归零，`[data-heavy-motion]` 元素（光标辉光、首页视觉引子）整体不渲染

页面切换用 View Transitions。跨文档过渡目前 Chromium + Safari 18.2+ 原生支持，
Firefox 跨文档尚未完成，MDN 标 "Limited availability" 非 Baseline，
所以由 Astro `<ClientRouter />` 在其余浏览器上补齐，再不济退化成普通跳转。

## 字体

标题用得意黑（SIL OFL 1.1，可商用），正文用系统字体栈（0 字节）。

完整得意黑 1.1MB。`scripts/subset-font.mjs` 在每次构建时扫描所有标题实际用到的字符，
只为这些字生成子集 —— 实测 **1123.9KB → 31.1KB**。

新文章会带来新字符，所以子集化必须跟着 build 跑（已挂在 `npm run build` 前）。

## 部署（Cloudflare Pages）

- 构建命令 `npm run build`，输出目录 `dist`
- Node 版本 22（见 `.nvmrc`，Astro 7 要求 ≥22.12）
- 缓存和安全头见 `public/_headers`

## 待补充

`src/config.ts` 里带 TODO 的都是占位符：站名、作者名、tagline、社交链接、
Giscus 四个 ID、Cloudflare Analytics token。
`astro.config.mjs` 里的 `site` 也要换成真实域名（影响 RSS 和 sitemap）。
