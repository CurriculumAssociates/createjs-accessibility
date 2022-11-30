module.exports = function babelConfig(api) {
  return {
    presets: [
      ['@babel/preset-env', { modules: api.env(['test']) ? 'auto' : false }],
      '@babel/preset-typescript',
    ],
  };
};
