export class DeclarationInjector {
  private _common: string[];
  private _methods: {[method: string]: string[]};

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
    declaration.$inject = this._common;
  }

  public injectMethods(declaration: any, methodName: string) {
    declaration[methodName].$inject = this._methods[methodName];
  }
}

export function bootstrapInject(declaration: any): DeclarationInjector {
  const injections: {
    common?: string[],
    methods?: {[method: string]: string[]}
  } = {};

  const hasCommonInject =
    declaration.prototype && Reflect.hasMetadata('ngms:inject', declaration.prototype);
  const hasParamsInject =
    declaration.prototype && Reflect.hasMetadata('ngms:inject:param', declaration.prototype);

  if (hasCommonInject || hasParamsInject) {
    const token = hasCommonInject ? 'ngms:inject' : 'ngms:inject:param';

    injections.common
      = initCommon(Reflect.getMetadata(token, declaration.prototype));
  }

  if (Reflect.hasMetadata('ngms:inject:method', declaration)) {
    injections.methods
      = initMethods(Reflect.getMetadata('ngms:inject:method', declaration));
  }

  return new DeclarationInjector(injections);
}

function initCommon(data: any[]): string[] {
  const common = new Array<string>(data.length);

  const len = data.length;
  for (let i = 0; i < len; i++) {
    const inject = data[i];
    common[i] = typeof inject === 'string' ? inject : inject.name;
  }

  return common;
}

function initMethods(data: {[method: string]: any[]}): {[method: string]: string[]} {
  const methods: {[method: string]: string[]} = {};

  for (const method in data) {
    methods[method] = new Array<string>(data[method].length);

    const len = data[method].length;
    for (let i = 0; i < len; i++) {
      const inject = data[method][i];
      methods[method][i] = typeof inject === 'string' ? inject : inject.name;
    }
  }

  return methods;
}
