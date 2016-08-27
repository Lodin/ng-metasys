import * as angular from 'angular';
import {bootstrapProviders} from '../providers/bootstrap';

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
    for (let i = 0, keys = Object.keys(this._properties); i < keys.length; i++) {
      const property = keys[i];
      const service = angular.injector().get(this._properties[property]);

      Object.defineProperty(declaration, property, {
        configurable: false,
        enumerable: true,
        get: () => service
      });
    }
  }
}

export function bootstrapInject(ngModule: angular.IModule, declaration: any): DeclarationInjector {
  const injections: CollectedInjections = {};

  if (declaration.prototype && Reflect.hasMetadata('ngms:inject', declaration.prototype)) {
    injections.common
      = initCommon(ngModule, Reflect.getMetadata('ngms:inject', declaration.prototype));
  }

  if (Reflect.hasMetadata('ngms:inject:method', declaration)) {
    injections.methods
      = initMethods(ngModule, Reflect.getMetadata('ngms:inject:method', declaration));
  }

  if (Reflect.hasMetadata('ngms:inject:property', declaration.prototype)) {
    injections.properties = initProperties(
      ngModule,
      Reflect.getMetadata('ngms:inject:property', declaration.prototype)
    );
  }

  return new DeclarationInjector(injections);
}

function initCommon(ngModule: angular.IModule,
                    data: CommonInjections): BootstrappedCommonInjections {
  const common = new Array<string>(data.length);

  let i = 0;
  for (const inject of data) {
    if (typeof inject === 'string') {
      common[i] = inject;
    } else {
      bootstrapProviders(ngModule, inject);
      common[i] = inject.name;
    }

    i += 1;
  }

  return common;
}

function initMethods(ngModule: angular.IModule,
                     data: MethodsInjections): BootstrappedMethodsInjections {
  const methods: BootstrappedMethodsInjections = {};

  for (let i = 0, keys = Object.keys(data); i < keys.length; i++) {
    const method = keys[i];

    methods[method] = new Array<string>(data[method].length);

    let j = 0;
    for (const inject of data[method]) {
      if (typeof inject === 'string') {
        methods[method][j] = inject;
      } else {
        bootstrapProviders(ngModule, inject);
        methods[method][j] = inject.name;
      }

      j += 1;
    }
  }

  return methods;
}

function initProperties(ngModule: angular.IModule,
                        data: PropertyInjections): BootstrappedPropertyInjections {
  const properties: BootstrappedPropertyInjections = {};

  for (let i = 0, keys = Object.keys(data); i < keys.length; i++) {
    const property = keys[i];

    if (typeof data[property] === 'string') {
      properties[property] = data[property];
    } else {
      bootstrapProviders(ngModule, data[property]);
      properties[property] = data[property].name;
    }
  }

  return properties;
}
