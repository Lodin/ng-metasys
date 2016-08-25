import * as angular from 'angular';
import {bootstrapModule} from '../module/bootstrap';

export function bootstrap(module: any, element: Element|JQuery|Document = document) {
  const moduleName = bootstrapModule(module);
  angular.bootstrap(element, [moduleName]);
}
