const { join } = require('path');
module.exports = {
  mode: 'development',
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