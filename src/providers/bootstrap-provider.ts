import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';
import {NgmsReflect} from '../core';

export function bootstrapProvider(ngModule: angular.IModule, declaration: any) {
  if (!declaration.prototype.$get) {
    throw new Error(`Provider ${declaration.name} should have method '$get'`);
  }

  const inject = bootstrapInject(declaration);

  if (inject && inject.hasMethods) {
    inject.injectMethods(declaration.prototype, '$get');
  }

  ngModule.provider(declaration.name, declaration);

  NgmsReflect.defineMetadata(declaration, 'provider', {
    name: declaration.name,
    instance: declaration
  });
}
