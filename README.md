# webpack4.x + babel7.x
____
> ![avatar](https://img.shields.io/badge/webpack-4.41.1-blue.svg) ![avatar](https://img.shields.io/badge/@babel/core-7.6.4-blue.svg)

## package.json
> 1. npm run dev 开发环境打包
> 2. npm run server 或者 npm run start 启动本地开发服务
> 3. npm run build 上线打包
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack",
    "server": "cross-env NODE_ENV=development webpack-dev-server",
    "start": "npm run server",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

## webpack.config.js
```javascript
const base = require('./build/webpack.base'); // webpack公共配置
const dev = require('./build/webpack.dev'); // webpack开发配置
const prod = require('./build/webpack.prod'); // webpack生产配置
const merge = require('webpack-merge');
const isDev = process.env.NODE_ENV; // NODE_ENV指定开发或生产的变量

module.exports = () => {
  console.log(`currentMode:${isDev}`);
  // let isDev = env.development;
  return isDev === 'development' ? merge(base, dev) : merge(base, prod);
}
```

## 对js处理(对es6+语法转为es5) 
> + babel7.x的3个核心包  @babel/core @babel/preset-env babel-loader
> + 默认调用@babel/core转换代码，转换的时候用@babel/preset-env转为es5代码
> + .babelrc中presets的执行顺序是从下往上
> + .babelrc中plugins的执行顺序是从上往下

### 1. 安装依赖项
```bash
npm install @babel/core @babel/preset-env babel-loader --save-dev # 基本依赖
npm install core-js@2 --save # @babel/preset-env option配置项，corejs包
npm install @babel/preset-react --save-dev # 解析react jsx预设
npm install @babel/plugin-proposal-decorators --save-dev # 解析装饰器语法
npm install @babel/plugin-proposal-class-properties --save-dev # 解析class语法
npm install @babel/plugin-transform-runtime --save-dev # 去除重复引入，重整代码
npm install @babel/runtime --save
npm install @babel/plugin-syntax-dynamic-import --savve-dev # 懒加载模块
```
### 2. build/webpack.base.js
```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  }
  ...
}
```

### 3. .babelrc配置文件
```json
{
  "presets": [
    // https://babeljs.io/docs/en/babel-preset-env#docsNav
    ["@babel/preset-env", {
      "modules": false, // 模块使用 es modules ，不使用 commonJS 规范
      "useBuiltIns": "usage", // usage-按需引入 entry-入口引入（整体引入） false-不引入polyfill
      "corejs": 2 // 就是以前的babel-polyfill
    }],
    "@babel/preset-react"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { // 解析类的装饰器
      "legacy": true
    }],
    ["@babel/plugin-proposal-class-properties", { // 解析class语法
      "loose": true
    }],
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav
    // 去除重复代码
    // A plugin that enables the re-use of Babel's injected helper code to save on codesize
    [
      "@babel/plugin-transform-runtime",
      {
        // 上面presets useBuiltIns写了，这里就不用写了
        // "corejs": 2, // you can directly import "core-js" or use @babel/preset-env's useBuiltIns option.
        "helpers": true, // 默认
        "regenerator": false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
        "useESModules": true // 使用 es modules helpers, 减少 commonJS 语法代码
      }
    ],
    // https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
    "@babel/plugin-syntax-dynamic-import" // 懒加载
  ]
}
```

### 4. webpack.prod.js
```javascript
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const TerserPlugin = require('terser-webpack-plugin'); // 混淆压缩js

module.exports = {
  ...
  optimization: { // 优化项
    runtimeChunk: { // 去除相同的webpack的运行文件，减少文件体积
      name: "manifest"
    },
    occurrenceOrder: true, // To keep filename consistent between different modes (for example building only)
    // usedExports: true, // js Tree Shaking
    // webpack4中废弃了webpack.optimize.CommonsChunkPlugin插件,用新的配置项替代,把多次import的文件打包成一个单独的common.js
    splitChunks: {
      chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async) https://juejin.im/post/5af1677c6fb9a07ab508dabb
      minSize: 30000, // 最小尺寸，30000
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 5, // 最大异步请求数， 默认5
      maxInitialRequests: 3, // 最大初始化请求数，默认3
      automaticNameDelimiter: '~',// 打包分隔符
      cacheGroups: {
        commons: { // 抽离自己写的公共代码
          chunks: "initial",
          name: "common", // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          maxInitialRequests: 5,
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        vendor: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 2,
          name: 'vendor', // 打包后的文件名，任意命名
          priority: 10, // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          enforce: true
        }
        // 'vendor-pageA': {
        //   test: /tween/, // 直接使用 test 来做路径匹配
        //   chunks: "initial",
        //   name: "vendor-pageA",
        //   enforce: true,
        // },
        // 'vendor-pageB': {
        //   test: /moment/,
        //   chunks: "initial",
        //   name: "vendor-pageB",
        //   enforce: true,
        // }
      }
    },
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
  }
  ...
}
```