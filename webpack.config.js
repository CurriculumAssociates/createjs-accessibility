const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'createjs-accessibility.js',
    library: '',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ],
      },
    ],
  },
  mode: 'production',
};

if (process.env.NODE_ENV !== 'production') {
  config.watch = true;
  config.watchOptions = {
  };
}

module.exports = config;
