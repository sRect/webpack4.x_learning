const webpack = require('webpack');
const { join, resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin({
  pluginNames: {
    customAddAssetHtmlWebpackPluginName: AddAssetHtmlWebpackPlugin
  }
});

module.exports = smp.wrap({
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
    // 构建时会引用动态链接库的内容
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, '../dll/manifest.json')
    }),
    // 需要手动引入react.dll.js
    new AddAssetHtmlWebpackPlugin({ 
      filepath: resolve(__dirname, '../dll/react.dll.js') 
    })
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
})