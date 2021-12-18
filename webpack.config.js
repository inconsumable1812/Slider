const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
if (isDev) {
  // eslint-disable-next-line
  const ESLintPlugin = require('eslint-webpack-plugin');
}

// prettier-ignore
const filename = (ext) => isDev ? `[name].${ext}` : `[name]/[name][hash].${ext}`;

function plugins() {
  const pluginsArray = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets/favicons',
          to: 'favicons'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ];

  if (isDev) {
    // eslint-disable-next-line no-undef
    pluginsArray.push(new ESLintPlugin());
  }

  return pluginsArray;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  externals: {
    jquery: '$'
  },
  mode: 'development',
  entry: {
    index: ['@babel/polyfill', './index.ts'],
    plugin: './components/JQplugin.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    runtimeChunk: 'single'
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev,
    open: true
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      }
    ]
  }
};
