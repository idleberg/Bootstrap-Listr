import { relative, sep } from 'node:path';
import watcher, { type AsyncSubscription } from '@parcel/watcher';
import { evict } from './listing.ts';

// Open event streams; each gets the changed paths, relative to the watched folder
export const listeners = new Set<(paths: string[]) => void>();

// The dev server re-runs `init` when hooks change, without disposing modules,
// so the previous subscription is only reachable through a global
const state = globalThis as typeof globalThis & { listrWatcher?: Promise<AsyncSubscription> };

export async function watch(dir: string) {
	await (await state.listrWatcher)?.unsubscribe();

	state.listrWatcher = watcher.subscribe(dir, (error, events) => {
		if (error) {
			console.error(error);

			return;
		}

		for (const event of events) {
			evict(event.path);
		}

		const paths = events.map((event) => relative(dir, event.path).split(sep).join('/'));

		for (const send of listeners) {
			send(paths);
		}
	});

	return state.listrWatcher;
}
