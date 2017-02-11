const WebpackTestConfig = require('./webpack-test.conf');

module.exports = (config) => {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-webpack'),
      require('karma-sourcemap-loader')
    ],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    files: [
      {pattern: './src/test.ts', watched: false}
    ],
    exclude: [],
    preprocessors: {
      'src/test.ts': ['webpack', 'sourcemap']
    },
    remapIstanbulReporter: {
      reports: {
        lcovonly: 'coverage/lcov/lcov.info',
        html: 'coverage/html'
      }
    },
    reporters: ['progress', 'karma-remap-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,

    noResolve: false,

    webpack: WebpackTestConfig,

    webpackMiddleware: {
      noInfo: true,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },

    client: {
      captureConsole: true,
      mocha: {
        bail: true
      }
    },

    mime: {
      'text/x-typescript': ['ts','tsx']
    }
  });
};
