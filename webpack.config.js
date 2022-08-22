const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'createjs-accessibility.js',
    library: 'createjs-accessibility',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
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
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};

if (process.env.NODE_ENV !== 'production') {
  config.watch = true;
  config.watchOptions = {
    ignored: /node_modules/,
  };
}

module.exports = config;
