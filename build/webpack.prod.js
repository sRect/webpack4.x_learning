const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 混淆压缩js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: '#source-map', // 线上生成配置
  mode: 'production',
  optimization: { // 优化项
    minimizer: [ // 放置压缩方案
      // 压缩css(注意：配置了css压缩后，也要手动配置js的压缩，不配置js就不压缩了)
      new OptimizeCssAssetsPlugin(), 
      // https://www.npmjs.com/package/terser-webpack-plugin
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/,
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: true, // true/false 是否混淆变量名
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}