export function Inject(...injections: any[]): Function {
  return (target: any, property?: string) => {
    if (property && target[property] && typeof target !== 'function') {
      throw new Error(`Method for injection in declaration ${target.name} should be static`);
    }

    if (property && target[property]) {
      MethodInject(injections, target, property);
    } else if (property && !target[property]) {
      PropertyInject(injections, target, property);
    } else {
      CommonInject(injections, target);
    }
  };
}

function CommonInject(injections: any[], target: any) {
  Reflect.defineMetadata('ngms:inject', injections, target.prototype);
}

function MethodInject(injections: any[], target: any, property: string) {
  if (!Reflect.hasMetadata('ngms:inject:method', target)) {
    Reflect.defineMetadata('ngms:inject:method', {[property]: injections}, target);
    return;
  }

  Reflect.getMetadata('ngms:inject:method', target)[property] = injections;
}

function PropertyInject(injections: any[], target: any, property: string) {
  if (injections.length > 1) {
    throw new Error('Only one injection can be added to a property');
  }

  const [injection] = injections;

  if (!Reflect.hasMetadata('ngms:inject:property', target)) {
    Reflect.defineMetadata('ngms:inject:property', {[property]: injection}, target);
    return;
  }

  Reflect.getMetadata('ngms:inject:property', target)[property] = injection;
}
