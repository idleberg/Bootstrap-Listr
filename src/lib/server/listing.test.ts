import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { type Entry, evict, hashFile, listDirectory, sortEntries } from './listing.ts';

it('lists, caches and evicts folders', async () => {
	const root = await mkdtemp(join(tmpdir(), 'listr-'));
	const sub = join(root, 'a');
	const subsub = join(sub, 'b');
	await mkdir(subsub, { recursive: true });
	await writeFile(join(root, 'file.txt'), 'hi');
	await writeFile(join(root, '.gitignore'), '');
	await writeFile(join(root, 'Thumbs.db'), '');
	await symlink(join(root, 'missing'), join(root, 'broken'));

	// Thumbs.db is ignored, .gitignore hidden by the default patterns
	const entries = await listDirectory(root);
	expect(entries.map((e) => [e.name, e.hidden])).toEqual([
		['a', false],
		['.gitignore', true],
		['file.txt', false],
	]);
	expect(entries.find((e) => e.name === 'a')?.isDirectory).toBe(true);

	// Served from the cache until evicted
	await writeFile(join(root, 'new.txt'), '');
	expect(await listDirectory(root)).toBe(entries);
	evict(join(root, 'new.txt'));
	expect((await listDirectory(root)).length).toBe(4);

	// Deleting a folder evicts its descendants and its ancestors
	const nested = await listDirectory(subsub);
	const top = await listDirectory(root);
	evict(sub);
	expect(await listDirectory(subsub)).not.toBe(nested);
	expect(await listDirectory(root)).not.toBe(top);

	await rm(root, { recursive: true });
});

it('shares reads and drops the least recently used listings', async () => {
	const root = await mkdtemp(join(tmpdir(), 'listr-'));
	const [a, b, c] = ['a', 'b', 'c'].map((name) => join(root, name));

	for (const dir of [a, b, c]) {
		await mkdir(dir);
		await writeFile(join(dir, '1.txt'), '');
		await writeFile(join(dir, '2.txt'), '');
	}

	// Concurrent requests get the same read
	const [first, second] = await Promise.all([listDirectory(a), listDirectory(a)]);
	expect(first).toBe(second);

	// Each folder counts as 3 (2 files plus itself), so a cap of 6 holds two; using a
	// again makes b the least recently used
	const listingB = await listDirectory(b, 6);
	await listDirectory(a, 6);
	await listDirectory(c, 6);
	expect(await listDirectory(a)).toBe(first);
	expect(await listDirectory(b)).not.toBe(listingB);

	await rm(root, { recursive: true });
});

it('collapses folders that only contain one folder', async () => {
	const root = await mkdtemp(join(tmpdir(), 'listr-'));
	await mkdir(join(root, 'a/b/c/d'), { recursive: true });
	await mkdir(join(root, 'a/b/c/e'));
	// Ignored files don't stop a folder from collapsing
	await writeFile(join(root, 'a/.DS_Store'), '');
	await mkdir(join(root, 'f'));
	await writeFile(join(root, 'f/file.txt'), '');

	const entries = await listDirectory(root);
	expect(entries.map((e) => [e.name, e.chain])).toEqual([
		['a', ['b', 'c']],
		['f', []],
	]);

	await rm(root, { recursive: true });
});

it('sorts by column with folders on top', () => {
	const entry = (name: string, size: number, day: number, isDirectory = false): Entry => ({
		name,
		isDirectory,
		size,
		createdDate: new Date(0),
		modifiedDate: new Date(Date.UTC(2026, 0, day)),
		hidden: false,
		chain: [],
	});
	const entries = [
		entry('file10', 1, 3),
		entry('File2', 3, 1),
		entry('b', 4096, 1, true),
		entry('a', 64, 2, true),
		entry('file1', 2, 2),
	];
	const names = (
		key: Parameters<typeof sortEntries>[1],
		order: 'asc' | 'desc',
		foldersFirst = true,
	) => sortEntries(entries, key, order, foldersFirst).map((e) => e.name);

	expect(names('name', 'asc')).toEqual(['a', 'b', 'file1', 'File2', 'file10']);
	expect(names('name', 'desc')).toEqual(['b', 'a', 'file10', 'File2', 'file1']);
	expect(names('size', 'asc')).toEqual(['a', 'b', 'file10', 'file1', 'File2']);
	expect(names('modified', 'desc')).toEqual(['a', 'b', 'file10', 'file1', 'File2']);

	// Mixed: folders sort like files, and count as smaller than any file by size
	expect(names('name', 'asc', false)).toEqual(['a', 'b', 'file1', 'File2', 'file10']);
	expect(names('name', 'desc', false)).toEqual(['file10', 'File2', 'file1', 'b', 'a']);
	expect(names('size', 'asc', false)).toEqual(['a', 'b', 'file10', 'file1', 'File2']);
	expect(names('size', 'desc', false)).toEqual(['File2', 'file1', 'file10', 'b', 'a']);
	expect(names('modified', 'desc', false)).toEqual(['file10', 'file1', 'a', 'File2', 'b']);
});

it('hashes files', async () => {
	const root = await mkdtemp(join(tmpdir(), 'listr-'));
	await writeFile(join(root, 'file.txt'), 'hi');
	expect(await hashFile(join(root, 'file.txt'))).toBe(
		createHash('sha256').update('hi').digest('hex'),
	);
	await rm(root, { recursive: true });
});
