import {ModuleMetadata} from './module-metadata';

export function Module(metadata: ModuleMetadata): Function {
  return (target: any) => {
    Reflect.defineMetadata('ngms:module', metadata, target.prototype);
  };
}
