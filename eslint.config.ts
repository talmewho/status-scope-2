import js from '@eslint/js';
import globals from 'globals';

import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: ['build/**', 'node_modules/**', 'package-lock.json', '.react-router'],
  },
  tseslint.configs.recommended,
  {
    files: ['./app/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, '@stylistic': stylistic },
    extends: [js.configs.recommended, stylistic.configs.recommended],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ['./*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', './server/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, '@stylistic': stylistic },
    extends: [js.configs.recommended, stylistic.configs.recommended],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['./**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      'semi': ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],
      '@typescript-eslint/parameter-properties': 'error',
      'indent': ['error', 2],
      '@stylistic/indent': ['error', 2],
    },
  },
  {
    files: ['**/*.{tsx,mtsx}'],
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: [css.configs.recommended],
  },
);
