import * as angular from 'angular';
import bootstrapInject from '../extensions/bootstrap-inject';
import {NgmsReflect} from '../core';

type BootstrapFactory = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapFactory: BootstrapFactory =
  (ngModule, declaration) => {
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
  };

export {BootstrapFactory};
export default bootstrapFactory;
