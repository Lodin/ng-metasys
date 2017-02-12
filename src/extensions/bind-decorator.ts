import * as tokens from '../core/tokens';

type BindDecorator =
  (type: string) => (target: any, property: string, descriptor?: PropertyDescriptor) => void;
const Bind: BindDecorator =
  type =>
    (target, property, descriptor) => {
      if (descriptor) {
        descriptor.writable = true;
        descriptor.configurable = true;
        descriptor.enumerable = true;
      }

      if (!Reflect.hasMetadata(tokens.binding, target)) {
        Reflect.defineMetadata(tokens.binding, {[property]: type}, target);
        return;
      }

      Reflect.getMetadata(tokens.binding, target)[property] = type;
    };

export {BindDecorator};
export default Bind;
