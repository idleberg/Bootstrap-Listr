import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { lookup } from 'mrmime';

// "bytes=500-999", "bytes=500-" or "bytes=-500"; multiple ranges get the whole file
const RANGE = /^bytes=(?<first>\d*)-(?<last>\d*)$/u;

// Streams `file` from disk, so a movie never sits in memory, and honors single
// ranges, which players need to seek. Null if `file` isn't a regular file
export async function serveFile(file: string, request: Request): Promise<Response | null> {
	let size: number;
	let mtime: Date;

	try {
		const stats = await stat(file);

		if (!stats.isFile()) {
			return null;
		}

		({ size, mtime } = stats);
	} catch {
		return null;
	}

	const headers: Record<string, string> = {
		'content-type': lookup(file) ?? 'application/octet-stream',
		'accept-ranges': 'bytes',
		'last-modified': mtime.toUTCString(),
		// Served HTML runs in its own origin, not the app's, and types aren't guessed
		'content-security-policy': 'sandbox',
		'x-content-type-options': 'nosniff',
	};

	let start = 0;
	let end = size - 1;
	let status = 200;
	const { first, last } = request.headers.get('range')?.match(RANGE)?.groups ?? {};

	if (first || last) {
		if (first) {
			start = Number(first);
			end = last ? Math.min(Number(last), size - 1) : size - 1;
		} else {
			start = Math.max(0, size - Number(last));
		}

		if (start > end) {
			return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } });
		}

		status = 206;
		headers['content-range'] = `bytes ${start}-${end}/${size}`;
	}

	headers['content-length'] = String(end - start + 1);

	// An empty file has no byte range to read
	const body =
		request.method === 'HEAD' || size === 0
			? null
			: (Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream);

	return new Response(body, { status, headers });
}
