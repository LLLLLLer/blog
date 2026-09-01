---
title: 中文网页字体：1.1MB 到 19KB
description: 为什么中文字体是「轻量」最大的敌人，以及标题自托管、正文系统栈这个组合为什么成立。
pubDate: 2026-08-25
tags: [前端, 字体, 性能]
---

英文站聊 web font 优化，谈的是几十 KB 的取舍。中文站不是——一个完整中文字体动辄 **5–10MB**，比整个英文站所有资源加起来还大一个数量级。

## 数字先摆出来

得意黑（Smiley Sans）完整 WOFF2 是 1.1MB。作为对照，一个写得克制的静态博客首页，HTML + CSS + JS 总共可能只有 30KB。

**直接引入完整中文字体，等于把「轻量」这个要求作废。**

## 两条路

### 分包

把字体按 Unicode 区间切成若干小包，浏览器按 `unicode-range` 只下载用到的那几包。推荐切成 70KB 一包。

这条路的问题是：**分包只是让它别一次砸下来，总量还在那儿**。正文用中文字体，读一篇长文照样要拉几百 KB。

### 只给标题用

标题的字数极少。一个博客几十篇文章，所有标题加起来可能就两三百个不重复的字。构建期扫描一遍，只为这些字生成子集：

```js
const chars = new Set();
for await (const file of walk('src/content')) {
  for (const ch of extractTitles(await readFile(file, 'utf8'))) {
    chars.add(ch);
  }
}
const buffer = await subsetFont(source, [...chars].join(''), {
  targetFormat: 'woff2',
});
```

实测结果：**1123.9KB → 18.7KB，省掉 98.3%**。

正文走系统字体栈，0 字节：

```css
--font-sans: system-ui, -apple-system, 'PingFang SC',
  'HarmonyOS Sans SC', 'Microsoft YaHei', sans-serif;
```

## 代价是什么

要诚实说清楚：

1. **正文在不同设备上长得不一样。** 苹方、微软雅黑、鸿蒙黑体各有各的味道，你控制不了最终观感。
2. **标题字体有覆盖上限。** 得意黑覆盖 GB2312 常用字 6767 个，标题里出现生僻字会 fallback 到系统字体，视觉上会突兀。
3. **新文章会带来新字符**，所以子集化必须跟着每次构建跑，不能只生成一次。

第三条最容易忘。忘了的后果是新文章的标题缺字。
