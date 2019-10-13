const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离css

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
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // 开发模式下用style-loader
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader, {
              loader: 'css-loader',
              options: { // 意思是，如果在css中引入(@import)了其他文件css,而这个css文件中引入了less,将用less-loader处理
                importLoaders: 2
              }
            },'postcss-loader', 'less-loader'
          ] // 从右往左
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] // 从右往左
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: {
            loader: 'url-loader',
              options: {
                limit: 100*1024, // 如果大于100k图片，会默认使用file-loader(file-loader作用就是拷贝)
                outputPath: 'images/',
                name: '[name].[hash:8].[ext]'
              }
          }
        }
      ]
    },
    plugins: [
      // 开发模式下不抽离css,此时返回false
      !isDev && new MiniCssExtractPlugin({
        filename: `css/[name].[hash:8].css`
      }),
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
    ].filter(Boolean) // 过滤数组中的false
  }

  if(isDev) { // 开发模式
    return merge(base, dev);
  }  else { // 生产模式
    return merge(base, prod);
  }
}