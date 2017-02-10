import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';
import {NgmsReflect} from '../core';

export function bootstrapService(ngModule: angular.IModule, declaration: any) {
  const inject = bootstrapInject(declaration);

  if (inject && inject.hasCommon) {
    inject.injectCommon(declaration);
  }

  ngModule.service(declaration.name, declaration);

  NgmsReflect.defineMetadata(declaration, 'service', {
    name: declaration.name,
    instance: declaration
  });
}
