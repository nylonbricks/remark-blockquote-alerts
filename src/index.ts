import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Blockquote, Paragraph, PhrasingContent } from 'mdast';

interface ExtendedBlockquoteData {
  hProperties?: { className: string };
  type?: string;
}

const highlightsTypes: Record<string, string> = {
  '[!NOTE]': 'highlights-note',
  '[!TIP]': 'highlights-tip',
  '[!IMPORTANT]': 'highlights-important',
  '[!WARNING]': 'highlights-warning',
  '[!CAUTION]': 'highlights-caution',
};

const RemarkBlockquoteHighlights: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const firstChild = node.children[0] as Paragraph;

      if (firstChild?.children.length > 0) {
        const textNode = firstChild.children[0] as PhrasingContent & { value?: string };
        const text = textNode?.value?.trim() || '';

        for (const [prefix, className] of Object.entries(highlightsTypes)) {
          if (text.startsWith(prefix)) {
            const data = (node.data || {}) as ExtendedBlockquoteData;
            data.hProperties = { className };
            data.type = 'highlights';
            textNode.value = text.replace(prefix, '').trim();
            node.data = data;
            break;
          }
        }
      }
    });
  };
};

export default RemarkBlockquoteHighlights;
