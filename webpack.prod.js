const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            // 'react-hot-loader/patch',
            // 'webpack-dev-server/client?http://localhost:3001',
            // 'webpack/hot/only-dev-server',
            './src/client/index'
        ]
    },
    output: {
        path: path.resolve(__dirname, './public/javascript'),
        filename: '[name].js',
        publicPath: '/javascript/'
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
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }
                )
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            comments: false
        })
    ],
    resolve: {
        alias: {
            jquery: path.join(__dirname, './lib/jquery-stub.js')
        }
    }
};
