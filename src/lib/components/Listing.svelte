<script lang="ts">
	import prettyBytes from 'pretty-bytes';
	import { summary, timeAgo } from '#lib/format.ts';
	import { fileKind, getIcons } from '#lib/icons/icons.ts';
	import type { Entry, SortKey } from '#lib/server/listing.ts';
	import { getTheme, type ListingProps } from '#lib/themes/theme.ts';
	import { viewerFor } from '#lib/viewer.ts';
	import { page } from '$app/state';
	import Viewer, { type ViewedFile } from './Viewer.svelte';

	let {
		entries,
		path,
		offset,
		sort,
		order,
		folders,
		files,
		totalSize,
		striped,
		dates,
		renderHtml,
	}: ListingProps = $props();

	const { classes } = getTheme();
	const icons = getIcons();

	let input = $state<HTMLInputElement>();
	let filter = $state('');

	// Only the browser knows the platform, so the server renders the bare label
	let placeholder = $state('Filter');

	$effect(() => {
		placeholder = navigator.userAgent.includes('Mac') ? 'Filter (⌘K)' : 'Filter (Ctrl+K)';
	});

	// macOS stores names decomposed (NFD), typed text is composed (NFC)
	const fold = (text: string) => text.normalize().toLowerCase();

	// Hidden entries show while Alt is held, as in Bootstrap-Listr, or always with ?reveal
	let holdingAlt = $state(false);
	const reveal = $derived(holdingAlt || page.url.searchParams.has('reveal'));

	// ponytail: filters the current page only, filter on the server if paged folders need it
	const shown = $derived(
		entries.filter(
			(entry) =>
				(reveal || !entry.hidden) &&
				(!filter || fold([entry.name, ...entry.chain].join('/')).includes(fold(filter))),
		),
	);

	function onkeydown(event: KeyboardEvent) {
		holdingAlt = event.altKey;
		focusFilter(event);
	}

	// Cmd+K (Ctrl+K off macOS) jumps to the filter and selects what's in it
	function focusFilter(event: KeyboardEvent) {
		if (!input || event.key !== 'k' || !(event.metaKey || event.ctrlKey)) {
			return;
		}

		event.preventDefault();
		input.select();
	}

	// Esc clears the filter, a second Esc leaves it
	function clearFilter(event: KeyboardEvent) {
		if (event.key !== 'Escape') {
			return;
		}

		event.preventDefault();

		if (filter) {
			filter = '';
		} else {
			input?.blur();
		}
	}

	const COLUMNS = 4;

	// Longer collapsed chains show as a / … / y / z
	const MAX_SEGMENTS = 4;

	const href = (parts: string[]) => `/${parts.map(encodeURIComponent).join('/')}`;

	// Indexes of the chain segments to show: a / … / y / z keeps where you are and where you land.
	// -1 stands for the elided middle
	const visible = (parts: string[]) =>
		parts.length > MAX_SEGMENTS
			? [0, -1, parts.length - 2, parts.length - 1]
			: parts.map((_, i) => i);

	// Clicking the active column flips the order; any other column starts ascending, on page 1
	function sortHref(key: SortKey) {
		const params = new URLSearchParams(page.url.search);

		params.set('sort', key);
		params.set('order', key === sort && order === 'asc' ? 'desc' : 'asc');
		params.delete('page');

		return `?${params}`;
	}

	function ariaSort(key: SortKey) {
		if (key !== sort) {
			return ;
		}

		return order === 'asc' ? 'ascending' : 'descending';
	}

	const iso = (date: Date) => date.toISOString().slice(0, 19).replace('T', ' ');

	let viewing = $state<ViewedFile | null>(null);

	// Plain clicks on viewable files open the dialog; modified clicks and other files
	// go to the browser, which opens, downloads or opens a new tab as usual
	function view(event: MouseEvent, entry: Entry) {
		if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		const viewer = viewerFor(entry.name, entry.size, renderHtml);

		if (viewer) {
			event.preventDefault();
			const link = event.currentTarget as HTMLAnchorElement;
			viewing = { name: entry.name, href: link.href, size: entry.size, viewer };
		}
	}
</script>

