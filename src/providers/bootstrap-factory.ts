import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';

export function bootstrapFactory(ngModule: angular.IModule, factory: any) {
  if (!factory.$get) {
    throw new Error(`Factory ${factory.name} should have static method '$get'`);
  }

  const inject = bootstrapInject(factory);

  if (inject && inject.hasMethods) {
    inject.injectMethods(factory, '$get');
  }

  ngModule.factory(factory.name, factory.$get);
}
