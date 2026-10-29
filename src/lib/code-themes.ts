// twinkleplop's highlighting themes, as stylesheet URLs; the layout links only the
// configured one's, the dark one behind the system's dark mode like the rest of the page
import atomOneDark from '@twinkleplop/theme-atom-one/dark?url';
import atomOneLight from '@twinkleplop/theme-atom-one/light?url';
import ayuDark from '@twinkleplop/theme-ayu/dark?url';
import ayuLight from '@twinkleplop/theme-ayu/light?url';
import catppuccinDark from '@twinkleplop/theme-catppuccin/dark?url';
import catppuccinLight from '@twinkleplop/theme-catppuccin/light?url';
import githubDark from '@twinkleplop/theme-github/dark?url';
import githubLight from '@twinkleplop/theme-github/light?url';
import materialDark from '@twinkleplop/theme-material/dark?url';
import materialLight from '@twinkleplop/theme-material/light?url';
import nightOwlDark from '@twinkleplop/theme-night-owl/dark?url';
import nightOwlLight from '@twinkleplop/theme-night-owl/light?url';
import rosePineDark from '@twinkleplop/theme-rose-pine/dark?url';
import rosePineLight from '@twinkleplop/theme-rose-pine/light?url';
import solarizedDark from '@twinkleplop/theme-solarized/dark?url';
import solarizedLight from '@twinkleplop/theme-solarized/light?url';

export const codeThemes = {
	'atom-one': { light: atomOneLight, dark: atomOneDark },
	ayu: { light: ayuLight, dark: ayuDark },
	catppuccin: { light: catppuccinLight, dark: catppuccinDark },
	github: { light: githubLight, dark: githubDark },
	material: { light: materialLight, dark: materialDark },
	'night-owl': { light: nightOwlLight, dark: nightOwlDark },
	'rose-pine': { light: rosePineLight, dark: rosePineDark },
	solarized: { light: solarizedLight, dark: solarizedDark },
};
