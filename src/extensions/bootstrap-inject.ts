import * as tokens from '../core/tokens';

type MethodCollection = {[method: string]: any[]};
type MethodNameCollection = {[method: string]: string[]};

class DeclarationInjector {
  private _common?: string[];
  private _methods?: MethodNameCollection;

  constructor({common, methods}: {
    common?: string[],
    methods?: {[method: string]: string[]}
  }) {
    this._common = common;
    this._methods = methods;
  }

  public get hasCommon(): boolean {
    return !!this._common;
  }

  public get hasMethods(): boolean {
    return !!this._methods;
  }

  public injectCommon(declaration: any) {
    declaration.$inject = this._common ? this._common : [];
  }

  public injectMethods(declaration: any, methodName: string) {
    declaration[methodName].$inject = this._methods ? this._methods[methodName] : [];
  }
}

type InitCommon = (data: any[]) => string[];
const initCommon: InitCommon =
  data => {
    const len = data.length;
    const common = new Array<string>(len);

    for (let i = 0; i < len; i++) {
      const inject = data[i];
      common[i] =
        typeof inject === 'string'
          ? inject
          : inject.name;
    }

    return common;
  };

type InitMethods = (data: MethodCollection) => MethodNameCollection;
const initMethods: InitMethods =
  data => {
    const methods: MethodNameCollection = {};

    for (const method in data) {
      methods[method] = new Array<string>(data[method].length);

      for (let i = 0, len = data[method].length; i < len; i++) {
        const inject = data[method][i];
        methods[method][i] =
          typeof inject === 'string'
            ? inject
            : inject.name;
      }
    }

    return methods;
  };

type BootstrapInject = (declaration: any) => DeclarationInjector;
const bootstrapInject: BootstrapInject =
  declaration => {
    const injections: {
      common?: string[],
      methods?: {[method: string]: string[]}
    } = {};

    const hasCommonInject =
      declaration.prototype && Reflect.hasMetadata(tokens.inject.self, declaration.prototype);
    const hasParamsInject =
      declaration.prototype && Reflect.hasMetadata(tokens.inject.param, declaration.prototype);

    if (hasCommonInject || hasParamsInject) {
      const commons = hasParamsInject
        ? Array.from(Reflect.getMetadata(tokens.inject.param, declaration.prototype))
        : Reflect.getMetadata(tokens.inject.self, declaration.prototype);

      injections.common = initCommon(commons);
    }

    if (Reflect.hasMetadata(tokens.inject.method, declaration)) {
      injections.methods
        = initMethods(Reflect.getMetadata(tokens.inject.method, declaration));
    }

    return new DeclarationInjector(injections);
  };

export {
  MethodCollection,
  MethodNameCollection,
  DeclarationInjector,
  BootstrapInject
};
export default bootstrapInject;
