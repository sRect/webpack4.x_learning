const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离css
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const copyWebpackPlugin = require("copy-webpack-plugin");
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin'); // 消除无用的css(这个插件不靠谱)
const HappyPack = require('happypack');
const isDev = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
  entry: path.resolve(__dirname, '../src/js/index.js'),
  // entry: ['./src/index.js', "./src/a.js"], // 将多个文件打包成一个
  // entry: { // 多入口, 对应的HtmlWebpackPlugin的chunks也要写
  //   index: './src/index.js',
  //   AOP: './src/AOP.js',
  //   iterator: './src/iterator.js'
  // },
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].min.js',
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
        test: /\.js$/,
        use: 'happypack/loader?id=babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          // 开发模式下用style-loader
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: { // 意思是，如果在css中引入(@import)了其他文件css,而这个css文件中引入了less,将用less-loader处理
              importLoaders: 2
            }
          }, 'postcss-loader', 'less-loader'
        ], // 从右往左
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: 'happypack/loader?id=less', // 从右往左
        exclude: /node_modules/
      },
      { // 图标的处理
        test: /\.(woff|ttf|eot|svg|otf)$/,
        use: 'file-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024, // 如果大于8k图片，会默认使用file-loader(file-loader作用就是拷贝)
              outputPath: 'images/',
              name: '[name].[hash:8].[ext]'
            }
          },
          !isDev && { // 可以在使用file-loader之前 对图片进行压缩
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ].filter(Boolean)
      }
    ]
  },
  plugins: [
    // 开发模式下不抽离css,此时返回false
    !isDev && new MiniCssExtractPlugin({
      filename: `css/[name].[hash:8].css`
    }),
    // !isDev && new PurgecssPlugin({
    //   paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, { nodir: true }) // 不匹配目录，只匹配文件
    // }),
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
    }),
    new copyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'), //要打包的静态资源目录地址
      to: './static', //要打包到的文件夹路径，跟随output配置中的目录。所以不需要再自己加__dirname
    }]),
    new HappyPack({
      id: 'babel',
      threads: 4,
      loaders: ['babel-loader']
    }),
    new HappyPack({
      id: 'less',
      threads: 4,
      loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
    }),
    new webpack.DefinePlugin({ // 定义全局变量
      'VERSION': '123'
    }),
    new webpack.ProvidePlugin({ // 变量暴露给全局window
      $: 'jQuery'
    }),
    new FriendlyErrorsWebpackPlugin(),
    new WebpackBuildNotifierPlugin({
      title: "My Project Webpack Build",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    })
  ].filter(Boolean) // 过滤数组中的false
}