const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build-utils/loadPresets');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';


const myGlobOptions = {
  ignore: ['.DS_Store']
};

const polyfills = [
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
    to: 'vendor/[name][ext]',
    globOptions: myGlobOptions
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
    to: 'vendor/bundles/[name][ext]',
    globOptions: myGlobOptions
  },
  {
    from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
    to: 'vendor/[name][ext]',
    globOptions: myGlobOptions
  }
];

const assets = [
  {
    from: 'src/img',
    to: 'img/',
    globOptions: myGlobOptions
  }
];

const plugins = [
  new CleanWebpackPlugin({
    cleanAfterEveryBuildPatterns: ['dist']
  }),
  new webpack.ProgressPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  }),

  new CopyWebpackPlugin({
    patterns: [...polyfills, ...assets]
  })
];

module.exports = ({ mode, presets }) => {
  return merge(
    {
      mode,
      output: {
        filename: '[name].[chunkhash:8].js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-syntax-dynamic-import'],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    targets: '>1%, not dead, not ie 11'
                  }
                ]
              ]
            }
          }
        ]
      },
      plugins
    },
    modeConfig({ mode, presets }),
    loadPresets({ mode, presets })
  );
};
