import * as angular from 'angular';
import {bootstrapInject} from '../extensions/bootstrap';

export function bootstrapProvider(ngModule: angular.IModule, provider: any) {
  if (!provider.prototype.$get) {
    throw new Error(`Provider ${provider.name} should have method '$get'`);
  }

  const inject = bootstrapInject(provider);

  if (inject && inject.hasMethods) {
    inject.injectMethods(provider.prototype, '$get');
  }

  ngModule.provider(provider.name, provider);
}
