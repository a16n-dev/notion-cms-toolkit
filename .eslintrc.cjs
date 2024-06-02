module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'eslint-plugin-import-helpers',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': ['error'],
    'import/no-restricted-paths': [
      'error',
      {
        basePath: 'src',
        zones: [
          {
            target: 'lib',
            from: '.',
            except: ['lib', './projPath.ts'],
          },
          {
            target: 'public',
            from: '.',
            except: ['lib', 'public'],
          },
          {
            target: 'admin',
            from: '.',
            except: ['lib', 'admin'],
          },
        ],
      },
    ],
    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: ['module', '/@lib/', '/^(\\./)([a-zA-Z]*/)*([A-Za-z]|\\.)*$/'],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
    'import/newline-after-import': 2,
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
