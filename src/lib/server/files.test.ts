import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { serveFile } from './files.ts';

const get = (range?: string) => new Request('http://listr/', { headers: range ? { range } : {} });

it('serves whole files and single ranges', async () => {
	const root = await mkdtemp(join(tmpdir(), 'listr-'));
	const file = join(root, 'a.txt');
	await writeFile(file, '0123456789');

	const whole = await serveFile(file, get());
	expect(whole?.status).toBe(200);
	expect(whole?.headers.get('content-type')).toBe('text/plain');
	expect(await whole?.text()).toBe('0123456789');

	for (const [range, body, contentRange] of [
		['bytes=2-4', '234', 'bytes 2-4/10'],
		['bytes=7-', '789', 'bytes 7-9/10'],
		['bytes=-2', '89', 'bytes 8-9/10'],
		['bytes=8-99', '89', 'bytes 8-9/10'],
	]) {
		const partial = await serveFile(file, get(range));
		expect(partial?.status).toBe(206);
		expect(partial?.headers.get('content-range')).toBe(contentRange);
		expect(await partial?.text()).toBe(body);
	}

	expect((await serveFile(file, get('bytes=10-')))?.status).toBe(416);
	// Multiple ranges aren't supported, so they get the whole file
	expect((await serveFile(file, get('bytes=0-1,4-5')))?.status).toBe(200);

	expect(await serveFile(root, get())).toBeNull();
	expect(await serveFile(join(root, 'missing'), get())).toBeNull();

	await rm(root, { recursive: true });
});
