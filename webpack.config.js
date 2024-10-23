const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

dotenv.config();

module.exports = {
  entry: './src/main.tsx',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3001,
  },
  output: {
    publicPath: 'auto',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env.APPWRITE_URL': JSON.stringify(process.env.APPWRITE_URL),
      'process.env.APPWRITE_PROJECT_ID': JSON.stringify(process.env.APPWRITE_PROJECT_ID),
      'process.env.APPWRITE_DATABASE_ID': JSON.stringify(process.env.APPWRITE_DATABASE_ID),
      'process.env.APPWRITE_COLLECTION_ID_MESSAGES': JSON.stringify(process.env.APPWRITE_COLLECTION_ID_MESSAGES),
    })
  ],
};