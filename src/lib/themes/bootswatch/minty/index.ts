import base from '../../bootstrap/index.ts';
import type { Theme } from '../../theme.ts';
import stylesheet from './style.scss?url';

// Same markup as Bootstrap 5; only the CSS differs
export default { ...base, name: 'Minty', stylesheet } satisfies Theme;
