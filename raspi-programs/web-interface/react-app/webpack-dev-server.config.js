const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  context: path.join(__dirname, '/app'),
  devtool: 'source-map',
  devServer: {
    hot: true,
    contentBase: '/dist/',
    publicPath: '',
    inline: true,
    stats: 'errors-only',
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './client.jsx',
  ],
  output: {
    publicPath: '',
    path: path.join(__dirname, '/../www-root/'),
    filename: '[name].js',
  },
  performance: false,
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // the ? adds support for .jsx
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          babelrc: true, // use external .babelrc for config
          cacheDirectory: true, // use node_modules/.cache/babel-loader to cache transformations
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: 'url-loader',
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: 'file-loader?name=fonts/[name].[ext]',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html/index.html',
      cache: 'true',
      // filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
