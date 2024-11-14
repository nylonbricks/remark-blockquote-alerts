import assert from 'node:assert/strict';
import test from 'node:test';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkAlerts from 'remark-alerts';

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
  await t.test('should transform "[!NOTE]" blockquote to alert-note', async () => {
    const result = await processMarkdown('> [!NOTE] This is a note.');

    assert.ok(result.includes('<blockquote class="alert-note">'));
    assert.ok(result.includes('This is a note.'));
  });

  await t.test('should transform "[!TIP]" blockquote to alert-tip', async () => {
    const result = await processMarkdown('> [!TIP] This is a tip.');

    assert.ok(result.includes('<blockquote class="alert-tip">'));
    assert.ok(result.includes('This is a tip.'));
  });

  await t.test('should transform "[!IMPORTANT]" blockquote to alert-important', async () => {
    const result = await processMarkdown('> [!IMPORTANT] Crucial information.');

    assert.ok(result.includes('<blockquote class="alert-important">'));
    assert.ok(result.includes('Crucial information.'));
  });

  await t.test('should transform "[!WARNING]" blockquote to alert-warning', async () => {
    const result = await processMarkdown('> [!WARNING] Critical attention required.');

    assert.ok(result.includes('<blockquote class="alert-warning">'));
    assert.ok(result.includes('Critical attention required.'));
  });

  await t.test('should transform "[!CAUTION]" blockquote to alert-caution', async () => {
    const result = await processMarkdown('> [!CAUTION] Exercise caution.');

    assert.ok(result.includes('<blockquote class="alert-caution">'));
    assert.ok(result.includes('Exercise caution.'));
  });

  await t.test('should leave regular blockquotes unchanged', async () => {
    const result = await processMarkdown('> This is a regular blockquote.');

    assert.ok(result.includes('<blockquote>'));
    assert.ok(result.includes('This is a regular blockquote.'));
    assert.ok(!result.includes('class="alert-note"'));
    assert.ok(!result.includes('class="alert-tip"'));
    assert.ok(!result.includes('class="alert-important"'));
    assert.ok(!result.includes('class="alert-warning"'));
    assert.ok(!result.includes('class="alert-caution"'));
  });
});
