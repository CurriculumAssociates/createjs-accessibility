module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'airbnb-typescript', 'prettier', 'prettier/prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    createjs: false,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  root: true,
  plugins: ['import', '@typescript-eslint'],
  rules: {
    'array-bracket-newline': 'warn',
    'no-underscore-dangle': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-plusplus': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      }
    ],
    'object-shorthand': 'error',
    'consistent-return': 'off',
    'no-mixed-operators': 'warn',
    'no-bitwise': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-new': 'warn',
    'no-eval': 'warn',
    'no-lone-blocks': 'off',
    'no-return-assign': 'warn',
    'no-duplicate-case': 'error',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'prefer-rest-params': 'warn',
    'no-restricted-properties': [
      'off',
      {
        object: 'Math',
        property: 'pow',
      },
    ],
    'no-continue': 'warn',
    'max-len': 'warn',
    'no-param-reassign': 'off',
    'new-cap': 'warn',
    'quote-props': 'off',
    'no-use-before-define': 'warn',
    'object-curly-newline': 'warn',
    'no-multi-spaces': 'warn',
    'arrow-spacing': ['error', { before: true, after: true }],
    'space-in-parens': 'warn',
    'prefer-destructuring': 'off',
    'import/no-unresolved': 'off',
  },
  settings: {
    'import/core-modules': ['createjs', 'TimelineMax'],
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
        extensions: ['.js'],
      },
    },
  },
};
