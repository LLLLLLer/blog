# 个人博客

Astro 7 + Cloudflare Pages。纯中文，本地 Markdown + git push 自动部署。

视觉是极简亮色阅读向：留白、衬线正文、动效克制。
配色令牌全在 `src/styles/theme.css`，改那一个文件就能整体换肤。

## 命令

```bash
npm run dev      # 本地开发（含字体子集化）
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
npm run font       # 只跑字体子集化
npm run check:font # 校验字体覆盖（build 时自动跑）
npx astro check  # 类型检查
```

### 只看视觉效果时用 preview，不要用 dev

```bash
SHOW_DRAFTS=1 npm run build
npx astro preview --host 127.0.0.1 --port 4321
```

原因：**dev 模式下 Astro 的 CSS 是以 `<script type="module" src="…css">` 的形式、
经由 Vite 客户端注入的**，浏览器端 JS 一旦没跑起来（SSH 隧道、代理、拦截插件都可能），
页面就会没有任何样式。生产构建里 CSS 是老老实实的 `<link rel="stylesheet">`，不依赖 JS。

`SHOW_DRAFTS=1` 让草稿（`draft: true`）进构建，这样能看到「有作品时首页长什么样」。
不加这个变量则和线上一致，草稿被过滤掉。目前 `src/content/works/example.md` 就是这样一个草稿模板。

远程服务器上看，本地开个 SSH 隧道：`ssh -L 4321:127.0.0.1:4321 <user>@<host>`，
然后浏览器开 http://localhost:4321 。

## 写文章

| 目录 | 路由 | 内容 |
| --- | --- | --- |
| `src/content/posts/` | `/posts` | 技术 —— 教程、笔记、踩坑 |
| `src/content/lab/` | `/lab` | 实验 —— 可交互的小玩意儿 |
| `src/content/notes/` | `/notes` | 随笔 |
| `src/content/works/` | `/works` | 作品 |

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

滚动进场只在 `html.js` 下才先隐藏元素（`js` 类由 head 里的内联脚本加上）。
**不要写裸的 `[data-reveal] { opacity: 0 }`** —— JS 一旦没执行，内容就永久不可见。

页面切换用 View Transitions。跨文档过渡目前 Chromium + Safari 18.2+ 原生支持，
Firefox 跨文档尚未完成，MDN 标 "Limited availability" 非 Baseline，
所以由 Astro `<ClientRouter />` 在其余浏览器上补齐，再不济退化成普通跳转。

## 字体

标题用得意黑（SIL OFL 1.1，可商用），正文用系统字体栈（0 字节）。

完整得意黑 1.1MB，覆盖 8136 个汉字。`scripts/subset-font.mjs` 在每次构建时扫描所有
会用标题字体渲染的文案，只为实际用到的字符生成子集 —— 实测 **1123.9KB → 53.3KB**。

扫描范围必须覆盖 CSS 里所有 `font-family: var(--font-display)` 的地方，
少扫一处就会出现「同一个标题里一半得意黑一半系统字体」的混排。目前扫两路：

- **内容文件** —— frontmatter 的 title/description/tags + 正文里的 `#` 标题行 + MDX 组件属性
- **源码文件** —— `.astro`/`.ts` 剥掉注释后的中文（注释里的中文不该占字体体积）

`scripts/check-font-coverage.mjs` 会在每次 build 后校验产物：
扫描遗漏直接让构建失败，真·生僻字（超出得意黑覆盖）只警告。

## 部署（Cloudflare Workers Static Assets）

用 Workers 而不是 Pages：Cloudflare 已宣布弃用 Pages，2026 年 3 月起 Workers
在静态资源、SSR、自定义域名上与 Pages 功能对等，官方对新项目的建议是直接上 Workers。
现有 Pages 项目不强制迁移，但新建就没必要再进那条路。

`public/_headers` 里的缓存与安全头在 Workers 上原生支持，不用改。

### 1. 推到 GitHub

