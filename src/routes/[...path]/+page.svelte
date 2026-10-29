<script lang="ts">
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Listing from '#lib/components/Listing.svelte';
	import Pagination from '#lib/components/Pagination.svelte';
	import { getTheme } from '#lib/themes/theme.ts';
	import { page } from '$app/state';

	let { data } = $props();

	const { components } = getTheme();
	const ThemedBreadcrumbs = components?.Breadcrumbs ?? Breadcrumbs;
	const ThemedListing = components?.Listing ?? Listing;
	const ThemedPagination = components?.Pagination ?? Pagination;

	const path = $derived(page.params.path ? page.params.path.split('/') : []);
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<ThemedBreadcrumbs {path} />

<!-- A new folder starts with an empty filter; sorting, paging and live refreshes keep it -->
{#key page.params.path}
	<ThemedListing
		entries={data.entries}
		{path}
		offset={data.offset}
		sort={data.sort}
		order={data.order}
		folders={data.folders}
		files={data.files}
		totalSize={data.totalSize}
		striped={data.striped}
		dates={data.dates}
		renderHtml={data.renderHtml}
	/>
{/key}

<ThemedPagination current={data.page} total={data.pages} />
