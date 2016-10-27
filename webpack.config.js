var path = require('path');
var rootPath = path.dirname(__dirname);
var rooter = function(dir) {
  return path.join(rootPath, dir);
}

module.exports = {
  entry: [rooter('mocker-sdk/src/index.js')],
  output: {
    path: rooter('mocker-sdk/dest'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: [
          'add-module-exports',
          'transform-decorators-legacy',
          ['transform-runtime', {
            'polyfill': false,
            'regenerator': true
          }]
        ]
      }
    }]
  },
  watch: true
}
