const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'createjs-accessibility.js',
    library: 'cjs_a11y',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/env', { modules: false }], '@babel/react'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  mode: 'production',
};

if (process.env.NODE_ENV !== 'production') {
  config.watch = true;
  config.watchOptions = {
    ignored: /node_modules/,
  };
}

module.exports = config;
