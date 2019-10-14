const base = require('./build/webpack.base');
const dev = require('./build/webpack.dev');
const prod = require('./build/webpack.prod');
const merge = require('webpack-merge');
const isDev = process.env.NODE_ENV;

module.exports = () => {
  console.log(`currentMode:${isDev}`);
  // let isDev = env.development;

  return isDev === 'development' ? merge(base, dev) : merge(base, prod);
}

