import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro'
import neostandard from 'neostandard'
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    ...eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...neostandard(),
    ...eslintPluginAstro.configs.recommended,
    ...prettierPlugin.configs.recommended,
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            'prettier/prettier': 'error',
        },
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        files: ['**/*.astro'],
        rules: {
            'prettier/prettier': 'error',
        },
        languageOptions: {
            parser: astroPlugin.parser,
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.astro'],
            },
        },
    },
]