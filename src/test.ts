import 'reflect-metadata';

declare const __karma__: any;

__karma__.loaded = () => {};

Promise.all([
  System.import('angular')
])
  .then(() => require.context('./', true, /\.spec\.ts/))
  .then((context: any) => context.keys().map(context))
  .then(__karma__.start, __karma__.error);
