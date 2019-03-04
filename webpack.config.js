var path = require('path');
var nodeExternals = require('webpack-node-externals');

var config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'createjs-accessibility.js',
    library: '',
    libraryTarget: 'umd'
  },
  externals: [ nodeExternals() ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  mode: 'production',
}

if (process.env.NODE_ENV !== 'production') {
  config.watch = true;
  config.watchOptions = {
    ignored: /node_modules/
  };
}

module.exports = config;
