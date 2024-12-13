import assert from 'node:assert/strict';
import test from 'node:test';
import {remark} from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkAlerts from 'remark-blockquote-alerts';

async function processMarkdown(markdown) {
  const file = await remark()
    .use(remarkAlerts)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  const result = String(file);
  console.log(
    `\x1b[1m[RESULT]\x1b[0m\n` +
    `\x1b[4mmarkdown\x1b[0m: ${markdown}\n` +
    `\x1b[4mhtml\x1b[0m: ${result}\n`,
  );
  return result;
}

test('remark-alerts', async (t) => {
  await t.test('should transform "[!NOTE]" blockquote to blockquote-note', async () => {
    const result = await processMarkdown('> [!NOTE] This is a note.');

    assert.ok(result.includes('<blockquote class="blockquote-note">'));
    assert.ok(result.includes('This is a note.'));
  });

  await t.test('should transform "[!TIP]" blockquote to blockquote-tip', async () => {
    const result = await processMarkdown('> [!TIP] This is a tip.');

    assert.ok(result.includes('<blockquote class="blockquote-tip">'));
    assert.ok(result.includes('This is a tip.'));
  });

  await t.test('should transform "[!IMPORTANT]" blockquote to blockquote-important', async () => {
    const result = await processMarkdown('> [!IMPORTANT] Crucial information.');

    assert.ok(result.includes('<blockquote class="blockquote-important">'));
    assert.ok(result.includes('Crucial information.'));
  });

  await t.test('should transform "[!WARNING]" blockquote to blockquote-warning', async () => {
    const result = await processMarkdown('> [!WARNING] Critical attention required.');

    assert.ok(result.includes('<blockquote class="blockquote-warning">'));
    assert.ok(result.includes('Critical attention required.'));
  });

  await t.test('should transform "[!CAUTION]" blockquote to blockquote-caution', async () => {
    const result = await processMarkdown('> [!CAUTION] Exercise caution.');

    assert.ok(result.includes('<blockquote class="blockquote-caution">'));
    assert.ok(result.includes('Exercise caution.'));
  });

  await t.test('should leave regular blockquotes unchanged', async () => {
    const result = await processMarkdown('> This is a regular blockquote.');

    assert.ok(result.includes('<blockquote>'));
    assert.ok(result.includes('This is a regular blockquote.'));
    assert.ok(!result.includes('class="blockquote-note"'));
    assert.ok(!result.includes('class="blockquote-tip"'));
    assert.ok(!result.includes('class="blockquote-important"'));
    assert.ok(!result.includes('class="blockquote-warning"'));
    assert.ok(!result.includes('class="blockquote-caution"'));
  });
});
