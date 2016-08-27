export function Property(type: string): Function {
  return (target: any, property: string) => {
    if (!Reflect.hasMetadata('ngms:property', target)) {
      Reflect.defineMetadata('ngms:property', {[property]: type}, target);
      return;
    }

    Reflect.getMetadata('ngms:property', target)[property] = type;
  };
}
