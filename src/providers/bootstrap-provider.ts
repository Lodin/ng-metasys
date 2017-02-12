import * as angular from 'angular';
import bootstrapInject from '../extensions/bootstrap-inject';
import {NgmsReflect} from '../core';

type BootstrapProvider = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapProvider: BootstrapProvider =
  (ngModule, declaration) => {
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
  };

export {BootstrapProvider};
export default bootstrapProvider;
