var path = require('path');
var webpack = require('webpack');

var projectRoot = path.resolve(__dirname, '..');
var srcRoot = path.resolve(projectRoot, 'src');

module.exports = {
  devtool: 'inline-source-map',
  context: srcRoot,
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: srcRoot
  },
  entry: {
    test: './test.ts'
  },
  output: {
    path: './dist.test',
    filename: '[name].bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [
          path.resolve(projectRoot, 'node_modules')
        ]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          path.resolve(projectRoot, 'node_modules/angular')
        ]
      }
    ],
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              tsconfig: path.resolve(srcRoot, 'tsconfig.json'),
              module: 'commonjs',
              target: 'es5',
              useForkChecker: true
            }
          }
        ],
        exclude: [/\.e2e\.ts$/]
      }
    ],
    postLoaders: [
      {
        test: /\.(js|ts)$/, loader: 'sourcemap-istanbul-instrumenter-loader',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ],
        query: { 'force-sourcemap': true }
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i
    })
  ],
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: srcRoot
  },
  node: {
    fs: 'empty',
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
