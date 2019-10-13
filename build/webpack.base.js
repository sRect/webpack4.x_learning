const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const path = require('path');
const merge = require('webpack-merge');

module.exports = (env) => {
  console.log(env);
  let isDev = env.development;

  const base = {
    entry: path.resolve(__dirname, '../src/js/index.js'),
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
  }

  if(isDev) { // 开发模式
    return merge(base, dev);
  }  else { // 生产模式
    return merge(base, prod);
  }
}