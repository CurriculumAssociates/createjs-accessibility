module.exports = {
  rules: {
    'import/no-unresolved': 'off',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    createjs: false,
    TimelineMax: false,
  },
};
