import {ModuleMetadata} from './module-metadata';
import metadata = Reflect.metadata;

type ModuleDecorator = (metadata: ModuleMetadata) => (target: any) => void;
const Module: ModuleDecorator =
  metadata =>
    target =>
      Reflect.defineMetadata('ngms:module', metadata, target.prototype);

export {ModuleDecorator};
export default Module;
