module.exports = function babelConfig(api) {
  return {
    babelrcRoots: [
      '.',
      './test-app',
    ],
    presets: [
      ['@babel/preset-env', { modules: api.env(['test']) ? 'auto' : false }],
      '@babel/preset-typescript',
    ],
  };
};
