import { listeners } from '#lib/server/watcher.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const encoder = new TextEncoder();
	let send: (paths: string[]) => void;

	const stream = new ReadableStream({
		start(controller) {
			send = (paths) => {
				try {
					controller.enqueue(
						encoder.encode(`data: ${JSON.stringify({ type: 'changed', paths })}\n\n`),
					);
				} catch {
					// Closed before `cancel` ran
					listeners.delete(send);
				}
			};

			listeners.add(send);
		},

		cancel() {
			listeners.delete(send);
		},
	});

	return new Response(stream, {
		headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
	});
};
