export interface ThemeMeta {
  id: 'a' | 'b' | 'c';
  name: string;
  vibe: string;
  /** 基线参考 */
  basedOn: string;
  /** 是否支持明暗切换。B 是暗色原生，没有亮色形态 */
  hasColorToggle: boolean;
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'a',
    name: '极简亮色阅读向',
    vibe: '大量留白、字体讲究、颜色克制，像一本书。动效只在必要处出现。',
    basedOn: 'AstroPaper 的取向',
    hasColorToggle: true,
  },
  {
    id: 'b',
    name: '暗色科技感',
    vibe: '深色底、辉光强调色、毛玻璃卡片、光标跟随。交互反馈最重的一个。',
    basedOn: 'astro-devosfera 的取向',
    hasColorToggle: false,
  },
  {
    id: 'c',
    name: '杂志编辑感',
    vibe: '超大标题、不对称栅格、图文混排，排版本身就是内容的一部分。',
    basedOn: 'Astro 官方主题库 editorial 类的取向',
    hasColorToggle: true,
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const getTheme = (id: string) => THEMES.find((t) => t.id === id);
