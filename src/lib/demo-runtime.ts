/**
 * 交互 demo 的运行时契约。
 *
 * 写一个 demo 只需要在 src/demos/ 下建个文件默认导出 setup，
 * DPR 缩放、resize、滚出视口暂停、降级、重置这些样板全在容器里，不用重复写。
 */

export interface DemoContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** CSS 像素尺寸（已处理 devicePixelRatio，画的时候直接用这个） */
  width: number;
  height: number;
  /** 当前是否处于降级模式：应只画一帧静态图，不要做持续动画 */
  reducedMotion: boolean;
}

export interface DemoInstance {
  /** 每帧调用，仅在 demo 位于视口内时执行。降级模式下只会被调用一次 */
  frame?(elapsed: number): void;
  /** 尺寸变化时调用 */
  resize?(width: number, height: number): void;
  /** 点「重置」时调用 */
  reset?(): void;
  /** 卸载（换页）时调用，用来解绑事件 */
  destroy?(): void;
}

export type DemoSetup = (context: DemoContext) => DemoInstance;
