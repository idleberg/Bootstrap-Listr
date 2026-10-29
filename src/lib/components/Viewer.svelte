<script lang="ts" module>
	import type { LoadLanguage, Viewer } from '#lib/viewer.ts';

	export interface ViewedFile {
		name: string;
		href: string;
		size: number;
		viewer: Viewer;
	}
</script>

<script lang="ts">
	import prettyBytes from 'pretty-bytes';
	import { type Embed, embedFor, serviceName } from '#lib/embed.ts';
	import { getTheme } from '#lib/themes/theme.ts';

	let { file = $bindable() }: { file: ViewedFile | null } = $props();

	const { classes } = getTheme();

	let dialog = $state<HTMLDialogElement>();
	let broken = $state(false);

	// Highlighted HTML once the file and its language have loaded
	let source = $state('');

	// A plain text file once it has loaded
	let plainText = $state<string>();

	// The player for a virtual file once it has loaded
	let embed = $state<Embed>();

	$effect(() => {
		const opened = file;

		if (!opened) {
			return;
		}

		broken = false;
		source = '';
		plainText = undefined;
		embed = undefined;
		dialog?.showModal();

		if (opened.viewer.kind === 'embed') {
			fetchText(opened.href).then(
				(text) => {
					if (file === opened) {
						embed = embedFor(opened.name, text) ?? undefined;
						broken = !embed;
					}
				},
				() => {
					broken = file === opened;
				},
			);
		} else if (opened.viewer.kind === 'text') {
			fetchText(opened.href).then(
				(body) => {
					if (file === opened) {
						plainText = body;
					}
				},
				() => {
					broken = file === opened;
				},
			);
		} else if (opened.viewer.kind === 'source') {
			// Another file may be open by the time this one arrives
			highlight(opened.href, opened.viewer.load).then(
				(html) => {
					if (file === opened) {
						source = html;
					}
				},
				() => {
					broken = file === opened;
				},
			);
		}
	});

	// twinkleplop escapes the source, so a file can't inject markup
	async function highlight(href: string, load: LoadLanguage) {
		const [text, { language }] = await Promise.all([fetchText(href), load()]);

		return language()(text, { line_numbers: true });
	}

	async function fetchText(href: string) {
		const response = await fetch(href);

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return response.text();
	}

	// Clicks outside the content land on the dialog, which fills the screen
	function onclick(event: MouseEvent) {
		if (event.target === dialog) {
			dialog.close();
		}
	}
</script>

<!-- Closing unmounts the body, which stops audio and video -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<!-- biome-ignore lint/a11y/useKeyWithClickEvents: Esc closes the dialog natively -->
<dialog
	bind:this={dialog}
	id="viewer"
	class={classes.dialog}
	aria-labelledby="viewer-title"
	{onclick}
	onclose={() => {
		file = null;
	}}
>
	{#if file}
		<div class={classes.dialogFrame}>
			<div class={classes.dialogContent}>
				<div class={classes.dialogHeader}>
					<h2 id="viewer-title" class={classes.dialogTitle}>{file.name}</h2>
					<button
						type="button"
						class={classes.dialogClose}
						aria-label="Close"
						commandfor="viewer"
						command="close"
					></button>
				</div>
				<div class={classes.dialogBody}>
					{#if broken}
						<p class={classes.empty}>This file can't be shown here.</p>
					{:else if file.viewer.kind === 'image'}
						<img src={file.href} alt={file.name} onerror={() => {
								broken = true;
							}}>
					{:else if file.viewer.kind === 'audio'}
						<!-- biome-ignore lint/a11y/useMediaCaption: listed files come without captions -->
						<audio src={file.href} controls autoplay></audio>
					{:else if file.viewer.kind === 'video'}
						<!-- svelte-ignore a11y_media_has_caption -->
						<!-- biome-ignore lint/a11y/useMediaCaption: listed files come without captions -->
						<video src={file.href} controls autoplay></video>
					{:else if file.viewer.kind === 'pdf'}
						<!-- biome-ignore lint/security/useIframeSandbox: Chrome blocks PDFs in sandboxed frames; the sandbox header still applies -->
						<iframe src={file.href} title={file.name}></iframe>
					{:else if file.viewer.kind === 'website'}
						<!-- The sandbox header already blocks scripts; this holds behind a proxy that drops it -->
						<iframe src={file.href} title={file.name} sandbox=""></iframe>
					{:else if file.viewer.kind === 'embed'}
						{#if embed}
							<!-- Third-party players need their own scripts and storage; popups for "Watch on …" links -->
							<iframe
								class="embed"
								src={embed.src}
								title={file.name}
								style:height={embed.height ? `${embed.height}px` : null}
								style:max-width={embed.maxWidth ? `${embed.maxWidth}px` : null}
								sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
								allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
							></iframe>
						{:else}
							<p class={classes.empty}>Loading…</p>
						{/if}
					{:else if plainText !== undefined}
						<pre class="text">{plainText}</pre>
					{:else if source}
						{@html source}
					{:else}
						<p class={classes.empty}>Loading…</p>
					{/if}
				</div>
				<div class={classes.dialogFooter}>
					{#if file.viewer.kind === 'embed'}
						<small class={classes.dialogMeta}>Embedded from {serviceName(file.name)}</small>
					{:else}
						<small class={classes.dialogMeta} title="{file.size} bytes">{prettyBytes(file.size)}</small>
					{/if}
					<button type="button" class={classes.dialogButton} commandfor="viewer" command="close"
						>Close</button
					>
					<!-- ponytail: virtual files get no button, a link to the service's page needs a page path for SoundCloud and Bandcamp -->
					{#if file.viewer.kind !== 'embed'}
						<a class={classes.dialogDownload} href={file.href} download>Download</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</dialog>

<style>
	/* The dialog is the full-screen layer, like Bootstrap's and Bulma's .modal;
	   the frame inside sizes and centers the content. A flex column, so Bulma's
	   centering applies; Bootstrap's frame needs a width (bootstrap/style.scss) */
	dialog[open] {
		display: flex;
		flex-direction: column;
		max-width: none;
		max-height: none;
		padding: 0;
		border: 0;
		background: none;
	}

	dialog::backdrop {
		background: rgb(0 0 0 / 50%);
	}

	:global(body:has(dialog[open])) {
		overflow: hidden;
	}

	img,
	video {
		display: block;
		max-width: 100%;
		max-height: 70vh;
		margin-inline: auto;
	}

	audio {
		display: block;
		width: 100%;
	}

	iframe {
		display: block;
		width: 100%;
		height: 70vh;
		border: 0;
	}

	/* Video players; audio players get a fixed height from embed.ts */
	iframe.embed {
		height: auto;
		max-height: 70vh;
		margin-inline: auto;
		aspect-ratio: 16 / 9;
	}

	pre.text {
		max-height: 70vh;
		margin: 0;
		overflow: auto;
	}

	/* Code reads left to right in either direction */
	dialog :global(.twinkleplop) {
		direction: ltr;
		max-height: 70vh;
		margin: 0;
		padding: 1rem;
		overflow: auto;
		background: var(--twp-background);
		color: var(--twp-identifier);
		font-size: 0.875em;
	}

	/* Themes have no line number color, so borrow the comment one */
	dialog :global(.twinkleplop .ln) {
		display: inline-block;
		min-width: 3ch;
		padding-inline-end: 2ch;
		text-align: end;
		color: var(--twp-comment);
		/* biome-ignore lint/suspicious/useBaseline: Safari has the prefixed one */
		user-select: none;
		-webkit-user-select: none;
	}
</style>
