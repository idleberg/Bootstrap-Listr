<script lang="ts">
	import { onMount } from 'svelte';
	import { codeThemes } from '#lib/code-themes.ts';
	import bootstrapIcons from '#lib/icons/bootstrap/index.ts';
	import { setIcons } from '#lib/icons/icons.ts';
	import octicons from '#lib/icons/octicons/index.ts';
	import phosphor from '#lib/icons/phosphor/index.ts';
	import { setTheme, type Theme } from '#lib/themes/theme.ts';
	import { afterNavigate, refreshAll } from '$app/navigation';
	import { page } from '$app/state';

	let { data, children } = $props();

	// Every theme's class map is bundled, but only the configured one's CSS loads;
	// a theme is named by its folder, e.g. bootswatch/minty
	const themes = import.meta.glob<Theme>('../lib/themes/**/index.ts', {
		eager: true,
		import: 'default',
	});

	// svelte-ignore state_referenced_locally (config is read once at startup)
	const theme = themes[`../lib/themes/${data.theme}/index.ts`];

  setTheme(theme);

  // svelte-ignore state_referenced_locally
	setIcons({ bootstrap: bootstrapIcons, octicons, phosphor }[data.icons]);

  const { classes } = theme;

  // svelte-ignore state_referenced_locally
	const codeTheme = codeThemes[data.codeTheme];

	let changed = $state(false);

	const within = (path: string, dir: string) =>
		dir === '' || path === dir || path.startsWith(`${dir}/`);

	async function reload() {
		await refreshAll();
		changed = false;
	}

	// A new folder loads fresh data, so an older banner no longer applies
	afterNavigate(() => {
		changed = false;
	});

	onMount(() => {
		const events = new EventSource('/api/events');
		events.onmessage = (event) => {
			const { paths } = JSON.parse(event.data) as { paths: string[] };
			const current = page.params.path ?? '';
			// Below the viewed folder (it may show a collapsed chain through it), or above it (it may be gone)

      if (paths.some((path) => within(path, current) || within(current, path))) {
				if (data.onChange === 'refresh') {
					refreshAll();
				} else {
					changed = true;
				}
			}
		};

		return () => events.close();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href={theme.stylesheet}>
	<link rel="stylesheet" href={codeTheme.light}>
	<link rel="stylesheet" href={codeTheme.dark} media="(prefers-color-scheme: dark)">
</svelte:head>

<main class={classes.container}>
	{#if changed}
		<div class={classes.alert} role="status">
			Files in this folder have changed, refresh to update.
			<button type="button" class={classes.alertButton} onclick={reload}>Refresh</button>
		</div>
	{/if}

	{@render children()}
</main>

<style>
	/* As wide as its message, not the table */
	[role='status'] {
		width: fit-content;
		margin-inline: auto;
		gap: 1rem;
	}
</style>
