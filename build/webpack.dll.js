const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['react', 'react-dom'], // 将react、react-dom单独进行打包
  mode: 'production',
  output: {
    filename: 'react.dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: 'react'
  },
  plugins: [
    // 使用DllPlugin可以大幅度提高构建速度
    new webpack.DllPlugin({
      name: 'react',
      path: path.resolve(__dirname, '../dll/manifest.json')
    })
  ]
}