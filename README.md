# remark-blockquote-highlights

![NPM Version](https://img.shields.io/npm/v/remark-blockquote-highlights)

`remark-blockquote-highlights` extends the functionality of Markdown to enable highlighted blockquotes in environments
using `remark`, such as `gatsby.js` and similar frameworks. By default, Markdown in these environments does not support
blockquote highlights.

GitHub introduced this feature in 2022 (see [GitHub Discussions](https://github.com/orgs/community/discussions/16925)),
and it has since been widely used in many documents. This library allows you to bring similar functionality to your
Markdown-based projects.

## How It Works

This library transforms blockquote prefixes into CSS class formats. For example, a blockquote starting with `[!NOTE]`
will be converted to `class="blockquote-note"`. Using CSS, you can style these blockquotes to create elegant components
like the example below:

**An example of all five types:**

```markdown
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

**Here is how they are displayed:**
![Sample Display(Dark)](./docs/blockquote-sample-dark.png#gh-dark-mode-only)
![Sample Display(Light)](./docs/blockquote-sample-light.png#gh-light-mode-only)

## Installation

```bash
npm install remark-blockquote-highlights
```
