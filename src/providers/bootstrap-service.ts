import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';

export function bootstrapService(ngModule: angular.IModule, service: any) {
  const inject = bootstrapInject(service);

  if (inject) {
    if (inject.hasCommon) {
      inject.injectCommon(service);
    }

    if (inject.hasProperties) {
      inject.injectProperties(service);
    }
  }

  ngModule.service(service.name, service);
}
