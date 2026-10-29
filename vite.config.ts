import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/postcss';
import postcssRTLCSS from 'postcss-rtlcss';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit({ adapter: adapter() }), icons({ compiler: 'svelte' })],

	css: {
		// Tailwind skips CSS without its at-rules, so it builds only the daisyUI theme;
		// @tailwindcss/vite would skip it too, as themes import their CSS with ?url.
		// Adds mirrored [dir="rtl"] rules next to the physical left/right ones, so one
		// stylesheet serves both directions. safeBothPrefix gives shorthands like
		// .breadcrumb { padding: 0 } the same [dir] boost, or [dir] ol { padding-right } wins
		postcss: {
			plugins: [/* fucking */ tailwindcss(), postcssRTLCSS({ safeBothPrefix: true })],
		},
		preprocessorOptions: {
			scss: {
				// Bootstrap 5 still uses @import and global Sass functions; it can't be
				// loaded with @use until Bootstrap 6
				quietDeps: true,
				silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
			},
		},
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
