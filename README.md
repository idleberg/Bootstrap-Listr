# Listr

> A themeable directory listing for the web, built with SvelteKit.

[![License](https://img.shields.io/github/license/idleberg/Bootstrap-Listr?color=blue&style=for-the-badge)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/Bootstrap-Listr/ci.yml?style=for-the-badge)](https://github.com/idleberg/Bootstrap-Listr/actions)

## Features

- themes for [Bootstrap](https://getbootstrap.com/), all [Bootswatch](http://bootswatch.com/) themes, [Bulma](https://bulma.io/) and [daisyUI](https://daisyui.com/)
- [Bootstrap](https://icons.getbootstrap.com/), [Octicons](https://primer.style/octicons/) or [Phosphor](https://phosphoricons.com/) icons
- file viewer with [syntax highlighting](http://twinkleplop.pngwn.at/) and a choice of code themes
- live notices when files change, as a banner or an automatic reload
- streamed downloads with range requests, so videos can seek
- right-to-left layout

## Installation

Requires Node 24 and pnpm.

```sh
pnpm install  
pnpm build
```

## Usage

Set `LISTR_ROOT` to the folder you want to serve, then start the server:

```sh
LISTR_ROOT=/path/to/files node build
```

The server listens on port 3000. `LISTR_ROOT` can be relative to the working directory and defaults to `__public`.

To run it on Bun instead, use `bun build/index.js`, since `bun build` is Bun's bundler.

> [!IMPORTANT]
> Listr only works with [`@sveltejs/adapter-node`](https://svelte.dev/docs/kit/adapter-node). It reads the served folder from disk, watches it for changes and holds connections open to push change notices, so it needs a long-running server. Static, serverless and edge adapters can't do that. Other runtimes are fine as long as they run the adapter-node build, as Bun does.

### Docker

The image serves `/srv` on port 3000:

```sh
docker build -t listr .
docker run -p 3000:3000 -v ./files:/srv:ro -v ./listr.config.json:/app/listr.config.json:ro listr
```

## Configuration

Listr reads `listr.config.json` from the working directory at startup, so restart after changing it. Comments are allowed, and every option is optional.

| Option         | Default      | Description                                                                                    |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `theme`        | `bootstrap`  | `bootstrap`, `bootstrap-alpha`, `bulma`, `daisyui` or `bootswatch/<name>`                      |
| `codeTheme`    | `github`     | `atom-one`, `ayu`, `catppuccin`, `github`, `material`, `night-owl`, `rose-pine` or `solarized` |
| `icons`        | `bootstrap`  | `bootstrap`, `octicons` or `phosphor`                                                          |
| `onChange`     | `banner`     | When the open folder changes, offer a reload (`banner`) or reload at once (`refresh`)          |
| `pageSize`     | `0`          | Entries per page; `0` lists the whole folder on one page                                       |
| `foldersFirst` | `true`       | List folders above files                                                                       |
| `striped`      | `false`      | Alternate row shading                                                                          |
| `dates`        | `relative`   | Show modification dates as `relative` ("3 days ago") or `absolute`                             |
| `ignoredFiles` | system files | Glob patterns for names that are neither listed nor served. Setting it replaces the defaults   |
| `hideDotFiles` | `true`       | Hide dot-files until <kbd>Alt</kbd> is held or `?reveal` is added to the URL                   |
| `hiddenFiles`  | `[]`         | More glob patterns to hide like dot-files                                                      |
| `direction`    | `ltr`        | Text direction, `ltr` or `rtl`                                                                 |
| `renderHtml`   | `true`       | Render HTML files in the viewer, with scripts blocked, or show them as source                  |
| `customTitle`  | `null`       | Page title for every folder instead of "Index of …"                                            |

See [`listr.config.json`](listr.config.json) for an example.

## License

This work is licensed under [The MIT License](LICENSE).
