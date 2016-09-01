import {Decorator} from '../core/decorator';

export function providersDecoratorFactory(type: string): Decorator {
  return (declaration: any) =>
    Reflect.defineMetadata(`ngms:providers:${type}`, null, declaration.prototype);
}
