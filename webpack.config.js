const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src', 'static'),
      to: path.resolve(__dirname, 'dist', 'static')
    }]),
    new HtmlWebpackPlugin({
      title: 'Family Screen Time',
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            // Extract CSS into its own file
            loader: MiniCssExtractPlugin.loader
          },
          {
            // translates CSS into CommonJS modules
            loader: 'css-loader'
          },
          {
            // Run postcss actions
            loader: 'postcss-loader',
            options: {
              // postcss plugins, can be exported to postcss.config.js
              plugins () {
                return [require('autoprefixer')]
              }
            }
          },
          {
            // compiles Sass to CSS
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}
