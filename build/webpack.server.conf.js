var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeModules = {};
var projectRoot = path.resolve(__dirname, '../');
var config = require('../config');

module.exports = {
    // The configuration for the server-side rendering
    entry: {
      app: './server/server.js'
    },
    output: {
      path: config.build.assetsRoot,
      filename: 'server.js',
    },
    target: 'node',
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
    ],
    resolve: {
      extensions: ['', '.js', '.json'],
    },
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { 
                test: /\.js$/,
                loader: 'babel',
                include: [
                  path.join(projectRoot, 'server')
                ],
                exclude: /node_modules/
            },
            {
              test: /\.json$/,
              loader: 'json'
            },
        ]
    },
};