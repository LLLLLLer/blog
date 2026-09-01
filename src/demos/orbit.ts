import type { DemoSetup } from '../lib/demo-runtime';

/**
 * 示例 demo：可拖拽的双体轨道。
 * 拖动中心质点改变引力源位置，观察轨道形变。
 */
const setup: DemoSetup = ({ canvas, ctx, width, height, reducedMotion }) => {
  let w = width;
  let h = height;
  const center = { x: w / 2, y: h / 2 };
  let dragging = false;

  const initial = () => ({
    pos: { x: w / 2 + Math.min(w, h) * 0.28, y: h / 2 },
    vel: { x: 0, y: -1.35 },
    trail: [] as { x: number; y: number }[],
  });
  let body = initial();

  const pointerPos = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: PointerEvent) => {
    const p = pointerPos(e);
    if (Math.hypot(p.x - center.x, p.y - center.y) < 40) {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
    }
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const p = pointerPos(e);
    center.x = p.x;
    center.y = p.y;
  };
  const onUp = () => (dragging = false);

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  const style = getComputedStyle(canvas);
  const accent = style.getPropertyValue('--accent').trim() || '#e07a5f';
  const fg = style.getPropertyValue('--fg').trim() || '#222';

  const step = () => {
    const dx = center.x - body.pos.x;
    const dy = center.y - body.pos.y;
    const dist = Math.max(Math.hypot(dx, dy), 26);
    const force = 900 / (dist * dist);
    body.vel.x += (dx / dist) * force;
    body.vel.y += (dy / dist) * force;
    body.pos.x += body.vel.x;
    body.pos.y += body.vel.y;
    body.trail.push({ ...body.pos });
    if (body.trail.length > 220) body.trail.shift();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    body.trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.globalAlpha = 0.45;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(body.pos.x, body.pos.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  return {
    frame() {
      // 降级模式只画一帧静态图：先跑够步数让轨迹成形，再画
      if (reducedMotion) {
        for (let i = 0; i < 220; i++) step();
      } else {
        step();
      }
      draw();
    },
    resize(nw, nh) {
      w = nw;
      h = nh;
      center.x = w / 2;
      center.y = h / 2;
      body = initial();
    },
    reset() {
      center.x = w / 2;
      center.y = h / 2;
      body = initial();
    },
    destroy() {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    },
  };
};

export default setup;
