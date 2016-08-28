import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';

export function bootstrapFilter(ngModule: angular.IModule, filter: any) {
  const inject = bootstrapInject(filter);

  if (inject && inject.hasMethods) {
    inject.injectMethods(filter, 'execute');
  }

  ngModule.filter(reduceName(filter.name).toLowerCase(), filter.execute);
}

function reduceName(filterName: string) {
  return filterName.slice(0, filterName.indexOf('Filter'));
}
