import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    { languageOptions: { globals: globals.browser } },
    ...tseslint.configs.recommended,
    {
        ignores: ['**/*.js', '**/*.js.map', '**/*.d.ts', 'coverage', 'docs'],
    },
];
