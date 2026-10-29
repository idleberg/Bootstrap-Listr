import { error } from '@sveltejs/kit';
import { config } from '#lib/server/config.ts';
import {
	type Entry,
	listDirectory,
	SORT_KEYS,
	type SortKey,
	type SortOrder,
	sortEntries,
} from '#lib/server/listing.ts';
import { resolvePublic } from '#lib/server/root.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const dir = resolvePublic(params.path);

	if (!dir) {
		error(404);
	}

	let entries: Entry[];

	try {
		entries = await listDirectory(dir);
	} catch (e) {
		const { code } = e as NodeJS.ErrnoException;

		// The handle hook serves files; one only gets here as a client-side navigation
		if (code === 'ENOENT' || code === 'ENOTDIR') {
			error(404);
		}

		throw e;
	}

	let files = 0;
	let totalSize = 0;

	for (const entry of entries) {
		if (!entry.isDirectory) {
			files += 1;
			totalSize += entry.size;
		}
	}

	// Unknown values fall back to the default order instead of failing
	const sortParam = url.searchParams.get('sort') as SortKey;
	const sort = SORT_KEYS.includes(sortParam) ? sortParam : 'name';
	const order: SortOrder = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';

	// The cached listing is already sorted by name with folders first
	// ponytail: other orders re-sort per request, cache them per key if huge folders get slow
	if (sort !== 'name' || order !== 'asc' || !config.foldersFirst) {
		entries = sortEntries(entries, sort, order, config.foldersFirst);
	}

	// Out-of-range pages clamp, so a refresh after deletions doesn't 404
	const { pageSize } = config;
	const pages = pageSize ? Math.max(1, Math.ceil(entries.length / pageSize)) : 1;
	const page = Math.min(Math.max(1, Math.trunc(Number(url.searchParams.get('page'))) || 1), pages);
	const offset = pageSize * (page - 1);

	return {
		// As in PHP: the folder's name, or the host at the root
		title: config.customTitle ?? `Index of ${params.path.split('/').at(-1) || url.host}`,
		entries: pageSize ? entries.slice(offset, offset + pageSize) : entries,
		offset,
		sort,
		order,
		page,
		pages,
		folders: entries.length - files,
		files,
		totalSize,
		striped: config.striped,
		dates: config.dates,
		renderHtml: config.renderHtml,
	};
};
