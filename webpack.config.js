const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'code.js'
  },
  mode: 'production',
  optimization:{
    minimize: false
  }
};