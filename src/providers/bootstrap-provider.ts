import * as angular from 'angular';
import * as tokens from '../core/tokens';
import {NgmsReflect} from '../core/ngms-reflect';
import bootstrapInject from '../extensions/bootstrap-inject';

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

    NgmsReflect.defineMetadata(declaration, tokens.permanent.provider, {
      name: declaration.name,
      instance: declaration
    });
  };

export {BootstrapProvider};
export default bootstrapProvider;
