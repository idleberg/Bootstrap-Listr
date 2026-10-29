import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { opendir, readdir, stat } from 'node:fs/promises';
import { dirname, join, matchesGlob, sep } from 'node:path';
import { config } from './config.ts';

export interface Entry {
	name: string;
	isDirectory: boolean;
	size: number;
	createdDate: Date;
	modifiedDate: Date;
	// A dot-file with `hideDotFiles`, or matches `hiddenFiles`, so it shows only when revealed
	hidden: boolean;
	// Folders this one collapses into, e.g. ['b', 'c'] for a/b/c; empty for files
	chain: string[];
}

// Enough parallel stat calls to be fast, few enough to stay clear of EMFILE
const STAT_BATCH_SIZE = 64;

// Patterns match the name, not the path; `*` skips dot-files, as in a shell
const matches = (name: string, patterns: string | string[]) =>
	[patterns].flat().some((pattern) => matchesGlob(name, pattern));

// Ignored entries never reach the page; hidden ones are sent and revealed in the browser
export const isIgnored = (name: string) => matches(name, config.ignoredFiles);

// Guards against absurdly deep chains; symlinks can't loop since Dirent skips them
const MAX_CHAIN_DEPTH = 32;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

// About 190 MB at the ~380 bytes an entry takes on the heap
const MAX_CACHED_ENTRIES = 500_000;

// A listing, or the read in progress, so concurrent requests share one read.
// `size` counts its entries plus one for the folder itself, 0 until the read is done
interface Slot {
	entries: Promise<Entry[]>;
	size: number;
}

// Least recently used first: a hit moves its folder to the end
const cache = new Map<string, Slot>();
let cachedEntries = 0;

// Name of the only entry in `dir` if it's a folder, else null
async function onlySubfolder(dir: string): Promise<string | null> {
	let found: string | null = null;

	try {
		for await (const entry of await opendir(dir)) {
			if (!isIgnored(entry.name)) {
				// Returning closes the directory, so a huge folder costs about two reads
				if (found || !entry.isDirectory()) {
					return null;
				}

				found = entry.name;
			}
		}
	} catch {
		// Unreadable or gone: show the folder uncollapsed
		return null;
	}

	return found;
}

export async function collapseChain(dir: string): Promise<string[]> {
	const chain: string[] = [];
	let next = await onlySubfolder(dir);

	while (next && chain.length < MAX_CHAIN_DEPTH) {
		chain.push(next);
		next = await onlySubfolder(join(dir, ...chain));
	}

	return chain;
}

async function statEntry(dir: string, name: string): Promise<Entry | null> {
	try {
		const path = join(dir, name);
		const stats = await stat(path);
		const isDirectory = stats.isDirectory();

		return {
			name,
			isDirectory,
			size: stats.size,
			createdDate: stats.birthtime,
			modifiedDate: stats.mtime,
			hidden: (config.hideDotFiles && name.startsWith('.')) || matches(name, config.hiddenFiles),
			chain: isDirectory ? await collapseChain(path) : [],
		};
	} catch (error) {
		// Deleted since readdir, or a broken symlink
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return null;
		}

		throw error;
	}
}

async function readListing(dir: string): Promise<Entry[]> {
	const names = (await readdir(dir)).filter((name) => !isIgnored(name));
	const entries: Entry[] = [];

	for (let i = 0; i < names.length; i += STAT_BATCH_SIZE) {
		const batch = names.slice(i, i + STAT_BATCH_SIZE);

		for (const entry of await Promise.all(batch.map((name) => statEntry(dir, name)))) {
			if (entry) {
				entries.push(entry);
			}
		}
	}

	return sortEntries(entries, 'name', 'asc');
}

export const SORT_KEYS = ['name', 'size', 'modified'] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export type SortOrder = 'asc' | 'desc';

// A folder's own size says nothing about its contents, so folders count as -1, as in PHP:
// below every file, and among themselves by name
const bytes = (entry: Entry) => (entry.isDirectory ? -1 : entry.size);

const compare: Record<SortKey, (a: Entry, b: Entry) => number> = {
	// Natural, case-insensitive (file2 before file10), as in PHP
	name: (a, b) => collator.compare(a.name, b.name),
	size: (a, b) => bytes(a) - bytes(b),
	modified: (a, b) => a.modifiedDate.getTime() - b.modifiedDate.getTime(),
};

// With `foldersFirst`, folders stay on top in either order; ties fall back to name
export function sortEntries(
	entries: Entry[],
	key: SortKey,
	order: SortOrder,
	foldersFirst = true,
): Entry[] {
	const sign = order === 'asc' ? 1 : -1;

	return entries.toSorted(
		(a, b) =>
			(foldersFirst ? Number(b.isDirectory) - Number(a.isDirectory) : 0) ||
			sign * compare[key](a, b) ||
			sign * compare.name(a, b),
	);
}

// `maxEntries` is only lowered by tests
export function listDirectory(dir: string, maxEntries = MAX_CACHED_ENTRIES): Promise<Entry[]> {
	const cached = cache.get(dir);

	if (cached) {
		cache.delete(dir);
		cache.set(dir, cached);

		return cached.entries;
	}

	const slot: Slot = { entries: readListing(dir), size: 0 };
	cache.set(dir, slot);

	// Evicted while reading means the result may be stale, so it isn't counted or kept
	slot.entries.then(
		(entries) => {
			if (cache.get(dir) === slot) {
				slot.size = entries.length + 1;
				cachedEntries += slot.size;
				trim(dir, maxEntries);
			}
		},
		() => {
			// Failed reads aren't cached; the caller gets the error
			if (cache.get(dir) === slot) {
				cache.delete(dir);
			}
		},
	);

	return slot.entries;
}

// Drops the least recently used listings until the cap holds. `keep` stays even if it's
// over the cap alone, since a huge folder is the one that's slowest to read again.
// Reads in progress have no size yet, so dropping them would free nothing
function trim(keep: string, maxEntries: number) {
	for (const [dir, slot] of cache) {
		if (cachedEntries <= maxEntries) {
			return;
		}

		if (dir !== keep && slot.size > 0) {
			drop(dir);
		}
	}
}

function drop(dir: string) {
	cachedEntries -= cache.get(dir)?.size ?? 0;
	cache.delete(dir);
}

// Drops every cached listing a change to `path` can affect: its ancestors, and
// the folder itself plus everything below it in case `path` was a deleted folder
export function evict(path: string) {
	for (const dir of cache.keys()) {
		if (dir === path || dir.startsWith(path + sep)) {
			drop(dir);
		}
	}

	for (let dir = dirname(path); ; dir = dirname(dir)) {
		drop(dir);

		if (dir === dirname(dir)) {
			break;
		}
	}
}

export async function hashFile(path: string): Promise<string> {
	const hash = createHash('sha256');

	for await (const chunk of createReadStream(path)) {
		hash.update(chunk);
	}

	return hash.digest('hex');
}
