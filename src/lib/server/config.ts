import { readFile } from 'node:fs/promises';
import stripJsonComments from 'strip-json-comments';

// Folders in src/lib/themes, Bootswatch ones under bootswatch/
const THEMES = [
	'bootstrap',
	'bootstrap-alpha',
	'bootswatch/brite',
	'bootswatch/cerulean',
	'bootswatch/cosmo',
	'bootswatch/cyborg',
	'bootswatch/darkly',
	'bootswatch/flatly',
	'bootswatch/journal',
	'bootswatch/litera',
	'bootswatch/lumen',
	'bootswatch/lux',
	'bootswatch/materia',
	'bootswatch/minty',
	'bootswatch/morph',
	'bootswatch/pulse',
	'bootswatch/quartz',
	'bootswatch/sandstone',
	'bootswatch/simplex',
	'bootswatch/sketchy',
	'bootswatch/slate',
	'bootswatch/solar',
	'bootswatch/spacelab',
	'bootswatch/superhero',
	'bootswatch/united',
	'bootswatch/vapor',
	'bootswatch/yeti',
	'bootswatch/zephyr',
	'bulma',
	'daisyui',
] as const;

export interface Config {
	// Look of the page, one of THEMES
	theme: (typeof THEMES)[number];
	// Colors of highlighted source in the viewer, with any theme: a twinkleplop theme
	codeTheme:
		| 'atom-one'
		| 'ayu'
		| 'catppuccin'
		| 'github'
		| 'material'
		| 'night-owl'
		| 'rose-pine'
		| 'solarized';
	// File icons, with any theme: a folder in src/lib/icons
	icons: 'bootstrap' | 'octicons' | 'phosphor';
	// What the page does when its folder changes: offer a reload, or reload at once
	onChange: 'banner' | 'refresh';
	// Entries per page; 0 lists the whole folder on one page
	pageSize: number;
	// Folders above files, like Windows Explorer; false mixes them, like macOS Finder
	foldersFirst: boolean;
	// Alternate row shading
	striped: boolean;
	// Modified column as "3 days ago" or "2024-05-01 13:37:00"
	dates: 'relative' | 'absolute';
	// Names left out of the listing, as glob patterns like `*.tmp`
	ignoredFiles: string | string[];
	// Names starting with a dot, listed but hidden until revealed (hold Alt, or ?reveal)
	hideDotFiles: boolean;
	// More names to hide like dot-files, as glob patterns
	hiddenFiles: string | string[];
	// Text direction of the page, for right-to-left languages
	direction: 'ltr' | 'rtl';
	// HTML files in the viewer as rendered pages, or as highlighted source
	renderHtml: boolean;
	// Page title for every folder, instead of "Index of <folder>"
	customTitle: string | null;
}

const defaults: Config = {
	theme: 'bootstrap',
	codeTheme: 'github',
	icons: 'bootstrap',
	onChange: 'banner',
	pageSize: 0,
	foldersFirst: true,
	striped: false,
	dates: 'relative',
	// PHP's list, without .listr and with desktop.ini
	ignoredFiles: [
		'.apdisk',
		'.AppleDB',
		'.AppleDesktop',
		'.AppleDouble',
		'.bzr',
		'.DAV',
		'.DocumentRevisions-V100',
		'.DS_Store',
		'.fseventsd',
		'.git',
		'.hg',
		'.htaccess',
		'.htpasswd',
		'.LSOverride',
		'.Spotlight-V100',
		'.svn',
		'.TemporaryItems',
		'.Trashes',
		'.VolumeIcon.icns',
		'__MACOSX',
		'desktop.ini',
		'ehthumbs.db',
		'Network Trash Folder',
		'robots.txt',
		'Temporary Items',
		'Thumbs.db',
		'thumbs.tps',
	],
	hideDotFiles: true,
	hiddenFiles: [],
	direction: 'ltr',
	renderHtml: true,
	customTitle: null,
};

// Every option but these takes one of a few values
type OpenOption = 'pageSize' | 'customTitle' | 'ignoredFiles' | 'hiddenFiles';

const CHOICES: Record<Exclude<keyof Config, OpenOption>, unknown[]> = {
	theme: [...THEMES],
	codeTheme: [
		'atom-one',
		'ayu',
		'catppuccin',
		'github',
		'material',
		'night-owl',
		'rose-pine',
		'solarized',
	],
	icons: ['bootstrap', 'octicons', 'phosphor'],
	onChange: ['banner', 'refresh'],
	foldersFirst: [true, false],
	striped: [true, false],
	dates: ['relative', 'absolute'],
	hideDotFiles: [true, false],
	direction: ['ltr', 'rtl'],
	renderHtml: [true, false],
};

// Read once at startup from the working directory; restart to apply changes
async function readConfig(path = 'listr.config.json'): Promise<Config> {
	let text: string;

	try {
		text = await readFile(path, 'utf8');
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return defaults;
		}

		throw error;
	}

	const config = { ...defaults, ...JSON.parse(stripJsonComments(text)) } as Config;

	for (const [key, allowed] of Object.entries(CHOICES)) {
		const value = config[key as keyof Config];

		if (!allowed.includes(value)) {
			const choices = allowed.map((choice) => JSON.stringify(choice).replaceAll('"', "'"));
			throw new Error(
				`${path}: ${key} must be ${choices.join(' or ')}, got ${JSON.stringify(value)}`,
			);
		}
	}

	if (!Number.isInteger(config.pageSize) || config.pageSize < 0) {
		throw new Error(
			`${path}: pageSize must be 0 or a positive integer, got ${JSON.stringify(config.pageSize)}`,
		);
	}

	for (const key of ['ignoredFiles', 'hiddenFiles'] as const) {
		const patterns = [config[key]].flat();

		if (!patterns.every((pattern) => typeof pattern === 'string')) {
			throw new Error(
				`${path}: ${key} must be a glob pattern or a list of them, got ${JSON.stringify(config[key])}`,
			);
		}
	}

	if (config.customTitle !== null && typeof config.customTitle !== 'string') {
		throw new Error(
			`${path}: customTitle must be a string or null, got ${JSON.stringify(config.customTitle)}`,
		);
	}

	return config;
}

export const config = await readConfig();
