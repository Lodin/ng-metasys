import * as angular from 'angular';
import * as tokens from '../core/tokens';
import bootstrapFactory from './bootstrap-factory';
import bootstrapProvider from './bootstrap-provider';
import bootstrapService from './bootstrap-service';

type BootstrapProviders = (ngModule: angular.IModule, declaration: any) => void;
const bootstrapProviders: BootstrapProviders =
  (ngModule, declaration) => {
    switch (true) {
      case Reflect.hasMetadata(tokens.providers.service, declaration.prototype):
        bootstrapService(ngModule, declaration);
        break;
      case Reflect.hasMetadata(tokens.providers.factory, declaration.prototype):
        bootstrapFactory(ngModule, declaration);
        break;
      case Reflect.hasMetadata(tokens.providers.provider, declaration.prototype):
        bootstrapProvider(ngModule, declaration);
        break;
      default:
        throw new Error(`Unknown provider ${declaration.name} in module ${ngModule.name}`);
    }
  };

export {BootstrapProviders};
export default bootstrapProviders;
