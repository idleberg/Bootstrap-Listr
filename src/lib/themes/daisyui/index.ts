import type { Theme } from '../theme.ts';
import stylesheet from './style.css?url';

export default {
	name: 'daisyUI',
	stylesheet,
	classes: {
		container: 'container mx-auto px-4 py-4',
		alert: 'alert alert-warning mb-4 flex justify-between',
		alertButton: 'btn btn-sm',
		// Right-aligned, a third of the width from md up, like Bootstrap-Listr
		search: 'mb-4 ms-auto sm:w-5/12 md:w-1/3',
		searchInput: 'input w-full',
		tableWrapper: 'overflow-x-auto',
		// daisyUI marks hovered rows with .row-hover on each <tr>, which core doesn't render
		table: 'table [&_tbody_tr:hover]:bg-base-200',
		tableStriped: 'table-zebra',
		count: 'text-end text-base-content/60',
		// Muted when revealed, like Bootstrap-Listr's hidden files
		dotfile: 'opacity-50',
		sortLink: 'link link-hover text-base-content',
		size: 'text-end',
		modified: 'text-end',
		empty: 'italic text-base-content/60',
		summary: 'text-sm text-base-content/60',
		pagination: 'flex justify-center gap-2 mt-4',
		pageItem: '',
		pageItemActive: '',
		pageItemDisabled: '',
		pageLink: 'btn btn-sm',
		pageLinkActive: 'btn-primary',
		pageLinkDisabled: 'btn-disabled',
		pageEllipsis: 'btn btn-sm btn-disabled',
		// daisyUI puts .breadcrumbs on the <nav>; style.css does that for this list
		breadcrumb: 'listr-breadcrumbs',
		breadcrumbItem: '',
		breadcrumbItemActive: '',
		// daisyUI's modal is a native <dialog> already; m-auto centers the box in core's flex column
		dialog: 'modal',
		dialogFrame: 'modal-box m-auto w-11/12 max-w-4xl',
		dialogContent: 'flex flex-col gap-4',
		dialogHeader: 'flex items-center justify-between gap-2',
		dialogTitle: 'text-lg font-bold truncate',
		// daisyUI has no close glyph, so the button draws its own
		dialogClose: "btn btn-sm btn-circle btn-ghost after:content-['✕']",
		dialogBody: '',
		dialogFooter: 'modal-action mt-0 items-center',
		dialogMeta: 'me-auto text-base-content/60',
		dialogButton: 'btn',
		dialogDownload: 'btn btn-primary',
		// Preflight makes svg a block
		entryIcon: 'me-2 inline align-middle text-base-content/60',
	},
} satisfies Theme;
