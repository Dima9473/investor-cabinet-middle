import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
  { ignores: ['dist', 'vite.config.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
      'array-bracket-spacing': ['error', 'never'],      
      "space-before-blocks": ['error', 'always'],
      "object-curly-spacing": ['error', 'always'],   
      "jsx-quotes": ["error", "prefer-double"],      
      "space-in-parens": ['error', 'never'],
      "key-spacing": ["error", { "beforeColon": false }],
      "no-duplicate-case": 'error',
      "no-duplicate-imports": 'error',
      "no-empty-pattern": 'error',
      "no-fallthrough": 'error',
      "no-useless-assignment": 'error',
      "consistent-return": 'error',
      "curly": 'error',
      "max-params": ['error', { max: 3 }],
      "no-console": 'warn',
      "no-else-return": 'error',
      "no-empty": 'error',
      "no-empty-function": 'error',
      "no-nested-ternary": 'error',
      "no-redeclare": 'error',
      "no-useless-catch": 'error',
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        'error',
        {
          groups: [
            ['^'],
            [
              '^shared',
              '^entities',
              '^features',
              '^widgets',
              '^pages',
              '^\\.\\.?/?',
            ],
            ['hooks'],
            ['types'],
            ['^.+\\.s?css$']
          ]
        }
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    }
  },
)
