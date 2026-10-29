import base from '../../bootstrap/index.ts';
import type { Theme } from '../../theme.ts';
import stylesheet from './style.scss?url';

export default { ...base, name: 'Litera', stylesheet } satisfies Theme;
