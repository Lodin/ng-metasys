const path = require('path');
const webpack = require('webpack');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.resolve(projectRoot, 'src');

module.exports = {
  devtool: 'inline-source-map',
  context: srcRoot,
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    test: './test.ts'
  },
  output: {
    path: './dist.test',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'tslint-loader',
        include: srcRoot,
        exclude: [
          /\.spec\.(ts|tsx)$/,
          /test.ts$/
        ],
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.(js|ts|tsx)$/, loader: 'sourcemap-istanbul-instrumenter-loader',
        enforce: 'post',
        exclude: [
          /\.spec\.(ts|tsx)$/,
          /node_modules/
        ],
        options: {'force-sourcemap': true}
      },
      {
        test: /\.(ts|tsx)$/,
        include: srcRoot,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: path.resolve(projectRoot, 'tsconfig.json'),
          forkChecker: true
        }
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: srcRoot,
        output: {
          path: path.resolve(srcRoot, 'dist.test')
        },
        tslint: {
          emitErrors: false,
          failOnHint: false,
          resourcePath: srcRoot
        }
      }
    })
  ],
  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty',
    tls: 'empty',
    net: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
