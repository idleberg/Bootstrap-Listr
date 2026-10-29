// Octicons, GitHub's UI icons; there are no document, font, PDF, slide or
// spreadsheet icons, so those kinds fall back to `file`

import Descending from '~icons/octicon/chevron-down-16';
import Ascending from '~icons/octicon/chevron-up-16';
import File from '~icons/octicon/file-16';
import Binary from '~icons/octicon/file-binary-16';
import Code from '~icons/octicon/file-code-16';
import Diff from '~icons/octicon/file-diff-16';
import Folder from '~icons/octicon/file-directory-fill-16';
import Image from '~icons/octicon/file-media-16';
import Zip from '~icons/octicon/file-zip-16';
import Home from '~icons/octicon/home-fill-16';
import Lock from '~icons/octicon/lock-16';
import Unmute from '~icons/octicon/unmute-16';
import Video from '~icons/octicon/video-16';
import type { IconSet } from '../icons.ts';

export default {
	folder: Folder,
	file: File,
	home: Home,
	ascending: Ascending,
	descending: Descending,
	archive: Zip,
	audio: Unmute,
	binary: Binary,
	code: Code,
	crypto: Lock,
	diff: Diff,
	image: Image,
	video: Video,
} satisfies IconSet;
