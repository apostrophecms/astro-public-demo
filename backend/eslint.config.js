import apostrophe from 'eslint-config-apostrophe';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'public/apos-frontend',
    'data/temp',
    'apos-build'
  ]),
  apostrophe,
  {
    languageOptions: {
      globals: {
        apos: 'readonly'
      }
    },
    rules: {
      'no-var': 'error',
      'no-console': 'off'
    }
  }
]);
