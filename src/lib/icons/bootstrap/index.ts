// Bootstrap Icons; the outline ones drop -fill. The filetype-* icons exist
// only as outlines, so they'd clash with these and aren't used

import Descending from '~icons/bi/chevron-down';
import Ascending from '~icons/bi/chevron-up';
import File from '~icons/bi/file-earmark';
import Binary from '~icons/bi/file-earmark-binary';
import Code from '~icons/bi/file-earmark-code';
import Diff from '~icons/bi/file-earmark-diff';
import Excel from '~icons/bi/file-earmark-excel';
import Font from '~icons/bi/file-earmark-font';
import Image from '~icons/bi/file-earmark-image';
import Lock from '~icons/bi/file-earmark-lock';
import Music from '~icons/bi/file-earmark-music';
import Pdf from '~icons/bi/file-earmark-pdf';
import Play from '~icons/bi/file-earmark-play';
import Ppt from '~icons/bi/file-earmark-ppt';
import Richtext from '~icons/bi/file-earmark-richtext';
import Spreadsheet from '~icons/bi/file-earmark-spreadsheet';
import Text from '~icons/bi/file-earmark-text';
import Word from '~icons/bi/file-earmark-word';
import Zip from '~icons/bi/file-earmark-zip';
import Folder from '~icons/bi/folder-fill';
import Home from '~icons/bi/house-door-fill';
import type { IconSet } from '../icons.ts';

export default {
	folder: Folder,
	file: File,
	home: Home,
	ascending: Ascending,
	descending: Descending,
	archive: Zip,
	audio: Music,
	binary: Binary,
	code: Code,
	crypto: Lock,
	diff: Diff,
	document: Word,
	font: Font,
	image: Image,
	pdf: Pdf,
	presentation: Ppt,
	richtext: Richtext,
	spreadsheet: Excel,
	table: Spreadsheet,
	text: Text,
	video: Play,
} satisfies IconSet;
