import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import cypress from 'eslint-plugin-cypress'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['node_modules/', 'reports/', 'coverage/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      'no-console': 'warn',
    },
  },
  {
    files: ['cypress/**/*.ts'],
    ...cypress.configs.recommended,
    rules: {
      // Chai assertions such as expect(x).to.be.empty are expression statements by design.
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // Keep last: turns off rules that clash with Prettier.
  prettier,
)
