import * as angular from 'angular';

const types = ['component', 'directive', 'filter', 'service', 'factory', 'provider'];

export class NgmsReflect {
  private static  _modules = new Map<string, angular.IModule>();

  public static get modules() {
    return this._modules;
  }

  public static defineMetadata(declaration: any, type: string, data: any) {
    Reflect.defineMetadata(`ngms:permanent:${type}`, data, declaration.prototype);
  }

  public static getMetadata(declaration: any) {
    for (const type of types) {
      const namespace = `ngms:permanent:${type}`;

      if (Reflect.hasMetadata(namespace, declaration.prototype)) {
        return Reflect.getMetadata(namespace, declaration.prototype);
      }
    }
  }
}
