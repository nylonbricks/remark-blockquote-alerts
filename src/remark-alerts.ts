import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Blockquote, Paragraph, PhrasingContent } from 'mdast';

interface ExtendedBlockquoteData {
  hProperties?: { className: string };
  type?: string;
}

const alertTypes: Record<string, string> = {
  '[!NOTE]': 'alert-note',
  '[!TIP]': 'alert-tip',
  '[!IMPORTANT]': 'alert-important',
  '[!WARNING]': 'alert-warning',
  '[!CAUTION]': 'alert-caution',
};

const remarkAlerts: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const firstChild = node.children[0] as Paragraph;

      if (firstChild?.children.length > 0) {
        const textNode = firstChild.children[0] as PhrasingContent & { value?: string };
        const text = textNode?.value?.trim() || '';

        for (const [prefix, className] of Object.entries(alertTypes)) {
          if (text.startsWith(prefix)) {
            const data = (node.data || {}) as ExtendedBlockquoteData;
            data.hProperties = { className };
            data.type = 'alert';
            textNode.value = text.replace(prefix, '').trim();
            node.data = data;
            break;
          }
        }
      }
    });
  };
};

export default remarkAlerts;
