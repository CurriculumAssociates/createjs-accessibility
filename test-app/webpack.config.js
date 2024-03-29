const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  devServer: {
    host: '0.0.0.0',
    port: '8007',
    allowedHosts: 'all',
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
  entry: {
    bundle: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  },
  output: {
    pathinfo: true,
    path: `${__dirname}/dist`,
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: {
                      chrome: '88',
                      ie: '11',
                      edge: '88',
                      firefox: '79',
                      safari: '13.1.3',
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name() {
                return '[path][name].[ext]';
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
  externals: {
    TimelineMax: 'TimelineMax',
    createjs: 'createjs',
    jquery: 'jQuery',
  },
  performance: { hints: false },
};

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
} else {
  config.mode = 'development';
  config.devtool = 'eval-source-map';
}

module.exports = config;
