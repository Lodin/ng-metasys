import {Decorator} from '../core/decorator';

export function moduleConfigDecoratorFactory(type: string): Decorator {
  return (declaration: any, property: string) => {
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
}
