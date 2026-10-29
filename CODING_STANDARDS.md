# Coding Standards

Biome enforces formatting and lint rules (`biome.jsonc`). This file covers what it can't.

## Blank lines

Code is written in **paragraphs**: a few lines that do one thing. A blank line ends a paragraph, so the reader can see where one step of the logic stops and the next begins. Lines that belong to one paragraph stay together.

Read each rule below as a common case of this. When a case isn't listed, ask whether the lines form one paragraph or two.

### Script (TS and `<script>`)

- **Blocks** (`if`, `for`, `try`, `switch`, a function or callback body) get a blank line before and after.
  - The first statement in a block needs none, since the opening brace already separates it.

    ```ts
    const response = await fetch(href);

    if (!response.ok) {
    	throw new Error(response.statusText);
    }

    return response.text();
    ```

- **`return`** gets a blank line before it, unless it's the only statement in its block.
- **A comment** above a line or block gets a blank line before it. The comment and the code it describes are one paragraph, so nothing goes between them.
- **A new scope**: inside a body, a blank line goes between the setup of one scope and work in the next. In `highlight` in `Viewer.svelte`, loading the inputs and rendering them are two paragraphs.

### Markup (Svelte templates)

- **Top-level parts** of a component get one blank line between them: each `<script>` (module and instance count separately), `<svelte:head>`, `<svelte:window>`, each `{#snippet}`, each root element or block, and `<style>`.
- **Nested markup** is one paragraph: children of an element, snippet or `{#if}`/`{#each}` block follow each other directly, however deep.
- **A comment** sits directly above the element it describes. At top level it takes the blank line, so: blank line, comment, element. Nested, it gets no blank line either.
- **Unrelated regions inside one container** get a blank line between them. In `+layout.svelte`, the `{#if changed}` alert and `{@render children()}` share `<main>`, but one is page chrome and the other is the page:

  ```svelte
  <main class={classes.container}>
  	{#if changed}
  		<div class={classes.alert} role="status">…</div>
  	{/if}

  	{@render children()}
  </main>
  ```

## Markdown

Markdown should read as well in raw text as it does rendered.

- **Tables** are aligned: pad each cell with spaces to its column's widest cell, so every `|` lines up. The delimiter row fills each column with dashes. See the tables in `DESIGN.md`.

  ```md
  | Option     | Default     |
  | ---------- | ----------- |
  | `theme`    | `bootstrap` |
  | `onChange` | `banner`    |
  ```
