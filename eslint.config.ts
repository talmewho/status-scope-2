import js from '@eslint/js';
import globals from 'globals';

import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import jest from 'eslint-plugin-jest';

export default tseslint.config(
  {
    ignores: ['coverage/**', 'build/**', 'node_modules/**', 'package-lock.json', '.react-router'],
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
    files: ['./**/*.test.{ts,tsx,js}'],
    plugins: { jest },
    extends: [jest.configs['flat/recommended']],
    languageOptions: { globals: { ...globals.jest } },
  },

  {
    files: ['./**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, '@stylistic': stylistic, '@typescript-eslint': tseslint.plugin },
    rules: {
      'semi': ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],
      '@typescript-eslint/parameter-properties': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
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
