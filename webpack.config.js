var path = require('path');
 
module.exports = {
  entry: './src/index.jsx',
  output: { 
      path: path.join(__dirname, "dist"), 
      filename: 'bundle.js' 
    },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};