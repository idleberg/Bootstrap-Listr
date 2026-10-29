import { relative, resolve, sep } from 'node:path';
import { LISTR_ROOT } from '$app/env/private';
import { isIgnored } from './listing.ts';

export const publicDir = resolve(LISTR_ROOT);

// Absolute path for a URL path, or null if it escapes `publicDir` (e.g. `../`) or passes
// through an ignored name, so `.git/config` isn't served to someone who guesses it
export function resolvePublic(path: string): string | null {
	const target = resolve(publicDir, path);

	if (target !== publicDir && !target.startsWith(publicDir + sep)) {
		return null;
	}

	return relative(publicDir, target).split(sep).some(isIgnored) ? null : target;
}
