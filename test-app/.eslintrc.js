module.exports = {
  rules: {
    'array-bracket-newline': 'warn',
    'class-methods-use-this': 'warn',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'warn',
    'no-undef': 'warn',
    'no-param-reassign': 'warn',
    'no-plusplus': 'warn'
  },
  extends: ['airbnb-base', 'prettier', 'prettier/prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    createjs: false,
    TimelineMax: false,
  },
  root: true,
};
