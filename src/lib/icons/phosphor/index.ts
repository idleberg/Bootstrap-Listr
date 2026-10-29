// Phosphor, regular weight; there are no binary, diff or font file icons, so
// those kinds fall back to `file`

import Descending from '~icons/ph/caret-down';
import Ascending from '~icons/ph/caret-up';
import File from '~icons/ph/file';
import Audio from '~icons/ph/file-audio';
import Code from '~icons/ph/file-code';
import Csv from '~icons/ph/file-csv';
import Doc from '~icons/ph/file-doc';
import Image from '~icons/ph/file-image';
import Lock from '~icons/ph/file-lock';
import Pdf from '~icons/ph/file-pdf';
import Ppt from '~icons/ph/file-ppt';
import Text from '~icons/ph/file-text';
import Txt from '~icons/ph/file-txt';
import Video from '~icons/ph/file-video';
import Xls from '~icons/ph/file-xls';
import Zip from '~icons/ph/file-zip';
import Folder from '~icons/ph/folder-fill';
import Home from '~icons/ph/house-fill';
import type { IconSet } from '../icons.ts';

export default {
	folder: Folder,
	file: File,
	home: Home,
	ascending: Ascending,
	descending: Descending,
	archive: Zip,
	audio: Audio,
	code: Code,
	crypto: Lock,
	document: Doc,
	image: Image,
	pdf: Pdf,
	presentation: Ppt,
	richtext: Text,
	spreadsheet: Xls,
	table: Csv,
	text: Txt,
	video: Video,
} satisfies IconSet;
