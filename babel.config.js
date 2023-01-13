module.exports = function babelConfig(api) {
  const config = {
    babelrcRoots: [
      '.',
      './test-app',
    ],
    presets: [
      ['@babel/preset-env', { modules: api.env(['test']) ? 'auto' : false }],
    ],
  };

  if (api.env(['test'])) {
    config.presets.push(['@babel/preset-typescript']);
  }

  return config;
};
