import * as angular from 'angular';
import {defineMetadata} from '../core/reflection';
import * as tokens from '../core/tokens';
import bootstrapInject from '../extensions/bootstrap-inject';

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

    defineMetadata(declaration, tokens.permanent.factory, {
      name: declaration.name,
      instance: declaration.$get
    });
  };

export {BootstrapFactory};
export default bootstrapFactory;
