import { lookup } from 'mrmime';
import { type Component, createContext } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';

// What an entry is, as far as its icon goes; each icon set draws these
export type FileKind =
	| 'folder'
	| 'file'
	| 'archive'
	| 'audio'
	| 'binary'
	| 'code'
	| 'crypto'
	| 'diff'
	| 'document'
	| 'font'
	| 'image'
	| 'pdf'
	| 'presentation'
	| 'richtext'
	| 'spreadsheet'
	| 'table'
	| 'text'
	| 'video';

type Icon = Component<SVGAttributes<SVGSVGElement>>;

// A set without an icon for a kind falls back to `file`; `home` is the breadcrumbs' root, `ascending` and `descending` mark the sorted column
export type IconSet = Record<'folder' | 'file' | 'home' | 'ascending' | 'descending', Icon> &
	Partial<Record<FileKind, Icon>>;

const BY_EXTENSION: Partial<Record<string, FileKind>> = {};

for (const [kind, extensions] of [
	['archive', '7z bz2 gz rar tar tgz xz zip zst'],
	['audio', 'bandcamp mixcloud soundcloud'],
	['binary', 'bin dll dmg exe iso msi so dylib'],
	[
		'code',
		'bash c cc cfg cjs cpp cs css cts cxx dockerfile env go gql graphql h hpp htm html http ini java js json jsonc jsx kt lua mjs mts nsh nsi php pl ps1 psd1 psm1 py rb rs sass scss sh sql svelte swift toml ts tsx vue xhtml xml yaml yml zsh',
	],
	['diff', 'diff patch'],
	['document', 'doc docx odt pages'],
	['font', 'otf ttf woff woff2'],
	['crypto', 'asc gpg p12 pem'],
	['pdf', 'pdf'],
	['presentation', 'key odp ppt pptx'],
	['richtext', 'rtf'],
	['spreadsheet', 'numbers ods xls xlsx'],
	['table', 'csv tsv'],
	['text', 'diz log markdown md nfo txt'],
	['video', 'vimeo youtube'],
] as const) {
	for (const extension of extensions.split(' ')) {
		BY_EXTENSION[extension] = kind;
	}
}

// Fallbacks by the first half of the content type
const BY_TYPE: Partial<Record<string, FileKind>> = {
	audio: 'audio',
	font: 'font',
	image: 'image',
	video: 'video',
};

// By extension, then by content type (mrmime), then a generic file
export function fileKind(name: string, isDirectory: boolean): FileKind {
	if (isDirectory) {
		return 'folder';
	}

	return (
		BY_EXTENSION[name.slice(name.lastIndexOf('.') + 1).toLowerCase()] ??
		BY_TYPE[lookup(name)?.split('/')[0] ?? ''] ??
		'file'
	);
}

export const [getIcons, setIcons] = createContext<IconSet>();
