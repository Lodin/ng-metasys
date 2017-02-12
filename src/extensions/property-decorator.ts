type PropertyDecorator =
  (type: string) => (target: any, property: string, descriptor?: PropertyDescriptor) => void;
const Property: PropertyDecorator =
  type =>
    (target, property, descriptor) => {
      if (descriptor) {
        descriptor.writable = true;
        descriptor.configurable = true;
        descriptor.enumerable = true;
      }

      if (!Reflect.hasMetadata('ngms:property', target)) {
        Reflect.defineMetadata('ngms:property', {[property]: type}, target);
        return;
      }

      Reflect.getMetadata('ngms:property', target)[property] = type;
    };

export {PropertyDecorator};
export default Property;
