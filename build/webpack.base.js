const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
  console.log(env);
  let isDev = env.development;

  const base = {
    entry: path.resolve(__dirname, '../src/js/index.js'),
    // entry: ['./src/index.js', "./src/a.js"], // 将多个文件打包成一个
    // entry: { // 多入口, 对应的HtmlWebpackPlugin的chunks也要写
    //   index: './src/index.js',
    //   AOP: './src/AOP.js',
    //   iterator: './src/iterator.js'
    // },
    output: {
      filename: '[name].[hash:8].js',
      path: path.resolve(__dirname, '../dist')
    },
    resolve: {
      // 能够使用户在引入模块时不带扩展
      extensions: ['.js', '.json', 'css', 'less'],
      alias: {
        '@': path.resolve(__dirname, '../src')
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        title: 'webpack',
        hash: true,
        minify: !isDev && {
          collapseWhitespace: true, // 折叠空行
          removeAttributeQuotes: true // 去除双引号
        }
        // chunks: ['index', 'AOP', 'iterator'] // index.html 引入index.js
      })
    ]
  }

  if(isDev) { // 开发模式
    return merge(base, dev);
  }  else { // 生产模式
    return merge(base, prod);
  }
}