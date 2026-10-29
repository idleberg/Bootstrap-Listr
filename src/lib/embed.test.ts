import { expect, it } from 'vitest';
import { embedFor, serviceName } from './embed.ts';

it('builds player URLs from IDs', () => {
	expect(embedFor('a.youtube', '{"id":"dQw4w9WgXcQ","start":30}')?.src).toBe(
		'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&start=30',
	);
	expect(embedFor('a.vimeo', '{"id":"76979871/abc123"}')?.src).toBe(
		'https://player.vimeo.com/video/76979871?autoplay=1&h=abc123#t=0s',
	);
	expect(embedFor('a.SoundCloud', '{"type":"playlist","id":"123"}')).toEqual({
		src: 'https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F123&auto_play=true&visual=true',
		height: 350,
		maxWidth: 350,
	});
	expect(embedFor('a.bandcamp', '{"type":"album","id":"123"}')?.src).toContain('/album=123/');
	expect(embedFor('a.mixcloud', '{"id":"spartacus/party-time"}')?.src).toBe(
		'https://www.mixcloud.com/widget/iframe/?feed=%2Fspartacus%2Fparty-time%2F&autoplay=1',
	);
});

it('rejects anything but matching IDs', () => {
	expect(embedFor('a.youtube', 'not json')).toBeNull();
	expect(embedFor('a.youtube', 'null')).toBeNull();
	expect(embedFor('a.youtube', '{"id":"x\\"><script>"}')).toBeNull();
	expect(embedFor('a.soundcloud', '{"id":123}')).toBeNull();
	expect(embedFor('a.soundcloud', '{"type":"user","id":"123"}')).toBeNull();
	expect(embedFor('a.soundcloud', '{"type":"toString","id":"123"}')).toBeNull();
	expect(embedFor('a.mixcloud', '{"id":"../../evil"}')).toBeNull();
	expect(embedFor('a.vimeo', '{"id":"1","start":-5}')).toBeNull();
	expect(embedFor('a.flickr', '{"id":"1"}')).toBeNull();
	expect(serviceName('a.toString')).toBeUndefined();
	expect(serviceName('a.Vimeo')).toBe('Vimeo');
});
