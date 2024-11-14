import assert from 'node:assert/strict';
import test from 'node:test';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkBlockquoteHighlight from 'remark-blockquote-highlights';

async function processMarkdown(markdown) {
  const file = await remark()
    .use(remarkBlockquoteHighlight)
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

test('remark-highlights', async (t) => {
  await t.test('should transform "[!NOTE]" blockquote to highlights-note', async () => {
    const result = await processMarkdown('> [!NOTE] This is a note.');

    assert.ok(result.includes('<blockquote class="highlights-note">'));
    assert.ok(result.includes('This is a note.'));
  });

  await t.test('should transform "[!TIP]" blockquote to highlights-tip', async () => {
    const result = await processMarkdown('> [!TIP] This is a tip.');

    assert.ok(result.includes('<blockquote class="highlights-tip">'));
    assert.ok(result.includes('This is a tip.'));
  });

  await t.test('should transform "[!IMPORTANT]" blockquote to highlights-important', async () => {
    const result = await processMarkdown('> [!IMPORTANT] Crucial information.');

    assert.ok(result.includes('<blockquote class="highlights-important">'));
    assert.ok(result.includes('Crucial information.'));
  });

  await t.test('should transform "[!WARNING]" blockquote to highlights-warning', async () => {
    const result = await processMarkdown('> [!WARNING] Critical attention required.');

    assert.ok(result.includes('<blockquote class="highlights-warning">'));
    assert.ok(result.includes('Critical attention required.'));
  });

  await t.test('should transform "[!CAUTION]" blockquote to highlights-caution', async () => {
    const result = await processMarkdown('> [!CAUTION] Exercise caution.');

    assert.ok(result.includes('<blockquote class="highlights-caution">'));
    assert.ok(result.includes('Exercise caution.'));
  });

  await t.test('should leave regular blockquotes unchanged', async () => {
    const result = await processMarkdown('> This is a regular blockquote.');

    assert.ok(result.includes('<blockquote>'));
    assert.ok(result.includes('This is a regular blockquote.'));
    assert.ok(!result.includes('class="highlights-note"'));
    assert.ok(!result.includes('class="highlights-tip"'));
    assert.ok(!result.includes('class="highlights-important"'));
    assert.ok(!result.includes('class="highlights-warning"'));
    assert.ok(!result.includes('class="highlights-caution"'));
  });
});
