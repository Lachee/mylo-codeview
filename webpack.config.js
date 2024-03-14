// webpack.config.js
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

const path = require('path');
const outputPath = 'dist';
const entryPoints = {
   activities: path.resolve(__dirname, 'src', 'content', 'activities.ts'),
   background: path.resolve(__dirname, 'src', 'background.ts'),
   'popup/popup': [
      path.resolve(__dirname, 'src', 'popup', 'index.ts'),
      path.resolve(__dirname, 'src', 'popup', 'index.scss')
   ],
};

module.exports = {
   entry: entryPoints,
   output: {
      path: path.join(__dirname, outputPath),
      filename: '[name].js',
   },
   resolve: {
      extensions: ['.ts', '.js'],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.(sa|sc)ss$/,
            use: [
               MiniCssExtractPlugin.loader,
               'css-loader',
               'sass-loader'
            ]
         },
         {
            test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
            use: 'url-loader?limit=1024'
         }
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [{ from: '.', to: '.', context: 'public' }]
      }),
      new MiniCssExtractPlugin({
         filename: '[name].css',
      }),
      new Dotenv(),
   ]
};