import * as angular from 'angular';
import {NgmsReflect} from '../core';
import {bootstrapInject} from '../extensions/bootstrap';

export function bootstrapFilter(ngModule: angular.IModule, declaration: any) {
  const inject = bootstrapInject(declaration);

  if (inject && inject.hasMethods) {
    inject.injectMethods(declaration, 'execute');
  }

  const name = reduceName(declaration.name);
  ngModule.filter(name.toLowerCase(), declaration.execute);

  NgmsReflect.defineMetadata(declaration, 'filter', {
    name,
    instance: declaration.execute
  });
}

function reduceName(filterName: string) {
  return filterName.slice(0, filterName.indexOf('Filter'));
}
