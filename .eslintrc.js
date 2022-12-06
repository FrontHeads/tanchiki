module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/ban-ts-comment': 1,
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn',
    'no-duplicate-imports': 'error',
    'eol-last': ['warn', 'always'],
    'max-len': ['error', 120, 2, { ignoreStrings: true }],
    'linebreak-style': ['warn', 'unix'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error'],
  },
  ignorePatterns: ['**/client/dist', '**/server/dist', '*.css', '*.scss', '*.json'],
};
