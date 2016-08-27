import 'core-js/es6';
import 'core-js/es7/reflect';

import 'ts-helpers';

declare var __karma__: any;

__karma__.loaded = (): undefined => undefined;

Promise.all([
  System.import('angular')
])
  .then(() => require.context('./', true, /\.spec\.ts/))
  .then((context: any) => context.keys().map(context))
  .then(__karma__.start, __karma__.error);
