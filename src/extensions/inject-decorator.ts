import * as tokens from '../core/tokens';

type CommonInject = (injections: any[], target: any) => void;
const commonInject: CommonInject =
  (injections, target) =>
    Reflect.defineMetadata(tokens.inject.self, injections, target.prototype);

type MethodInject = (injections: any[], target: any, property: string) => void;
const methodInject: MethodInject =
  (injections, target, property) => {
    if (!Reflect.hasMetadata(tokens.inject.method, target)) {
      Reflect.defineMetadata(tokens.inject.method, {[property]: injections}, target);
      return;
    }

    Reflect.getMetadata(tokens.inject.method, target)[property] = injections;
  };

type ParamInject = (injections: any[], target: any, index: number) => void;
const paramInject: ParamInject =
  (injections, target, index) => {
    if (injections.length > 1) {
      throw new Error('Only one injectable can be injected to the constructor parameter');
    }

    const [injection] = injections;

    if (!Reflect.hasMetadata(tokens.inject.param, target.prototype)) {
      Reflect.defineMetadata(tokens.inject.param, {
        [index]: injection,
        length: 1
      }, target.prototype);
      return;
    }

    const params = Reflect.getMetadata(tokens.inject.param, target.prototype);
    params[index] = injection;
    params.length += 1;
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
        paramInject(injections, target, index);
      } else if (property && target[property]) {
        methodInject(injections, target, property);
      } else {
        commonInject(injections, target);
      }
    };

export {InjectDecorator};
export default Inject;
