const path = require('path');

module.exports = {
  mode: 'development', // Use 'production' for production builds
  entry: {
    game: './src/pages/checkers-dom.ts',
    signup: './src/pages/signup.ts'
  },
  output: {
    path: path.resolve(__dirname, 'public/js/pages/bundles'), // Output directory
    filename: '[name].bundle.js' // Output file
  },
  devtool: 'inline-source-map', // Source maps support
  module: {
    rules: [
      {
        test: /\.tsx?$/, // .ts and .tsx files
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
    extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve files from here
    },
    compress: true,
    port: 9000, // Adjust the port as necessary
  },
};
