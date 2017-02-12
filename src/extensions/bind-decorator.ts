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

      if (!Reflect.hasMetadata('ngms:binding', target)) {
        Reflect.defineMetadata('ngms:binding', {[property]: type}, target);
        return;
      }

      Reflect.getMetadata('ngms:binding', target)[property] = type;
    };

export {BindDecorator};
export default Bind;
