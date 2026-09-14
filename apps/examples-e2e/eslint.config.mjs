import baseConfig from '../../eslint.config.mjs';
import cypress from 'eslint-plugin-cypress/flat';

export default [
  ...baseConfig,
  {
    ...cypress.configs.recommended,
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
];
