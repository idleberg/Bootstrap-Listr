import { config } from '#lib/server/config.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({
	theme: config.theme,
	codeTheme: config.codeTheme,
	icons: config.icons,
	onChange: config.onChange,
});
