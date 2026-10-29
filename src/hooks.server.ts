import process from 'node:process';
import type { Handle, ServerInit } from '@sveltejs/kit/hooks';
import { config } from '#lib/server/config.ts';
import { serveFile } from '#lib/server/files.ts';
import { publicDir, resolvePublic } from '#lib/server/root.ts';
import { watch } from '#lib/server/watcher.ts';

export const init: ServerInit = async () => {
	const subscription = await watch(publicDir);

	// Emitted by adapter-node on SIGINT/SIGTERM
	process.once('sveltekit:shutdown', () => subscription.unsubscribe());
};

// Files are served at their own path; everything else is a folder page
export const handle: Handle = async ({ event, resolve }) => {
	if (!event.isDataRequest) {
		const path = resolvePublic(decodePath(event.url.pathname));
		const file = path && (await serveFile(path, event.request));

		if (file) {
			return file;
		}
	}

	// The stylesheet carries rules for both directions; dir on <html> picks one
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%listr.direction%', config.direction),
	});
};

// A malformed escape like %E0 can't name a file
function decodePath(pathname: string) {
	try {
		return decodeURIComponent(pathname.slice(1));
	} catch {
		return '';
	}
}
