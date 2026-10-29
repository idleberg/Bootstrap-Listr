<script lang="ts">
	import { getIcons } from '#lib/icons/icons.ts';
	import { type BreadcrumbsProps, getTheme } from '#lib/themes/theme.ts';

	let { path }: BreadcrumbsProps = $props();

	const { classes } = getTheme();
	const { home: Home } = getIcons();

	// The root is the icon set's home icon, named for screen readers
	const crumbs = $derived([
		{ name: '', href: '/' },
		...path.map((name, i) => ({
			name,
			href: `/${path
				.slice(0, i + 1)
				.map(encodeURIComponent)
				.join('/')}`,
		})),
	]);
</script>

{#snippet label(name: string)}
	{#if name}
		{name}
	{:else}
		<Home class="home" role="img" aria-label="Home" />
	{/if}
{/snippet}

<nav aria-label="Breadcrumb">
	<ol class={classes.breadcrumb}>
		{#each crumbs as crumb, i (crumb.href)}
			{#if i === crumbs.length - 1}
				<li class="{classes.breadcrumbItem} {classes.breadcrumbItemActive}" aria-current="page">
					{@render label(crumb.name)}
				</li>
			{:else}
				<li class={classes.breadcrumbItem}><a href={crumb.href}>{@render label(crumb.name)}</a></li>
			{/if}
		{/each}
	</ol>
</nav>

<style>
	/* Sits on the text baseline like a letter */
	nav :global(.home) {
		vertical-align: -0.125em;
	}
</style>
