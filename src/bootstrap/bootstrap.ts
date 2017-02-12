import * as angular from 'angular';
import bootstrapModule from '../module/bootstrap-module';

type Bootstrap = (module: any, element?: Element|JQuery|Document) => angular.auto.IInjectorService;
const bootstrap: Bootstrap =
  (module, element = document) =>
    angular.bootstrap(element as Element|JQuery|Document, [bootstrapModule(module)]);

export {Bootstrap};
export default bootstrap;
