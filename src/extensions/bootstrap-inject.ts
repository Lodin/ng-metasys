import * as angular from 'angular';

type CommonInjections = any[];
type BootstrappedCommonInjections = string[];
type MethodsInjections = {[method: string]: any[]};
type BootstrappedMethodsInjections = {[method: string]: string[]};
type PropertyInjections = {[method: string]: any};
type BootstrappedPropertyInjections = {[property: string]: string};

type CollectedInjections = {
  common?: BootstrappedCommonInjections,
  methods?: BootstrappedMethodsInjections,
  properties?: BootstrappedPropertyInjections
};

class DeclarationInjector {
  private _common: BootstrappedCommonInjections;
  private _methods: BootstrappedMethodsInjections;
  private _properties: BootstrappedPropertyInjections;

  constructor({common, methods, properties}: CollectedInjections) {
    this._common = common;
    this._properties = properties;
    this._methods = methods;
  }

  public get hasCommon(): boolean {
    return !!this._common;
  }

  public get hasMethods(): boolean {
    return !!this._methods;
  }

  public get hasProperties(): boolean {
    return !!this._properties;
  }

  public injectCommon(declaration: any) {
    declaration.$inject = this._common;
  }

  public injectMethods(declaration: any, methodName: string) {
    declaration[methodName].$inject = this._methods[methodName];
  }

  public injectProperties(declaration: any) {
    for (const property in this._properties) {
      const service = angular.injector().get(this._properties[property]);

      Object.defineProperty(declaration, property, {
        configurable: false,
        enumerable: true,
        get: () => service
      });
    }
  }
}

export function bootstrapInject(declaration: any): DeclarationInjector {
  const injections: CollectedInjections = {};

  if (declaration.prototype && Reflect.hasMetadata('ngms:inject', declaration.prototype)) {
    injections.common
      = initCommon(Reflect.getMetadata('ngms:inject', declaration.prototype));
  }

  if (Reflect.hasMetadata('ngms:inject:method', declaration)) {
    injections.methods
      = initMethods(Reflect.getMetadata('ngms:inject:method', declaration));
  }

  if (Reflect.hasMetadata('ngms:inject:property', declaration.prototype)) {
    injections.properties
      = initProperties(Reflect.getMetadata('ngms:inject:property', declaration.prototype));
  }

  return new DeclarationInjector(injections);
}

function initCommon(data: CommonInjections): BootstrappedCommonInjections {
  const common = new Array<string>(data.length);

  for (let i = 0, len = data.length; i < len; i++) {
    const inject = data[i];
    common[i] = typeof inject === 'string' ? inject : inject.name;
  }

  return common;
}

function initMethods(data: MethodsInjections): BootstrappedMethodsInjections {
  const methods: BootstrappedMethodsInjections = {};

  for (const method in data) {
    methods[method] = new Array<string>(data[method].length);

    for (let i = 0, len = data[method].length; i < len; i++) {
      const inject = data[method][i];
      methods[method][i] = typeof inject === 'string' ? inject : inject.name;
    }
  }

  return methods;
}

function initProperties(data: PropertyInjections): BootstrappedPropertyInjections {
  const properties: BootstrappedPropertyInjections = {};

  for (const property in data) {
    properties[property] = typeof data[property] === 'string'
      ? data[property]
      : data[property].name;
  }

  return properties;
}