```bash
gh repo create LLLLLLer/blog --public --source=. --remote=origin --push
# 或者手动：在 GitHub 建空仓库后
# git remote add origin git@github.com:LLLLLLer/blog.git && git push -u origin main
```

用 `--public`：Giscus 评论要求仓库公开（见下面第 6 步）。只想先私有也行，
以后在仓库 Settings 里改成 public 再开评论。

### 2. 首次部署

```bash
npx wrangler login --device   # 见下方说明，远程服务器上必须加 --device
npm run deploy                # = npm run build && wrangler deploy
```

**`--device` 不能省。** 默认的 `wrangler login` 会在**服务器上**开一个
`localhost:8976` 的回调服务等浏览器跳回来，而你的浏览器在自己电脑上，
根本够不着那个端口，命令会一直卡着。`--device` 改用 OAuth 设备码流程：
终端打印一个 URL 和一段验证码，你在自己电脑的浏览器打开、输码即可，
不需要任何端口转发。

（如果连交互都不方便，也可以在 Cloudflare 控制台建一个 API Token，
用环境变量 `CLOUDFLARE_API_TOKEN=xxx npm run deploy` 直接部署，跳过登录。）

部署完终端会打印真实地址，形如 `https://linners-note.<你的账号子域>.workers.dev`。

### 3. 改 SITE_URL（**别跳过**）

把上一步打印的真实地址填进 `astro.config.mjs` 的 `SITE_URL`，然后再部署一次：

```bash
npm run deploy
```

不改的话 RSS 和 sitemap 里全是错的绝对地址，订阅器和搜索引擎会拿到打不开的链接。

### 4. 接上 Git 自动部署（可选，但建议）

Cloudflare 控制台 → Workers & Pages → 选中这个 Worker → Settings → Builds，
连接 GitHub 仓库。构建设置：

| 项 | 值 |
| --- | --- |
| 构建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy` |
| 根目录 | `/` |
| Node 版本 | 22（`.nvmrc` 已写好；不生效就加环境变量 `NODE_VERSION=22`） |

接上之后 `git push` 即部署，不用再手动跑 `npm run deploy`。

> 控制台的菜单名称 Cloudflare 改得比较勤，按「Builds / 构建」这个关键词找即可。

### 5. 自定义域名（买了域名之后）

1. 域名 DNS 托管到 Cloudflare
2. 控制台 → 这个 Worker → Settings → Domains & Routes → 添加自定义域
3. 把 `astro.config.mjs` 的 `SITE_URL` 改成新域名，重新部署

注意：Workers 的自定义域名**必须在 Cloudflare 托管的区域内**，域名放在别处只做 CNAME 是不支持的。

### 6. 打开评论（Giscus）

1. 仓库设为 public，Settings → General → Features 勾上 **Discussions**
2. 给仓库装 [giscus app](https://github.com/apps/giscus)
3. 打开 https://giscus.app ，填仓库名，选映射方式 **pathname**、
   分类选 **Announcements**，页面下方会生成 `data-repo-id` 和 `data-category-id`
4. 把四个值填进 `src/config.ts` 的 `GISCUS`，把 `enabled` 改成 `true`
5. 重新部署

### 7. 打开访问统计（可选）

Cloudflare 控制台 → Web Analytics → 添加站点 → 拿到 token，
填进 `src/config.ts` 的 `ANALYTICS.cfBeaconToken`，重新部署。
免费、无 cookie、不拖慢页面。

## 还没做的事

- `SITE_URL` 是占位符，首次部署后必须按第 3 步改掉
- Giscus 和 Web Analytics 都没开，按第 6、7 步走
- `src/content/` 下四篇文章和 `works/example.md` 都是搭排版用的示例，
  开始写自己的东西时删掉（`example.md` 是 `draft: true`，不会上线，留着当模板也行）
- Lighthouse 跑分和 Firefox 实机复查没做过（开发机上没有浏览器），
  部署后在真机上跑一遍
