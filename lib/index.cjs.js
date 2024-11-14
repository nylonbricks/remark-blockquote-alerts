'use strict';

var unistUtilVisit = require('unist-util-visit');

const alertTypes = {
    '[!NOTE]': 'alert-note',
    '[!TIP]': 'alert-tip',
    '[!IMPORTANT]': 'alert-important',
    '[!WARNING]': 'alert-warning',
    '[!CAUTION]': 'alert-caution',
};
const remarkAlerts = () => {
    return (tree) => {
        unistUtilVisit.visit(tree, 'blockquote', (node) => {
            const firstChild = node.children[0];
            if (firstChild?.children.length > 0) {
                const textNode = firstChild.children[0];
                const text = textNode?.value?.trim() || '';
                for (const [prefix, className] of Object.entries(alertTypes)) {
                    if (text.startsWith(prefix)) {
                        const data = (node.data || {});
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

module.exports = remarkAlerts;
