import type { Theme } from '../theme.ts';
import stylesheet from './style.scss?url';

export default {
	name: 'Bulma',
	stylesheet,
	classes: {
		container: 'container px-3 py-4',
		alert: 'notification is-warning is-flex is-align-items-center is-justify-content-space-between',
		alertButton: 'button is-small',
		search: 'listr-search mb-4',
		searchInput: 'input',
		tableWrapper: 'table-container',
		table: 'table is-fullwidth is-hoverable',
		tableStriped: 'is-striped',
		count: 'has-text-right has-text-grey',
		dotfile: 'listr-dotfile',
		sortLink: 'has-text-current',
		size: 'has-text-right',
		modified: 'has-text-right',
		empty: 'is-italic has-text-grey',
		summary: 'is-size-7 has-text-grey',
		// Bulma's .pagination and .pagination-list sit on a <nav> and a <ul> inside it;
		// both on the <ul> work too
		pagination: 'pagination pagination-list is-justify-content-center',
		pageItem: '',
		pageItemActive: '',
		pageItemDisabled: '',
		pageLink: 'pagination-link',
		pageLinkActive: 'is-current',
		pageLinkDisabled: 'is-disabled',
		pageEllipsis: 'pagination-ellipsis',
		// Bulma puts .breadcrumb on the <nav> and styles the list inside it
		breadcrumb: 'breadcrumb is-flex is-flex-wrap-wrap',
		breadcrumbItem: '',
		breadcrumbItemActive: 'is-active',
		// Bulma's modal card on a native <dialog>, without .modal-background or .is-active
		dialog: 'modal',
		dialogFrame: 'modal-card',
		// An extra box Bulma's card lacks; flex and clipped, so the body still scrolls
		dialogContent: 'is-flex is-flex-direction-column is-clipped',
		dialogHeader: 'modal-card-head',
		dialogTitle: 'modal-card-title is-size-5 listr-truncate',
		dialogClose: 'delete',
		dialogBody: 'modal-card-body',
		dialogFooter: 'modal-card-foot',
		dialogMeta: 'mr-auto has-text-grey',
		dialogButton: 'button mr-2',
		dialogDownload: 'button is-link',
		entryIcon: 'mr-2 has-text-grey listr-icon',
	},
} satisfies Theme;
