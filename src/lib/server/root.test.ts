import { join } from 'node:path';
import { expect, it } from 'vitest';
import { publicDir, resolvePublic } from './root.ts';

it('refuses paths outside the root or through ignored names', () => {
	expect(resolvePublic('')).toBe(publicDir);
	expect(resolvePublic('a/file.txt')).toBe(join(publicDir, 'a/file.txt'));
	expect(resolvePublic('../outside')).toBeNull();
	expect(resolvePublic('.git/config')).toBeNull();
	expect(resolvePublic('a/.DS_Store')).toBeNull();
	expect(resolvePublic('a/b/../.git')).toBeNull();
});
