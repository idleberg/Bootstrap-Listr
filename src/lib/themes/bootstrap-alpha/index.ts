import type { Theme } from '../theme.ts';
import stylesheet from './style.scss?url';

// Bootstrap 6 renames most of what Bootstrap 5 calls the same, so it's a class
// map of its own rather than an extension of ../bootstrap
export default {
	name: 'Bootstrap 6 (alpha)',
	stylesheet,
	classes: {
		container: 'container py-3',
		// Theme colors are modifiers in Bootstrap 6: .alert.theme-warning, not .alert-warning
		alert: 'alert theme-warning align-items-center justify-content-between',
		alertButton: 'btn-solid theme-warning btn-sm',
		// Responsive classes take a prefix in Bootstrap 6: sm:col-5, not col-sm-5
		search: 'sm:col-5 md:col-4 ms-auto mb-3',
		searchInput: 'form-control',
		tableWrapper: 'table-responsive',
		table: 'table table-hover',
		tableStriped: 'table-striped',
		count: 'text-end fg-3',
		dotfile: 'opacity-50',
		sortLink: 'fg-body text-decoration-none',
		size: 'text-end',
		modified: 'text-end',
		empty: 'fst-italic fg-3',
		summary: 'small fg-3',
		pagination: 'pagination justify-content-center',
		pageItem: 'page-item',
		pageItemActive: 'active',
		pageItemDisabled: 'disabled',
		pageLink: 'page-link',
		pageLinkActive: '',
		pageLinkDisabled: '',
		pageEllipsis: 'page-link',
		breadcrumb: 'breadcrumb',
		breadcrumbItem: 'breadcrumb-item',
		breadcrumbItemActive: 'active',
		// Bootstrap 6 has a native <dialog> component; its box is the frame here
		// (see style.scss), and the <dialog> a full-screen layer around it
		dialog: 'w-100 h-100',
		dialogFrame: 'dialog dialog-lg dialog-instant',
		dialogContent: '',
		dialogHeader: 'dialog-header',
		dialogTitle: 'dialog-title text-truncate',
		dialogClose: 'btn-close',
		dialogBody: 'dialog-body',
		dialogFooter: 'dialog-footer',
		dialogMeta: 'me-auto fg-3',
		dialogButton: 'btn-solid theme-secondary',
		dialogDownload: 'btn-solid theme-primary',
		entryIcon: 'me-2 fg-3',
	},
} satisfies Theme;
