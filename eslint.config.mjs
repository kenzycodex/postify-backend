import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
      env: {
        node: true,
        es2021: true,
        jest: true,
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      indent: ['error', 2],
      quotes: ['error', 'single'],
    },
  },
];
