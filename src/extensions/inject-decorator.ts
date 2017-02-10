export function Inject(...injections: any[]): Function {
  return (target: any, property?: string, index?: number) => {
    if (property && target[property] && typeof target !== 'function') {
      throw new Error(`Method for injection in declaration ${target.name} should be static`);
    }

    if (index !== undefined && typeof index === 'number') {
      ParamInject(injections, target);
    } else if (property && target[property]) {
      MethodInject(injections, target, property);
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

function ParamInject(injections: any[], target: any) {
  if (injections.length > 1) {
    throw new Error('Only one injectable can be injected to the constructor parameter');
  }

  if (!Reflect.hasMetadata('ngms:inject:param', target.prototype)) {
    Reflect.defineMetadata('ngms:inject:param', injections, target.prototype);
    return;
  }

  Reflect.getMetadata('ngms:inject:param', target.prototype).unshift(...injections);
}
