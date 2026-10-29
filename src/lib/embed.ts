// Virtual files: small JSON files standing for a track, video or playlist on a
// streaming service, `{ type?, id, start? }` (see DESIGN.md, Virtual files).
// Listr builds the player URL; only IDs matching the service's pattern get in.
// Players autoplay where the service has an option for it, which Bandcamp lacks

export interface Embed {
	src: string;
	// Fixed player height in pixels for audio players; video players are 16:9
	height?: number;
	// For players that stop growing and sit at the start of a wider frame
	maxWidth?: number;
}

interface Service {
	name: string;
	// The first type is the default
	types: Record<string, RegExp>;
	build: (type: string, id: string, start: number) => Embed;
}

const SERVICES: Partial<Record<string, Service>> = {
	youtube: {
		name: 'YouTube',
		types: { video: /^[\w-]{11}$/u, playlist: /^[\w-]+$/u },
		build: (type, id, start) => ({
			src:
				type === 'video'
					? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&start=${start}`
					: `https://www.youtube-nocookie.com/embed/videoseries?list=${id}&autoplay=1&start=${start}`,
		}),
	},
	vimeo: {
		name: 'Vimeo',
		types: { video: /^\d+(?:\/[\da-f]+)?$/u },
		build: (_, id, start) => {
			const [video, hash] = id.split('/');

			return {
				src: `https://player.vimeo.com/video/${video}?autoplay=1${hash ? `&h=${hash}` : ''}#t=${start}s`,
			};
		},
	},
	soundcloud: {
		name: 'SoundCloud',
		types: { track: /^\d+$/u, playlist: /^\d+$/u },
		build: (type, id) => ({
			src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(`https://api.soundcloud.com/${type}s/${id}`)}&auto_play=true&visual=true`,
			// The visual player, square like Bandcamp's artwork player
			height: 350,
			maxWidth: 350,
		}),
	},
	bandcamp: {
		name: 'Bandcamp',
		types: { track: /^\d+$/u, album: /^\d+$/u },
		build: (type, id) => ({
			src: `https://bandcamp.com/EmbeddedPlayer/${type}=${id}/size=large/minimal=true/transparent=true/`,
			// The artwork player: a square cover with a play button on it
			height: 350,
			maxWidth: 350,
		}),
	},
	mixcloud: {
		name: 'Mixcloud',
		types: { show: /^[\w-]+\/[\w-]+$/u },
		build: (_, id) => ({
			src: `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(`/${id}/`)}&autoplay=1`,
			height: 120,
		}),
	},
};

// By extension; hasOwn, so `a.toString` isn't one
function serviceOf(name: string) {
	const extension = name.slice(name.lastIndexOf('.') + 1).toLowerCase();

	return Object.hasOwn(SERVICES, extension) ? SERVICES[extension] : undefined;
}

// The service a virtual file embeds from, or undefined if `name` isn't one
export const serviceName = (name: string) => serviceOf(name)?.name;

// The player for virtual file `name` with contents `text`, or null if it isn't valid
export function embedFor(name: string, text: string): Embed | null {
	const service = serviceOf(name);

	if (!service) {
		return null;
	}

	let file: unknown;

	try {
		file = JSON.parse(text);
	} catch {
		return null;
	}

	if (typeof file !== 'object' || file === null) {
		return null;
	}

	const { type = Object.keys(service.types)[0], id, start = 0 } = file as Record<string, unknown>;
	const pattern =
		typeof type === 'string' && Object.hasOwn(service.types, type) && service.types[type];

	if (!pattern || typeof id !== 'string' || !pattern.test(id)) {
		return null;
	}

	if (!Number.isInteger(start) || (start as number) < 0) {
		return null;
	}

	return service.build(type as string, id, start as number);
}
