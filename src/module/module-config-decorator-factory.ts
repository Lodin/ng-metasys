import {Decorator} from '../core/decorator';

type ModuleConfigDecoratorFactory = (token: symbol) => Decorator;
const moduleConfigDecoratorFactory: ModuleConfigDecoratorFactory =
  token =>
    (declaration, property) => {
      if (typeof declaration !== 'function') {
        throw new Error(`${property} of module ${declaration.name} should be static`);
      }

      if (!Reflect.hasMetadata(token, declaration)) {
        Reflect.defineMetadata(token, [property], declaration);
        return;
      }

      Reflect.getMetadata(token, declaration).push(property);
    };

export {ModuleConfigDecoratorFactory};
export default moduleConfigDecoratorFactory;
