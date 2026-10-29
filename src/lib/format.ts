import prettyBytes from 'pretty-bytes';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 31_570_560],
	['month', 2_630_880],
	['week', 604_800],
	['day', 86_400],
	['hour', 3600],
	['minute', 60],
	['second', 1],
];

const relative = new Intl.RelativeTimeFormat('en');

// Largest unit that fits more than once, rounded down, as in PHP's time_ago
export function timeAgo(date: Date, now = Date.now()): string {
	const seconds = Math.max(0, (now - date.getTime()) / 1000);
	const [unit, length] = UNITS.find(([, size]) => seconds / size > 1) ?? ['second', 1];

	return relative.format(-Math.floor(seconds / length), unit);
}

const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// "2 folders and 1 file, 4 kB in total"; folders don't add to the size
export function summary(folders: number, files: number, totalSize: number): string {
	const parts: string[] = [];

	if (folders) {
		parts.push(count(folders, 'folder'));
	}

	if (files) {
		parts.push(count(files, 'file'));
	}

	const text = parts.join(' and ');

	return files ? `${text}, ${prettyBytes(totalSize)} in total` : text;
}

// First, last, current and one neighbour each side, plus two gaps
const PAGE_SLOTS = 7;

// The pages a pager shows, 0 standing for a gap. Always PAGE_SLOTS of them, so the pager
// keeps its width; a gap hides at least two pages, so near either end the run grows
// instead: 1 2 3 4 5 … 20, 1 … 5 6 7 … 20, 1 … 16 17 18 19 20
export function pageList(current: number, total: number): number[] {
	const run = (from: number, length: number) => Array.from({ length }, (_, i) => from + i);

	// Slots left beside the gap and the page across it
	const end = PAGE_SLOTS - 2;

	if (total <= PAGE_SLOTS) {
		return run(1, total);
	}

	if (current < end) {
		return [...run(1, end), 0, total];
	}

	if (current > total - end + 1) {
		return [1, 0, ...run(total - end + 1, end)];
	}

	return [1, 0, current - 1, current, current + 1, 0, total];
}
