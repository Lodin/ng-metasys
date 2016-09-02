import * as angular from 'angular';

export class DeclarationInjector {
  private _common: string[];
  private _methods: {[method: string]: string[]};
  private _properties: {[property: string]: string};

  constructor({common, methods, properties}: {
    common?: string[],
    methods?: {[method: string]: string[]},
    properties?: {[property: string]: string}
  }) {
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

  public injectProperties(declaration: any, ngModule: angular.IModule) {
    ngModule.run(['$injector', ($injector: angular.auto.IInjectorService) => {
      for (const property in this._properties) {
        const service = $injector.get(this._properties[property]);
        Reflect.defineMetadata('ngms:inject:property:get', service, declaration, property);
      }
    }]);
  }
}

export function bootstrapInject(declaration: any): DeclarationInjector {
  const injections: {
    common?: string[],
    methods?: {[method: string]: string[]},
    properties?: {[property: string]: string}
  } = {};

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

function initCommon(data: any[]): string[] {
  const common = new Array<string>(data.length);

  for (let i = 0, len = data.length; i < len; i++) {
    const inject = data[i];
    common[i] = typeof inject === 'string' ? inject : inject.name;
  }

  return common;
}

function initMethods(data: {[method: string]: any[]}): {[method: string]: string[]} {
  const methods: {[method: string]: string[]} = {};

  for (const method in data) {
    methods[method] = new Array<string>(data[method].length);

    for (let i = 0, len = data[method].length; i < len; i++) {
      const inject = data[method][i];
      methods[method][i] = typeof inject === 'string' ? inject : inject.name;
    }
  }

  return methods;
}

function initProperties(data: {[method: string]: any}): {[property: string]: string} {
  const properties: {[property: string]: string} = {};

  for (const property in data) {
    properties[property] = typeof data[property] === 'string'
      ? data[property]
      : data[property].name;
  }

  return properties;
}
