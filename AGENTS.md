# Listr

- **Coding standards**: read [CODING_STANDARDS.md](CODING_STANDARDS.md) before writing or editing code or Markdown. It covers what Biome can't check.
- **Adapter**: Listr runs on `@sveltejs/adapter-node` only. It reads the served folder from disk, watches it and holds connections open for change notices, so it needs a long-running server.
- **SvelteKit config** goes in `sveltekit({ … })` in `vite.config.ts`, the only config file.
- **Imports** from `src/lib` use the `#lib` subpath import from `package.json`.
