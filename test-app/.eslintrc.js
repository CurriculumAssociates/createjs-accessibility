module.exports = {
  rules: {
    'import/no-unresolved': [2, { caseSensitive: false }],
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    createjs: false,
    TimelineMax: false,
  },
};
