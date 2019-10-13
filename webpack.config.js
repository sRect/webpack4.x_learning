const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/js/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}