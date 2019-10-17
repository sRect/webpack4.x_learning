const webpack = require('webpack');
const { join } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: "cheap-module-eval-source-map",
  mode: 'development',
  // https://webpack.js.org/guides/tree-shaking/#add-a-utility
  // 开发环境下默认tree-shaking不会生效,可以配置后生效
  optimization: {
    usedExports: true, // js Tree Shaking
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devServer: {
    contentBase: join(__dirname, '../dist'),
    port: 8080,
    compress: true,
    hot: true,
    open: true,
    host: 'localhost',
    historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    proxy: {
      // 代理到后端的服务地址，会拦截所有以api开头的请求地址
      "/api": "http://localhost:3000"
    }
  }
}