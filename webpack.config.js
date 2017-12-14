const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3001/',
      'webpack/hot/only-dev-server',
      './src/client/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, './public/javascript'),
    publicPath: '/javascript/',
    filename: 'app.js',
    chunkFilename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'
      },
      {
        test: /\.json$/, loader: 'json'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('styles.css')
  ],
  resolve: {
    alias: {
      jquery: path.join(__dirname, './lib/jquery-stub.js')
    }
  },
  devServer: {
    host: 'localhost',
    port: 3001,
    historyApiFallback: {
      index: '/javascript/'
    },
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.resolve(__dirname, 'public')
  }
};
