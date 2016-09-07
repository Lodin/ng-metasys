export function Property(type: string): Function {
  return (target: any, property: string, descriptor?: PropertyDescriptor) => {
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
}
