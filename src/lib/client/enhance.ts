/**
 * 客户端渐进增强总入口。
 *
 * 全部挂在 astro:page-load 上：View Transitions 的客户端路由换页时不会重新执行
 * 模块顶层代码，散在各组件里写 <script> 的话换一次页就失效一次。
 *
 * 每一项都是「没有它页面也完全可用」的增强，JS 挂了不影响阅读。
 */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isNarrow = () => window.matchMedia('(max-width: 767px)').matches;

/** 元素滚动进视口时淡入。降级时直接标记为已显示，不做动画。 */
function initScrollReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.setAttribute('data-revealed', ''));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-revealed', '');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  targets.forEach((el) => io.observe(el));
}

/** 目录高亮跟随当前阅读位置 */
function initTocFollow() {
  const toc = document.querySelector<HTMLElement>('[data-toc]');
  if (!toc) return;
  const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  if (!links.length) return;

  const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const headings = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (!headings.length) return;

  let active: HTMLAnchorElement | null = null;
  const setActive = (id: string) => {
    const link = byId.get(id);
    if (!link || link === active) return;
    active?.removeAttribute('data-active');
    link.setAttribute('data-active', '');
    active = link;
  };

  const io = new IntersectionObserver(
    (entries) => {
      // 取当前视口内位置最靠上的标题作为「正在读的那一节」
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  );
  headings.forEach((h) => io.observe(h));
  setActive(headings[0].id);
}

/** 代码块一键复制 */
function initCodeCopy() {
  const blocks = document.querySelectorAll<HTMLPreElement>('.prose pre:not(.mermaid):not([data-copy-ready])');
  for (const pre of blocks) {
    pre.setAttribute('data-copy-ready', '');
    pre.classList.add('code-block');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = '已复制';
      } catch {
        button.textContent = '复制失败';
      }
      setTimeout(() => (button.textContent = '复制'), 1600);
    });

    pre.appendChild(button);
  }
}

/** 正文图片点开放大 */
function initLightbox() {
  const images = document.querySelectorAll<HTMLImageElement>('.prose img:not([data-no-zoom]):not([data-zoom-ready])');
  if (!images.length) return;

  let overlay: HTMLDivElement | null = null;

  const close = () => {
    overlay?.removeAttribute('data-open');
    document.body.style.removeProperty('overflow');
  };

  const open = (src: string, alt: string) => {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = '<img alt="">';
      overlay.addEventListener('click', close);
      document.body.appendChild(overlay);
    }
    const img = overlay.querySelector('img')!;
    img.src = src;
    img.alt = alt;
    overlay.setAttribute('data-open', '');
    document.body.style.overflow = 'hidden';
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  for (const img of images) {
    img.setAttribute('data-zoom-ready', '');
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  }
}

/** 只有页面上真有图时才加载 mermaid（它不小，不能全站背着） */
async function initMermaid() {
  const nodes = document.querySelectorAll<HTMLElement>('pre.mermaid[data-mermaid]');
  if (!nodes.length) return;

  const mermaid = (await import('mermaid')).default;
  const dark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? 'dark' : 'default',
    fontFamily: getComputedStyle(document.body).fontFamily,
  });
  nodes.forEach((n) => n.removeAttribute('data-mermaid'));
  await mermaid.run({ nodes: [...nodes] });
}

/**
 * 顶栏的「已滚动」状态。
 * 只影响分隔线和阴影 —— 背景色是 CSS 里的实色，不经过这里，
 * 所以 JS 挂掉最多是少一道线，不会出现正文从顶栏底下透上来。
 */
function initHeaderScrollState() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const sentinel = document.querySelector<HTMLElement>('[data-scroll-sentinel]');
  if (!header || !sentinel || header.dataset.scrollBound) return;
  header.dataset.scrollBound = '1';

  if (!('IntersectionObserver' in window)) {
    header.setAttribute('data-scrolled', '');
    return;
  }

  const io = new IntersectionObserver(
    ([entry]) => header.toggleAttribute('data-scrolled', !entry.isIntersecting),
    { threshold: 0 },
  );
  io.observe(sentinel);

  document.addEventListener('astro:before-swap', () => io.disconnect(), { once: true });
}

/** 重特效（辉光/光标跟随/视差）在窄屏和降级模式下整体不启动 */
function heavyMotionAllowed() {
  return !prefersReducedMotion() && !isNarrow();
}

function enhance() {
  initHeaderScrollState();
  initScrollReveal();
  initTocFollow();
  initCodeCopy();
  initLightbox();
  void initMermaid();
  document.documentElement.toggleAttribute('data-heavy-ok', heavyMotionAllowed());
}

document.addEventListener('astro:page-load', enhance);
