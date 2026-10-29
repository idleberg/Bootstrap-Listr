<script lang="ts">
	import { pageList } from '#lib/format.ts';
	import { getTheme, type PaginationProps } from '#lib/themes/theme.ts';
	import { page } from '$app/state';

	let { current, total }: PaginationProps = $props();

	const { classes } = getTheme();

	// Keeps the sort order while paging
	function pageHref(target: number) {
		const params = new URLSearchParams(page.url.search);
		params.set('page', String(target));

		return `?${params}`;
	}
</script>

<!-- A disabled arrow isn't a control, so screen readers skip it -->
{#snippet step(target: number, arrow: string, label: string, disabled: boolean)}
	<li class="{classes.pageItem} {disabled ? classes.pageItemDisabled : ''}">
		{#if disabled}
			<span class="{classes.pageLink} {classes.pageLinkDisabled}" aria-hidden="true">{arrow}</span>
		{:else}
			<a class={classes.pageLink} href={pageHref(target)} aria-label={label}>{arrow}</a>
		{/if}
	</li>
{/snippet}

{#if total > 1}
	<nav aria-label="Pages">
		<ul class={classes.pagination}>
			{@render step(current - 1, '«', 'Previous', current === 1)}
			{#each pageList(current, total) as target, i (i)}
				{#if !target}
					<li class="{classes.pageItem} {classes.pageItemDisabled}">
						<span class={classes.pageEllipsis}>…</span>
					</li>
				{:else if target === current}
					<li class="{classes.pageItem} {classes.pageItemActive}" aria-current="page">
						<span class="{classes.pageLink} {classes.pageLinkActive}">{target}</span>
					</li>
				{:else}
					<li class={classes.pageItem}>
						<a class={classes.pageLink} href={pageHref(target)}>{target}</a>
					</li>
				{/if}
			{/each}
			{@render step(current + 1, '»', 'Next', current === total)}
		</ul>
	</nav>
{/if}
