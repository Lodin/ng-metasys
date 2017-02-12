import * as angular from 'angular';
import {permanentList} from './token-lists';

export class NgmsReflect {
  private static _modules = new Map<string, angular.IModule>();

  public static get modules() {
    return this._modules;
  }

  public static defineMetadata(declaration: any, type: symbol, data: any) {
    Reflect.defineMetadata(type, data, declaration.prototype);
  }

  public static getMetadata(declaration: any) {
    for (const token of permanentList) {
      if (Reflect.hasMetadata(token, declaration.prototype)) {
        return Reflect.getMetadata(token, declaration.prototype);
      }
    }
  }
}
