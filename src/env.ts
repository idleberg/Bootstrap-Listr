import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	LISTR_ROOT: {
		description: 'The folder Listr serves, relative to the working directory or absolute',
		schema: (value) => value || '__public',
	},
});
