import { visit } from 'unist-util-visit';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ESCAPES[c]);

/**
 * 把 ```mermaid 代码块换成 <pre class="mermaid">，交给客户端按需渲染。
 * 放在 remark 层是为了抢在 Shiki 语法高亮之前，否则会先被高亮成普通代码块。
 * 不走构建期渲染（那需要 playwright），保持依赖轻量。
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === null) return;
      parent.children[index] = {
        type: 'html',
        value: `<pre class="mermaid" data-mermaid>${escapeHtml(node.value)}</pre>`,
      };
    });
  };
}
