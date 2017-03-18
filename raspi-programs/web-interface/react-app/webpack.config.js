const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
  context: path.join(__dirname, '/app'),
  devtool: false,
  entry: {
    app: './client.jsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'redux-thunk',
      'isomorphic-fetch',
      'material-ui',
      'react-tap-event-plugin',
    ],
  },
  output: {
    publicPath: '',
    path: path.join(__dirname, '/dist'),
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['app', 'vendor'],
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false,
      minimize: true,
    }),
    new HtmlWebpackPlugin({
      template: 'html/index.html',
      cache: 'true',
    }),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin(),
  ],
};
