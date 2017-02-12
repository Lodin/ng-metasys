type CommonInject = (injections: any[], target: any) => void;
const commonInject: CommonInject =
  (injections, target) =>
    Reflect.defineMetadata('ngms:inject', injections, target.prototype);

type MethodInject = (injections: any[], target: any, property: string) => void;
const methodInject: MethodInject =
  (injections, target, property) => {
    if (!Reflect.hasMetadata('ngms:inject:method', target)) {
      Reflect.defineMetadata('ngms:inject:method', {[property]: injections}, target);
      return;
    }

    Reflect.getMetadata('ngms:inject:method', target)[property] = injections;
  };

type ParamInject = (injections: any[], target: any) => void;
const paramInject: ParamInject =
  (injections, target) => {
    if (injections.length > 1) {
      throw new Error('Only one injectable can be injected to the constructor parameter');
    }

    if (!Reflect.hasMetadata('ngms:inject:param', target.prototype)) {
      Reflect.defineMetadata('ngms:inject:param', injections, target.prototype);
      return;
    }

    Reflect.getMetadata('ngms:inject:param', target.prototype).unshift(...injections);
  };

type InjectDecorator =
  (...injections: any[]) =>
    (target: any, property?: string, index?: number|TypedPropertyDescriptor<() => void>) => void;
const Inject: InjectDecorator =
  (...injections) =>
    (target, property, index) => {
      if (property && target[property] && typeof target !== 'function') {
        throw new Error(`Method for injection in declaration ${target.name} should be static`);
      }

      if (index !== undefined && typeof index === 'number') {
        paramInject(injections, target);
      } else if (property && target[property]) {
        methodInject(injections, target, property);
      } else {
        commonInject(injections, target);
      }
    };

export {InjectDecorator};
export default Inject;
