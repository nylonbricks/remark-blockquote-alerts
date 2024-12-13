import {Plugin} from 'unified';
import {visit} from 'unist-util-visit';
import {Node} from 'unist';
import {Blockquote, Paragraph, PhrasingContent} from 'mdast';

interface ExtendedBlockquoteData {
  hProperties?: { className: string };
  type?: string;
}

const alertsTypes: Record<string, string> = {
  '[!NOTE]': 'blockquote-note',
  '[!TIP]': 'blockquote-tip',
  '[!IMPORTANT]': 'blockquote-important',
  '[!WARNING]': 'blockquote-warning',
  '[!CAUTION]': 'blockquote-caution',
};

const RemarkBlockquoteAlerts: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const firstChild = node.children[0] as Paragraph;

      if (firstChild?.children.length > 0) {
        const textNode = firstChild.children[0] as PhrasingContent & { value?: string };
        const text = textNode?.value?.trim() || '';

        for (const [prefix, className] of Object.entries(alertsTypes)) {
          if (text.startsWith(prefix)) {
            const data = (node.data || {}) as ExtendedBlockquoteData;
            data.hProperties = {className};
            data.type = 'blockquote';
            textNode.value = text.replace(prefix, '').trim();
            node.data = data;
            break;
          }
        }
      }
    });
  };
};

export default RemarkBlockquoteAlerts;
