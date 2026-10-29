import { lookup } from 'mrmime';
import { serviceName } from './embed.ts';

type Highlight = (code: string, render?: { line_numbers?: boolean }) => string;
export type LoadLanguage = () => Promise<{ language: () => Highlight }>;

export type Viewer =
	| { kind: 'image' | 'audio' | 'video' | 'pdf' | 'website' | 'embed' | 'text' }
	| { kind: 'source'; load: LoadLanguage };

const bash: LoadLanguage = () => import('@twinkleplop/bash');
const c: LoadLanguage = () => import('@twinkleplop/c');
const cpp: LoadLanguage = () => import('@twinkleplop/cpp');
const html: LoadLanguage = () => import('@twinkleplop/html');
const ini: LoadLanguage = () => import('@twinkleplop/ini');
const javascript: LoadLanguage = () => import('@twinkleplop/javascript');
const nsis: LoadLanguage = () => import('@nsis/twinkleplop');
const markdown: LoadLanguage = () => import('@twinkleplop/markdown');
const powershell: LoadLanguage = () => import('@twinkleplop/powershell');
const tsx: LoadLanguage = () => import('@twinkleplop/tsx');
const typescript: LoadLanguage = () => import('@twinkleplop/typescript');
const yaml: LoadLanguage = () => import('@twinkleplop/yaml');

// twinkleplop languages by extension, or by name for files without one;
// each loads when a file of its kind is first opened
const LANGUAGES: Partial<Record<string, LoadLanguage>> = {
	bash,
	sh: bash,
	zsh: bash,
	c,
	h: c,
	cc: cpp,
	cpp,
	cxx: cpp,
	hpp: cpp,
	css: () => import('@twinkleplop/css'),
	diff: () => import('@twinkleplop/diff'),
	patch: () => import('@twinkleplop/diff'),
	dockerfile: () => import('@twinkleplop/dockerfile'),
	env: () => import('@twinkleplop/dotenv'),
	go: () => import('@twinkleplop/go'),
	gql: () => import('@twinkleplop/graphql'),
	graphql: () => import('@twinkleplop/graphql'),
	htm: html,
	html,
	xhtml: html,
	http: () => import('@twinkleplop/http'),
	cfg: ini,
	ini,
	cjs: javascript,
	js: javascript,
	mjs: javascript,
	json: () => import('@twinkleplop/json'),
	jsonc: () => import('@twinkleplop/jsonc'),
	markdown,
	md: markdown,
	nsh: nsis,
	nsi: nsis,
	ps1: powershell,
	psd1: powershell,
	psm1: powershell,
	py: () => import('@twinkleplop/python'),
	rs: () => import('@twinkleplop/rust'),
	sql: () => import('@twinkleplop/sql'),
	svelte: () => import('@twinkleplop/svelte'),
	toml: () => import('@twinkleplop/toml'),
	jsx: tsx,
	tsx,
	cts: typescript,
	mts: typescript,
	ts: typescript,
	yaml,
	yml: yaml,
};

// Plain text, shown as it is
const TEXT = new Set(['txt', 'nfo', 'diz']);

// ponytail: larger sources open as plain files, highlight in a worker if they need the dialog
const MAX_SOURCE_SIZE = 1_000_000;

// Virtual files are a few dozen bytes; anything bigger isn't one
const MAX_EMBED_SIZE = 1024;

// How the dialog shows `name`, or null to let the browser open it. Images are
// assumed to load; audio, video and PDF only if this browser says it can show them.
// Virtual files get their service's player
// HTML renders, or falls through to highlighting without `renderHtml`
export function viewerFor(name: string, size: number, renderHtml: boolean): Viewer | null {
	if (serviceName(name)) {
		return size <= MAX_EMBED_SIZE ? { kind: 'embed' } : null;
	}

	const type = lookup(name) ?? '';

	if (type.startsWith('image/')) {
		return { kind: 'image' };
	}

	// Mobile browsers mostly can't show PDFs in a frame
	if (type === 'application/pdf' && navigator.pdfViewerEnabled) {
		return { kind: 'pdf' };
	}

	if (renderHtml && (type === 'text/html' || type === 'application/xhtml+xml')) {
		return { kind: 'website' };
	}

	for (const kind of ['audio', 'video'] as const) {
		if (type.startsWith(`${kind}/`) && document.createElement(kind).canPlayType(type)) {
			return { kind };
		}
	}

	const extension = name.slice(name.lastIndexOf('.') + 1).toLowerCase();

	if (size > MAX_SOURCE_SIZE) {
		return null;
	}

	// Decoded as UTF-8 like any text, so DOS art in .nfo and .diz files can come out garbled
	if (TEXT.has(extension)) {
		return { kind: 'text' };
	}

	const load = LANGUAGES[extension];

	return load ? { kind: 'source', load } : null;
}
