const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    game: './src/pages/checkers-dom.ts',
    signup: './src/pages/signup.ts',
    login: './src/pages/login.ts'
  },
  output: {
    path: path.resolve(__dirname, 'public/js/pages/bundles'),
    filename: '[name].bundle.js'
  },
  // devtool: 'inline-source-map', 
  module: {
    rules: [
      {
        test: /\.tsx?$/, 
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
};
