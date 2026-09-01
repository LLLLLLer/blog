# 得意黑 Smiley Sans

- 来源: https://github.com/atelier-anchor/smiley-sans
- 版本: v2.0.1
- 授权: SIL Open Font License 1.1 —— 允许免费商用、允许网络嵌入、无需署名

这里放的是**完整字体源文件**（约 1.1MB），不直接对外提供。
构建时 `scripts/subset-font.mjs` 会按实际用到的标题字符生成子集，
输出到 `public/fonts/`（已 gitignore），线上加载的是几十 KB 的子集。

覆盖范围: 实测 8136 个汉字（总码位 9440，含拉丁/假名/标点）。
超出范围的字会 fallback 到系统字体，`scripts/check-font-coverage.mjs` 会在构建时报出来。
