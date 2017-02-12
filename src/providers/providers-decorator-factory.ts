import {Decorator} from '../core/decorator';

type ProvidersDecoratorFactory = (type: symbol) => Decorator;
const providersDecoratorFactory: ProvidersDecoratorFactory =
  type =>
    declaration =>
      Reflect.defineMetadata(type, null, declaration.prototype);

export {ProvidersDecoratorFactory};
export default providersDecoratorFactory;
