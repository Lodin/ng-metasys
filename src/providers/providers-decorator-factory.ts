import {Decorator} from '../core/decorator';

type ProvidersDecoratorFactory = (type: string) => Decorator;
const providersDecoratorFactory: ProvidersDecoratorFactory =
  type =>
    declaration =>
      Reflect.defineMetadata(`ngms:providers:${type}`, null, declaration.prototype);

export {ProvidersDecoratorFactory};
export default providersDecoratorFactory;