{#snippet header(key: SortKey, text: string, cellClass: string)}
	<th class={cellClass} aria-sort={ariaSort(key)}>
		<a class={classes.sortLink} href={sortHref(key)}
			>{text}{#if key === sort}{@const Chevron = order === 'asc' ? icons.ascending : icons.descending}<Chevron
					class="chevron"
					aria-hidden="true"
				/>{/if}</a
		>
	</th>
{/snippet}

<!-- Leaving the window mid-press never delivers the keyup, so blur lets go of Alt too -->
<svelte:window
	{onkeydown}
	onkeyup={(event) => {
		holdingAlt = event.altKey;
	}}
	onblur={() => {
		holdingAlt = false;
	}}
/>

<div class={classes.search}>
	<input
		bind:this={input}
		bind:value={filter}
		class={classes.searchInput}
		type="search"
		{placeholder}
		aria-label="Filter"
		onkeydown={clearFilter}
	>
</div>

<div class={classes.tableWrapper}>
	<table class={[classes.table, striped && classes.tableStriped]}>
		<thead>
			<tr>
				<th class="count {classes.count}">#</th>
				{@render header('name', 'Name', '')}
				{@render header('size', 'Size', classes.size)}
				{@render header('modified', 'Modified', classes.modified)}
			</tr>
		</thead>
		<tbody style:--offset={offset}>
			{#each shown as entry (entry.name)}
				{@const parts = [entry.name, ...entry.chain]}
				{@const relative = timeAgo(entry.modifiedDate)}
				{@const absolute = iso(entry.modifiedDate)}
				{@const Icon = icons[fileKind(entry.name, entry.isDirectory)] ?? icons.file}
				<tr>
					<td class="count {classes.count}"></td>
					<td class={[entry.hidden && classes.dotfile]}>
						<Icon class={classes.entryIcon} aria-hidden="true" />
						{#if entry.isDirectory}
							<!-- Each segment links to its own folder; separators are plain text -->
							<span title={parts.join('/')}>
								{#each visible(parts) as index, i (index)}
									{i ? ' / ' : ''}{#if index === -1}…{:else}<a href={href([...path, ...parts.slice(0, index + 1)])}
										>{parts[index]}</a
									>{/if}
								{/each}
							</span>
						{:else}
							<!-- A file, not a page, so SvelteKit's router stays out of it -->
							<a
								href={href([...path, entry.name])}
								data-sveltekit-reload
								onclick={(event) => view(event, entry)}>{entry.name}</a
							>
						{/if}
					</td>
					{#if entry.isDirectory}
						<td class={classes.size}>&mdash;</td>
					{:else}
						<td class={classes.size} title="{entry.size} bytes">{prettyBytes(entry.size)}</td>
					{/if}
					<td class={classes.modified}>
						<!-- The tooltip shows whichever format the column doesn't -->
						<time
							datetime={entry.modifiedDate.toISOString()}
							title={dates === 'relative' ? absolute : relative}
						>
							{dates === 'relative' ? relative : absolute}
						</time>
					</td>
				</tr>
			{:else}
				<tr><td colspan={COLUMNS} class={classes.empty}>{filter ? 'no matches' : 'empty folder'}</td></tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan={COLUMNS} class={classes.summary}>
					{summary(folders, files, totalSize)}
					<a class="kudos" href="https://github.com/idleberg/Bootstrap-Listr" target="_blank" rel="noopener">Fork me on GitHub</a>
				</td>
			</tr>
		</tfoot>
	</table>
</div>

<Viewer bind:file={viewing} />

<style>
	/* Credit at the end of the summary row, in its muted color */
	.kudos {
		float: inline-end;
		color: inherit;
	}

	/* Row numbers without markup, continuing from earlier pages */
	tbody {
		counter-reset: row var(--offset);
	}

	/* Only as wide as the largest number; set on the header too, so the column
	   keeps its width when the filter leaves no rows */
	.count {
		width: 1%;
		white-space: nowrap;
	}

	td.count::before {
		counter-increment: row;
		content: counter(row);
	}

	/* The icon set's chevron in the link color: up for ascending, down for descending */
	th :global(.chevron) {
		display: inline-block;
		width: 1em;
		height: 1em;
		margin-inline-start: 0.2em;
		vertical-align: -0.125em;
	}

	/* Keeps the chevron beside its label in narrow columns */
	th > a {
		white-space: nowrap;
	}
</style>
