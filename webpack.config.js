var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: {
    bundle: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/index.js')
    ]
  },
  output: {
    pathinfo: true,
    path: __dirname + '/dist',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                return '[path][name].[ext]';
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
  ],
  externals: {
    "TimelineMax": "TimelineMax",
    "createjs": "createjs",
    "jquery": "jQuery",
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
} else {
  config.mode = 'development';
  config.devtool = 'eval-source-map';
  config.resolve.alias = {
    'createjs-accessibility': path.resolve(__dirname, 'node_modules/createjs-accessibility/src/index.js'),
  };
}

module.exports = config;
