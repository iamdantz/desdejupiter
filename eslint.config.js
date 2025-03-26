/* eslint-disable prettier/prettier */
import { defineConfig } from 'eslint/config'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'
import eslintParserTypeScript from '@typescript-eslint/parser'
import astroEslintParser from 'astro-eslint-parser'
import js from '@eslint/js'
import neostandard from 'neostandard'

export default defineConfig([
  ...neostandard(),
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: eslintParserTypeScript,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
      prettier: eslintPluginPrettier,
      astro: eslintPluginAstro,
      js,
    },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
])
