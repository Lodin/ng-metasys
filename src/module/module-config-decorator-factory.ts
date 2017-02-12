import {Decorator} from '../core/decorator';

type ModuleConfigDecoratorFactory = (type: string) => Decorator;
const moduleConfigDecoratorFactory: ModuleConfigDecoratorFactory =
  type =>
    (declaration, property) => {
      if (typeof declaration !== 'function') {
        throw new Error(`${property} of module ${declaration.name} should be static`);
      }

      const namespace = `ngms:module:${type}`;
      if (!Reflect.hasMetadata(namespace, declaration)) {
        Reflect.defineMetadata(namespace, [property], declaration);
        return;
      }

      Reflect.getMetadata(namespace, declaration).push(property);
    };

export {ModuleConfigDecoratorFactory};
export default moduleConfigDecoratorFactory;
