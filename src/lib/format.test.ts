import { expect, it } from 'vitest';
import { pageList, summary, timeAgo } from './format.ts';

it('formats ages like PHP', () => {
	const now = Date.UTC(2026, 0, 1);
	expect(timeAgo(new Date(now), now)).toBe('0 seconds ago');
	expect(timeAgo(new Date(now - 90_000), now)).toBe('1 minute ago');
	expect(timeAgo(new Date(now - 60_000), now)).toBe('60 seconds ago');
	expect(timeAgo(new Date(now - 3 * 86_400_000), now)).toBe('3 days ago');
});

it('summarizes folders', () => {
	expect(summary(0, 0, 0)).toBe('');
	expect(summary(1, 0, 0)).toBe('1 folder');
	expect(summary(0, 1, 2)).toBe('1 file, 2 B in total');
	expect(summary(2, 3, 2000)).toBe('2 folders and 3 files, 2 kB in total');
});

it('lists pages with gaps', () => {
	expect(pageList(2, 3)).toEqual([1, 2, 3]);
	expect(pageList(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
	expect(pageList(4, 20)).toEqual([1, 2, 3, 4, 5, 0, 20]);
	expect(pageList(5, 20)).toEqual([1, 0, 4, 5, 6, 0, 20]);
	expect(pageList(17, 20)).toEqual([1, 0, 16, 17, 18, 19, 20]);
	expect(pageList(5, 8)).toEqual([1, 0, 4, 5, 6, 7, 8]);
});
