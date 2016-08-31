import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';
import {NgmsReflect} from '../core';

export function bootstrapFactory(ngModule: angular.IModule, declaration: any) {
  if (!declaration.$get) {
    throw new Error(`Factory ${declaration.name} should have static method '$get'`);
  }

  const inject = bootstrapInject(declaration);

  if (inject && inject.hasMethods) {
    inject.injectMethods(declaration, '$get');
  }

  ngModule.factory(declaration.name, declaration.$get);

  NgmsReflect.defineMetadata(declaration, 'factory', {
    name: declaration.name,
    instance: declaration.$get
  });
}
