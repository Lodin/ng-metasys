import * as angular from 'angular';
import {bootstrapFactory} from './bootstrap-factory';
import {bootstrapProvider} from './bootstrap-provider';
import {bootstrapService} from './bootstrap-service';

export function bootstrapProviders(ngModule: angular.IModule, declaration: any) {
  switch (true) {
    case Reflect.hasMetadata('ngms:providers:service', declaration.prototype):
      bootstrapService(ngModule, declaration);
      break;
    case Reflect.hasMetadata('ngms:providers:factory', declaration.prototype):
      bootstrapFactory(ngModule, declaration);
      break;
    case Reflect.hasMetadata('ngms:providers:provider', declaration.prototype):
      bootstrapProvider(ngModule, declaration);
      break;
    default:
      throw new Error(`Unknown provider ${declaration.name} in module ${ngModule.name}`);
  }
}
