import { type Component, createContext } from 'svelte';
import type { Entry, SortKey, SortOrder } from '#lib/server/listing.ts';

export interface ListingProps {
	entries: Entry[];
	// URL segments of the folder being listed
	path: string[];
	// Rows on earlier pages, so the row counter continues across pages
	offset: number;
	sort: SortKey;
	order: SortOrder;
	folders: number;
	files: number;
	totalSize: number;
	striped: boolean;
	dates: 'relative' | 'absolute';
	// HTML files in the viewer as rendered pages, or as highlighted source
	renderHtml: boolean;
}

export interface BreadcrumbsProps {
	// URL segments of the folder being listed
	path: string[];
}

export interface PaginationProps {
	current: number;
	total: number;
}

export interface Theme {
	name: string;
	// URL of the compiled CSS; the layout links only the configured theme's
	stylesheet: string;
	classes: Record<
		| 'container'
		| 'alert'
		| 'alertButton'
		| 'search'
		| 'searchInput'
		| 'tableWrapper'
		| 'table'
		| 'tableStriped'
		| 'count'
		| 'dotfile'
		| 'sortLink'
		| 'size'
		| 'modified'
		| 'empty'
		| 'summary'
		| 'pagination'
		| 'pageItem'
		| 'pageItemActive'
		| 'pageItemDisabled'
		| 'pageLink'
		// State on the item, the link or both: Bootstrap marks the item, Bulma the link
		| 'pageLinkActive'
		| 'pageLinkDisabled'
		| 'pageEllipsis'
		| 'breadcrumb'
		| 'breadcrumbItem'
		| 'breadcrumbItemActive'
		// The file viewer, a native <dialog> covering the screen
		| 'dialog'
		| 'dialogFrame'
		| 'dialogContent'
		| 'dialogHeader'
		| 'dialogTitle'
		| 'dialogClose'
		| 'dialogBody'
		| 'dialogFooter'
		| 'dialogMeta'
		| 'dialogButton'
		| 'dialogDownload'
		| 'entryIcon',
		string
	>;
	// Replace a core component where class names aren't enough
	components?: Partial<{
		Listing: Component<ListingProps>;
		Pagination: Component<PaginationProps>;
		Breadcrumbs: Component<BreadcrumbsProps>;
	}>;
}

export const [getTheme, setTheme] = createContext<Theme>();
