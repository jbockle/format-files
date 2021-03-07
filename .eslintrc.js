
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'key-spacing': ['error', {
      'mode': 'minimum'
    }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/indent': ['error', 2],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'semi': ['error', 'always'],
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'property',
        'modifiers': ['private', 'protected'],
        'format': ['camelCase'],
        'leadingUnderscore': 'require',
      },
      {
        'selector': 'property',
        'modifiers': ['public'],
        'format': ['camelCase'],
        'leadingUnderscore': 'allow',
        'trailingUnderscore': 'allow',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-console': 'error',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
